import { Injectable, Inject } from '@nestjs/common';
import { TokenTypes } from 'src/features/token/token.types';
import { ITokenRepository } from 'src/features/token/infrastructure/repositories/token-repository.interface';
import { WalletTypes } from 'src/features/wallet/wallet.types';
import { IWalletRepository } from 'src/features/wallet/infrastructure/repositories/wallet-repository.interface';
import { TransactionTypes } from 'src/features/transaction/transaction.types';
import { ITransactionRepository } from 'src/features/transaction/infrastructure/repositories/transaction/transaction-repository.interface';
import { Transaction } from 'src/features/transaction/domain/entities/transaction.entity';
import { ITransactionQueueMessage } from 'src/features/transaction/domain/interfaces/transaction-queue-message.interface';
import { IMassiveDecreaseApplication } from './massive-decrease.app.interface';
import { IMassiveDecreaseRepository } from '../../infrastructure/repositories/massive-decrease/massive-decrease-repository.interface';
import { EMassiveDetailStatus } from '../../domain/enums/massive-detail-status.enum';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import { IMessageQueueService } from 'src/shared/infrastructure/services/message-queue-service/message-queue-service.interface';
import configs from 'src/configs/environments/configs';
import { ConfigType } from '@nestjs/config';
import { EMassiveStatus } from '../../domain/enums/massive-status.enum';

@Injectable()
export class MassiveDecreaseApplication implements IMassiveDecreaseApplication {
  constructor(
    @Inject(TransactionTypes.INFRASTRUCTURE.MASSIVE_DECREASE_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(TransactionTypes.INFRASTRUCTURE.TRANSACTION_REPOSITORY)
    private readonly massiveDecreaseRepository: IMassiveDecreaseRepository,
    @Inject(SharedTypes.INFRASTRUCTURE.MESSAGE_QUEUE_SERVICE)
    private readonly messageQueueService: IMessageQueueService,
    @Inject(configs.KEY)
    private readonly configService: ConfigType<typeof configs>
  ) { }

  public async execute(transactionQueueMessage: ITransactionQueueMessage) {

    const token = await this.tokenRepository.findById(transactionQueueMessage.tokenId)
    const walletFrom = await this.walletRepository.findById(transactionQueueMessage.walletFrom);
    const walletTo = await this.walletRepository.findById(transactionQueueMessage.walletTo)
    let massiveDecrease = await this.massiveDecreaseRepository.findById(transactionQueueMessage.massiveDecreaseId);
    let massiveDecreaseDetail = massiveDecrease.detail.filter(d => d.id === transactionQueueMessage.detailId)[0];

    // escribe la transacción en RSK BLOCKCHAIN → transferencia del token seleccionado entre las ADDRESS
    const transactionInRskBlockchain = { hash: 'hast'};

    if (!transactionInRskBlockchain) {

      massiveDecreaseDetail.status = EMassiveDetailStatus.FAILED
      massiveDecrease.recordLengthExecutedError++;

    } else {
      const { amount, notes, transactionType, userId } = transactionQueueMessage;
      
      const transactionTypeDB = await this.transactionRepository.findOneType({ name: transactionType })

      const transaction = new Transaction({
        hash: transactionInRskBlockchain.hash,
        amount,
        token,
        notes,
        transactionType: transactionTypeDB.id,
        user: userId,
        walletFrom,
        walletTo
      })

      await this.transactionRepository.create(transaction);

      massiveDecreaseDetail.status = EMassiveDetailStatus.FINALIZED
      massiveDecrease.recordLengthExecutedOk++;
      massiveDecrease.totalAmountExecuted += massiveDecreaseDetail.amount
    }

    const detailsPendingToProcess = massiveDecrease.detail.filter(det => det.status === EMassiveDetailStatus.VALID);
    if (detailsPendingToProcess.length === 0) {

      massiveDecrease.status = EMassiveStatus.FINALIZED
      massiveDecrease = await this.massiveDecreaseRepository.update(massiveDecrease.id, massiveDecrease);

      const notificationMessage = {
        message: 'Disminución masiva finalizada',
        data: massiveDecrease,
      }

      //TODO: cambiar el tipo any
      this.messageQueueService
        .sendMessage<any>(this.configService.sqs.url_n, notificationMessage);

    } else {
      massiveDecrease = await this.massiveDecreaseRepository.update(massiveDecrease.id, massiveDecrease);
    }
  }
}
