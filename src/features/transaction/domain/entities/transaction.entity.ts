import { Token } from 'src/features/token/domain/entities/token.entity';
import { Wallet } from 'src/features/wallet/domain/entities/wallet.entity';

interface ITransactionProps {
  id?: string | null;
  hash: string;
  transactionType: string;
  token: Token;
  walletFrom: Wallet | null;
  walletTo: Wallet | null;
  amount: number;
  user: string;//definit clase User
  notes?: string;
}
export class Transaction {
  id: string | null;
  hash: string;
  transactionType: string;
  token: Token;
  walletFrom: Wallet | null;
  walletTo: Wallet | null;
  amount: number;
  user: string;
  notes?: string;
  //TODO : MEJORAR ESTA CLASE


  constructor({
    id = '',
    hash,
    transactionType,
    token,
    walletFrom,
    walletTo,
    amount,
    user,
    notes }: ITransactionProps) {
    this.id = id;
    this.hash = hash;
    this.transactionType = transactionType;
    this.token = token;
    this.walletFrom = walletFrom;
    this.walletTo = walletTo;
    this.amount = amount;
    this.user = user;
    this.notes = notes;
  }

  toModel() {
    return {
      hash: this.hash,
      transactionTypeId: this.transactionType,
      tokenId: this.token.id,
      walletFromId: this.walletFrom?.id,
      walletToId: this.walletTo.id,
      amount: this.amount,
      userId: this.user,
      notes: this.notes
    };
  }

  //TODO: MEJORAR ESTO CON INTERFACES
  static toEntity(model: any) {
    const { _id: id, hash, transactionTypeId, tokenId, walletFromId, walletToId,
      amount, userId, notes } = model;

    const transaction = new Transaction({
      id: id.toString(),
      hash,
      transactionType: transactionTypeId,
      token: tokenId,
      walletFrom: walletFromId,
      walletTo: walletToId,
      amount,
      user: userId,
      notes
    });

    return transaction;
  }

}
