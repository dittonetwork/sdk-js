import { Chain } from '../chains/types';
import { Address } from '../../types';

export const dittoOracleAddresses: { [key in Chain]: Address } = {
  [Chain.Polygon]: '0x7b5438F5037A74fd8deaF1c5f7c1B3575A93026A',
  [Chain.Arbitrum]: '0x7b5438F5037A74fd8deaF1c5f7c1B3575A93026A',
};
