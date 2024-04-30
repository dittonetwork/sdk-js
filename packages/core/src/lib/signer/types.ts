import { Address, MutationTransactionReturnType, Transaction } from '../types';
import { JSONObject } from '../network/api-client/types';

export interface DittoSigner {
  getAddress(): Promise<Address>;
  sendTransaction(tx: Transaction & JSONObject): Promise<MutationTransactionReturnType>;
  signMessage(message: string): Promise<string>;
  getBalance(address: Address): Promise<string>;
}
