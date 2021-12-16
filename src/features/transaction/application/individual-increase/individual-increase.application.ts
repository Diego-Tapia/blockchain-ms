import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { ITokenRepository } from 'src/features/token/infrastructure/repositories/token-repository.interface';
import { TokenTypes } from 'src/features/token/token.types';
import { IUserRepository } from 'src/features/user_profile/infrastructure/repositories/user-repository.interface';
import { UserTypes } from 'src/features/user_profile/user.types';
import { IWalletsByClientsRepository } from 'src/features/wallestByClients/infrastructure/repositories/walletsByClients-repository.interface';
import { WalletsByClientsTypes } from 'src/features/wallestByClients/walletsByClients.types';
import { Balance } from 'src/features/wallet/domain/entities/balance.entity';
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
import { IIndividualIncreaseApplication } from './individual-increase-app.interface';


@Injectable()
export class IndividualIncreaseApplication implements IIndividualIncreaseApplication {

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

  async execute({ tokenId, walletTo, amount, userId, notes }: ITransactionQueueMessage) {
    //buscar token por id
    const token = await this.tokenRepository.findById(tokenId);
    if (!token) throw new NotFoundException("Token no encontrado.");

    //buscar usuario ficticio creado junto con cliente que puede emitir y recaudar tokens
    //const clientId = this.helperService.toObjectId(token.client.id);
    // const walletManager = await this.userRepository.findUser({ clientId, isWalletManager: true });
    // const walletOfClient = await this.walletRepository.findById(walletManager.walletId);
    // if (!walletOfClient) throw new NotFoundException("Wallet de cliente no encontrada.");

    //TODO: quitar este modelo walletByClient
    const clientId = this.helperService.toObjectId(token.client.id);
    const walletClientId  = await this.walletByClientRepository.findOne({ clientId })
    if (!walletClientId) throw new NotFoundException("Wallet id de cliente no encontrada.");
    const walletOfClient = await this.walletRepository.findById(walletClientId.walletId);
    if (!walletOfClient) throw new NotFoundException("Wallet de cliente no encontrada.");



    const walletOfUser = await this.walletRepository.findById(walletTo);
    if (!walletOfUser) throw new NotFoundException("Wallet de destinatario no encontrada.");

    if (!walletOfClient.hasEnoughFunds(tokenId, amount))
      throw new ConflictException("Wallet de cliente sin fondos suficientes.");

    const transactionType = await this.transactionRepository
      .findOneType({ name: ETransactionTypes.INDIVIDUAL_INCREASE });

    const hash = await this.blockchainService
      .sendTransaction(walletOfClient.address, walletOfUser.address, token.bcItemId, amount);

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
        notes
      });

      await this.transactionRepository.create(transaction, session);
    });
  }
}