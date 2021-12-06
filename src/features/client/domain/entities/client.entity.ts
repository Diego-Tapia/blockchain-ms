import { IClientModelProps } from 'src/shared/infrastructure/models/client.model';

interface IClientProps {
  id: string;
  name: string;
  cuit: number;
  businessName: string;
  responsible: string;
  phoneNumber: number;
  email: string;
  status: string;
  industry: string;
};

export class Client {
  id: string;
  name: string;
  cuit: number;
  businessName: string;
  responsible: string;
  phoneNumber: number;
  email: string;
  status: string;
  industry: string;

  constructor({
    id, name, cuit, businessName, responsible, phoneNumber,
    email, status, industry }: IClientProps) {
    this.id = id;
    this.name = name;
    this.cuit = cuit;
    this.businessName = businessName;
    this.responsible = responsible;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.status = status;
    this.industry = industry;
  }

  public static toEntity(model: IClientModelProps) {
    const { _id, name, cuit, businessName, responsible, phoneNumber,
      email, status, industry } = model;
    return new Client({
      id: _id.toString(), name, cuit, businessName, responsible, phoneNumber,
      email, status, industry
    });
  }
}