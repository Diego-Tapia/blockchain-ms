import { Controller, Get, Post, Body, Inject, Param, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ICreateTokenApplication } from 'src/features/token/application/create-token/create-token-app.interface';
import { IEmitTokenApplication } from 'src/features/token/application/emit-token/emit-token-app.interface';
import { IGetAllTokensApplication } from 'src/features/token/application/get-all-tokens/get-all-tokens-app.interface';
import { IGetTokenByIdApplication } from 'src/features/token/application/get-token-by-id/get-token-by-id-app.interface';
import { EmitTokenDTO } from 'src/features/token/infrastructure/dtos/emit-token.dto';
import { TokenTypes } from 'src/features/token/token.types';
import { CreateTokenDto } from '../../features/token/infrastructure/dtos/create-token.dto';

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(
    @Inject(TokenTypes.APPLICATION.CREATE_TOKEN)
    private readonly createTokenApplication: ICreateTokenApplication,
    @Inject(TokenTypes.APPLICATION.GET_ALL_TOKENS)
    private readonly getAllTokensApplication: IGetAllTokensApplication,
    @Inject(TokenTypes.APPLICATION.GET_TOKEN_BY_ID)
    private readonly getTokenByIdApplication: IGetTokenByIdApplication,
    @Inject(TokenTypes.APPLICATION.EMIT_TOKEN)
    private readonly emitTokenApplication: IEmitTokenApplication
  ) { }

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.createTokenApplication.execute(createTokenDto);
  }

  @Post(':id/emit')
  emit(
    @Param('id') id: string,
    @Body() emitToken: EmitTokenDTO,
  ) {
    return this.emitTokenApplication.execute(id,emitToken);
  }

  @Get()
  findAll() {
    return this.getAllTokensApplication.execute();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.getTokenByIdApplication.execute(id);
  }
}
