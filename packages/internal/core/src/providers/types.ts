import type { Hex } from '../common/types';

export type EncodeFunctionDataParameters = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	abi: any;
	functionName: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	args: any[];
};

export type Web3Provider = {
	encodeFunctionData: ({
		abi,
		functionName,
	}: EncodeFunctionDataParameters) => Hex;
};
