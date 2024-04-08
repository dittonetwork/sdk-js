import { Chain } from '../../chains/types';
import { nativeTokens } from '../native';
import { isAddressesEqual } from './is-addresses-equal';
import { Address } from '../../../types';

export const isNativeToken = (address: Address, chain: Chain): boolean =>
  isAddressesEqual(nativeTokens[chain].address, address);
