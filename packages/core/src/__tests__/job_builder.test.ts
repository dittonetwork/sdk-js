import { describe, expect, it } from 'vitest';
import { createJobBuilder } from '../job_builder';
import { type StepBuilder, createStepBuilder } from '../step_builder';
import type {
	ActionStep,
	AssetPriceChecker,
	OnChainCallChecker,
} from '../types';

describe('JobBuilder', () => {
	it('should create a job with a contract call step', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.build();

		expect(job).toEqual({
			id: 'test-job',
			chain_id: 1,
			checkers: {},
			needs: [],
			steps: [
				{
					name: 'step1',
					address: '0x123',
					calldata: '0x456',
				},
			],
		});
	});

	it('should create a job with an action step', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withAction({
					uses: 'ditto/action@v1',
					with: {
						param1: 'value1',
						param2: 'value2',
					},
				});
			})
			.build();

		expect(job).toEqual({
			id: 'test-job',
			chain_id: 1,
			checkers: {},
			needs: [],
			steps: [
				{
					name: 'step1',
					uses: 'ditto/action@v1',
					with: {
						param1: 'value1',
						param2: 'value2',
					},
				},
			],
		});
	});

	it('should create a job with multiple steps', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step2').withAction({
					uses: 'ditto/action@v1',
					with: {
						param1: 'value1',
						param2: 'value2',
					},
				});
			})
			.build();

		expect(job).toEqual({
			id: 'test-job',
			chain_id: 1,
			checkers: {},
			needs: [],
			steps: [
				{
					name: 'step1',
					address: '0x123',
					calldata: '0x456',
				},
				{
					name: 'step2',
					uses: 'ditto/action@v1',
					with: {
						param1: 'value1',
						param2: 'value2',
					},
				},
			],
		});
	});

	it('should create a job with dependencies', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.dependsOn('job1')
			.dependsOn('job2')
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.build();

		expect(job).toEqual({
			id: 'test-job',
			chain_id: 1,
			checkers: {},
			needs: ['job1', 'job2'],
			steps: [
				{
					name: 'step1',
					address: '0x123',
					calldata: '0x456',
				},
			],
		});
	});

	it('should add dependencies incrementally', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.dependsOn('job1')
			.dependsOn(['job2', 'job3'])
			.dependsOn('job1') // Дубликат должен быть удален
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.build();

		expect(job.needs).toEqual(['job1', 'job2', 'job3']);
	});

	it('should handle empty dependencies', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.build();

		expect(job.needs?.length).toBe(0);
	});

	it('should create a job with checkers', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.withOnChainCallChecker({
				abi: 'function transfer(address,uint256)',
				method: 'transfer',
				chain_id: 1,
				args: ['0x456', '100'],
			})
			.withGasLimitChecker({ max_fee: 1000000, max_priority_fee: 2000000 })
			.withCountChecker(3)
			.build();

		expect(job.checkers.onchain_calls).toHaveLength(1);
		expect(job.checkers.onchain_calls?.[0].method).toBe('transfer');
	});

	it('should create a job with account abstraction', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.withAccountAbstraction('0x1234567890123456789012345678901234567890')
			.addStep((stepBuilder: StepBuilder) => {
				return stepBuilder.withName('step1').withContractCall({
					address: '0x123',
					calldata: '0x456',
				});
			})
			.build();

		expect(job).toEqual({
			id: 'test-job',
			chain_id: 1,
			account_abstraction: '0x1234567890123456789012345678901234567890',
			needs: [],
			checkers: {},
			steps: [
				{
					name: 'step1',
					address: '0x123',
					calldata: '0x456',
				},
			],
		});
	});

	it('should validate required fields', () => {
		expect(() => {
			createJobBuilder().build();
		}).toThrow('Missing required fields: id, chain_id, or steps');

		expect(() => {
			createJobBuilder().withBaseParams({ id: 'test-job', chainId: 1 }).build();
		}).toThrow('Missing required fields: id, chain_id, or steps');

		expect(() => {
			createJobBuilder()
				.withBaseParams({ id: 'test-job', chainId: 1 })
				.addStep((stepBuilder: StepBuilder) => {
					return stepBuilder.withName('step1');
				})
				.build();
		}).toThrow(
			'Step type is not set: use either withContractCall() or withAction()',
		);
	});

	it('should create a job with on-chain call checker', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withOnChainCallChecker({
				abi: 'function balanceOf(address) returns (uint256)',
				method: 'balanceOf',
				chain_id: 1,
				args: ['0x123'],
			})
			.build();

		expect(job.checkers.onchain_calls).toHaveLength(1);
		expect(job.checkers.onchain_calls?.[0].method).toBe('balanceOf');
	});

	it('should create a job with gas limit checker', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withGasLimitChecker({
				max_fee: 100000000000,
				max_priority_fee: 2000000000,
			})
			.build();

		expect(job.checkers.gas_limit).toBeDefined();
		expect(job.checkers.gas_limit?.max_fee).toBe(100000000000);
	});

	it('should create a job with count checker', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withCountChecker(5)
			.build();

		expect(job.checkers.count).toBe(5);
	});

	it('should create a job with asset price checker', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'test-job', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withAssetPriceChecker({
				sell_asset: '0x123',
				buy_asset: '0x456',
				limit_price: '1000000000000000000',
				operator: '>=',
			})
			.build();

		expect(job.checkers.asset_price_checker).toBeDefined();
		expect(job.checkers.asset_price_checker?.sell_asset).toBe('0x123');
	});

	it('should throw error when required fields are missing', () => {
		expect(() => {
			createJobBuilder().build();
		}).toThrow('Missing required fields: id, chain_id, or steps');
	});

	it('should throw error when id is missing', () => {
		expect(() => {
			createJobBuilder()
				.withBaseParams({ id: '', chainId: 1 })
				.addStep((stepBuilder) =>
					stepBuilder.withName('step1').withContractCall({
						address: '0x0000000000000000000000000000000000000001',
						calldata: '0x123456',
					}),
				)
				.build();
		}).toThrow('Job ID and chain ID are required');
	});

	it('should throw error when chainId is missing', () => {
		expect(() => {
			createJobBuilder()
				.withBaseParams({ id: 'test-job', chainId: 0 })
				.addStep((stepBuilder) =>
					stepBuilder.withName('step1').withContractCall({
						address: '0x0000000000000000000000000000000000000001',
						calldata: '0x123456',
					}),
				)
				.build();
		}).toThrow('Job ID and chain ID are required');
	});

	it('should add checkers correctly', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'checkers-job', chainId: 137 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withOnChainCallChecker({
				abi: '[{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address"}]}]',
				method: 'balanceOf',
				chain_id: 1,
				args: ['0x0000000000000000000000000000000000000001'],
			})
			.withGasLimitChecker({
				max_fee: 100,
				max_priority_fee: 2,
			})
			.withCountChecker(3)
			.build();

		expect(job.checkers?.onchain_calls).toHaveLength(1);
		expect(job.checkers?.gas_limit?.max_fee).toBe(100);
		expect(job.checkers?.count).toBe(3);
	});

	it('should throw if step is missing name', () => {
		expect(() =>
			createStepBuilder()
				.withContractCall({
					address: '0x1234567890123456789012345678901234567890',
					calldata: '0xabcdef',
				})
				.build(),
		).toThrow('Step name must be set before setting contract call parameters');
	});

	it('should throw if step is missing address', () => {
		expect(() =>
			createStepBuilder()
				.withName('Step without address')
				.withContractCall({
					address: '',
					calldata: '0xabcdef',
				})
				.build(),
		).toThrow('Missing required contract call properties');
	});

	it('should throw if step is missing calldata', () => {
		expect(() =>
			createStepBuilder()
				.withName('Step without calldata')
				.withContractCall({
					address: '0x1234567890123456789012345678901234567890',
					calldata: '',
				})
				.build(),
		).toThrow('Missing required contract call properties');
	});

	it('should build step with action data', () => {
		const step = createStepBuilder()
			.withName('Step with options')
			.withAction({
				uses: 'ditto/context@v1' as `${string}/${string}@${string}`,
				with: {
					param1: 'value1',
					param2: 'value2',
				},
			})
			.build();

		expect((step as ActionStep).uses).toBe('ditto/context@v1');
		expect((step as ActionStep).with).toEqual({
			param1: 'value1',
			param2: 'value2',
		});
	});

	it('should support multiple on-chain call checkers', () => {
		const checkerA: OnChainCallChecker = {
			abi: 'function balanceOf(address) returns (uint256)',
			method: 'balanceOf',
			chain_id: 1,
			args: ['0x123'],
		};

		const checkerB: OnChainCallChecker = {
			abi: 'function totalSupply() returns (uint256)',
			method: 'totalSupply',
			chain_id: 1,
			args: [],
		};

		const job = createJobBuilder()
			.withBaseParams({ id: 'multi-check', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withOnChainCallChecker(checkerA)
			.withOnChainCallChecker(checkerB)
			.build();

		expect(job.checkers.onchain_calls).toHaveLength(2);
		expect(job.checkers.onchain_calls?.[0].method).toBe('balanceOf');
		expect(job.checkers.onchain_calls?.[1].method).toBe('totalSupply');
	});

	it('should support boolean and mixed arguments in on-chain call checkers', () => {
		const checkerWithBoolArgs: OnChainCallChecker = {
			abi: 'function isApprovedForAll(address,address) returns (bool)',
			method: 'isApprovedForAll',
			chain_id: 1,
			args: ['0x123', '0x456'],
		};

		const checkerWithMixedArgs: OnChainCallChecker = {
			abi: 'function transferFrom(address,address,uint256) returns (bool)',
			method: 'transferFrom',
			chain_id: 1,
			args: ['0x123', '0x456', '1000000000000000000'],
		};

		const job = createJobBuilder()
			.withBaseParams({ id: 'bool-args', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withOnChainCallChecker(checkerWithBoolArgs)
			.withOnChainCallChecker(checkerWithMixedArgs)
			.build();

		expect(job.checkers.onchain_calls).toHaveLength(2);
		expect(job.checkers.onchain_calls?.[0].args).toEqual(['0x123', '0x456']);
		expect(job.checkers.onchain_calls?.[1].args).toEqual([
			'0x123',
			'0x456',
			'1000000000000000000',
		]);
	});

	it('should override gas_limit and count checkers if set multiple times', () => {
		const job = createJobBuilder()
			.withBaseParams({ id: 'override-checkers', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withGasLimitChecker({ max_fee: 10, max_priority_fee: 1 })
			.withGasLimitChecker({ max_fee: 50, max_priority_fee: 5 })
			.withCountChecker(2)
			.withCountChecker(9)
			.build();

		expect(job.checkers.gas_limit?.max_fee).toBe(50);
		expect(job.checkers.count).toBe(9);
	});

	it('should support asset price checker', () => {
		const assetPriceChecker: AssetPriceChecker = {
			sell_asset: '0x123',
			buy_asset: '0x456',
			limit_price: '1000000000000000000',
			operator: '>=',
		};

		const job = createJobBuilder()
			.withBaseParams({ id: 'asset-price-job', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withAssetPriceChecker(assetPriceChecker)
			.build();

		expect(job.checkers.asset_price_checker).toBeDefined();
		expect(job.checkers.asset_price_checker?.sell_asset).toBe('0x123');
		expect(job.checkers.asset_price_checker?.buy_asset).toBe('0x456');
	});

	it('should override asset price checker if set multiple times', () => {
		const firstChecker: AssetPriceChecker = {
			sell_asset: '0x123',
			buy_asset: '0x456',
			limit_price: '1000000000000000000',
			operator: '>=',
		};

		const secondChecker: AssetPriceChecker = {
			sell_asset: '0x789',
			buy_asset: '0xabc',
			limit_price: '2000000000000000000',
			operator: '<=',
		};

		const job = createJobBuilder()
			.withBaseParams({ id: 'override-asset-price', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withAssetPriceChecker(firstChecker)
			.withAssetPriceChecker(secondChecker)
			.build();

		expect(job.checkers.asset_price_checker?.sell_asset).toBe('0x789');
		expect(job.checkers.asset_price_checker?.buy_asset).toBe('0xabc');
	});

	it('should support all types of checkers together', () => {
		const assetPriceChecker: AssetPriceChecker = {
			sell_asset: '0x123',
			buy_asset: '0x456',
			limit_price: '1000000000000000000',
			operator: '>=',
		};

		const onchainCallChecker: OnChainCallChecker = {
			abi: 'function balanceOf(address) returns (uint256)',
			method: 'balanceOf',
			chain_id: 1,
			args: ['0x123'],
		};

		const job = createJobBuilder()
			.withBaseParams({ id: 'all-checkers', chainId: 1 })
			.addStep((stepBuilder) =>
				stepBuilder.withName('step1').withContractCall({
					address: '0x0000000000000000000000000000000000000001',
					calldata: '0x123456',
				}),
			)
			.withAssetPriceChecker(assetPriceChecker)
			.withOnChainCallChecker(onchainCallChecker)
			.withGasLimitChecker({ max_fee: 100, max_priority_fee: 2 })
			.withCountChecker(5)
			.build();

		expect(job.checkers.asset_price_checker).toBeDefined();
		expect(job.checkers.onchain_calls).toHaveLength(1);
		expect(job.checkers.gas_limit).toBeDefined();
		expect(job.checkers.count).toBe(5);
	});
});
