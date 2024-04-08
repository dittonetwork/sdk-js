import { CallDataBuilderReturnData } from './types';

export const noopBuilderData = {
  callData: new Set([
    {
      callData: '',
      to: '',
    },
  ]),
  value: BigInt(0),
} satisfies CallDataBuilderReturnData;
