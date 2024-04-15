// we use this file for environment related configurations
// all production related things are in config.prod.ts

import { DittoConfig } from './types';
import { Chain } from '../ditto-sdk';

export const config: DittoConfig = {
  apiBaseUrl: 'https://authentication-backend.dev.dittonetwork.io',

  vaultFactoryAddresses: {
    [Chain.Polygon]: '0xF03C8CaB74b5721eB81210592C9B06f662e9951E',
    [Chain.Arbitrum]: '0xF03C8CaB74b5721eB81210592C9B06f662e9951E',
  },

  vaultImplementations: {
    [Chain.Polygon]: [
      '0x0209A93968BFB0f3c3BbeaE72afAdfFAD0885c98',
      '0x56d3d560Dd74f2150e213875D590648c534a3352',
      '0xE587A6f96fb57b52EF90E638ca16430fC9D8db76',
      '0xA587d512C12558AE377628d87b60106707D68c8e',
    ],
    [Chain.Arbitrum]: [
      '0x77c2c3eA05BA3D1C049CE95b42BD9ddeC31494f0',
      '0x31dBC473343073F9a3cC2998dC1EcA22ce60B3A6',
      '0x3B631ba46C7E0D058F5f34699c8912Cb01b87d2e',
      '0x36D736D294F36380cF92EB9A1F476f94200ca43E',
    ],
  },
};
