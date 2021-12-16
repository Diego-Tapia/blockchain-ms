import { Test } from '@nestjs/testing';
import { IIndividualIncreaseApplication } from './individual-increase-app.interface';
import { IndividualIncreaseApplication } from './individual-increase.application';
import { IndividualIncreaseApplicationProvider } from './individual-increase.provider';

describe('individual increment application', () => {
  let indIncreaseApp: IIndividualIncreaseApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IndividualIncreaseApplicationProvider,
        //TODO: finalizar
      ],
    }).compile();

    indIncreaseApp = moduleRef.get<IIndividualIncreaseApplication>(IndividualIncreaseApplication);
    expect(indIncreaseApp).toBeDefined();
  });
});