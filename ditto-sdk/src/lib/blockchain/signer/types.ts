import { Transaction, TxHash, WalletAddress } from '../../types';
import { ethers } from 'ethers';

export interface DittoSigner {
  getRawSigner(): ethers.Signer;
  getAddress(): Promise<WalletAddress>;
  sendTransaction(tx: Transaction): Promise<TxHash>;
  signMessage(message: string): Promise<string>;
}
