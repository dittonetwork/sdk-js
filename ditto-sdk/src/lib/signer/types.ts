import { Transaction, TxHash, WalletAddress } from '../types';

export interface DittoSigner {
  getAddress(): Promise<WalletAddress>;
  sendTransaction(tx: Transaction): Promise<TxHash>;
  signMessage(message: string): Promise<string>;
}
