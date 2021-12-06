import { Token } from '../../domain/entities/token.entity';
import { CreateTokenDto } from '../../infrastructure/dtos/create-token.dto';

export interface ICreateTokenApplication {
  execute(createTokenDto: CreateTokenDto): Promise<Token>;
}
