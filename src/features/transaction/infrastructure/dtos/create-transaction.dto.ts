import { Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {

  @IsString()
  @IsNotEmpty()
  public readonly hash: string;

  @IsMongoId()
  public readonly token: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  public readonly amount: number;

  @IsString()
  @IsNotEmpty()
  public readonly notes: string;


}
