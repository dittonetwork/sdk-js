import type { ActionStep, ContractCallStep, Step } from './types';

type StepState = {
	name?: Step['name'];
	stepType: 'contract' | 'action' | null;
	address?: ContractCallStep['address'];
	calldata?: ContractCallStep['calldata'];
	uses?: ActionStep['uses'];
	with?: ActionStep['with'];
};

type ContractCallParams = {
	address: ContractCallStep['address'];
	calldata: ContractCallStep['calldata'];
};

type ActionParams = {
	uses: ActionStep['uses'];
	with: ActionStep['with'];
};

/**
 * Creates a builder for constructing workflow steps in a fluent manner.
 * The builder supports creating both contract call steps and action steps.
 *
 * @returns An object containing builder methods:
 * - withName: Sets the name for the step
 * - withContractCall: Configures the step as a contract call with address and calldata
 * - withAction: Configures the step as an action with 'uses' and 'with' parameters
 * - build: Validates and returns the constructed step
 *
 * @throws {Error} If required parameters are missing or if trying to mix contract/action parameters
 *
 * @example
 * const step = createStepBuilder()
 *   .withName('myStep')
 *   .withContractCall({
 *     address: '0x...',
 *     calldata: '0x...'
 *   })
 *   .build();
 */

function createStepBuilder() {
	const state: StepState = {
		stepType: null,
	};

	/**
	 * Sets the name for the step being built.
	 *
	 * @param {string} name - The name to assign to the step
	 * @returns {object} The builder instance for method chaining
	 * @throws {Error} If name is empty or contains only whitespace
	 *
	 * @example
	 * createStepBuilder()
	 *   .withName('myStep') // Sets the step name
	 */
	const withName = (name: Step['name']) => {
		if (!name || name.trim() === '') {
			throw new Error('Step name is required');
		}
		state.name = name;
		return builder;
	};

	/**
	 * Configures the step as a contract call with address and calldata.
	 *
	 * @param {ContractCallParams} params - The parameters for the contract call
	 * @returns {object} The builder instance for method chaining
	 */
	const withContractCall = (params: ContractCallParams) => {
		if (!state.name) {
			throw new Error(
				'Step name must be set before setting contract call parameters',
			);
		}
		if (state.stepType === 'action') {
			throw new Error(
				'Cannot set contract call parameters: action parameters are already set',
			);
		}

		state.stepType = 'contract';
		Object.assign(state, params);
		return builder;
	};

	/**
	 * Configures the step as an action with 'uses' and 'with' parameters.
	 *
	 * @param {ActionParams} params - The parameters for the action
	 * @returns {object} The builder instance for method chaining
	 */
	const withAction = (params: ActionParams) => {
		if (!state.name) {
			throw new Error('Step name must be set before setting action parameters');
		}
		if (state.stepType === 'contract') {
			throw new Error(
				'Cannot set action parameters: contract call parameters are already set',
			);
		}

		state.stepType = 'action';
		Object.assign(state, params);
		return builder;
	};

	/**
	 * Builds a contract call step based on the current state.
	 *
	 * @returns {ContractCallStep} A complete and valid contract call step object
	 * @throws {Error} If required parameters are missing or if step name is not set
	 *
	 */
	const buildContractCall = (): ContractCallStep => {
		const { name, address, calldata } = state;

		if (!name) {
			throw new Error('Step name is required');
		}
		if (!address || !calldata) {
			throw new Error('Missing required contract call properties');
		}

		return { name, address, calldata };
	};

	/**
	 * Builds an action step based on the current state.
	 *
	 * @returns {ActionStep} A complete and valid action step object
	 * @throws {Error} If required parameters are missing or if step name is not set
	 *
	 */
	const buildAction = (): ActionStep => {
		const { name, uses, with: withParams } = state;

		if (!name) {
			throw new Error('Step name is required');
		}
		if (!uses || !withParams) {
			throw new Error('Missing required action properties');
		}

		return { name, uses, with: withParams };
	};

	/**
	 * Builds a step based on the current state.
	 *
	 * @returns {Step} A complete and valid step object, either ContractCallStep or ActionStep
	 * @throws {Error} If required parameters are missing or if step type is not set
	 *
	 */
	const build = (): Step => {
		if (!state.name) {
			throw new Error('Step name is required');
		}
		switch (state.stepType) {
			case 'contract': {
				return buildContractCall();
			}
			case 'action': {
				return buildAction();
			}
			default: {
				throw new Error(
					'Step type is not set: use either withContractCall() or withAction()',
				);
			}
		}
	};

	const builder = {
		withName,
		withContractCall,
		withAction,
		build,
	};

	return builder;
}

type StepBuilder = ReturnType<typeof createStepBuilder>;

export {
	createStepBuilder,
	type StepBuilder,
	type ContractCallParams,
	type ActionParams,
};
