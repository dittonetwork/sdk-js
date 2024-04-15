import { Chain } from '../ditto-sdk';
import { Maybe } from '../types';
import { SmartWallet } from './smart-wallet/smart-wallet';

export interface Factory {
  getDefaultOrCreateVault(chainId: Chain): Promise<SmartWallet>;
  getByAddress(chainId: number, address: string): Promise<SmartWallet>;

  list(chainId: number): Promise<SmartWallet[]>;
}
