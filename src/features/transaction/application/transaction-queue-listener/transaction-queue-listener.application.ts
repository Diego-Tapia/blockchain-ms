import { Inject, NotImplementedException, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configs from 'src/configs/environments/configs';
import { IMassiveDecreaseApplication } from 'src/features/transaction/application/massive-decrease/massive-decrease.app.interface';
import { IMassiveIncreaseApplication } from 'src/features/transaction/application/massive-increase/massive-increase.app.interface';
import { ETransactionTypes } from 'src/features/transaction/domain/enums/transaction-types.enum';
import { ITransactionQueueMessage } from '../../domain/interfaces/transaction-queue-message.interface';
import { IMessageQueueService } from '../../../../shared/infrastructure/services/message-queue-service/message-queue-service.interface';
import { ITransactionQueueListenerApplication } from './transaction-queue-listener-app.interface';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import { TransactionTypes } from '../../transaction.types';
import { IIndividualIncreaseApplication } from '../individual-increase/individual-increase-app.interface';
import { ITransferApplication } from '../transfer/transfer-app.interface';
import { IIndividualDecreaseApplication } from '../individual-decrease/individual-decrease-app.interface';

export class TransactionQueueListenerApplication implements ITransactionQueueListenerApplication, OnModuleDestroy {
  private readonly transactions;
  private interval;

  constructor(
    @Inject(SharedTypes.INFRASTRUCTURE.MESSAGE_QUEUE_SERVICE)
    private readonly messageQueueService: IMessageQueueService,
    @Inject(configs.KEY)
    private readonly configService: ConfigType<typeof configs>,
    @Inject(TransactionTypes.APPLICATION.MASSIVE_INCREASE)
    private readonly massiveIncreaseApplication: IMassiveIncreaseApplication,
    @Inject(TransactionTypes.APPLICATION.MASSIVE_DECREASE)
    private readonly massiveDecreaseApplication: IMassiveDecreaseApplication,
    @Inject(TransactionTypes.APPLICATION.INDIVIDUAL_INCREASE)
    private readonly individualIncreaseApplication: IIndividualIncreaseApplication,
    @Inject(TransactionTypes.APPLICATION.TRANSFER)
    private readonly transferApplication: ITransferApplication,
    @Inject(TransactionTypes.APPLICATION.INDIVIDUAL_DECREASE)
    private readonly individualDecreaseApplication: IIndividualDecreaseApplication,
  ) {
    this.transactions = {
      [ETransactionTypes.INDIVIDUAL_INCREASE]: this.individualIncreaseApplication,
      [ETransactionTypes.INDIVIDUAL_DECREASE]: this.individualDecreaseApplication,
      [ETransactionTypes.MASSIVE_INCREMENT]: this.massiveIncreaseApplication,
      [ETransactionTypes.MASSIVE_DECREMENT]: this.massiveDecreaseApplication,
      [ETransactionTypes.TRANSFER]: this.transferApplication
    };
    this.execute();
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  execute() {
    this.interval = this.messageQueueService.listenerMessage(this.configService.sqs.url_t, async (message: ITransactionQueueMessage) => {
      const transaction = this.transactions[message.transactionType];
      if (!transaction) return new NotImplementedException(`transaccion ${message.transactionType} sin implementar.`);
      await transaction.execute(message);
    });
  }
}

