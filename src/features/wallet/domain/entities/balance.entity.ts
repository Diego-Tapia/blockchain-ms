import { Token } from 'src/features/token/domain/entities/token.entity';
import { ITokenModelProps } from 'src/shared/infrastructure/models/token.model';
import { IBalanceModelProps } from 'src/shared/infrastructure/models/wallet.model';

export class Balance {
  token: Token;
  amount: number;

  constructor(token: Token, amount: number) {
    this.token = token;
    this.amount = amount;
  }

  public toModel() {
    return {
      tokenId: this.token.id,
      amount: this.amount
    }
  }

  public static toEntity(model: IBalanceModelProps) {
    const token = Token.toEntity(model.tokenId as ITokenModelProps);
    return new Balance(token, model.amount);
  }
}
