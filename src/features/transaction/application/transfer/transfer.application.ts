import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { ITokenRepository } from 'src/features/token/infrastructure/repositories/token-repository.interface';
import { TokenTypes } from 'src/features/token/token.types';
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
import { ITransferApplication } from './transfer-app.interface';


@Injectable()
export class TransferApplication implements ITransferApplication {

  constructor(
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE)
    private readonly blockchainService: IBlockchainService,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
    @Inject(TransactionTypes.INFRASTRUCTURE.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository
  ) { }

  async execute({ tokenId, walletFrom: walletFromId, walletTo: walletToId, amount, userId, notes }: ITransactionQueueMessage) {
    //buscar token por id
    const token = await this.tokenRepository.findById(tokenId);
    if (!token) throw new NotFoundException("Token no encontrado.");

    //billetera origen
    const walletFrom = await this.walletRepository.findById(walletFromId);
    if (!walletFrom) throw new NotFoundException("Wallet origen no encontrada.");

    //billetera destino
    const walletTo = await this.walletRepository.findById(walletToId);
    if (!walletTo) throw new NotFoundException("Wallet destino no encontrada.");

    if (!walletFrom.hasEnoughFunds(tokenId, amount))
      throw new ConflictException("Wallet origen sin fondos suficientes.");

    const hash = await this.blockchainService
      .sendTransaction(walletFrom.address, walletTo.address, token.bcItemId, amount);

    const transactionType = await this.transactionRepository
      .findOneType({ name: ETransactionTypes.TRANSFER })

    await this.helperService.withTransaction(async (session: IClientSession) => {
      await this.walletRepository.updateBalance(walletFrom.id, tokenId, -amount, session);

      //se crea el balance en caso de no tener
      if (!walletTo.getBalance(tokenId)) {
        const balance = new Balance(token, amount);
        await this.walletRepository.addBalance(walletTo.id, balance, session);
      } else {
        await this.walletRepository.updateBalance(walletTo.id, tokenId, amount, session);
      }

      const transaction = new Transaction({
        hash,
        transactionType: transactionType.id,
        token,
        walletFrom,
        walletTo,
        amount,
        user: userId,
        notes
      });

      await this.transactionRepository.create(transaction, session);
    });
  }
}
