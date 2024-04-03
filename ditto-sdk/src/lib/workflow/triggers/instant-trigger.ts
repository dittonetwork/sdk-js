import { TriggerCallDataBuilder, Triggers } from './types';
import { CallDataBuilderReturnData } from '../builders/types';
import { noopBuilderData } from '../builders';

export class InstantTrigger extends TriggerCallDataBuilder<Triggers.Instant> {
  public build(): Promise<CallDataBuilderReturnData> {
    return Promise.resolve(noopBuilderData);
  }
}
