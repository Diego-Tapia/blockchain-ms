import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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
import { WalletsByClientsTypes } from 'src/features/wallestByClients/walletsByClients.types';
import { IWalletsByClientsRepository } from 'src/features/wallestByClients/infrastructure/repositories/walletsByClients-repository.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { IHelperService } from 'src/shared/infrastructure/services/helper-service/helper-service.interface';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Balance } from 'src/features/wallet/domain/entities/balance.entity';
import { ETransactionTypes } from '../../domain/enums/transaction-types.enum';

@Injectable()
export class MassiveIncreaseApplication implements IMassiveIncreaseApplication {

  count = 0;

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
    private readonly configService: ConfigType<typeof configs>,
    @Inject(WalletsByClientsTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletByClientRepository: IWalletsByClientsRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE)
    private readonly blockchainService: IBlockchainService,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
  ) {}

  public async execute({ tokenId, walletTo, amount, userId, notes, massiveIncreaseId, detailId }: ITransactionQueueMessage) {
    this.count++;
    console.log('ingresar request n', this.count);
    let massiveIncrease = await this.massiveIncreaseRepository.findById(massiveIncreaseId);
    if (!massiveIncrease) throw new NotFoundException('Incremento masivo no encontrado');
    let massiveIncreaseDetail = massiveIncrease.detail.find((d) => d.id === detailId);

    try {

      const token = await this.tokenRepository.findById(tokenId);
      if (!token) throw new NotFoundException('Token no encontrado.');

      const walletClientId = await this.walletByClientRepository.findOne({ clientId: token.client.id });
      if (!walletClientId) throw new NotFoundException('Wallet id de cliente no encontrada.');
      const walletOfClient = await this.walletRepository.findById(walletClientId.walletId);
      if (!walletOfClient) throw new NotFoundException('Wallet de cliente no encontrada.');

      const walletOfUser = await this.walletRepository.findById(walletTo);
      if (!walletOfUser) throw new NotFoundException('Wallet de destinatario no encontrada.');

      if (!walletOfClient.hasEnoughFunds(tokenId, amount))
        throw new ConflictException('Wallet de cliente sin fondos suficientes.');

      const transactionType = await this.transactionRepository.findOneType({
        name: ETransactionTypes.MASSIVE_INCREMENT,
      });
      
      const hash = await this.blockchainService
        .sendTransaction( walletOfClient.address, walletOfUser.address, token.bcItemId, amount);
      if (!hash) throw new BadRequestException();

      await this.helperService.withTransaction(async (session: IClientSession) => {
        await this.walletRepository.updateBalance(walletOfClient.id, tokenId, -amount, session);

        //se crea el balance en caso de no tener
        if (!walletOfUser.getBalance(tokenId)) {
          const balance = new Balance(token, amount);
          await this.walletRepository.addBalance(walletOfUser.id, balance, session);
        } else {
          await this.walletRepository.updateBalance(walletOfUser.id, tokenId, amount, session);
        }

        const transaction = new Transaction({
          hash,
          transactionType: transactionType.id,
          token,
          walletFrom: walletOfClient,
          walletTo: walletOfUser,
          amount,
          user: userId,
          notes,
        });

        await this.transactionRepository.create(transaction, session);
      });

      massiveIncreaseDetail.status = EMassiveDetailStatus.FINALIZED;
      massiveIncrease.recordLengthExecutedOk++;
      massiveIncrease.totalAmountExecuted += massiveIncreaseDetail.amount;

    } catch (error) {

      massiveIncreaseDetail.status = EMassiveDetailStatus.FAILED;
      massiveIncrease.recordLengthExecutedError++;
    
    } finally {

      // si no encuntra un detalle de incremento masivo se considera FINALIZED
      const detailsPendingToProcess = massiveIncrease.detail.find(
        (det) => det.status === EMassiveDetailStatus.VALID,
      );

      if (!detailsPendingToProcess) {
        massiveIncrease.status = EMassiveStatus.FINALIZED;

        const notificationMessage = {
          message: 'Incremento Masivo finalizado',
          data: massiveIncrease,
        };

        //TODO: cambiar el tipo any
        // this.messageQueueService.sendMessage<any>(
        //   this.configService.sqs.url_n,
        //   notificationMessage,
        // );
      }

      await this.massiveIncreaseRepository.update(massiveIncrease.id, massiveIncrease);
      console.log('finaliza request n', this.count);
    }
  }
}