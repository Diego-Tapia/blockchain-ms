import { Token } from '../../domain/entities/token.entity';

export interface IGetAllTokensApplication {
  execute(): Promise<Token[]>;
}
