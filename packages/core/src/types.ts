type ContractCallStep = {
	name: string;
	address: string;
	calldata: string;
};

type ActionStep = {
	name: string;
	uses: `${string}/${string}@${string}`;
	with: Record<string, string>;
};

type Step = ContractCallStep | ActionStep;

type AssetPriceChecker = {
	sell_asset: string;
	buy_asset: string;
	limit_price: string;
	operator: string;
};

type OnChainCallChecker = {
	abi: string;
	method: string;
	chain_id: number;
	args: (string | boolean)[];
};

type GasLimitChecker = {
	max_fee: number;
	max_priority_fee: number;
};

type CountChecker = number;

type Checkers = {
	onchain_calls?: OnChainCallChecker[];
	gas_limit?: GasLimitChecker;
	count?: CountChecker;
	asset_price_checker?: AssetPriceChecker;
};

type Job = {
	id: string;
	chain_id: number;
	account_abstraction?: string;
	needs?: string[];
	checkers: Checkers;
	steps: Step[];
};

type ScheduleTrigger = {
	cron: string;
};

type OnchainEventTrigger = {
	abi: string;
	addresses: string[];
	event_name: string;
};

type WorkflowTriggers = {
	schedule?: ScheduleTrigger;
	onchain_event?: OnchainEventTrigger;
};

type Workflow = {
	name: string;
	id: string;
	on: WorkflowTriggers;
	count?: number;
	expired_at?: number;
	signature: string;
	jobs: Job[];
	nonce: number;
};

type KeplerClient = {
	connect(): Promise<void>;
	getAccountNonce(address: string): Promise<number | null>;
	disconnect(): Promise<void>;
};

export type {
	Step,
	ContractCallStep,
	ActionStep,
	OnChainCallChecker,
	GasLimitChecker,
	CountChecker,
	Checkers,
	Job,
	ScheduleTrigger,
	OnchainEventTrigger,
	Workflow,
	AssetPriceChecker,
	KeplerClient,
	WorkflowTriggers,
};
