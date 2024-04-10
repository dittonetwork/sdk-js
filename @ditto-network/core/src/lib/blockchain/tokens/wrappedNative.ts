import { Chain } from '../chains/types';
import { Token } from '../../ditto-sdk';

export const wrappedNativeTokens: { [key in Chain]: Token & { chain: key } } = {
  [Chain.Polygon]: {
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    name: 'Wrapped MATIC',
    decimals: 18,
    symbol: 'WMATIC',
    chain: Chain.Polygon,
  },
  [Chain.Arbitrum]: {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'Wrapped ETH',
    decimals: 18,
    symbol: 'WETH',
    chain: Chain.Arbitrum,
  },
};
