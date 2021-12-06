
interface ITransationTypeProps {
  id: string;
  name: string;
  description: string;
}

export class TransactionType {
  id: string;
  name: string;
  description: string;

  constructor({ id, name, description }: ITransationTypeProps) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  //TODO: definir interfaz
  public static toEntity(model: any) {
    const { _id, name, description } = model;
    return new TransactionType({ id: _id, name, description });
  }
}