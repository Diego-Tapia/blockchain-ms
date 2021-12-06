import { Controller, Get, Post, Param, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ICreateWalletApplication } from 'src/features/wallet/application/create-wallet/create-wallet-app.interface';
import { IGetAllWalletsApplication } from 'src/features/wallet/application/get-all-wallets/get-all-wallets-app.interface';
import { IGetWalletByIdApplication } from 'src/features/wallet/application/get-wallet-by-id/get-wallet-by-id-app.interface';
import { WalletTypes } from 'src/features/wallet/wallet.types';
import { InternalServerException } from 'src/shared/domain/http-exceptions/internal-server-exception';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(WalletTypes.APPLICATION.CREATE_WALLET)
    private readonly createWalletApplication: ICreateWalletApplication,
    @Inject(WalletTypes.APPLICATION.GET_ALL_WALLETS)
    private readonly getAllWalletsApplication: IGetAllWalletsApplication,
    @Inject(WalletTypes.APPLICATION.GET_WALLET_BY_ID)
    private readonly getWalletByIdApplication: IGetWalletByIdApplication,
  ) { }

  @Post()
  async create() {
    try {
      return await this.createWalletApplication.execute();
    } catch (e) {
      throw new InternalServerException(e.message);
    }
  }

  @Get()
  findAll() {
    return this.getAllWalletsApplication.execute();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.getWalletByIdApplication.execute(id);
  }
}
