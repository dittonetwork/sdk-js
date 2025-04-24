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

/**
 * Creates a builder for constructing jobs in a fluent manner.
 * The builder supports adding steps, checkers, and other job properties.
 *
 * @returns An object containing builder methods:
 * - withIdAndChainId: Sets the job ID and chain ID
 * - withAccountAbstraction: Sets the account abstraction address
 * - dependsOn: Sets job dependencies
 * - addStep: Adds a step to the job
 * - withOnChainCallChecker: Adds an on-chain call checker
 * - withGasLimitChecker: Sets the gas limit checker
 * - withCountChecker: Sets the count checker
 * - withAssetPriceChecker: Sets the asset price checker
 * - build: Validates and returns the constructed job
 *
 * @throws {Error} If required parameters are missing
 *
 * @example
 * const job = createJobBuilder()
 *   .withBaseParams({ id: 'job1', chainId: 1 })
 *   .addStep(stepBuilder => stepBuilder.withBaseParams({ id: 'step1', chainId: 1 }))
 *   .build();
 */
function createJobBuilder() {
	const state: JobState = {
		checkers: {},
		steps: [],
	};

	/**
	 * Sets a count checker for the job. The count checker limits the number of times
	 * a job can be executed.
	 *
	 * @param {CountChecker} count - The maximum number of times the job can be executed
	 * @returns {object} The builder instance for method chaining
	 *
	 * @example
	 * const job = createJobBuilder()
	 *   .withBaseParams({ id: 'job1', chainId: 1 })
	 *   .withCountChecker(5) // Job will execute maximum 5 times
	 */
	const withBaseParams = (params: {
		id: Job['id'];
		chainId: Job['chain_id'];
	}) => {
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
	 * @returns {object} The builder instance for method chaining
	 *
	 */
	const withAccountAbstraction = (address: string) => {
		state.account_abstraction = address;
		return builder;
	};

	/**
	 * Sets the dependencies for the job.
	 * Multiple calls to this method will add dependencies to the existing list.
	 *
	 * @param {string | string[]} jobIds - The IDs of the jobs that this job depends on
	 * @returns {object} The builder instance for method chaining
	 */
	const dependsOn = (jobIds: string | string[]) => {
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
	 * @returns {object} The builder instance for method chaining
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
	const addStep = (enrich: (stepBuilder: StepBuilder) => StepBuilder) => {
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
	 * @returns {object} The builder instance for method chaining
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
	const withOnChainCallChecker = (checker: OnChainCallChecker) => {
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
	 * @returns {object} The builder instance for method chaining
	 *
	 * @example
	 * createJobBuilder()
	 *   .withGasLimitChecker({
	 *     max_fee: 100000000000,
	 *     max_priority_fee: 2000000000
	 *   })
	 */
	const withGasLimitChecker = (limit: GasLimitChecker) => {
		state.checkers.gas_limit = limit;
		return builder;
	};

	/**
	 * Sets a count checker for the job.
	 *
	 * @param {CountChecker} count - The count checker value
	 * @returns {object} The builder instance for method chaining
	 *
	 * @example
	 * createJobBuilder()
	 *   .withCountChecker(5) // Sets maximum execution count to 5
	 */
	const withCountChecker = (count: CountChecker) => {
		state.checkers.count = count;
		return builder;
	};

	/**
	 * Sets an asset price checker for the job.
	 *
	 * @param {AssetPriceChecker} checker - The asset price checker parameters
	 * @returns {object} The builder instance for method chaining
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
	const withAssetPriceChecker = (checker: AssetPriceChecker) => {
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

	const builder = {
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

type JobBuilder = ReturnType<typeof createJobBuilder>;

export { createJobBuilder, type JobBuilder };
