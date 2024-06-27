import { CallDataBuilderReturnData } from './types';

export const noopBuilderData = {
  callData: new Set(),
  value: BigInt(0),
} satisfies CallDataBuilderReturnData;
