import { Chain } from '../chains/types';
import { Address } from '../../types';

export const wrappedNativeTokens: { [key in Chain]: Address } = {
  [Chain.Polygon]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [Chain.Arbitrum]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
};
