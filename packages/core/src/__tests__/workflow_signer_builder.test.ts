import { createWalletClient, custom } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { signTypedData } from 'viem/actions';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Job } from '../types';

import { createMerkleRoot } from '../create_merkle_root';
import { createWorkflowSignerBuilder } from '../workflow_signer_builder';

// Mocking viem/actions
vi.mock('viem/actions', async () => {
	const actual = await vi.importActual('viem/actions');
	return {
		...actual,
		requestAddresses: vi.fn().mockResolvedValue(true),
		signTypedData: vi.fn().mockResolvedValue('0xmocked_signature'),
	};
});

vi.mock('@dittowallet/core', () => ({
	signTypedData: vi
		.fn()
		.mockResolvedValue(
			'0x8f8a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebf',
		),
}));

const mnemonic = 'test test test test test test test test test test test junk';

// Test jobs for creating merkle root
const testJobs: Job[] = [
	{
		id: 'job1',
		chain_id: 1,
		checkers: {
			count: 5,
		},
		steps: [
			{
				name: 'step1',
				address: '0xabcdef1234567890abcdef1234567890abcdef12',
				calldata: '0x',
			},
			{
				name: 'step2',
				address: '0x0987654321fedcba0987654321fedcba09876543',
				calldata: '0x1234',
			},
		],
	},
	{
		id: 'job2',
		chain_id: 1,
		checkers: {
			gas_limit: {
				max_fee: 100,
				max_priority_fee: 10,
			},
		},
		steps: [
			{
				name: 'step3',
				address: '0x1111111111111111111111111111111111111111',
				calldata: '0xabcd',
			},
		],
	},
];

describe('WorkflowSignerBuilder', () => {
	let walletClient: ReturnType<typeof createWalletClient>;
	let account: ReturnType<typeof mnemonicToAccount>;
	const domain = {
		name: 'Workflow',
		version: '1',
		chainId: 1,
		verifyingContract: '0x0000000000000000000000000000000000000000',
	} as const;

	// Get real merkle root from test jobs
	const generatedMerkleRoot = createMerkleRoot(testJobs);

	beforeEach(() => {
		account = mnemonicToAccount(mnemonic);

		// Create mock for walletClient
		walletClient = createWalletClient({
			account,
			chain: {
				id: 1,
				name: 'Ethereum',
				nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
				rpcUrls: { default: { http: ['http://localhost:8545'] } },
			},
			transport: custom({
				request: vi.fn().mockResolvedValue(null),
			}),
		});

		// Mock requestAddresses method
		walletClient.requestAddresses = vi.fn().mockResolvedValue(undefined);

		// Mock getAddresses method
		walletClient.getAddresses = vi.fn().mockResolvedValue([account.address]);

		// Clear mocks before each test
		vi.clearAllMocks();
	});

	it('should sign a merkle root correctly', async () => {
		const signer = await createWorkflowSignerBuilder(walletClient)
			.setDomain(domain)
			.build();

		const signature = await signer.sign(generatedMerkleRoot);

		expect(typeof signature).toBe('string');
		expect(signature).toBe('0xmocked_signature');
		expect(signTypedData).toHaveBeenCalledTimes(1);
	});

	it('should use the address from wallet when signing', async () => {
		const expectedAddress = account.address;
		const signer = await createWorkflowSignerBuilder(walletClient)
			.setDomain(domain)
			.build();

		await signer.sign(generatedMerkleRoot);

		// Check that the correct address is used for signing
		expect(signTypedData).toHaveBeenCalledTimes(1);
		const callArgs = vi.mocked(signTypedData).mock.calls[0][1];
		expect(callArgs.account).toBe(expectedAddress);
	});

	it('should throw if required fields are missing', async () => {
		const builder = createWorkflowSignerBuilder(walletClient);

		await expect(builder.build()).rejects.toThrow(
			'Missing required data to build signer: domain is required',
		);
	});

	it('should regenerate merkle root from different jobs and sign it', async () => {
		// Create new test jobs
		const newTestJobs: Job[] = [
			{
				id: 'different-job',
				chain_id: 1,
				checkers: {
					count: 3,
				},
				steps: [
					{
						name: 'different-step',
						address: '0xfedcba9876543210fedcba9876543210fedcba98',
						calldata: '0xffff',
					},
				],
			},
		];

		// Generate new merkle root
		const differentMerkleRoot = createMerkleRoot(newTestJobs);

		// Check that it differs from the first one
		expect(differentMerkleRoot).not.toEqual(generatedMerkleRoot);

		const signer = await createWorkflowSignerBuilder(walletClient)
			.setDomain(domain)
			.build();

		const signature = await signer.sign(differentMerkleRoot);

		expect(typeof signature).toBe('string');
		expect(signature).toBe('0xmocked_signature');
	});

	it('should work with a custom domain configuration', async () => {
		// Create a different domain to verify it's set correctly
		const customDomain = {
			...domain,
			chainId: 5,
			verifyingContract:
				'0x1111111111111111111111111111111111111111' as `0x${string}`,
		};

		const signer = await createWorkflowSignerBuilder(walletClient)
			.setDomain(customDomain)
			.build();

		const signature = await signer.sign(generatedMerkleRoot);

		expect(typeof signature).toBe('string');
		expect(signature).toBe('0xmocked_signature');

		// Check that the correct domain was used
		expect(signTypedData).toHaveBeenCalledTimes(1);
		const callArgs = vi.mocked(signTypedData).mock.calls[0][1];
		expect(callArgs.domain).toBeDefined();
		expect(typeof callArgs.domain).toBe('object');
		if (callArgs.domain) {
			expect('chainId' in callArgs.domain).toBe(true);
			expect((callArgs.domain as { chainId: number }).chainId).toBe(5);
		}
	});

	it('should throw if domain is not set', async () => {
		const builder = createWorkflowSignerBuilder(walletClient);

		await expect(builder.build()).rejects.toThrow(
			'Missing required data to build signer: domain is required',
		);
	});
});
