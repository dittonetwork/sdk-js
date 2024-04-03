import {
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../builders/types';

export enum Actions {
  SwapWithUniswap = 'swapWithUniswap',
  SendToAddress = 'sendToAddress',
}

export abstract class ActionCallDataBuilder<A extends Actions = Actions>
  implements CallDataBuilder
{
  protected constructor(
    private readonly config: ActionsConfigurationsMap[A],
    private readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}

  public abstract build(): Promise<CallDataBuilderReturnData>;
}

type ActionsConfigurationsMap = {
  [Actions.SwapWithUniswap]: {
    from: string;
    to: string;
    token: string;
    amount: string;
  };
  [Actions.SendToAddress]: {
    address: string;
    amount: string;
  };
};
