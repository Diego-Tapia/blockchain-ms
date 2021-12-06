import { Injectable, Inject } from '@nestjs/common';
import { Token } from '../../domain/entities/token.entity';
import { ITokenRepository } from '../../infrastructure/repositories/token-repository.interface';
import { TokenTypes } from '../../token.types';
import { IGetAllTokensApplication } from './get-all-tokens-app.interface';

@Injectable()
export class GetAllTokensApplication implements IGetAllTokensApplication {
  constructor(
    @Inject(TokenTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  public execute(): Promise<Token[]> {
    return this.tokenRepository.findAll();
  }
}
