import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
import { WalletsByClientsTypes } from 'src/features/wallestByClients/walletsByClients.types';
import { IWalletsByClientsRepository } from 'src/features/wallestByClients/infrastructure/repositories/walletsByClients-repository.interface';
import { ETransactionTypes } from '../../domain/enums/transaction-types.enum';
import { ConfigTypes } from 'src/configs/configs.types';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { IHelperService } from 'src/shared/infrastructure/services/helper-service/helper-service.interface';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';

@Injectable()
export class MassiveDecreaseApplication implements IMassiveDecreaseApplication {
  constructor(
    @Inject(TransactionTypes.INFRASTRUCTURE.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(TransactionTypes.INFRASTRUCTURE.MASSIVE_DECREASE_REPOSITORY)
    private readonly massiveDecreaseRepository: IMassiveDecreaseRepository,
    @Inject(SharedTypes.INFRASTRUCTURE.MESSAGE_QUEUE_SERVICE)
    private readonly messageQueueService: IMessageQueueService,
    @Inject(configs.KEY)
    private readonly configService: ConfigType<typeof configs>,
    @Inject(WalletsByClientsTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletByClientRepository: IWalletsByClientsRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE)
    private readonly blockchainService: IBlockchainService,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
  ) { }

  public async execute({ tokenId, walletFrom, amount, userId, notes, massiveDecreaseId, detailId }: ITransactionQueueMessage ) {
    
    let massiveDecrease = await this.massiveDecreaseRepository.findById(massiveDecreaseId);
    if (!massiveDecrease) throw new NotFoundException('Decremento masivo no encontrado');
    let massiveDecreaseDetail = massiveDecrease.detail.find((d) => d.id === detailId);

    try {

      const token = await this.tokenRepository.findById(tokenId);
      if (!token) throw new NotFoundException('Token no encontrado.');

      const walletClientId = await this.walletByClientRepository.findOne({ clientId: token.client.id })
      if (!walletClientId) throw new NotFoundException("Wallet id de cliente no encontrada.");
      const walletOfClient = await this.walletRepository.findById(walletClientId.walletId);
      if (!walletOfClient) throw new NotFoundException("Wallet de cliente no encontrada.");

      const walletOfUser = await this.walletRepository.findById(walletFrom);
      if (!walletOfUser) throw new NotFoundException("Wallet origen no encontrada.");

      if (!walletOfUser.hasEnoughFunds(tokenId, amount))
        throw new ConflictException("Wallet origen sin fondos suficientes.");

      const transactionType = await this.transactionRepository
        .findOneType({ name: ETransactionTypes.MASSIVE_DECREMENT });

      const hash = await this.blockchainService
        .sendTransaction(walletOfUser.address, walletOfClient.address, token.bcItemId, amount);
      if (!hash) throw new BadRequestException();

      await this.helperService.withTransaction(async (session: IClientSession) => {
        await this.walletRepository.updateBalance(walletOfUser.id, tokenId, -amount, session);
        await this.walletRepository.updateBalance(walletOfClient.id, tokenId, amount, session);
  
        const transaction = new Transaction({
          hash,
          transactionType: transactionType.id,
          token,
          walletFrom: walletOfUser,
          walletTo: walletOfClient,
          amount,
          user: userId,
          notes
        });
  
        await this.transactionRepository.create(transaction, session);
      });
      
      massiveDecreaseDetail.status = EMassiveDetailStatus.FINALIZED
      massiveDecrease.recordLengthExecutedOk++;
      massiveDecrease.totalAmountExecuted += massiveDecreaseDetail.amount

    } catch (error) {

      massiveDecreaseDetail.status = EMassiveDetailStatus.FAILED
      massiveDecrease.recordLengthExecutedError++;

    } finally {

      // si no encuntra un detalle de incremento masivo se considera FINALIZED
      const detailsPendingToProcess = massiveDecrease.detail.find(
        (det) => det.status === EMassiveDetailStatus.VALID,
      );

      if (!detailsPendingToProcess) {
        massiveDecrease.status = EMassiveStatus.FINALIZED;

        const notificationMessage = {
          message: 'Decremento Masivo finalizado',
          data: massiveDecrease,
        };

        //TODO: cambiar el tipo any
        // this.messageQueueService.sendMessage<any>(
        //   this.configService.sqs.url_n,
        //   notificationMessage,
        // );
      }

      await this.massiveDecreaseRepository.update(massiveDecrease.id, massiveDecrease);

    }
  }
}
