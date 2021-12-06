import { Injectable, Inject } from '@nestjs/common';
import { Token } from '../../domain/entities/token.entity';
import { CreateTokenDto } from '../../infrastructure/dtos/create-token.dto';
import { ITokenRepository } from '../../infrastructure/repositories/token-repository.interface';
import { TokenTypes } from '../../token.types';
import { ICreateTokenApplication } from './create-token-app.interface';

@Injectable()
export class CreateTokenApplication implements ICreateTokenApplication {
  constructor(
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  public execute(createTokenDto: CreateTokenDto): Promise<Token> {
    const { symbol, shortName, description, validFrom, validTo, initialAmount } = createTokenDto;

    // const token = new Token({
    //   shortName,
    //   description,
    //   symbol,
    //   price
    // }
    //   1,
    //   initialAmount,
    //   'PENDING_APPROVE',
    //   validFrom,
    //   validTo,
    // );

    return null //this.tokenRepository.create(token);
  }
}
