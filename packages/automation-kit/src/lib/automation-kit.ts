import { ChainConfig, chainConfigs } from '../config';
import { AbstractAdapter } from './adapters';

let kit: AutomationKit;

export interface AutomationKitOptions {
  adapter: AbstractAdapter;
}

export class AutomationKit {
  adapter: AbstractAdapter;
  config!: ChainConfig;

  constructor(options: AutomationKitOptions) {
    this.adapter = options.adapter;
  }

  async init(customChainConfig?: ChainConfig) {
    const chainId = await this.adapter.getChainId();

    this.config = customChainConfig || chainConfigs[chainId];

    if (!this.config) {
      throw new Error(`Unsupported chain with chainId ${chainId}`);
    }
  }

  async getContract(contractKey: keyof ChainConfig['contracts']) {
    if (!this.config) {
      await this.init();
    }

    const contract = this.config.contracts?.[contractKey];
    if (!contract) {
      throw new Error(`Contract ${contractKey} is not defined for chain ${this.config.name}`);
    }
    return contract;
  }

  async predictVaultAddress(vaultId: number) {
    const creator = await this.adapter.getAddress();
    const contract = await this.getContract('vaultFactory');
    return this.adapter.readContract({
      address: contract.address,
      abi: contract.abi,
      method: 'predictDeterministicVaultAddress',
      args: [creator, vaultId],
      type: 'view',
    });
  }

  async getVersions(): Promise<string> {
    const contract = await this.getContract('vaultFactory');
    const versions = await this.adapter.readContract({
      address: contract.address,
      abi: contract.abi,
      method: 'versions',
      args: [],
      type: 'view',
    });
    return String(versions);
  }
}

export async function createAutomationKit(options: AutomationKitOptions) {
  kit = new AutomationKit(options);
  await kit.init();
  return kit;
}

export async function predictVaultAddress(vaultId: number) {
  return kit.predictVaultAddress(vaultId);
}

export async function getVersions() {
  return kit.getVersions();
}
