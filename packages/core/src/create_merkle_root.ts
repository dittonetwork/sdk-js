import { keccak256, toHex } from 'viem';

import type { Job, Step } from './types';

/**
 * Ordered object serialization (stable JSON)
 */
function stableStringify(obj: unknown): string {
	return JSON.stringify(obj, Object.keys(obj as object).sort());
}

/**
 * Hash of a single Step with all its fields
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hashStep({ name: _, ...stepPayload }: Step): string {
	const serialized = stableStringify(stepPayload);
	return keccak256(toHex(serialized));
}

/**
 * Hashes job metadata directly without steps
 */
function hashJobMetadata(job: Job): string {
	// Create a copy of the job without the steps field

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { steps: _, ...jobWithoutSteps } = job;

	const serialized = stableStringify(jobWithoutSteps);
	return keccak256(toHex(serialized));
}

/**
 * Hash of a single Job with nested Steps and checkers
 */
function hashJobWithSteps(job: Job): string {
	// 1. Hash all steps separately
	const stepHashes = job.steps.map(hashStep);

	// 2. Combine step hashes into a single "steps root"
	let stepsRoot =
		stepHashes.length > 0 ? stepHashes[0] : keccak256(toHex('[]'));
	for (let i = 1; i < stepHashes.length; i++) {
		stepsRoot = keccak256(toHex(stepsRoot + stepHashes[i]));
	}

	// 3. Hash job metadata (all fields except steps)
	const jobMetadataHash = hashJobMetadata(job);

	// 4. Combine metadata hash and steps hash
	return keccak256(toHex(jobMetadataHash + stepsRoot));
}

/**
 * Builds a graph of job relations based on their dependencies
 * This graph may contain cycles
 */
function buildJobRelations(jobs: Job[]): Map<string, Set<string>> {
	const relations = new Map<string, Set<string>>();

	// Initialize the relations with empty sets for each job
	for (const job of jobs) {
		relations.set(job.id, new Set<string>());
	}

	// Add dependencies based on the 'needs' field
	for (const job of jobs) {
		if (job.needs) {
			for (const dependencyId of job.needs) {
				const dependencySet = relations.get(dependencyId);

				if (dependencySet) {
					dependencySet.add(job.id);
				} else {
					// If the dependency doesn't exist in our jobs list, create a new set
					relations.set(dependencyId, new Set<string>([job.id]));
				}
			}
		}
	}

	return relations;
}

/**
 * Gets the topological order of jobs in the DAG
 * Ensures a stable order by sorting job IDs
 * @throws {Error} If a cycle is detected
 */
function getTopologicalOrder(
	dag: Map<string, Set<string>>,
	jobs: Job[],
): Job[] {
	const jobMap = new Map<string, Job>();
	for (const job of jobs) {
		jobMap.set(job.id, job);
	}

	// Create a map of in-degree for each job
	const inDegree = new Map<string, number>();
	for (const job of jobs) {
		inDegree.set(job.id, 0);
	}

	// Calculate in-degree for each job, considering only existing dependencies
	for (const job of jobs) {
		if (job.needs) {
			for (const dependencyId of job.needs) {
				// Only count dependencies that exist in our jobs list
				if (jobMap.has(dependencyId)) {
					const count = inDegree.get(job.id) || 0;
					inDegree.set(job.id, count + 1);
				}
			}
		}
	}

	// Create a queue of jobs with in-degree 0
	const queue: string[] = [];
	for (const job of jobs) {
		if ((inDegree.get(job.id) || 0) === 0) {
			queue.push(job.id);
		}
	}

	// Sort the queue to ensure stable order
	queue.sort();

	const result: Job[] = [];
	let visitedCount = 0;

	while (queue.length > 0) {
		// Get the next job with in-degree 0
		const jobId = queue.shift();
		if (!jobId) continue;

		const job = jobMap.get(jobId);
		if (job) {
			result.push(job);
			visitedCount++;
		}

		// Decrease in-degree for all dependent jobs
		const dependencies = dag.get(jobId) || new Set<string>();
		const sortedDependencies = Array.from(dependencies).sort();

		for (const dependency of sortedDependencies) {
			const count = inDegree.get(dependency) || 0;
			inDegree.set(dependency, count - 1);

			// If in-degree becomes 0, add to queue
			if (count - 1 === 0) {
				queue.push(dependency);
			}
		}

		// Sort the queue again to maintain stable order
		queue.sort();
	}

	// If we haven't visited all jobs, there's a cycle
	if (visitedCount !== jobs.length) {
		throw new Error('Circular dependency detected in jobs');
	}

	return result;
}

/**
 * Final Merkle Root of all jobs (each containing steps inside)
 * Uses a DAG structure to account for job dependencies
 */
function createMerkleRoot(jobs: Job[]): string {
	if (jobs.length === 0) {
		throw new Error('Jobs array is empty');
	}

	// Build the job relations graph
	const relations = buildJobRelations(jobs);

	// Get jobs in topological order (this will also check for cycles)
	const orderedJobs = getTopologicalOrder(relations, jobs);

	// Hash each job
	const jobHashes = orderedJobs.map(hashJobWithSteps);

	// Build Merkle Tree from the ordered job hashes
	while (jobHashes.length > 1) {
		const nextLevel: string[] = [];
		for (let i = 0; i < jobHashes.length; i += 2) {
			const left = jobHashes[i];
			const right = i + 1 < jobHashes.length ? jobHashes[i + 1] : left;
			const combined = keccak256(toHex(left + right));
			nextLevel.push(combined);
		}
		jobHashes.length = 0;
		jobHashes.push(...nextLevel);
	}

	return jobHashes[0];
}

export { hashStep, hashJobMetadata, hashJobWithSteps, createMerkleRoot };
