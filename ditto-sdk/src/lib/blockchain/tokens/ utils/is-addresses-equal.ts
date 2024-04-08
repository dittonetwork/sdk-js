import { Address } from '../../../types';
import { trim } from 'rambda';

export const isAddressesEqual = (address1: Address, address2: Address): boolean =>
  trim(address1).toLowerCase() === trim(address2).toLowerCase();
