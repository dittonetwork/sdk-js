import { Token } from './types';
import { Chain } from '../chains/types';

export const nativeTokens: { [key in Chain]: Token & { chain: key } } = {
  [Chain.Polygon]: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC',
    chain: Chain.Polygon,
  },
  [Chain.Arbitrum]: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    name: 'Ethereum',
    decimals: 18,
    symbol: 'ETH',
    chain: Chain.Arbitrum,
  },
};
