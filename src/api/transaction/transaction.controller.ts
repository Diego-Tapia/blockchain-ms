import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ICreateTransactionApplication } from "src/features/transaction/application/create-transaction/create-transaction.app.interface";
import { CreateTransactionDto } from "src/features/transaction/infrastructure/dtos/create-transaction.dto";
import { TransactionTypes } from "src/features/transaction/transaction.types";


@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(TransactionTypes.APPLICATION.CREATE_TRANSACTION)
    private readonly createTransactionApplication: ICreateTransactionApplication,
  ) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.createTransactionApplication.execute(createTransactionDto);
  }
}
