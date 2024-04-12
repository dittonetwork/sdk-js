import { CallDataBuilderReturnData } from './types';

export const noopBuilderData = {
  callData: new Set([
    {
      callData: '',
      to: '0x',
    },
  ]),
  value: BigInt(0),
} satisfies CallDataBuilderReturnData;
