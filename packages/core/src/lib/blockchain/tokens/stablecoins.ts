import { Chain } from '../chains/types';
import { Address } from '../../types';

export const stableCoins = {
  [Chain.Polygon]: {
    USDC: {
      address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' as Address,
      name: 'USD Coin (PoS)',
      decimals: 6,
      symbol: 'USDC',
      chain: Chain.Polygon,
    },
    USDT: {
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' as Address,
      name: 'Tether USD',
      decimals: 6,
      symbol: 'USDT',
      chain: Chain.Polygon,
    },
  },
  [Chain.Arbitrum]: {},
};
