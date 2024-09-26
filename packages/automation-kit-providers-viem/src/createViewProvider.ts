import { encodeFunctionData } from 'viem';

import type { Web3Provider } from '@repo/core';

export const createViewProvider = (): Readonly<Web3Provider> => {
	return {
		encodeFunctionData: ({ abi, functionName, args }) =>
			encodeFunctionData({
				abi,
				functionName,
				args,
			}),
	};
};
