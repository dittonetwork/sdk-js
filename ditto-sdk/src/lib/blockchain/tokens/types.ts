import { Address } from '../../types';
import { Chain } from '../chains/types';

export type TokenLight = {
  address: Address;
  decimals: number;
};

export type Token = TokenLight & {
  symbol: string;
  name: string;
  chain: Chain;
};

export type ChainTokens = {
  [key in Chain]: {
    [name: string]: Token & { chain: key };
  };
};
