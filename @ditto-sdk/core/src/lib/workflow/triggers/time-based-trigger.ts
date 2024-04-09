import {
  CallData,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
  RepeatableCallDataBuilder,
} from '../builders/types';
import { TimeScale } from './types';
import VaultABI from '../../blockchain/abi/VaultABI.json';
import { getRandomBytes } from '../../utils/get-random-bytes';

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
        this.config.startAtTimestamp - Number(repeatSeconds),
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
    return Number(
      this.config.repeatTimes && this.config.repeatTimes > 1
        ? this.formatSeconds(this.config.cycle.frequency, this.config.cycle.scale)
        : 60
    );
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
        multiplier = 3600;
        break;
      case TimeScale.Days:
        multiplier = 86400;
        break;
      case TimeScale.Weeks:
        multiplier = 604800;
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
