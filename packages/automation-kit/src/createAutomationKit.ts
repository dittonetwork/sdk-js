import type { Web3Provider } from '@repo/core';

export type CreateAutomationKitParams = {
	provider: Web3Provider;
};

export type AutomationKit = {
	readonly provider: Web3Provider;
};

export const createAutomationKit = (
	params: CreateAutomationKitParams,
): AutomationKit => {
	const provider = params.provider;

	return {
		get provider() {
			return provider;
		},
	};
};
