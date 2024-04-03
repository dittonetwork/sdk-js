import {
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../builders/types';
import { FeeAmount } from '@uniswap/v3-sdk';

export abstract class TriggerCallDataBuilder<T extends Triggers = Triggers>
  implements CallDataBuilder
{
  protected constructor(
    protected readonly config: TriggersConfigurationsMap[T],
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}

  public abstract build(): Promise<CallDataBuilderReturnData>;
}

export enum Triggers {
  Schedule = 'schedule',
  Instant = 'instant',
  Price = 'price',
}

type TriggersConfigurationsMap = {
  [Triggers.Schedule]: {
    startAtTimestamp: number;
    repeatTimes?: number;
    cycle: {
      frequency: number;
      scale: TimeScale;
    };
  };
  [Triggers.Instant]: {
    // instant doesn't have options
  };
  [Triggers.Price]: {
    uniswapPoolFeeTier: FeeAmount;
    triggerAtPrice: number;
    priceMustBeHigherThan?: boolean;
    tokenAddress: string;
    baseTokenAddress: string;
  };
};

export enum TimeScale {
  Hours = 'hours',
  Days = 'days',
  Months = 'months',
  Weeks = 'weeks',
  Minutes = 'minutes',
}
