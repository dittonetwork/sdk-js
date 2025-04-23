import { describe, expect, it } from 'vitest';
import {
	type ActionParams,
	type ContractCallParams,
	createStepBuilder,
} from '../step_builder';

describe('StepBuilder', () => {
	const stepName = 'Test Step';
	const contractData: ContractCallParams = {
		address: '0x0000000000000000000000000000000000000000' as const,
		calldata: '0x1234abcd',
	};
	const actionData: ActionParams = {
		uses: 'ditto/context@v1.0.0',
		with: { param1: 'value1', param2: 'value2' },
	};

	describe('ContractCallStep', () => {
		it('builds contract call step with required fields', () => {
			const step = createStepBuilder()
				.withName(stepName)
				.withContractCall(contractData)
				.build();

			expect(step).toEqual({
				name: stepName,
				address: contractData.address,
				calldata: contractData.calldata,
			});
		});

		it('throws when trying to add action data after contract call', () => {
			const builder = createStepBuilder()
				.withName(stepName)
				.withContractCall(contractData);

			expect(() => builder.withAction(actionData)).toThrow(
				'Cannot set action parameters: contract call parameters are already set',
			);
		});

		it('throws if contract call data is incomplete', () => {
			const builder = createStepBuilder().withName(stepName).withContractCall({
				address: '',
				calldata: '',
			});

			expect(() => builder.build()).toThrow(
				'Missing required contract call properties',
			);
		});

		it('throws if name is not set before contract call', () => {
			const builder = createStepBuilder();

			expect(() => builder.withContractCall(contractData)).toThrow(
				'Step name must be set before setting contract call parameters',
			);
		});
	});

	describe('ActionStep', () => {
		it('builds action step with required fields', () => {
			const step = createStepBuilder()
				.withName(stepName)
				.withAction(actionData)
				.build();

			expect(step).toEqual({
				name: stepName,
				uses: actionData.uses,
				with: actionData.with,
			});
		});

		it('throws when trying to add contract call data after action', () => {
			const builder = createStepBuilder()
				.withName(stepName)
				.withAction(actionData);

			expect(() => builder.withContractCall(contractData)).toThrow(
				'Cannot set contract call parameters: action parameters are already set',
			);
		});

		it('throws if name is not set before action', () => {
			const builder = createStepBuilder();

			expect(() => builder.withAction(actionData)).toThrow(
				'Step name must be set before setting action parameters',
			);
		});
	});

	describe('Validation', () => {
		it('throws if step type is not set', () => {
			const builder = createStepBuilder().withName(stepName);

			expect(() => builder.build()).toThrow(
				'Step type is not set: use either withContractCall() or withAction()',
			);
		});

		it('throws if name is empty', () => {
			expect(() => createStepBuilder().withName('')).toThrow(
				'Step name is required',
			);
		});

		it('throws if name is whitespace only', () => {
			expect(() => createStepBuilder().withName('   ')).toThrow(
				'Step name is required',
			);
		});
	});
});
