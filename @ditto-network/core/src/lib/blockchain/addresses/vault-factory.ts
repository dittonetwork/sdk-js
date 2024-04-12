import { Chain } from '../chains/types';
import { Address } from '../../types';

export const vaultFactoryAddresses: { [key in Chain]: Address } = {
  [Chain.Polygon]: '0xF03C8CaB74b5721eB81210592C9B06f662e9951E',
  // TODO: add Arbitrum address
  [Chain.Arbitrum]: '0x...',
};
