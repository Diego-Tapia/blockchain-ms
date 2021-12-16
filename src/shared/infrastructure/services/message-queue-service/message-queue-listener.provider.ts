
import { SharedTypes } from '../../shared.types';
import { MessageQueueService } from "./message-queue.service";

export const MessageQueueServiceProvider = {
  provide: SharedTypes.INFRASTRUCTURE.MESSAGE_QUEUE_SERVICE,
  useClass: MessageQueueService,
}