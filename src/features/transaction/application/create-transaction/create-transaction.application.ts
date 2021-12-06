import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../infrastructure/dtos/create-transaction.dto';
import { ITransactionRepository } from '../../infrastructure/repositories/transaction-repository.interface';
import { TransactionTypes } from '../../transaction.types';
import { ICreateTransactionApplication } from './create-transaction.app.interface';
import { SQSClient } from "@aws-sdk/client-sqs";
import configs from 'src/configs/environments/configs';
import { ConfigType } from '@nestjs/config';
import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { Logger } from '@nestjs/common';
@Injectable()
export class CreateTransactionApplication implements ICreateTransactionApplication {
  constructor(
    @Inject(TransactionTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(configs.KEY)
    private readonly configService: ConfigType<typeof configs>,
  ) { }

  public async execute(createTransactionDto: CreateTransactionDto): Promise<any> {
    const { hash, amount, notes } = createTransactionDto;
    //const transaction = new Transaction(hash, amount, notes);

    const config = {
      region: process.env.REGION,
      credentials: {
        accessKeyId: this.configService.sqs.accesKeyId,
        secretAccessKey: this.configService.sqs.secretAccessKey,
      }
    };

    const sqsClient = new SQSClient(config);
    const queueURL = this.configService.sqs.url_t;

    const params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0,
    };

    const run = async () => {
      try {
        const data = await sqsClient.send(new ReceiveMessageCommand(params));
        if (data.Messages) {
          var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle,
          };
          try {
            const data = await sqsClient.send(new DeleteMessageCommand(deleteParams));
            Logger.log("Message deleted: ", [JSON.stringify(data)]);
            //return await this.transactionRepository.create(transaction);
          } catch (err) {
            Logger.error("Error", [JSON.stringify(err)]);
          }
        } else {
          Logger.log("No messages to delete");
        }
      } catch (err) {
        Logger.error("Receive Error", [JSON.stringify(err)]);
      }
    };

    await run();



  }
}
