import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @MaxLength(42)
  @IsNotEmpty()
  public readonly address: string;

  @IsString()
  @MaxLength(66)
  @IsNotEmpty()
  public readonly privateKey: string;
}
