import { ChainConfig, chainConfigs } from '../config';
import { AbstractAdapter } from './adapters';

let kit: AutomationKit;

export interface AutomationKitOptions {
  adapter: AbstractAdapter;
}

export class AutomationKit {
  adapter: AbstractAdapter;
  config!: ChainConfig;
  chainId!: string;

  constructor(options: AutomationKitOptions) {
    this.adapter = options.adapter;
  }

  async init(customChainConfig?: ChainConfig) {
    this.chainId = await this.adapter.getChainId();
    if (!this.chainId) throw new Error('Chain not found');
    this.config = customChainConfig || chainConfigs[this.chainId];
    if (!this.config) throw new Error(`Unsupported chain with chainId ${this.chainId}`);
  }

  async getContract(contractKey: keyof ChainConfig['contracts']) {
    if (!this.config) await this.init();
    const contract = this.config.contracts?.[contractKey];
    if (!contract)
      throw new Error(`Contract ${contractKey} is not defined for chain ${this.config.name}`);
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

  async getLatestVersion(): Promise<string> {
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

  // TODO: remove simulate option, it's only for testing
  async deploySmartWallet(vaultId: number, simulate = false) {
    const contract = await this.getContract('vaultFactory');
    const version = await this.getLatestVersion();
    const method = simulate ? 'simulateContract' : 'writeContract';
    return this.adapter[method]({
      address: contract.address,
      abi: contract.abi,
      method: 'deploy',
      args: [version, vaultId],
      type: 'write',
    });
  }

  async createWorkflow(workflowConfig: {
    name: string;
    triggers: any[];
    actions: any[];
  }, simulate = false) {
    // ...
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

export async function getLatestVersion() {
  return kit.getLatestVersion();
}

export async function deploySmartWallet(vaultId: number, simulate = false) {
  return kit.deploySmartWallet(vaultId, simulate);
}
