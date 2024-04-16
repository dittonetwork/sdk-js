import { Address, Maybe } from '../../types';

export type Asset = {
  id: string;
  amount: number;
};

export type SmartWalletVersion = 1 | 2 | 3 | 4;

export interface ISmartWallet {
  rename(name: string): Promise<string>;
  withdraw(assetID: string, amount: number): Promise<boolean>;
  deposit(assetID: string, amount: number): Promise<boolean>;
  upgrade(version: string): Promise<boolean>;
  hide(): Promise<boolean>;
  show(): Promise<boolean>;
  deploy(): Promise<boolean>;

  isDeployed(): Promise<boolean>;
  getAddress(): Maybe<Address>;
  getMaximumVersion(): Promise<SmartWalletVersion>;
  getAssets(): Asset[];
  getBalance(): Asset;
  getName(): string;
  getVersion(): Promise<SmartWalletVersion>;
}
