import {
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../builders/types';
import { TimeScale } from './types';

type TriggerConfig = {
  startAtTimestamp: number;
  repeatTimes?: number;
  cycle: {
    frequency: number;
    scale: TimeScale;
  };
};

export class TimeBasedTrigger implements CallDataBuilder {
  protected constructor(
    protected readonly config: TriggerConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}

  public async build(): Promise<CallDataBuilderReturnData> {
    throw new Error('Time based trigger not implemented');
  }
}
