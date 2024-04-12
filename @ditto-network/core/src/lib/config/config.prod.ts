// we use this file for environment related configurations
// all production related things are in config.prod.ts

import { DittoConfig } from './types';
import { Chain } from '../ditto-sdk';

export const config: DittoConfig = {
  apiBaseUrl: 'https://backend.dittonetwork.io',

  vaultImplementations: {
    [Chain.Polygon]: [
      '0xa4918Eb4ce5Cb72dde220963AB643c02c09374cf',
      '0xD85Cab06561E2252Eb81dcA86a31a1d3aeb73543',
      '0x6f53Cb6eCfB6d53AE2827DA81cfac9B26C725462',
    ],
    [Chain.Arbitrum]: [
      '0x0ebd83871160FeBc3736d4Ecfa50ee474DBF2d76',
      '0x9B5056cB0378b461924DF358746BB0F7A57c0524',
      '0x6c07D39042b2480a512675fdcc10A20756ba2d7B',
    ],
  },
};
