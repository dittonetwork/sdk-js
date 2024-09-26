import { describe, it, expect } from 'vitest';

import { createWorkflow, type CreateWorkflowParams } from './createWorkflow';

describe('createWorkflow', () => {
	it('should handle empty triggers and actions', () => {
		const workflow = createWorkflow({
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			kit: {} as any, // Mocking AutomationKit as it's not used in the current implementation
			triggers: [],
			actions: [],
		});
		const builtWorkflow = workflow.build();

		expect(builtWorkflow.triggersCallData).toEqual([]);
		expect(builtWorkflow.actionsCallData).toEqual([]);
	});
});
