import { ethers } from 'ethers5';

// @todo avoid
export const toUtf8Bytes = (input: string): Uint8Array => {
  return ethers.utils.toUtf8Bytes(input);
};
