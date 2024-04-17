import { Chain } from '../blockchain/chains/types';
import { SmartWallet } from './smart-wallet/smart-wallet';

export interface Factory {
  getDefaultOrCreateVault(chainId: Chain): Promise<SmartWallet>;
  getByAddress(chainId: number, address: string): Promise<SmartWallet>;

  list(chainId: number): Promise<SmartWallet[]>;
}
