import { ethers } from 'ethers';

// @todo avoid
export const toUtf8Bytes = (input: string): Uint8Array => {
  return ethers.toUtf8Bytes(input);
};
