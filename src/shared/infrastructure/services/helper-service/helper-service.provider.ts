import { SharedTypes } from '../../shared.types';
import { HelperService } from './helper.service';

export const HelperServiceProvider = {
  provide: SharedTypes.INFRASTRUCTURE.HELPER_SERVICE,
  useClass: HelperService,
};