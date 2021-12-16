import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IWalletModelProps, WalletModel } from 'src/shared/infrastructure/models/wallet.model';
import { IHelperService } from 'src/shared/infrastructure/services/helper-service/helper-service.interface';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import { Balance } from '../../domain/entities/balance.entity';
import { Wallet } from '../../domain/entities/wallet.entity';
import { IWalletRepository } from './wallet-repository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectModel(WalletModel.name)
    private readonly walletModel: Model<WalletModel>,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
  ) { }

  public async create(wallet: Wallet): Promise<Wallet> {
    const walletModel = new this.walletModel(wallet.toModel());
    const model = await walletModel.save();
    console.log('wallet modelppp', model)
    return Wallet.toEntity(model.toObject() as IWalletModelProps);
  }

  public async findAll(): Promise<Wallet[]> {
    const walletModelArray = await this.walletModel
      .find()
      .populate('balances.tokenId')
      .exec();

    return walletModelArray
      .map((wallet) => Wallet.toEntity(wallet.toObject() as IWalletModelProps));
  }

  public async findById(id: string): Promise<Wallet> {
    if (!this.helperService.isValidObjectId(id))
      throw new BadRequestException('Invalid Id');

    const walletModel = await this.walletModel
      .findById(id)
      .populate('balances.tokenId')
      .populate({path: "balances.tokenId", populate: { path: 'clientId' }})
      .lean()
      .exec();

    return walletModel ? Wallet.toEntity(walletModel as IWalletModelProps) : null;
  }

  public async addBalance(walletId: string, balance: Balance, session?: IClientSession) {
    const walletModel = await this.walletModel.findById(walletId);
    walletModel.balances.push(balance.toModel());
    await walletModel.save({ session });
  }

  public async updateBalance(walletId: string, tokenId: string, amount: number, session?: IClientSession) {
    const walletModel = await this.walletModel.findById(walletId);
    const balance = walletModel.balances.find((balance) => balance.tokenId.toString() === tokenId);
    balance.amount += amount;
    await walletModel.save({ session });
  }

  public async findWallet(filter: FilterQuery<WalletModel>): Promise<Wallet> {
    const walletModel = await this.walletModel
      .findOne(filter)
      .lean()
      .exec();

    return walletModel ? Wallet.toEntity(walletModel as IWalletModelProps) : null;
  }
}
