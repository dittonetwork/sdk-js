import { CallDataBuilder, CallDataBuilderReturnData } from '../builders/types';
import { noopBuilderData } from '../builders';

export class InstantTrigger implements CallDataBuilder {
  public build(): Promise<CallDataBuilderReturnData> {
    return Promise.resolve(noopBuilderData);
  }
}
