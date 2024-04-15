import { Address, Chain } from '../ditto-sdk';

export type DittoConfig = {
  apiBaseUrl: string;

  vaultFactoryAddresses: Record<Chain, Address>;
  vaultImplementations: Record<Chain, Address[]>;
};
