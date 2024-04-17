import { Chain } from '../blockchain/chains/types';
import { Address } from '../types';

export type DittoConfig = {
  apiBaseUrl: string;

  vaultFactoryAddresses: Record<Chain, Address>;
  vaultImplementations: Record<Chain, Address[]>;
};
