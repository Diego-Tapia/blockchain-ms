import { Controller, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {

  constructor(
  ) { }

}
