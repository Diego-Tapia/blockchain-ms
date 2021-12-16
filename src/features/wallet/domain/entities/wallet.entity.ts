import { IWalletModelProps } from 'src/shared/infrastructure/models/wallet.model';
import { IPrivateKey } from '../interfaces/private-key.interface';
import { Balance } from './balance.entity';

interface IWalletProps {
  id: string | null;
  address: string;
  privateKey: IPrivateKey;
  balances?: Array<Balance>;
}

export class Wallet {
  id: string;
  address: string;
  privateKey: IPrivateKey;
  balances: Array<Balance>;

  constructor({ id, address, privateKey, balances = [] }: IWalletProps) {
    this.id = id;
    this.address = address;
    this.privateKey = privateKey;
    this.balances = balances;
  }

  public toModel() {
    return {
      address: this.address,
      privateKey: this.privateKey,
      balances: this.balances.map((balance) => balance.toModel())
    };
  }

  public static toEntity(model: IWalletModelProps) {
    const balances = model.balances ? model.balances.map(Balance.toEntity) : [];
    const { _id, address, privateKey } = model;
    return new Wallet({ id: _id.toString(), address, privateKey, balances });
  }

  public getBalance(tokenId: string) {
    return this.balances.find((balance) => balance.token.id === tokenId);
  }

  public hasEnoughFunds(tokenId: string, amount: number) {
    const balance = this.getBalance(tokenId);
    return balance && balance.amount >= amount;
  }
}

