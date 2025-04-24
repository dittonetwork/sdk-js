import { describe, expect, it, test } from 'vitest';
import {
	createMerkleRoot,
	hashJobMetadata,
	hashJobWithSteps,
	hashStep,
} from '../create_merkle_root';
import type { Job, Step } from '../types';

describe('Merkle tree and hashing', () => {
	const stepA: Step = {
		name: 'transfer',
		address: '0xabc',
		calldata: '0x1234',
	};

	const stepB: Step = {
		name: 'approve',
		address: '0xdef',
		calldata: '0x5678',
		uses: 'test/transfer@1.0.0',
	};

	const stepC: Step = {
		name: 'different',
		address: '0xabc',
		calldata: '0x9999',
	};

	const jobA: Job = {
		id: 'job-1',
		chain_id: 1,
		steps: [stepA, stepB],
		checkers: {
			count: 5,
		},
	};

	const jobB: Job = {
		id: 'job-2',
		chain_id: 1,
		steps: [stepA],
		checkers: {},
	};

	const jobC: Job = {
		id: 'job-1', // Same ID as jobA
		chain_id: 1,
		steps: [stepC], // Different step
		checkers: {
			count: 5, // Same checker
		},
	};

	test('hashStep produces consistent hash', () => {
		const hash1 = hashStep(stepA);
		const hash2 = hashStep(stepA);
		expect(hash1).toBe(hash2);
		expect(hash1).toMatch(/^0x[a-f0-9]{64}$/);
	});

	test('hashStep produces different hashes for different inputs', () => {
		const hash1 = hashStep(stepA);
		const hash2 = hashStep(stepB);
		expect(hash1).not.toBe(hash2);
	});

	test('hashJobMetadata hashes only job metadata without steps', () => {
		// Create a job without steps and one with steps
		const jobWithoutSteps = { ...jobA, steps: [] };

		// Hash metadata of both jobs
		const hashWithSteps = hashJobMetadata(jobA);
		const hashWithoutSteps = hashJobMetadata(jobWithoutSteps);

		// Expect same hashes since steps are ignored
		expect(hashWithSteps).toBe(hashWithoutSteps);
		expect(hashWithSteps).toMatch(/^0x[a-f0-9]{64}$/);
	});

	test('hashJobMetadata produces different hashes for different metadata', () => {
		const hashA = hashJobMetadata(jobA);
		const hashB = hashJobMetadata(jobB);

		// Different job metadata should produce different hashes
		expect(hashA).not.toBe(hashB);
	});

	test('hashJobWithSteps includes step content', () => {
		const hashA = hashJobWithSteps(jobA);
		const hashB = hashJobWithSteps(jobB);
		expect(hashA).not.toBe(hashB);
	});

	test('hashJobWithSteps produces different hash when only steps differ', () => {
		// Create an object that's jobA but with jobB's steps
		const jobAWithDifferentSteps = { ...jobA, steps: jobB.steps };

		const hashOriginal = hashJobWithSteps(jobA);
		const hashModified = hashJobWithSteps(jobAWithDifferentSteps);

		// Expect different hashes since steps are different
		expect(hashOriginal).not.toBe(hashModified);
	});

	test('hashJobWithSteps handles empty steps array', () => {
		const jobWithoutSteps = { ...jobA, steps: [] };
		const hash = hashJobWithSteps(jobWithoutSteps);

		// Should still produce a valid hash
		expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
	});

	test('hashJobWithSteps produces different hash for jobs with same ID but different steps', () => {
		const hashA = hashJobWithSteps(jobA);
		const hashC = hashJobWithSteps(jobC);

		// Even though jobs have same ID and checkers, they should have different hashes
		// because their steps are different
		expect(hashA).not.toBe(hashC);
	});

	test('createMerkleRoot returns valid hash', () => {
		const root = createMerkleRoot([jobA, jobB]);
		expect(root).toMatch(/^0x[a-f0-9]{64}$/);
	});

	test('createMerkleRoot is stable for same input order', () => {
		const root1 = createMerkleRoot([jobA, jobB]);
		const root2 = createMerkleRoot([jobA, jobB]);
		expect(root1).toBe(root2);
	});

	test('createMerkleRoot is stable for different input order', () => {
		const root1 = createMerkleRoot([jobA, jobB]);
		const root2 = createMerkleRoot([jobB, jobA]);
		expect(root1).toBe(root2);
	});

	test('createMerkleRoot throws error for empty array', () => {
		expect(() => createMerkleRoot([])).toThrow('Jobs array is empty');
	});
});

describe('DAG-based Merkle tree', () => {
	const step1: Step = {
		name: 'step1',
		address: '0xabc',
		calldata: '0x1234',
	};

	const step2: Step = {
		name: 'step2',
		address: '0xdef',
		calldata: '0x5678',
	};

	const step3: Step = {
		name: 'step3',
		address: '0xghi',
		calldata: '0x9abc',
	};

	const job1: Job = {
		id: 'job-1',
		chain_id: 1,
		steps: [step1],
		checkers: {},
	};

	const job2: Job = {
		id: 'job-2',
		chain_id: 1,
		steps: [step2],
		checkers: {},
		needs: ['job-1'], // Depends on job1
	};

	const job3: Job = {
		id: 'job-3',
		chain_id: 1,
		steps: [step3],
		checkers: {},
		needs: ['job-2'], // Depends on job2
	};

	const job4: Job = {
		id: 'job-4',
		chain_id: 1,
		steps: [step1],
		checkers: {},
		needs: ['job-1'], // Also depends on job1
	};

	test('createMerkleRoot respects job dependencies', () => {
		// Create a root with jobs in dependency order
		const root1 = createMerkleRoot([job1, job2, job3, job4]);

		// Create a root with jobs in a different order
		const root2 = createMerkleRoot([job4, job3, job2, job1]);

		// The roots should be the same because the DAG ensures consistent ordering
		expect(root1).toBe(root2);
	});

	test('createMerkleRoot handles jobs with no dependencies', () => {
		const root1 = createMerkleRoot([job1]);
		const root2 = createMerkleRoot([job1]);
		expect(root1).toBe(root2);
	});

	test('createMerkleRoot handles jobs with missing dependencies', () => {
		// job2 depends on job1, but job1 is not in the list
		const root = createMerkleRoot([job2]);
		expect(root).toMatch(/^0x[a-f0-9]{64}$/);
	});

	test('createMerkleRoot detects circular dependencies', () => {
		// Create a circular dependency: jobA -> jobB -> jobC -> jobA
		const jobA: Job = {
			id: 'job-A',
			chain_id: 1,
			steps: [step1],
			checkers: {},
			needs: ['job-C'], // Depends on jobC
		};

		const jobB: Job = {
			id: 'job-B',
			chain_id: 1,
			steps: [step2],
			checkers: {},
			needs: ['job-A'], // Depends on jobA
		};

		const jobC: Job = {
			id: 'job-C',
			chain_id: 1,
			steps: [step3],
			checkers: {},
			needs: ['job-B'], // Depends on jobB
		};

		// Should throw an error due to circular dependency
		expect(() => createMerkleRoot([jobA, jobB, jobC])).toThrow(
			'Circular dependency detected in jobs',
		);
	});

	test('createMerkleRoot handles multiple dependencies', () => {
		// Create a job that depends on multiple other jobs
		const job5: Job = {
			id: 'job-5',
			chain_id: 1,
			steps: [step1],
			checkers: {},
			needs: ['job-1', 'job-2', 'job-3'], // Depends on multiple jobs
		};

		const root1 = createMerkleRoot([job1, job2, job3, job5]);
		const root2 = createMerkleRoot([job5, job3, job2, job1]);

		// The roots should be the same because the DAG ensures consistent ordering
		expect(root1).toBe(root2);
	});

	test('createMerkleRoot handles complex dependency graph', () => {
		// Create a more complex dependency graph:
		// job1 -> job2 -> job3
		// job1 -> job4
		// job2 -> job5
		// job4 -> job5
		// job3 -> job6
		// job5 -> job6

		const job5: Job = {
			id: 'job-5',
			chain_id: 1,
			steps: [step1],
			checkers: {},
			needs: ['job-2', 'job-4'], // Depends on both job2 and job4
		};

		const job6: Job = {
			id: 'job-6',
			chain_id: 1,
			steps: [step2],
			checkers: {},
			needs: ['job-3', 'job-5'], // Depends on both job3 and job5
		};

		// Create roots with different job orders
		const root1 = createMerkleRoot([job1, job2, job3, job4, job5, job6]);
		const root2 = createMerkleRoot([job6, job5, job4, job3, job2, job1]);

		// The roots should be the same because the DAG ensures consistent ordering
		expect(root1).toBe(root2);
	});
});

describe('createMerkleRoot', () => {
	describe('Job Dependencies', () => {
		it('should handle jobs with dependencies', () => {
			const job1: Job = {
				id: 'job-1',
				chain_id: 1,
				checkers: {},
				steps: [
					{
						name: 'Step 1',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'Hello' },
					},
				],
			};

			const job2: Job = {
				id: 'job-2',
				chain_id: 1,
				checkers: {},
				needs: ['job-1'],
				steps: [
					{
						name: 'Step 2',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'World' },
					},
				],
			};

			const jobs = [job1, job2];
			const root = createMerkleRoot(jobs);

			// Verify that the root is a valid hash
			expect(root).toMatch(/^0x[a-fA-F0-9]{64}$/);

			// Verify that the order of jobs doesn't matter when dependencies are correct
			const reverseRoot = createMerkleRoot([job2, job1]);
			expect(root).toBe(reverseRoot);
		});

		it('should throw error on circular dependencies', () => {
			const job1: Job = {
				id: 'job-1',
				chain_id: 1,
				checkers: {},
				needs: ['job-2'],
				steps: [
					{
						name: 'Step 1',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'Hello' },
					},
				],
			};

			const job2: Job = {
				id: 'job-2',
				chain_id: 1,
				checkers: {},
				needs: ['job-1'],
				steps: [
					{
						name: 'Step 2',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'World' },
					},
				],
			};

			const jobs = [job1, job2];
			expect(() => createMerkleRoot(jobs)).toThrow(
				'Circular dependency detected in jobs',
			);
		});

		it('should handle complex dependency chains', () => {
			const job1: Job = {
				id: 'job-1',
				chain_id: 1,
				checkers: {},
				steps: [
					{
						name: 'Step 1',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'Hello' },
					},
				],
			};

			const job2: Job = {
				id: 'job-2',
				chain_id: 1,
				checkers: {},
				needs: ['job-1'],
				steps: [
					{
						name: 'Step 2',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'World' },
					},
				],
			};

			const job3: Job = {
				id: 'job-3',
				chain_id: 1,
				checkers: {},
				needs: ['job-2'],
				steps: [
					{
						name: 'Step 3',
						uses: 'ditto/echo@1.0.0',
						with: { message: '!' },
					},
				],
			};

			const jobs = [job3, job2, job1];
			const root = createMerkleRoot(jobs);

			// Verify that the root is a valid hash
			expect(root).toMatch(/^0x[a-fA-F0-9]{64}$/);

			// Verify that the order of jobs doesn't matter when dependencies are correct
			const differentOrderRoot = createMerkleRoot([job1, job2, job3]);
			expect(root).toBe(differentOrderRoot);
		});

		it('should handle multiple independent jobs', () => {
			const job1: Job = {
				id: 'job-1',
				chain_id: 1,
				checkers: {},
				steps: [
					{
						name: 'Step 1',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'Hello' },
					},
				],
			};

			const job2: Job = {
				id: 'job-2',
				chain_id: 1,
				checkers: {},
				steps: [
					{
						name: 'Step 2',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'World' },
					},
				],
			};

			const jobs = [job1, job2];
			const root = createMerkleRoot(jobs);

			// Verify that the root is a valid hash
			expect(root).toMatch(/^0x[a-fA-F0-9]{64}$/);

			// Verify that the order of independent jobs doesn't matter
			const reverseRoot = createMerkleRoot([job2, job1]);
			expect(root).toBe(reverseRoot);
		});

		it('should handle jobs with missing dependencies', () => {
			const job1: Job = {
				id: 'job-1',
				chain_id: 1,
				checkers: {},
				needs: ['non-existent-job'],
				steps: [
					{
						name: 'Step 1',
						uses: 'ditto/echo@1.0.0',
						with: { message: 'Hello' },
					},
				],
			};

			const jobs = [job1];
			const root = createMerkleRoot(jobs);

			// Verify that the root is a valid hash
			expect(root).toMatch(/^0x[a-fA-F0-9]{64}$/);
		});
	});
});
