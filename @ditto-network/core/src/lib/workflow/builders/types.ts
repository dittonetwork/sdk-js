import { Chain } from '../../blockchain/chains/types';
import { DittoProvider } from '../../provider/types';
import { Address } from '../../ditto-sdk';

export type CallData = {
  to: Address;
  callData: string;
  initData?: string;
  viewData?: string;
};

export interface CommonBuilderOptions {
  chainId: Chain;
  recipient: Address;
  accountAddress: string;
  vaultAddress: Address;
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
