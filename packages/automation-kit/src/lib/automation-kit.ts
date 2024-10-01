// TODO: Remove ethers dependency from this file
import { ethers } from 'ethers';

import { type ChainConfig, chainConfigs } from '../config';
import {
	ActionFn,
	type ActionResult,
	TriggerFn,
	type TriggerResult,
} from './types';
import type { AbstractAdapter } from './adapters';

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
		if (!this.config)
			throw new Error(`Unsupported chain with chainId ${this.chainId}`);
	}

	async getContract(contractKey: keyof ChainConfig['contracts']) {
		if (!this.config) await this.init();
		const contract = this.config.contracts?.[contractKey];
		if (!contract)
			throw new Error(
				`Contract ${contractKey} is not defined for chain ${this.config.name}`,
			);
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

	async createWorkflowWip(
		options: {
			name: string;
			triggers: TriggerResult[];
			actions: ActionResult[];
		},
		simulate = false,
	) {
		const actionsCallData = await Promise.all(
			options.actions.map((action) => action(this.adapter)),
		);
		const triggersCallData = await Promise.all(
			options.triggers.map((trigger) => trigger(this.adapter)),
		);
		const value = [...actionsCallData, ...triggersCallData].reduce(
			(acc, item) => {
				return acc + BigInt(item.value);
			},
			BigInt(0),
		);
		const vaultFactory = await this.getContract('vaultFactory');
		const vaultInterface = new ethers.Interface(vaultFactory.abi);

    // TODO: viewData and initData missing here
    const triggersCallDataChunk = triggersCallData.map((cd) => [
			cd.callData,
			ethers.toUtf8Bytes(''),
			ethers.toUtf8Bytes(Math.random().toString()), // For random seed or id
			ethers.toUtf8Bytes(''),
		]);

		const actionsCallDataChunk = actionsCallData.map((cd) => [
			cd.callData,
			ethers.toUtf8Bytes(''),
			ethers.toUtf8Bytes(''),
		]);

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
