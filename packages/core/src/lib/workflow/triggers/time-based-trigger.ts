import {
  CallData,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
  RepeatableCallDataBuilder,
} from '../builders/types';
import { TimeScale } from './types';
import VaultABI from '../../blockchain/abi/VaultABI.json';
import { getRandomBytes } from '../../utils/get-random-bytes';

/**
 * Configuration for scheduling triggers in a time-based system.
 *
 * @property {number} startAtTimestamp - The Unix timestamp in seconds (pay attention) when the trigger should first execute.
 * @property {number} [repeatTimes] - Optional. The number of times the trigger should repeat. If not specified, the trigger may be considered as a one-time event or infinitely recurring, depending on the system's implementation.
 * @property {Object} cycle - The cycle configuration for the trigger, defining how it repeats over time.
 * @property {number} cycle.frequency - The frequency with which the trigger should repeat. The interpretation of this value depends on the `scale`.
 * @property {TimeScale} cycle.scale - The timescale in which the frequency is measured, e.g., seconds, minutes, hours, etc. This should be of the `TimeScale` type, which could be an enumeration or a set of predefined constants representing different time scales.
 */
type TriggerConfig = {
  startAtTimestamp: number;
  repeatTimes?: number;
  cycle: {
    frequency: number;
    scale: TimeScale;
  };
};

export class TimeBasedTrigger extends RepeatableCallDataBuilder {
  constructor(
    protected readonly config: TriggerConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {
    super();
  }

  public async build(): Promise<CallDataBuilderReturnData> {
    const vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));

    const callDataArray = new Set<CallData>();

    const repeatSeconds =
      this.config.repeatTimes && this.config.repeatTimes > 1
        ? this.formatSeconds(this.config.cycle.frequency, this.config.cycle.scale)
        : 60;

    const initData = vaultInterface
      .encodeFunctionData('timeCheckerInitialize', [
        Math.ceil(this.config.startAtTimestamp - Number(repeatSeconds)),
        repeatSeconds,
        getRandomBytes(32),
      ])
      .slice(0, -64);

    const viewData = vaultInterface.selector('checkTimeView')!;
    const callData = vaultInterface.selector('checkTime')!;

    callDataArray.add({
      callData,
      initData,
      viewData,
      to: this.commonCallDataBuilderConfig.vaultAddress,
    });

    return {
      callData: callDataArray,
      value: BigInt(0),
    };
  }

  public getRepeatCount(): number {
    return Number(this.config.repeatTimes);
  }

  private formatSeconds(value: number, frequency: TimeScale) {
    const _value = BigInt(value);

    if (_value <= 0) {
      return 0;
    }

    let multiplier;

    switch (frequency) {
      case TimeScale.Minutes:
        multiplier = 60;
        break;
      case TimeScale.Hours:
        multiplier = 60 * 60;
        break;
      case TimeScale.Days:
        multiplier = 60 * 60 * 24;
        break;
      case TimeScale.Weeks:
        multiplier = 60 * 60 * 24 * 7;
        break;
      case TimeScale.Months:
        multiplier = 2629800;
        break;
      default:
        multiplier = 0;
        break;
    }

    return _value * BigInt(multiplier);
  }
}
