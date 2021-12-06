import { Client } from 'src/features/client/domain/entities/client.entity';
import { TransactionType } from 'src/features/transaction/domain/entities/transaction-type.entity';
import { IClientModelProps } from 'src/shared/infrastructure/models/client.model';
import { ITokenModelProps } from 'src/shared/infrastructure/models/token.model';

interface ITokenProps {
  id: string;
  shortName: string;
  description?: string;
  symbol: string;
  price: number;
  money: string;//TODO: currency
  operations: Array<TransactionType>;
  status: string;
  validFrom?: Date;
  validTo?: Date;
  bcItemId: number;
  client: Client;
  applicabilities: Array<string>; //TODO: definir clase de aplicabilidades
  emited: boolean;
  //initialAmount: number;
}

export class Token {
  id: string | null;
  shortName: string;
  description?: string;
  symbol: string;
  price: number;
  money: string;//TODO: currency
  operations: Array<TransactionType>;
  status: string;
  validFrom?: Date;
  validTo?: Date;
  bcItemId: number;
  client: Client;
  applicabilities: Array<string>; //TODO: definir clase de aplicabilidades
  emited: boolean;
  //initialAmount: number; //TODO: esto lo dejamos?

  constructor({
    id = null,
    shortName,
    description = 'sin descripción',
    symbol,
    price,
    money,
    operations = [],
    status,
    validFrom,
    validTo,
    bcItemId,
    client,
    applicabilities = [],
    emited
  }: ITokenProps
  ) {
    this.id = id;
    this.shortName = shortName;
    this.description = description;
    this.symbol = symbol;
    this.price = price;
    this.money = money;
    this.operations = operations;
    this.status = status;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.bcItemId = bcItemId;
    this.client = client;
    this.applicabilities = applicabilities;
    this.emited = emited;
    //this.initialAmount = initialAmount;
  }

  isEmission() {
    return !this.emited;
  }

  public static toEntity(model: ITokenModelProps) {
    console.log('token model', model)
    const { _id, shortName, description, symbol, price, money,
      status, validFrom, validTo, bcItemId, emited } = model;

    const operations = model.operations ? model.operations.map(TransactionType.toEntity) : [];
    const client = Client.toEntity(model.clientId as IClientModelProps);
    const applicabilities = [];//TODO: terminar de definir

    const token = new Token({
      id: _id.toString(), shortName, description, symbol, price, money,
      operations, status, validFrom, validTo, bcItemId, client, applicabilities, emited
    });

    return token;
  }
}
