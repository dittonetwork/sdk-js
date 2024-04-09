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
  chainId: number;
  accountId: string;
  address: string;
  createdAt: Date;
}

interface ReferralCode {
  code: string;
  referredWalletAddress: null;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
