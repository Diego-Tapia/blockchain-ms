import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsPositive,
  MaxLength,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @MaxLength(5)
  @IsNotEmpty()
  public readonly symbol: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  public readonly shortName: string;

  @IsOptional()
  @IsString()
  public readonly description: string;

  @IsOptional()
  @IsDateString()
  public readonly validFrom: Date;

  @IsDateString()
  @ValidateIf((params) => !!params.validFrom)
  public readonly validTo: Date;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public readonly initialAmount: number;
}
