import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { Transaction } from 'src/features/transaction/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/features/transaction/infrastructure/repositories/transaction/transaction-repository.interface';
import { TransactionTypes } from 'src/features/transaction/transaction.types';
import { IUserRepository } from 'src/features/user_profile/infrastructure/repositories/user-repository.interface';
import { UserTypes } from 'src/features/user_profile/user.types';
import { Balance } from 'src/features/wallet/domain/entities/balance.entity';
import { IWalletRepository } from 'src/features/wallet/infrastructure/repositories/wallet-repository.interface';
import { WalletTypes } from 'src/features/wallet/wallet.types';
import { IHelperService } from 'src/shared/infrastructure/services/helper-service/helper-service.interface';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import { Token } from '../../domain/entities/token.entity';
import { ITokenRepository } from '../../infrastructure/repositories/token-repository.interface';
import { TokenTypes } from '../../token.types';
import { IEmitTokenApplication } from './emit-token-app.interface';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { ETransactionTypes } from 'src/features/transaction/domain/enums/transaction-types.enum';
import { EmitTokenDTO } from '../../infrastructure/dtos/emit-token.dto';
import { IWalletsByClientsRepository } from 'src/features/wallestByClients/infrastructure/repositories/walletsByClients-repository.interface';
import { WalletsByClientsTypes } from 'src/features/wallestByClients/walletsByClients.types';

@Injectable()
export class EmitTokenApplication implements IEmitTokenApplication {

  constructor(
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    @Inject(UserTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE)
    private readonly blockchainService: IBlockchainService,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
    @Inject(TransactionTypes.INFRASTRUCTURE.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(WalletsByClientsTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletByClientRepository: IWalletsByClientsRepository
  ) { }


  async execute(id:string,emitToken: EmitTokenDTO) {
    const {amount,idAdmin} = emitToken
    //buscar token por id
    const token = await this.tokenRepository.findById(id);
    if (!token) throw new NotFoundException("Token no encontrado.");
    
    const walletClientId = await this.walletByClientRepository.findOne({ clientId: token.client.id })
    console.log("walletClientEmision: ",walletClientId);
    const walletOfClient = await this.walletRepository.findById(walletClientId.walletId);

    //crear token en BLOCKCHAIN
    const hash = await this.blockchainService.createToken(token.bcItemId, amount, walletOfClient);

    const name = token.isEmission() ? ETransactionTypes.EMISION : ETransactionTypes.RE_EMISION;
    const transactionType = await this.transactionRepository.findOneType({ name });

    await this.helperService.withTransaction(async (session: IClientSession) => {
      //si emision   -> crear balances y cambiar estado a emited
      //si reemision -> incrementa el balance del token a reemitir
      const operation = token.isEmission() ? this.emitToken.bind(this) : this.reemitToken.bind(this);
      await operation(token, amount, walletOfClient, session);

      //registra en la coleccion de transacciones la emision/reemision
      const transaction = new Transaction({
        hash,
        transactionType: transactionType.id,
        token,
        walletFrom: null,
        walletTo: walletOfClient,
        amount,
        user: idAdmin,
        notes: 'Emisión de tokens'
      });

      await this.transactionRepository.create(transaction, session);
    });
  }

  private async emitToken(token: Token, amount: number, { id: walletId }, session) {
    const balance = new Balance(token, amount);
    await this.walletRepository.addBalance(walletId, balance, session);
    await this.tokenRepository.update(token.id, { "emited": true }, session)
  }

  private async reemitToken({ id: tokenId }, amount: number, { id: walletId }, session) {
    await this.walletRepository.updateBalance(walletId, tokenId, amount, session);
  }

}
