import { Chain } from '../chains/types';
import { Address } from '../../types';

export const dittoSmartWalletFactoryAddresses: { [key in Chain]: Address } = {
  [Chain.Polygon]: '0xF03C8CaB74b5721eB81210592C9B06f662e9951E',
  [Chain.Arbitrum]: '0x...',
};
