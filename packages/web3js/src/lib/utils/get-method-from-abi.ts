import { DittoContractMethodNotFoundError } from '@ditto-network/core';
import { AbiFunctionFragment } from 'web3';

export const getMethodFromAbi = (
  methodName: string,
  abi: string | Array<Record<string, any>>
): AbiFunctionFragment => {
  const methodAbi = (Array.isArray(abi) ? abi : JSON.parse(abi)).find(
    (item: any) => item.name === methodName && item.type === 'function'
  ) as AbiFunctionFragment;

  if (!methodAbi) {
    throw new DittoContractMethodNotFoundError();
  }

  return methodAbi;
};
