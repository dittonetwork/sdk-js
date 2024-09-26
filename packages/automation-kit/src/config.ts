import VaultFactoryABI from './abis/VaultFactoryABI.json';

export type ChainContract = {
  address: string
  abi: any
};

export interface ChainBlockExplorer {
  name: string
  url: string
}

export interface ChainRpcUrls {
  http: string[]
  websocket?: string[]
}

export type ChainConfig = {
  contracts: {
    vaultFactory?: ChainContract
    vaultImplementation?: ChainContract
  }
  id: number
  name: string
}

export const polygonChainConfig: ChainConfig = {
  id: 137,
  name: 'Polygon',
  contracts: {
    vaultFactory: {
      address: '0xaB5F025297E40bd5ECf340d1709008eFF230C6cA',
      abi: VaultFactoryABI,
    },
  },
};

export const arbitrumChainConfig: ChainConfig = {
  id: 42161,
  name: 'Arbitrum',
  contracts: {
    vaultFactory: {
      address: '0xaB5F025297E40bd5ECf340d1709008eFF230C6cA',
      abi: VaultFactoryABI,
    },
  },
};

export const chainConfigs: { [chainId: string | number]: ChainConfig } = {
  137: polygonChainConfig,
  42161: arbitrumChainConfig,
};
