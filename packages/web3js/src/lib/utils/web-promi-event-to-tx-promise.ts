import { Web3PromiEvent } from 'web3';
import { createDeferredPromise } from './deferred-promise';
import { MutationTransactionReturnType } from '@ditto-network/core';

export const webPromiEventToTxPromise = async (
  input: Web3PromiEvent<any, any>
): Promise<MutationTransactionReturnType> => {
  const {
    promise: deferredPromise,
    resolve: deferredResolve,
    reject: deferredReject,
  } = createDeferredPromise();

  return new Promise((resolve, reject) => {
    input
      .on('transactionHash', (hash) => {
        resolve({
          hash,
          wait: () => deferredPromise,
        });
      })
      .on('error', (error) => {
        reject(error);
        deferredReject(error);
      })
      .on('receipt', (receipt) => {
        deferredResolve(receipt);
      });
  });
};
