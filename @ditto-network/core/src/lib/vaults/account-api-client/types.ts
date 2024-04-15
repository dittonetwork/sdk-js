import { Address } from '../../types';
import { Chain } from '../../ditto-sdk';

export interface FullData {
  id: string;
  accounts: Account[];
  createdAt: Date;
  referralCodes: ReferralCode[];
  sudo: boolean;
}

export interface Account {
  id: string;
  address: string;
  userId: string;
  vaults: Vault[];
  createdAt: Date;
}

export interface Vault {
  id: string;
  chainId: Chain;
  accountId: string;
  address: Address;
  createdAt: Date;
}

export type VaultDto = Omit<Vault, 'id'> & {
  id: number;
  uuid: string;
  ownerAddress: Address;
};

interface ReferralCode {
  code: string;
  referredWalletAddress: null;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
