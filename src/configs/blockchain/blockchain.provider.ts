import { ConfigTypes } from '../configs.types';
import { BlockchainService } from './blockchain.service';

export const BlockchainServiceProvider = {
  provide: ConfigTypes.BLOCKCHAIN.SERVICE,
  useClass: BlockchainService,
};
