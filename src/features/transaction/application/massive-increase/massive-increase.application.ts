import { Injectable, Inject } from '@nestjs/common';
import { TokenTypes } from 'src/features/token/token.types';
import { ITokenRepository } from 'src/features/token/infrastructure/repositories/token-repository.interface';
import { WalletTypes } from 'src/features/wallet/wallet.types';
import { IWalletRepository } from 'src/features/wallet/infrastructure/repositories/wallet-repository.interface';
import { IMassiveIncreaseApplication } from './massive-increase.app.interface';
import { TransactionTypes } from 'src/features/transaction/transaction.types';
import { ITransactionRepository } from 'src/features/transaction/infrastructure/repositories/transaction/transaction-repository.interface';
import { Transaction } from 'src/features/transaction/domain/entities/transaction.entity';
import { ITransactionQueueMessage } from 'src/features/transaction/domain/interfaces/transaction-queue-message.interface';
import { IMassiveIncreaseRepository } from '../../infrastructure/repositories/massive-increase/massive-increase-repository.interface';
import { EMassiveStatus } from '../../domain/enums/massive-status.enum';
import { IMessageQueueService } from 'src/shared/infrastructure/services/message-queue-service/message-queue-service.interface';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import configs from 'src/configs/environments/configs';
import { ConfigType } from '@nestjs/config';
import { EMassiveDetailStatus } from '../../domain/enums/massive-detail-status.enum';

@Injectable()
export class MassiveIncreaseApplication implements IMassiveIncreaseApplication {
  constructor(
    @Inject(TransactionTypes.INFRASTRUCTURE.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(TransactionTypes.INFRASTRUCTURE.MASSIVE_INCREASE_REPOSITORY)
    private readonly massiveIncreaseRepository: IMassiveIncreaseRepository,
    @Inject(SharedTypes.INFRASTRUCTURE.MESSAGE_QUEUE_SERVICE)
    private readonly messageQueueService: IMessageQueueService,
    @Inject(configs.KEY)
    private readonly configService: ConfigType<typeof configs>
    ) { }

  public async execute(transactionQueueMessage: ITransactionQueueMessage) {
    
    const token = await this.tokenRepository.findById(transactionQueueMessage.tokenId);
    const walletFrom = await this.walletRepository.findById(transactionQueueMessage.walletFrom);
    const walletTo = await this.walletRepository.findById(transactionQueueMessage.walletTo);
    let massiveIncrease = await this.massiveIncreaseRepository.findById(transactionQueueMessage.massiveIncreaseId);
    let massiveIncreaseDetail = massiveIncrease.detail.filter((d) => d.id === transactionQueueMessage.detailId)[0];

    // escribe la transacción en RSK BLOCKCHAIN → transferencia del token seleccionado entre las ADDRESS
    const transactionInRskBlockchain = {hash: 'hash'};

    if (!transactionInRskBlockchain) {
    
      massiveIncreaseDetail.status = EMassiveDetailStatus.FAILED;
      massiveIncrease.recordLengthExecutedError++;
    
    } else {
    
      const { amount, notes, transactionType, userId } = transactionQueueMessage;
      const transactionTypeDB = await this.transactionRepository.findOneType({ name: transactionType })
      console.log(transactionTypeDB)

      const transaction = new Transaction({
        hash: transactionInRskBlockchain.hash,
        amount,
        token,
        notes,
        transactionType: transactionTypeDB.id,
        user: userId,
        walletFrom,
        walletTo,
      });

      await this.transactionRepository.create(transaction);
      
      massiveIncreaseDetail.status = EMassiveDetailStatus.FINALIZED;
      massiveIncrease.recordLengthExecutedOk++;
      massiveIncrease.totalAmountExecuted += massiveIncreaseDetail.amount;
    
    }

    const detailsPendingToProcess = massiveIncrease.detail.filter((det) => det.status === EMassiveDetailStatus.VALID);
    if (detailsPendingToProcess.length === 0) {
      
      massiveIncrease.status = EMassiveStatus.FINALIZED;
      massiveIncrease = await this.massiveIncreaseRepository.update(massiveIncrease.id, massiveIncrease);
      
      const notificationMessage = {
        message: 'Incremento Masivo finalizado',
        data: massiveIncrease,
      }

      //TODO: cambiar el tipo any
      this.messageQueueService
        .sendMessage<any>(this.configService.sqs.url_n, notificationMessage);
    
    } else {
      massiveIncrease = await this.massiveIncreaseRepository.update(massiveIncrease.id, massiveIncrease);
    }
  }
}