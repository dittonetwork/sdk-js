import { Chain } from '../chains/types';
import { Address } from '../../types';

export const uniswapPoolFactoryAddresses: { [key in Chain]: Address } = {
  [Chain.Polygon]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [Chain.Arbitrum]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
};
