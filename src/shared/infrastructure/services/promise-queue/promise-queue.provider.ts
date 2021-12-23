import { SharedTypes } from "../../shared.types";
import { PromiseQueueService } from "./promise-queue.service";

export const PromiseQueueServiceProvider = {
  provide: SharedTypes.INFRASTRUCTURE.PROMISE_QUEUE_SERVICE,
  useClass: PromiseQueueService
};
