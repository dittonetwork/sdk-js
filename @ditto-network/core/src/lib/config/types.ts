import { Address, Chain } from '../ditto-sdk';

export type DittoConfig = {
  apiBaseUrl: string;

  vaultImplementations: Record<Chain, Address[]>;
};
