import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJobBuilder } from '../job_builder';
import { type StepBuilder, createStepBuilder } from '../step_builder';
import type {
	Job,
	KeplerClient,
	OnchainEventTrigger,
	ScheduleTrigger,
	Step,
} from '../types';
import { createWorkflowBuilder } from '../workflow_builder';
import type { WorkflowSigner } from '../workflow_signer_builder';

// Mock the merkle root creation function
vi.mock('../create_merkle_root', () => ({
	createMerkleRoot: vi.fn().mockImplementation((jobs) => {
		// Create a unique hash based on job IDs
		const jobIds = jobs.map((job: Job) => job.id).join(',');
		const hash = `0x${Buffer.from(jobIds).toString('hex').padEnd(64, '0')}`;
		return hash;
	}),
}));

// Mock getPublicKey
vi.mock('../address', () => ({
	getKeplerAddress: vi
		.fn()
		.mockImplementation(() =>
			Promise.resolve('0x1234567890abcdef1234567890abcdef1234567890'),
		),
	getAddressFromPubKey: vi
		.fn()
		.mockImplementation(
			() => 'ditto1abcdef1234567890abcdef1234567890abcdef1234567890',
		),
}));

describe('WorkflowBuilder', () => {
	let builder: ReturnType<typeof createWorkflowBuilder>;
	let mockSigner: WorkflowSigner;
	let mockKeplerClient: KeplerClient;
	let testJob: Job;
	let baseStep: Step;

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();

		// Create a mock signer object
		mockSigner = {
			sign: vi
				.fn()
				.mockImplementation(() =>
					Promise.resolve(
						'0x8a7d5a224f03f1457a1c3462c8c5d8c93c2d29061ac2b965d8c0c6ee78347f3f7e4c27d1c9bc5b1c6c1b97c0a0e8c74e25fc4cc7bc12a6fc8ff3879d3052c7c1b',
					),
				),
		};

		mockKeplerClient = {
			connect: vi.fn().mockImplementation(() => Promise.resolve()),
			getAccountNonce: vi.fn().mockImplementation(() => Promise.resolve(42)),
			disconnect: vi.fn().mockImplementation(() => Promise.resolve()),
		};

		// Create a test job to use in tests
		baseStep = createStepBuilder()
			.withName('Test Step')
			.withContractCall({
				address: '0x1234567890123456789012345678901234567890',
				calldata: '0xabcdef',
			})
			.build();

		testJob = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('Test Step').withContractCall({
					address: '0x1234567890123456789012345678901234567890',
					calldata: '0xabcdef',
				});
			})
			.build();

		// Create a new WorkflowBuilder instance before each test
		builder = createWorkflowBuilder().withName('Test Workflow');
	});

	describe('withName', () => {
		it('should throw an error when name is not provided', () => {
			expect(() => createWorkflowBuilder().withName('')).toThrow(
				'Workflow name is required',
			);
			expect(() => createWorkflowBuilder().withName('   ')).toThrow(
				'Workflow name is required',
			);
		});

		it('should create a workflow with the given name', async () => {
			const workflow = await builder
				.onScheduleTrigger({ cron: '0 * * * *' })
				.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(workflow.name).toBe('Test Workflow');
		});
	});

	describe('Basic Functionality', () => {
		it('should add a job to the workflow', async () => {
			const workflow = await builder
				.onScheduleTrigger({ cron: '0 * * * *' })
				.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.addJob((job) =>
					job
						.withBaseParams({ id: 'another-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step2').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(workflow.jobs).toHaveLength(2);
			expect(workflow.jobs[0].id).toBe('test-job');
			expect(workflow.jobs[1].id).toBe('another-job');
		});

		it('should throw error when adding job with duplicate ID', () => {
			builder.addJob((job) =>
				job
					.withBaseParams({ id: 'test-job', chainId: 1 })
					.addStep((stepBuilder: StepBuilder) => {
						return stepBuilder.withName('step1').withContractCall({
							address: '0x1234567890123456789012345678901234567890',
							calldata: '0xabcdef',
						});
					}),
			);

			expect(() =>
				builder.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step2').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				),
			).toThrow('Job with ID "test-job" already exists in the workflow');
		});
	});

	describe('Trigger Management', () => {
		it('should add schedule trigger', async () => {
			const scheduleTrigger: ScheduleTrigger = { cron: '0 0 * * *' };

			const workflow = await builder
				.onScheduleTrigger(scheduleTrigger)
				.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(workflow.on.schedule).toEqual(scheduleTrigger);
		});

		it('should add onchain event trigger', async () => {
			const onchainEventTrigger: OnchainEventTrigger = {
				abi: '[{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}]}]',
				addresses: ['0x1234567890123456789012345678901234567890'],
				event_name: 'Transfer',
			};

			const workflow = await builder
				.onChainEventTrigger(onchainEventTrigger)
				.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(workflow.on.onchain_event).toEqual(onchainEventTrigger);
		});

		it('should support both trigger types simultaneously', async () => {
			const scheduleTrigger: ScheduleTrigger = { cron: '0 0 * * *' };
			const onchainEventTrigger: OnchainEventTrigger = {
				abi: '[{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}]}]',
				addresses: ['0x1234567890123456789012345678901234567890'],
				event_name: 'Transfer',
			};

			const workflow = await builder
				.onScheduleTrigger(scheduleTrigger)
				.onChainEventTrigger(onchainEventTrigger)
				.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(workflow.on.schedule).toEqual(scheduleTrigger);
			expect(workflow.on.onchain_event).toEqual(onchainEventTrigger);
		});
	});

	describe('Error Validation', () => {
		it('should throw error when required fields are missing', async () => {
			// Without trigger
			await expect(
				createWorkflowBuilder()
					.withName('Test Workflow')
					.addJob((job) =>
						job
							.withBaseParams({ id: 'test-job', chainId: 1 })
							.addStep((stepBuilder: StepBuilder) => {
								return stepBuilder.withName('step1').withContractCall({
									address: '0x1234567890123456789012345678901234567890',
									calldata: '0xabcdef',
								});
							}),
					)
					.withSigner(mockSigner)
					.withKeplerClient(mockKeplerClient)
					.buildAndSign(),
			).rejects.toThrow(
				'Missing required workflow field: at least one trigger (schedule or onchain_event)',
			);
		});

		it('should throw error when signer is missing', async () => {
			await expect(
				builder
					.onScheduleTrigger({ cron: '0 * * * *' })
					.addJob((job) =>
						job
							.withBaseParams({ id: 'test-job', chainId: 1 })
							.addStep((stepBuilder: StepBuilder) => {
								return stepBuilder.withName('step1').withContractCall({
									address: '0x1234567890123456789012345678901234567890',
									calldata: '0xabcdef',
								});
							}),
					)
					.withKeplerClient(mockKeplerClient)
					.buildAndSign(),
			).rejects.toThrow(
				'Missing signer: call .withSigner(signer) before buildAndSign()',
			);
		});

		it('should throw error when jobs are missing', async () => {
			await expect(
				builder
					.onScheduleTrigger({ cron: '0 * * * *' })
					.withSigner(mockSigner)
					.withKeplerClient(mockKeplerClient)
					.buildAndSign(),
			).rejects.toThrow('Jobs array is empty');
		});
	});

	describe('Complete workflow example', () => {
		it('should build a complete working workflow with all options', async () => {
			// Create multiple steps and jobs
			const step1 = createStepBuilder()
				.withName('Step 1')
				.withContractCall({
					address: '0x1234567890123456789012345678901234567890',
					calldata: '0xabcdef',
				})
				.build();

			const step2 = createStepBuilder()
				.withName('Step 2')
				.withAction({
					uses: 'ditto/context@v1',
					with: { param1: 'value1' },
				})
				.build();

			const job1 = createJobBuilder()
				.withBaseParams({ id: 'job-1', chainId: 1 })
				.addStep((stepBuilder: StepBuilder) => {
					return stepBuilder.withName('Step 1').withContractCall({
						address: '0x1234567890123456789012345678901234567890',
						calldata: '0xabcdef',
					});
				})
				.build();

			const job2 = createJobBuilder()
				.withBaseParams({ id: 'job-2', chainId: 1 })
				.addStep((stepBuilder: StepBuilder) => {
					return stepBuilder.withName('Step 2').withAction({
						uses: 'ditto/context@v1',
						with: { param1: 'value1' },
					});
				})
				.dependsOn('job-1')
				.withAccountAbstraction('0x1234567890123456789012345678901234567890')
				.build();

			// Current time + 24 hours
			const expirationTime = Math.floor(Date.now() / 1000) + 86400;

			// Build a complete workflow
			const fullWorkflow = await createWorkflowBuilder()
				.withName('Comprehensive Workflow')
				.onScheduleTrigger({ cron: '0 0 * * *' })
				.onChainEventTrigger({
					abi: '[{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}]}]',
					addresses: ['0x1234567890123456789012345678901234567890'],
					event_name: 'Transfer',
				})
				.addJob((job) =>
					job
						.withBaseParams({ id: 'job-1', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.addJob((job) =>
					job
						.withBaseParams({ id: 'job-2', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step2').withAction({
								uses: 'ditto/context@v1',
								with: { param1: 'value1' },
							});
						})
						.dependsOn('job-1')
						.withAccountAbstraction(
							'0x1234567890123456789012345678901234567890',
						),
				)
				.withCount(3)
				.withExpiration(expirationTime)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(fullWorkflow.name).toBe('Comprehensive Workflow');
			expect(fullWorkflow.jobs).toHaveLength(2);
			expect(fullWorkflow.jobs[0].id).toBe('job-1');
			expect(fullWorkflow.jobs[1].id).toBe('job-2');
			expect(fullWorkflow.jobs[1].needs).toEqual(['job-1']);
			expect(fullWorkflow.count).toBe(3);
			expect(fullWorkflow.expired_at).toBe(expirationTime);
			expect(fullWorkflow.signature).toBe(
				'0x8a7d5a224f03f1457a1c3462c8c5d8c93c2d29061ac2b965d8c0c6ee78347f3f7e4c27d1c9bc5b1c6c1b97c0a0e8c74e25fc4cc7bc12a6fc8ff3879d3052c7c1b',
			);
			expect(fullWorkflow.id).toMatch(/^0x[a-fA-F0-9]{64}$/);
		});
	});

	describe('Kepler Client', () => {
		it('should set Kepler client', () => {
			const result = builder.withKeplerClient(mockKeplerClient);
			expect(result).toBe(builder);
		});

		it('should throw error if Kepler client is not set before buildAndSign', async () => {
			await expect(
				builder
					.onScheduleTrigger({ cron: '0 * * * *' })
					.addJob((job) =>
						job
							.withBaseParams({ id: 'test-job', chainId: 1 })
							.addStep((stepBuilder: StepBuilder) => {
								return stepBuilder.withName('step1').withContractCall({
									address: '0x1234567890123456789012345678901234567890',
									calldata: '0xabcdef',
								});
							}),
					)
					.withSigner(mockSigner)
					.buildAndSign(),
			).rejects.toThrow(
				'Missing Kepler client: call .setKeplerClient(client) before buildAndSign()',
			);
		});

		it('should use Kepler client to get account nonce', async () => {
			const workflow = await builder
				.onScheduleTrigger({ cron: '0 * * * *' })
				.addJob((job) =>
					job
						.withBaseParams({ id: 'test-job', chainId: 1 })
						.addStep((stepBuilder: StepBuilder) => {
							return stepBuilder.withName('step1').withContractCall({
								address: '0x1234567890123456789012345678901234567890',
								calldata: '0xabcdef',
							});
						}),
				)
				.withSigner(mockSigner)
				.withKeplerClient(mockKeplerClient)
				.buildAndSign();

			expect(mockKeplerClient.getAccountNonce).toHaveBeenCalled();
			expect(workflow.nonce).toBe(42);
		});
	});
});
