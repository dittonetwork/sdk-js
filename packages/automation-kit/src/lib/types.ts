import { AbstractAdapter } from "./adapters";

export type ResultCallData = {
  callData: Set<{ to: `0x${string}`; callData: string }>;
  value: bigint;
}
export type ActionResult = (adapter: AbstractAdapter) => Promise<ResultCallData>;
export type ActionFn = (options: any) => ActionResult;

export type TriggerResult = (adapter: AbstractAdapter) => Promise<ResultCallData>;
export type TriggerFn = (options: any) => TriggerResult;
