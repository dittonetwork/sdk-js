import { Address, Transaction, TxHash, WalletAddress } from '../types';
import { ethers } from 'ethers';

export interface DittoSigner {
  getRawSigner(): ethers.Signer;
  getAddress(): Promise<WalletAddress>;
  sendTransaction(tx: Transaction): Promise<{ hash: TxHash; wait: () => Promise<unknown> }>;
  signMessage(message: string): Promise<string>;
  getBalance(address: Address): Promise<string>;
}
