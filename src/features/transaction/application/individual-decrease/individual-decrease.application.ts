import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { ITokenRepository } from 'src/features/token/infrastructure/repositories/token-repository.interface';
import { TokenTypes } from 'src/features/token/token.types';
import { IUserRepository } from 'src/features/user_profile/infrastructure/repositories/user-repository.interface';
import { UserTypes } from 'src/features/user_profile/user.types';
import { IWalletsByClientsRepository } from 'src/features/wallestByClients/infrastructure/repositories/walletsByClients-repository.interface';
import { WalletsByClientsTypes } from 'src/features/wallestByClients/walletsByClients.types';
import { IWalletRepository } from 'src/features/wallet/infrastructure/repositories/wallet-repository.interface';
import { WalletTypes } from 'src/features/wallet/wallet.types';
import { IHelperService } from 'src/shared/infrastructure/services/helper-service/helper-service.interface';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ETransactionTypes } from '../../domain/enums/transaction-types.enum';
import { ITransactionQueueMessage } from '../../domain/interfaces/transaction-queue-message.interface';
import { ITransactionRepository } from '../../infrastructure/repositories/transaction/transaction-repository.interface';
import { TransactionTypes } from '../../transaction.types';
import { IIndividualDecreaseApplication } from './individual-decrease-app.interface';

@Injectable()
export class IndividualDecreaseApplication implements IIndividualDecreaseApplication {

  constructor(
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
    @Inject(UserTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE)
    private readonly blockchainService: IBlockchainService,
    @Inject(TransactionTypes.INFRASTRUCTURE.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(WalletsByClientsTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletByClientRepository: IWalletsByClientsRepository
  ) { }

  async execute({ tokenId, walletFrom, amount, userId, notes }: ITransactionQueueMessage) {
    //buscar token por id
    const token = await this.tokenRepository.findById(tokenId);
    if (!token) throw new NotFoundException("Token no encontrado.");

    //buscar usuario ficticio creado junto con cliente que puede emitir y recaudar tokens
    //const walletManager = await this.userRepository.findUser({ clientId, isWalletManager: true });
    // const walletOfClient = await this.walletRepository.findById(walletManager.walletId);
    // if (!walletOfClient) throw new NotFoundException("Wallet de cliente no encontrada.");

    //TODO: quitar este modelo walletByClient
    // const clientId = this.helperService.toObjectId(token.client.id);
    const walletClientId = await this.walletByClientRepository.findOne({ clientId: token.client.id })
    if (!walletClientId) throw new NotFoundException("Wallet id de cliente no encontrada.");
    const walletOfClient = await this.walletRepository.findById(walletClientId.walletId);
    if (!walletOfClient) throw new NotFoundException("Wallet de cliente no encontrada.");



    const walletOfUser = await this.walletRepository.findById(walletFrom);
    if (!walletOfUser) throw new NotFoundException("Wallet origen no encontrada.");

    if (!walletOfUser.hasEnoughFunds(tokenId, amount))
      throw new ConflictException("Wallet origen sin fondos suficientes.");

    const transactionType = await this.transactionRepository
      .findOneType({ name: ETransactionTypes.INDIVIDUAL_DECREASE });

    const hash = await this.blockchainService
      .sendTransaction(walletOfUser.address, walletOfClient.address, token.bcItemId, amount);

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
  }
}
