import { StargateClient } from '@cosmjs/stargate';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createKeplerClient } from '../kepler_client';
import type { KeplerClient } from '../types';

// Mock StargateClient
vi.mock('@cosmjs/stargate', () => ({
	StargateClient: {
		connect: vi.fn(),
	},
}));

describe('KeplerClient', () => {
	const rpcEndpoint = 'http://localhost:26657';
	const testAddress = 'ditto1kw6hwvxcc474yrn76rf3y7puyhm000mxdn4a0x';
	let mockClient: {
		getAccount: ReturnType<typeof vi.fn>;
		disconnect: ReturnType<typeof vi.fn>;
	};
	let keplerClient: KeplerClient;

	beforeEach(() => {
		// Create mock StargateClient instance
		mockClient = {
			getAccount: vi.fn(),
			disconnect: vi.fn(),
		};

		// Setup mock connect to return our mock client
		(StargateClient.connect as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockClient,
		);

		// Create Kepler client instance
		keplerClient = createKeplerClient(rpcEndpoint);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('connect', () => {
		it('should connect to the RPC endpoint', async () => {
			await keplerClient.connect();
			expect(StargateClient.connect).toHaveBeenCalledWith(rpcEndpoint);
		});

		it('should throw error if connection fails', async () => {
			(StargateClient.connect as ReturnType<typeof vi.fn>).mockRejectedValue(
				new Error('Connection failed'),
			);
			await expect(keplerClient.connect()).rejects.toThrow('Connection failed');
		});
	});

	describe('getAccountNonce', () => {
		it('should throw error if client is not connected', async () => {
			await expect(keplerClient.getAccountNonce(testAddress)).rejects.toThrow(
				'Kepler client not connected',
			);
		});

		it('should return null if account does not exist', async () => {
			await keplerClient.connect();
			mockClient.getAccount.mockResolvedValue(null);

			const nonce = await keplerClient.getAccountNonce(testAddress);
			expect(nonce).toBeNull();
			expect(mockClient.getAccount).toHaveBeenCalledWith(testAddress);
		});

		it('should return account sequence if account exists', async () => {
			await keplerClient.connect();
			const testSequence = 42;
			mockClient.getAccount.mockResolvedValue({ sequence: testSequence });

			const nonce = await keplerClient.getAccountNonce(testAddress);
			expect(nonce).toBe(testSequence);
			expect(mockClient.getAccount).toHaveBeenCalledWith(testAddress);
		});
	});

	describe('disconnect', () => {
		it('should disconnect client if connected', async () => {
			await keplerClient.connect();
			await keplerClient.disconnect();
			expect(mockClient.disconnect).toHaveBeenCalled();
		});

		it('should not throw error if client is not connected', async () => {
			await expect(keplerClient.disconnect()).resolves.not.toThrow();
		});
	});
});
