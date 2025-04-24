import { StargateClient } from '@cosmjs/stargate';
import type { KeplerClient } from './types';

export function createKeplerClient(rpcEndpoint: string): KeplerClient {
	let client: StargateClient | null = null;

	return {
		async connect() {
			client = await StargateClient.connect(rpcEndpoint);
		},
		async getAccountNonce(address: string) {
			if (!client) {
				throw new Error('Kepler client not connected');
			}

			const account = await client.getAccount(address);

			if (!account) {
				return null;
			}

			return account.sequence;
		},
		async disconnect() {
			return client?.disconnect();
		},
	};
}
