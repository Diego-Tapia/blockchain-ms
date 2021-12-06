import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Token } from '../../domain/entities/token.entity';

export interface ITokenRepository {
  create(token: Token): Promise<Token>;
  findAll(): Promise<Token[]>;
  findById(id: string): Promise<Token>;
  update(tokenId: string, props: Partial<Token>, session: IClientSession): Promise<void>;
}
