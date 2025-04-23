import { getKeplerAddress } from './address';
import { createMerkleRoot } from './create_merkle_root';
import { type JobBuilder, createJobBuilder } from './job_builder';
import type {
	Job,
	KeplerClient,
	OnchainEventTrigger,
	ScheduleTrigger,
	Workflow,
	WorkflowTriggers,
} from './types';
import type { WorkflowSigner } from './workflow_signer_builder';

type WorkflowState = {
	name: string;
	jobs: Job[];
	on: WorkflowTriggers;
	signature: string;
	id: string;
	nonce: number;
	count?: number;
	expired_at?: number;
};

/**
 * Creates a builder for constructing workflows in a fluent manner.
 * The builder supports adding jobs, triggers, and other workflow properties.
 *
 * @returns An object containing builder methods for constructing workflows
 *
 * @example
 * const workflow = await createWorkflowBuilder()
 *   .withName('My Workflow')
 *   .onScheduleTrigger({ cron: '0 * * * *' })
 *   .addJob(job)
 *   .withSigner(signer)
 *   .withKeplerClient(client)
 *   .buildAndSign();
 */
function createWorkflowBuilder() {
	const state: WorkflowState = {
		name: '',
		jobs: [],
		on: {},
		signature: '',
		id: '', // Will be set during buildAndSign
		nonce: 0,
	};

	let signer: WorkflowSigner | undefined;
	let keplerClient: KeplerClient | undefined;

	/**
	 * Sets the name of the workflow.
	 * This is a required field and must be set before calling buildAndSign.
	 *
	 * @param name - The name of the workflow
	 * @returns The builder instance for method chaining
	 * @throws Error if name is empty or only whitespace
	 *
	 * @example
	 * builder.withName('My Workflow');
	 */
	const withName = (name: string) => {
		if (!name || name.trim() === '') {
			throw new Error('Workflow name is required');
		}
		state.name = name;
		return builder;
	};

	/**
	 * Sets the Kepler client for the workflow.
	 * This is required for getting the account nonce during signing.
	 *
	 * @param client - The Kepler client instance
	 * @returns The builder instance for method chaining
	 *
	 * @example
	 * builder.withKeplerClient(keplerClient);
	 */
	const withKeplerClient = (client: KeplerClient) => {
		keplerClient = client;
		return builder;
	};

	/**
	 * Adds a schedule-based trigger to the workflow.
	 * The workflow will be executed according to the specified cron schedule.
	 *
	 * @param trigger - The schedule trigger configuration
	 * @returns The builder instance for method chaining
	 *
	 * @example
	 * builder.onScheduleTrigger({ cron: '0 * * * *' });
	 */
	const onScheduleTrigger = (trigger: ScheduleTrigger) => {
		state.on.schedule = trigger;
		return builder;
	};

	/**
	 * Adds an on-chain event trigger to the workflow.
	 * The workflow will be executed when the specified event occurs.
	 *
	 * @param trigger - The on-chain event trigger configuration
	 * @returns The builder instance for method chaining
	 *
	 * @example
	 * builder.onChainEventTrigger({
	 *   abi: '[{"type":"event","name":"Transfer"}]',
	 *   addresses: ['0x123...'],
	 *   event_name: 'Transfer'
	 * });
	 */
	const onChainEventTrigger = (trigger: OnchainEventTrigger) => {
		state.on.onchain_event = trigger;
		return builder;
	};

	/**
	 * Sets the maximum number of times the workflow can be executed.
	 *
	 * @param count - The maximum execution count
	 * @returns The builder instance for method chaining
	 *
	 * @example
	 * builder.withCount(3);
	 */
	const withCount = (count: number) => {
		state.count = count;
		return builder;
	};

	/**
	 * Sets the expiration timestamp for the workflow.
	 * The workflow will not be executed after this timestamp.
	 *
	 * @param timestamp - Unix timestamp in seconds
	 * @returns The builder instance for method chaining
	 *
	 * @example
	 * builder.withExpiration(Math.floor(Date.now() / 1000) + 86400); // Expires in 24 hours
	 */
	const withExpiration = (timestamp: number) => {
		state.expired_at = timestamp;
		return builder;
	};

	/**
	 * Adds a job to the workflow using a job builder.
	 * Each job must have a unique ID.
	 *
	 * @param {function} enrich - A function that enriches the job builder
	 * @returns {object} The builder instance for method chaining
	 * @throws {Error} If a job with the same ID already exists
	 *
	 * @example
	 * builder.addJob(job => job
	 *   .withBaseParams({ id: 'my-job', chainId: 1 })
	 *   .addStep(step => step
	 *     .withName('step1')
	 *     .withContractCall({
	 *       address: '0x1234...',
	 *       calldata: '0xabcd...'
	 *     })
	 *   )
	 * );
	 */
	const addJob = (enrich: (jobBuilder: JobBuilder) => JobBuilder) => {
		const jobBuilder = createJobBuilder();
		const enrichedJobBuilder = enrich(jobBuilder);
		const job = enrichedJobBuilder.build();

		if (state.jobs.some((existingJob) => existingJob.id === job.id)) {
			throw new Error(`Job with ID "${job.id}" already exists in the workflow`);
		}

		state.jobs.push(job);
		return builder;
	};

	/**
	 * Sets the signer for the workflow.
	 * This is required for signing the workflow during buildAndSign.
	 *
	 * @param newSigner - The workflow signer
	 * @returns The builder instance for method chaining
	 *
	 * @example
	 * builder.withSigner(signer);
	 */
	const withSigner = (newSigner: WorkflowSigner) => {
		signer = newSigner;
		return builder;
	};

	const _getNonce = async (
		msg: string,
		signature: `0x${string}`,
	): Promise<number> => {
		if (!keplerClient) {
			throw new Error(
				'Missing Kepler client: call .setKeplerClient(client) before buildAndSign()',
			);
		}

		const keplerAddress = await getKeplerAddress({
			msg,
			signature,
		});

		try {
			await keplerClient.connect();
			const nonce = await keplerClient.getAccountNonce(keplerAddress);

			return nonce || 1;
		} finally {
			await keplerClient.disconnect();
		}
	};

	/**
	 * Builds and signs the workflow.
	 * This is the final step in creating a workflow.
	 *
	 * @returns A promise that resolves to the built and signed workflow
	 * @throws Error if required fields are missing
	 *
	 * @example
	 * const workflow = await builder.buildAndSign();
	 */
	const buildAndSign = async (): Promise<Workflow> => {
		if (!state.name) {
			throw new Error(
				'Missing workflow name: call .withName(name) before buildAndSign()',
			);
		}

		// Check for at least one trigger
		if (!state.on.schedule && !state.on.onchain_event) {
			throw new Error(
				'Missing required workflow field: at least one trigger (schedule or onchain_event)',
			);
		}

		if (!signer) {
			throw new Error(
				'Missing signer: call .withSigner(signer) before buildAndSign()',
			);
		}

		if (!keplerClient) {
			throw new Error(
				'Missing Kepler client: call .setKeplerClient(client) before buildAndSign()',
			);
		}

		if (state.jobs.length === 0) {
			throw new Error('Jobs array is empty');
		}

		const merkleRoot = createMerkleRoot(state.jobs);
		const signature = await signer.sign(merkleRoot);
		const nonce = await _getNonce(merkleRoot, signature);

		const signedWorkflow: Workflow = {
			...state,
			id: merkleRoot,
			signature,
			nonce,
		};

		return signedWorkflow;
	};

	const builder = {
		withName,
		withKeplerClient,
		onScheduleTrigger,
		onChainEventTrigger,
		withCount,
		withExpiration,
		addJob,
		withSigner,
		buildAndSign,
	};

	return builder;
}

type WorkflowBuilder = ReturnType<typeof createWorkflowBuilder>;

export { createWorkflowBuilder, type WorkflowBuilder };
