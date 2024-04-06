import { Chain } from '../../blockchain/chains/types';
import { DittoProvider } from '../../provider/types';

export type CallData = {
  to: string;
  callData: string;
  initData?: string;
  viewData?: string;
};

export interface CommonBuilderOptions {
  chainId: Chain;
  recipient: string;
  accountAddress: string;
  vaultAddress: string;
  provider: DittoProvider;
}

export type CallDataBuilderReturnData = {
  callData: Set<CallData>;
  value: bigint;
};

export interface CallDataBuilder {
  build(): Promise<CallDataBuilderReturnData>;
}

export abstract class RepeatableCallDataBuilder implements CallDataBuilder {
  abstract build(): Promise<CallDataBuilderReturnData>;
  abstract getRepeatCount(): number;
}
