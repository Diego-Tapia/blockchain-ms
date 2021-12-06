import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITokenModelProps, TokenModel } from 'src/shared/infrastructure/models/token.model';
import { IHelperService } from 'src/shared/infrastructure/services/helper-service/helper-service.interface';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { SharedTypes } from 'src/shared/infrastructure/shared.types';
import { Token } from '../../domain/entities/token.entity';
import { ITokenRepository } from './token-repository.interface';

//declare function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;

@Injectable()
export class TokenRepository implements ITokenRepository {

  constructor(
    @InjectModel(TokenModel.name)
    private readonly tokenModel: Model<TokenModel>,
    @Inject(SharedTypes.INFRASTRUCTURE.HELPER_SERVICE)
    private readonly helperService: IHelperService,
  ) { }

  public create(token: Token): Promise<Token> {
    return null//new this.tokenModel(token).save();
  }

  public findAll(): Promise<Token[]> {
    return null//this.tokenModel.find().exec();
  }

  public async findById(id: string): Promise<Token> {
    if (!this.helperService.isValidObjectId(id))
      throw new BadRequestException('Invalid Id');

    const tokenModel = await this.tokenModel
      .findById(id)
      .populate("clientId")
      .lean()
      .exec();

    return tokenModel ? Token.toEntity(tokenModel as ITokenModelProps) : null;
  }

  public async update(tokenId: string, props: Partial<Token>, session?: IClientSession) {
    // const a = Object.keys(props) as unknown as (keyof Token)[]
    // const _props = pick(props, ...a);
    const _props = this.helperService.getJSON(props);
    await this.tokenModel.updateOne({ _id: tokenId }, _props, { session }).exec();
  }

}
