import { regularTokens } from './regular';
import { nativeTokens } from './native';
import { stableCoins } from './stablecoins';
import type { Token } from './types';
import { wrappedNativeTokens } from './wrappedNative';

export const tokens = {
  wrappedNative: wrappedNativeTokens,
  regular: regularTokens,
  native: nativeTokens,
  stableCoins: stableCoins,
};

export type { Token };
