import { type StepBuilder, createStepBuilder } from './step_builder';
import type {
	AssetPriceChecker,
	CountChecker,
	GasLimitChecker,
	Job,
	OnChainCallChecker,
	Step,
} from './types';

type JobState = Partial<Job> & {
	checkers: {
		onchain_calls?: OnChainCallChecker[];
		gas_limit?: GasLimitChecker;
		count?: CountChecker;
		asset_price_checker?: AssetPriceChecker;
	};
	steps: Step[];
};

type JobBuilder = {
	withBaseParams(params: {
		id: Job['id'];
		chainId: Job['chain_id'];
	}): JobBuilder;
	withAccountAbstraction(address: string): JobBuilder;
	dependsOn(jobIds: string | string[]): JobBuilder;
	addStep(enrich: (stepBuilder: StepBuilder) => StepBuilder): JobBuilder;
	withOnChainCallChecker(checker: OnChainCallChecker): JobBuilder;
	withGasLimitChecker(limit: GasLimitChecker): JobBuilder;
	withCountChecker(count: CountChecker): JobBuilder;
	withAssetPriceChecker(checker: AssetPriceChecker): JobBuilder;
	build(): Job;
};

/**
 * Creates a builder for constructing jobs in a fluent manner.
 * The builder supports adding steps, checkers, and other job properties.
 *
 * @returns {JobBuilder} An object containing builder methods
 * @throws {Error} If required parameters are missing
 *
 * @example
 * const job = createJobBuilder()
 *   .withBaseParams({ id: 'job1', chainId: 1 })
 *   .addStep(stepBuilder => stepBuilder.withName('step1').withContractCall({...}))
 *   .build();
 */
function createJobBuilder(): JobBuilder {
	const state: JobState = {
		checkers: {},
		steps: [],
	};

	/**
	 * Sets the base parameters for the job including id and chain_id.
	 *
	 * @param {object} params - The parameters containing id and chainId
	 * @returns {JobBuilder} The builder instance for method chaining
	 * @throws {Error} If id or chainId is missing
	 *
	 * @example
	 * const job = createJobBuilder()
	 *   .withBaseParams({ id: 'job1', chainId: 1 })
	 */
	const withBaseParams = (params: {
		id: Job['id'];
		chainId: Job['chain_id'];
	}): JobBuilder => {
		if (!params.id || !params.chainId) {
			throw new Error('Job ID and chain ID are required');
		}
		state.id = params.id;
		state.chain_id = params.chainId;
		return builder;
	};

	/**
	 * Sets the account abstraction address for the job.
	 *
	 * @param {string} address - The address of the account abstraction
	 * @returns {JobBuilder} The builder instance for method chaining
	 */
	const withAccountAbstraction = (address: string): JobBuilder => {
		state.account_abstraction = address;
		return builder;
	};

	/**
	 * Sets the dependencies for the job.
	 * Multiple calls to this method will add dependencies to the existing list.
	 *
	 * @param {string | string[]} jobIds - The IDs of the jobs that this job depends on
	 * @returns {JobBuilder} The builder instance for method chaining
	 */
	const dependsOn = (jobIds: string | string[]): JobBuilder => {
		if (!state.needs) {
			state.needs = [];
		}

		if (Array.isArray(jobIds)) {
			state.needs.push(...jobIds);
		} else {
			state.needs.push(jobIds);
		}

		// Удаляем дубликаты
		state.needs = [...new Set(state.needs)];

		return builder;
	};

	/**
	 * Adds a step to the job.
	 *
	 * @param {function} enrich - A function that enriches the step builder
	 * @returns {JobBuilder} The builder instance for method chaining
	 *
	 * @example
	 * const job = createJobBuilder()
	 *   .addStep(step => step
	 *     .withName('myStep')
	 *     .withContractCall({
	 *       address: '0x1234...',
	 *       calldata: '0xabcd...'
	 *     })
	 *   )
	 */
	const addStep = (
		enrich: (stepBuilder: StepBuilder) => StepBuilder,
	): JobBuilder => {
		const stepBuilder = createStepBuilder();
		const enrichedStepBuilder = enrich(stepBuilder);
		const step = enrichedStepBuilder.build();

		state.steps.push(step);

		return builder;
	};

	/**
	 * Sets an on-chain call checker for the job.
	 *
	 * @param {OnChainCallChecker} checker - The on-chain call checker
	 * @returns {JobBuilder} The builder instance for method chaining
	 *
	 * @example
	 * createJobBuilder()
	 *   .withOnChainCallChecker({
	 *     abi: 'function balanceOf(address) returns (uint256)',
	 *     method: 'balanceOf',
	 *     chain_id: 1,
	 *     args: ['0x1234...']
	 *   })
	 */
	const withOnChainCallChecker = (checker: OnChainCallChecker): JobBuilder => {
		if (!state.checkers.onchain_calls) {
			state.checkers.onchain_calls = [];
		}
		state.checkers.onchain_calls.push(checker);
		return builder;
	};

	/**
	 * Sets a gas limit checker for the job.
	 *
	 * @param {GasLimitChecker} limit - The gas limit checker parameters
	 * @returns {JobBuilder} The builder instance for method chaining
	 *
	 * @example
	 * createJobBuilder()
	 *   .withGasLimitChecker({
	 *     max_fee: 100000000000,
	 *     max_priority_fee: 2000000000
	 *   })
	 */
	const withGasLimitChecker = (limit: GasLimitChecker): JobBuilder => {
		state.checkers.gas_limit = limit;
		return builder;
	};

	/**
	 * Sets a count checker for the job.
	 *
	 * @param {CountChecker} count - The count checker value
	 * @returns {JobBuilder} The builder instance for method chaining
	 *
	 * @example
	 * createJobBuilder()
	 *   .withCountChecker(5) // Sets maximum execution count to 5
	 */
	const withCountChecker = (count: CountChecker): JobBuilder => {
		state.checkers.count = count;
		return builder;
	};

	/**
	 * Sets an asset price checker for the job.
	 *
	 * @param {AssetPriceChecker} checker - The asset price checker parameters
	 * @returns {JobBuilder} The builder instance for method chaining
	 *
	 * @example
	 * createJobBuilder()
	 *   .withAssetPriceChecker({
	 *     sell_asset: '0x...',
	 *     buy_asset: '0x...',
	 *     limit_price: '1000000000000000000',
	 *     operator: '>='
	 *   })
	 */
	const withAssetPriceChecker = (checker: AssetPriceChecker): JobBuilder => {
		state.checkers.asset_price_checker = checker;
		return builder;
	};

	/**
	 * Builds the job object.
	 *
	 * @returns {Job} The constructed job
	 *
	 * @throws {Error} If required fields are missing
	 */
	const build = (): Job => {
		if (!state.id || !state.chain_id || !state.steps.length) {
			throw new Error('Missing required fields: id, chain_id, or steps');
		}

		const job: Job = {
			id: state.id,
			chain_id: state.chain_id,
			checkers: state.checkers,
			steps: state.steps,
		};

		if (state.account_abstraction) {
			job.account_abstraction = state.account_abstraction;
		}

		job.needs = state.needs || [];

		return job;
	};

	const builder: JobBuilder = {
		withBaseParams,
		withAccountAbstraction,
		dependsOn,
		addStep,
		withOnChainCallChecker,
		withGasLimitChecker,
		withCountChecker,
		withAssetPriceChecker,
		build,
	};

	return builder;
}

export { createJobBuilder, type JobBuilder };
