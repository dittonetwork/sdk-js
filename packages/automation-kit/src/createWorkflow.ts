import type { Buildable } from '@repo/core';
import type { AutomationKit } from './createAutomationKit';

export type CreateWorkflowParams = {
	kit: AutomationKit;
	triggers: Buildable[];
	actions: Buildable[];
};

export const createWorkflow = (params: CreateWorkflowParams) => {
	return {
		build: () =>
			({
				triggersCallData: params.triggers.map((trigger) => trigger.build()),
				actionsCallData: params.actions.map((action) => action.build()),
			}) as const,
	};
};
