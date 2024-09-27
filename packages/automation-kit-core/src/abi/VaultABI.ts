export const VaultABI = [
	{
		type: 'function',
		name: 'aaveCheckerInitialize',
		inputs: [
			{
				name: 'lowerHFBoundary',
				type: 'uint128',
				internalType: 'uint128',
			},
			{
				name: 'upperHFBoundary',
				type: 'uint128',
				internalType: 'uint128',
			},
			{
				name: 'user',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'activateVault',
		inputs: [
			{
				name: 'callbacks',
				type: 'bytes[]',
				internalType: 'bytes[]',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'activateWorkflow',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'addDepositAA',
		inputs: [],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'addWorkflow',
		inputs: [
			{
				name: 'checkers',
				type: 'tuple[]',
				internalType: 'struct IEntryPointLogic.Checker[]',
				components: [
					{
						name: 'data',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'viewData',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'storageRef',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'initData',
						type: 'bytes',
						internalType: 'bytes',
					},
				],
			},
			{
				name: 'actions',
				type: 'tuple[]',
				internalType: 'struct IEntryPointLogic.Action[]',
				components: [
					{
						name: 'data',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'storageRef',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'initData',
						type: 'bytes',
						internalType: 'bytes',
					},
				],
			},
			{
				name: 'executor',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'count',
				type: 'uint88',
				internalType: 'uint88',
			},
			{
				name: 'maxGasLimit',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'maxGasPrice',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'addWorkflowAndGelatoTask',
		inputs: [
			{
				name: 'checkers',
				type: 'tuple[]',
				internalType: 'struct IEntryPointLogic.Checker[]',
				components: [
					{
						name: 'data',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'viewData',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'storageRef',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'initData',
						type: 'bytes',
						internalType: 'bytes',
					},
				],
			},
			{
				name: 'actions',
				type: 'tuple[]',
				internalType: 'struct IEntryPointLogic.Action[]',
				components: [
					{
						name: 'data',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'storageRef',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'initData',
						type: 'bytes',
						internalType: 'bytes',
					},
				],
			},
			{
				name: 'executor',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'count',
				type: 'uint88',
				internalType: 'uint88',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'borrowAaveAction',
		inputs: [
			{
				name: 'borrowToken',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'canExecWorkflowCheck',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: '',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'cancelTask',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'checkHF',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'checkTime',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'checkTimeView',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'createTask',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'creatorAndId',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '',
				type: 'uint16',
				internalType: 'uint16',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'crossChainLogicIsActive',
		inputs: [],
		outputs: [
			{
				name: 'isActive',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'deactivateVault',
		inputs: [
			{
				name: 'callbacks',
				type: 'bytes[]',
				internalType: 'bytes[]',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'deactivateWorkflow',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'dedicatedMessageSender',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'deposit',
		inputs: [
			{
				name: 'amountToDeposit',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'depositERC20',
		inputs: [
			{
				name: 'token',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'depositor',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'depositETH',
		inputs: [
			{
				name: 'amountToDeposit',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'depositNative',
		inputs: [],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'emergencyRepayAave',
		inputs: [
			{
				name: 'supplyToken',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'borrowToken',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'poolFee',
				type: 'uint24',
				internalType: 'uint24',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'entryPointAA',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IEntryPoint',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'execute',
		inputs: [
			{
				name: 'target',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'value',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'data',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'executeOperation',
		inputs: [
			{
				name: 'asset',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'premium',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'initiator',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'params',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'executeViaEntryPoint',
		inputs: [
			{
				name: 'data',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'getDepositAA',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getHFBoundaries',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'lowerHFBoundary',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'upperHFBoundary',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getImplementationAddress',
		inputs: [],
		outputs: [
			{
				name: 'implementationAddress',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getLocalAaveCheckerStorage',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'lowerHFBoundary',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'upperHFBoundary',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'user',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'initialized',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getLocalTimeCheckerStorage',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'lastActionTime',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'timePeriod',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'initialized',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getModules',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address[]',
				internalType: 'address[]',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getNextWorkflowKey',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getNonceAA',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getTaskId',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getTotalSupplyTokenBalance',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getVaultProxyAdminAddress',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getWorkflow',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType: 'struct IEntryPointLogic.Workflow',
				components: [
					{
						name: 'checkers',
						type: 'tuple[]',
						internalType: 'struct IEntryPointLogic.Checker[]',
						components: [
							{
								name: 'data',
								type: 'bytes',
								internalType: 'bytes',
							},
							{
								name: 'viewData',
								type: 'bytes',
								internalType: 'bytes',
							},
							{
								name: 'storageRef',
								type: 'bytes',
								internalType: 'bytes',
							},
							{
								name: 'initData',
								type: 'bytes',
								internalType: 'bytes',
							},
						],
					},
					{
						name: 'actions',
						type: 'tuple[]',
						internalType: 'struct IEntryPointLogic.Action[]',
						components: [
							{
								name: 'data',
								type: 'bytes',
								internalType: 'bytes',
							},
							{
								name: 'storageRef',
								type: 'bytes',
								internalType: 'bytes',
							},
							{
								name: 'initData',
								type: 'bytes',
								internalType: 'bytes',
							},
						],
					},
					{
						name: 'executor',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'counter',
						type: 'uint88',
						internalType: 'uint88',
					},
					{
						name: 'inactive',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'grantRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'hasRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'healthFactorsAndNft',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'targetHF',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'currentHF',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'uniswapV3NftId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'initialize',
		inputs: [
			{
				name: 'uniswapV3NftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'targetHealthFactor_e18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'supplyTokenAave',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'debtTokenAave',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'pointerToAaveChecker',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'initializeCreatorAndId',
		inputs: [
			{
				name: 'creator',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'vaultId',
				type: 'uint16',
				internalType: 'uint16',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'initializeWithMint',
		inputs: [
			{
				name: 'p',
				type: 'tuple',
				internalType:
					'struct IDeltaNeutralStrategyLogic.InitializeWithMintParams',
				components: [
					{
						name: 'targetHealthFactor_e18',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'minTick',
						type: 'int24',
						internalType: 'int24',
					},
					{
						name: 'maxTick',
						type: 'int24',
						internalType: 'int24',
					},
					{
						name: 'poolFee',
						type: 'uint24',
						internalType: 'uint24',
					},
					{
						name: 'supplyTokenAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'debtTokenAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'supplyToken',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'debtToken',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'pointerToAaveChecker',
						type: 'bytes32',
						internalType: 'bytes32',
					},
				],
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'isActive',
		inputs: [],
		outputs: [
			{
				name: 'active',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'isValidSignature',
		inputs: [
			{
				name: 'hash',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'signature',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [
			{
				name: 'magicValue',
				type: 'bytes4',
				internalType: 'bytes4',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'layerZeroMulticall',
		inputs: [
			{
				name: 'data',
				type: 'bytes[]',
				internalType: 'bytes[]',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'moduleAction',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'action',
				type: 'uint8',
				internalType: 'enum ActionModule',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'multicall',
		inputs: [
			{
				name: 'data',
				type: 'bytes[]',
				internalType: 'bytes[]',
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'owner',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'priceCheckerUniswapInitialize',
		inputs: [
			{
				name: 'uniswapPool',
				type: 'address',
				internalType: 'contract IUniswapV3Pool',
			},
			{
				name: 'targetRate',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'priceDifferenceCheckerUniswapInitialize',
		inputs: [
			{
				name: 'uniswapPool',
				type: 'address',
				internalType: 'contract IUniswapV3Pool',
			},
			{
				name: 'percentageDeviation_E3',
				type: 'uint24',
				internalType: 'uint24',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'rebalance',
		inputs: [
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'renounceRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'repayAaveAction',
		inputs: [
			{
				name: 'borrowToken',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'revokeRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'run',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'runGelato',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'sendBatchCelerCircleMessage',
		inputs: [
			{
				name: 'dstChainId',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: 'exactAmount',
				type: 'uint256[]',
				internalType: 'uint256[]',
			},
			{
				name: 'recipient',
				type: 'address[]',
				internalType: 'address[]',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'sendCelerCircleMessage',
		inputs: [
			{
				name: 'dstChainId',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: 'exactAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'recipient',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'sendLayerZeroMessage',
		inputs: [
			{
				name: 'vaultVersion',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'dstChainId',
				type: 'uint16',
				internalType: 'uint16',
			},
			{
				name: 'lzTxParams',
				type: 'tuple',
				internalType: 'struct ILayerZeroLogic.LayerZeroTxParams',
				components: [
					{
						name: 'dstGasForCall',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'dstNativeAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'dstNativeAddr',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'zroPaymentAddress',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'payInZRO',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
			{
				name: 'payload',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'sendStargateMessage',
		inputs: [
			{
				name: 'vaultVersion',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'dstChainId',
				type: 'uint16',
				internalType: 'uint16',
			},
			{
				name: 'srcPoolId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'dstPoolId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'bridgeAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'amountOutMinSg',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'lzTxParams',
				type: 'tuple',
				internalType: 'struct IStargateComposer.lzTxObj',
				components: [
					{
						name: 'dstGasForCall',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'dstNativeAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'dstNativeAddr',
						type: 'bytes',
						internalType: 'bytes',
					},
				],
			},
			{
				name: 'payload',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'setCrossChainLogicInactiveStatus',
		inputs: [
			{
				name: 'newValue',
				type: 'bool',
				internalType: 'bool',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setHFBoundaries',
		inputs: [
			{
				name: 'lowerHFBoundary',
				type: 'uint128',
				internalType: 'uint128',
			},
			{
				name: 'upperHFBoundary',
				type: 'uint128',
				internalType: 'uint128',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setNewNftId',
		inputs: [
			{
				name: 'newNftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setNewTargetHF',
		inputs: [
			{
				name: 'newTargetHF',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setTimePeriod',
		inputs: [
			{
				name: 'timePeriod',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'stargateMulticall',
		inputs: [
			{
				name: 'bridgedAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'data',
				type: 'bytes[]',
				internalType: 'bytes[]',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'stargateMultisender',
		inputs: [
			{
				name: 'bridgeAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'mParams',
				type: 'tuple',
				internalType: 'struct IStargateLogic.MultisenderParams',
				components: [
					{
						name: 'dstChainId',
						type: 'uint16',
						internalType: 'uint16',
					},
					{
						name: 'srcPoolId',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'dstPoolId',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'slippageE18',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'recipients',
						type: 'address[]',
						internalType: 'address[]',
					},
					{
						name: 'tokenShares',
						type: 'uint256[]',
						internalType: 'uint256[]',
					},
				],
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'supplyAaveAction',
		inputs: [
			{
				name: 'supplyToken',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'taxedMulticall',
		inputs: [
			{
				name: 'data',
				type: 'bytes[]',
				internalType: 'bytes[]',
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'timeCheckerInitialize',
		inputs: [
			{
				name: 'lastActionTime',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: 'timePeriod',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'transferOwnership',
		inputs: [
			{
				name: 'newOwner',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapAddLiquidity',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'token0Amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'token1Amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'useFullTokenBalancesFromVault',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: 'swap',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapAutoCompound',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapChangePercentageDeviationE3',
		inputs: [
			{
				name: 'percentageDeviation_E3',
				type: 'uint24',
				internalType: 'uint24',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapChangeTargetRate',
		inputs: [
			{
				name: 'targetRate',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapChangeTickRange',
		inputs: [
			{
				name: 'newLowerTick',
				type: 'int24',
				internalType: 'int24',
			},
			{
				name: 'newUpperTick',
				type: 'int24',
				internalType: 'int24',
			},
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapChangeTokensAndFeePriceChecker',
		inputs: [
			{
				name: 'uniswapPool',
				type: 'address',
				internalType: 'contract IUniswapV3Pool',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapChangeTokensAndFeePriceDiffChecker',
		inputs: [
			{
				name: 'uniswapPool',
				type: 'address',
				internalType: 'contract IUniswapV3Pool',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapCheckFeesExistence',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckGTETargetRate',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckGTTargetRate',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckInTickRange',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckLTETargetRate',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckLTTargetRate',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckOutOfTickRange',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCheckPriceDifference',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'success',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapCheckPriceDifferenceView',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'success',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapCollectFees',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapDexCheckerInitialize',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapGetLocalDexCheckerStorage',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapGetLocalPriceCheckerStorage',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'token0',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'token1',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'fee',
				type: 'uint24',
				internalType: 'uint24',
			},
			{
				name: 'targetRate',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'initialized',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapGetLocalPriceDifferenceCheckerStorage',
		inputs: [
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: 'token0',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'token1',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'fee',
				type: 'uint24',
				internalType: 'uint24',
			},
			{
				name: 'percentageDeviation_E3',
				type: 'uint24',
				internalType: 'uint24',
			},
			{
				name: 'lastCheckPrice',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'initialized',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'uniswapMintNft',
		inputs: [
			{
				name: 'uniswapPool',
				type: 'address',
				internalType: 'contract IUniswapV3Pool',
			},
			{
				name: 'newLowerTick',
				type: 'int24',
				internalType: 'int24',
			},
			{
				name: 'newUpperTick',
				type: 'int24',
				internalType: 'int24',
			},
			{
				name: 'token0Amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'token1Amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'useFullTokenBalancesFromVault',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: 'swap',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapSwapExactInput',
		inputs: [
			{
				name: 'tokens',
				type: 'address[]',
				internalType: 'address[]',
			},
			{
				name: 'poolFees',
				type: 'uint24[]',
				internalType: 'uint24[]',
			},
			{
				name: 'amountIn',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'useFullBalanceOfTokenInFromVault',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: 'unwrapInTheEnd',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'amountOut',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapSwapExactOutputSingle',
		inputs: [
			{
				name: 'tokenIn',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'tokenOut',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'poolFee',
				type: 'uint24',
				internalType: 'uint24',
			},
			{
				name: 'amountOut',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'amountIn',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapSwapToTargetR',
		inputs: [
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'uniswapPool',
				type: 'address',
				internalType: 'contract IUniswapV3Pool',
			},
			{
				name: 'token0Amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'token1Amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'targetRE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapWithdrawPositionByLiquidity',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'liquidity',
				type: 'uint128',
				internalType: 'uint128',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'uniswapWithdrawPositionByShares',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'sharesE18',
				type: 'uint128',
				internalType: 'uint128',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'unwrapNative',
		inputs: [
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'upgradeVersion',
		inputs: [
			{
				name: 'vaultVersion',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'validateUserOp',
		inputs: [
			{
				name: 'userOp',
				type: 'tuple',
				internalType: 'struct UserOperation',
				components: [
					{
						name: 'sender',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'nonce',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'initCode',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'callData',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'callGasLimit',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'verificationGasLimit',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'preVerificationGas',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxFeePerGas',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxPriorityFeePerGas',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'paymasterAndData',
						type: 'bytes',
						internalType: 'bytes',
					},
					{
						name: 'signature',
						type: 'bytes',
						internalType: 'bytes',
					},
				],
			},
			{
				name: 'userOpHash',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'missingAccountFunds',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'validationData',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdraw',
		inputs: [
			{
				name: 'shareE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'deviationThresholdE18',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pointer',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdrawAaveAction',
		inputs: [
			{
				name: 'supplyToken',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdrawDepositToAA',
		inputs: [
			{
				name: 'withdrawAddress',
				type: 'address',
				internalType: 'address payable',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdrawERC20',
		inputs: [
			{
				name: 'token',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'receiver',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdrawNative',
		inputs: [
			{
				name: 'receiver',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdrawTotalERC20',
		inputs: [
			{
				name: 'token',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'receiver',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'withdrawTotalNative',
		inputs: [
			{
				name: 'receiver',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'wrapNative',
		inputs: [],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'wrapNativeFromVaultBalance',
		inputs: [
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'event',
		name: 'AaveBorrow',
		inputs: [
			{
				name: 'token',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveCheckerInitialized',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveCheckerSetNewHF',
		inputs: [
			{
				name: 'lowerHFBoundary',
				type: 'uint128',
				indexed: false,
				internalType: 'uint128',
			},
			{
				name: 'upperHFBoundary',
				type: 'uint128',
				indexed: false,
				internalType: 'uint128',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveEmergencyRepay',
		inputs: [
			{
				name: 'supplyToken',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'debtToken',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveFlashLoan',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveRepay',
		inputs: [
			{
				name: 'token',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveSupply',
		inputs: [
			{
				name: 'token',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'AaveWithdraw',
		inputs: [
			{
				name: 'token',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'CrossChainLogicInactiveFlagSet',
		inputs: [
			{
				name: 'flag',
				type: 'bool',
				indexed: false,
				internalType: 'bool',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DeltaNeutralStrategyDeposit',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DeltaNeutralStrategyInitialize',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DeltaNeutralStrategyNewHealthFactor',
		inputs: [
			{
				name: 'newTargetHealthFactor',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DeltaNeutralStrategyRebalance',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DeltaNeutralStrategyWithdraw',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DepositERC20',
		inputs: [
			{
				name: 'depositor',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DepositNative',
		inputs: [
			{
				name: 'depositor',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DexCheckerInitialized',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DexCollectFees',
		inputs: [
			{
				name: 'amount0',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'amount1',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DexSwap',
		inputs: [
			{
				name: 'tokenIn',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amountIn',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'tokenOut',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amountOut',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DittoExecute',
		inputs: [
			{
				name: 'target',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'data',
				type: 'bytes',
				indexed: false,
				internalType: 'bytes',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DittoFeeTransfer',
		inputs: [
			{
				name: 'dittoFee',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointAddWorkflow',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointRun',
		inputs: [
			{
				name: 'executor',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointRunGelato',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointVaultStatusActivated',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointVaultStatusDeactivated',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointWorkflowStatusActivated',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'EntryPointWorkflowStatusDeactivated',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GelatoTaskCancelled',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'id',
				type: 'bytes32',
				indexed: false,
				internalType: 'bytes32',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GelatoTaskCreated',
		inputs: [
			{
				name: 'workflowKey',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'id',
				type: 'bytes32',
				indexed: false,
				internalType: 'bytes32',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'ImplementationChanged',
		inputs: [
			{
				name: 'newImplementation',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'ModuleAdded',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'ModuleDeleted',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OwnershipTransferred',
		inputs: [
			{
				name: 'oldOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PriceCheckerInitialized',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PriceCheckerSetNewTarget',
		inputs: [
			{
				name: 'newTarget',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PriceCheckerSetNewTokensAndFee',
		inputs: [
			{
				name: 'token0',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'token1',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'fee',
				type: 'uint24',
				indexed: false,
				internalType: 'uint24',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PriceDifferenceCheckerInitialized',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PriceDifferenceCheckerSetNewDeviationThreshold',
		inputs: [
			{
				name: 'newPercentage',
				type: 'uint24',
				indexed: false,
				internalType: 'uint24',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PriceDifferenceCheckerSetNewTokensAndFee',
		inputs: [
			{
				name: 'token0',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'token1',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'fee',
				type: 'uint24',
				indexed: false,
				internalType: 'uint24',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoleGranted',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				indexed: false,
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'sender',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoleRevoked',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				indexed: false,
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'sender',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'TimeCheckerInitialized',
		inputs: [],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'TimeCheckerSetNewPeriod',
		inputs: [
			{
				name: 'newPeriod',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'TransferHelperTransfer',
		inputs: [
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'from',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'to',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'value',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'UniswapAddLiquidity',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'UniswapAutoCompound',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'UniswapChangeTickRange',
		inputs: [
			{
				name: 'oldNftId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'newNftId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'UniswapMintNft',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'UniswapWithdraw',
		inputs: [
			{
				name: 'nftId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'WithdrawERC20',
		inputs: [
			{
				name: 'receiver',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'WithdrawNative',
		inputs: [
			{
				name: 'receiver',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'error',
		name: 'AaveChecker_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'AaveChecker_IncorrectHealthFators',
		inputs: [],
	},
	{
		type: 'error',
		name: 'AaveChecker_NotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'AaveLogicLib_InitiatorNotValid',
		inputs: [],
	},
	{
		type: 'error',
		name: 'AccessControlLib_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'CelerCircleBridgeLogic_MultisenderArgsNotValid',
		inputs: [],
	},
	{
		type: 'error',
		name: 'CelerCircleBridgeLogic_VaultCannotUseCrossChainLogic',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_AaveCheckerNotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_DepositZero',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_HealthFactorOutOfRange',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_InvalidNFTTokens',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_NotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DeltaNeutralStrategy_Token0IsNotWNative',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DexChecker_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DexChecker_NotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DexLogicLib_NotEnoughTokenBalances',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DexLogicLib_ZeroNumberOfTokensCannotBeAdded',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DexLogicLogic_WrongLengthOfPoolFeesArray',
		inputs: [],
	},
	{
		type: 'error',
		name: 'DexLogicLogic_WrongLengthOfTokensArray',
		inputs: [],
	},
	{
		type: 'error',
		name: 'EntryPoint_AlreadyActive',
		inputs: [],
	},
	{
		type: 'error',
		name: 'EntryPoint_AlreadyInactive',
		inputs: [],
	},
	{
		type: 'error',
		name: 'EntryPoint_TriggerVerificationFailed',
		inputs: [],
	},
	{
		type: 'error',
		name: 'EntryPoint_VaultIsInactive',
		inputs: [],
	},
	{
		type: 'error',
		name: 'EntryPoint_WorkflowDoesNotExist',
		inputs: [],
	},
	{
		type: 'error',
		name: 'EntryPoint_WorkflowIsInactive',
		inputs: [],
	},
	{
		type: 'error',
		name: 'ExecutionLogic_ExecuteCallReverted',
		inputs: [
			{
				name: 'target',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'data',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
	},
	{
		type: 'error',
		name: 'ExecutionLogic_ExecuteTargetCannotBeAddressThis',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Gelato_CannotCancelTaskWhichNotExists',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Gelato_MsgSenderIsNotDedicated',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Gelato_TaskAlreadyStarted',
		inputs: [],
	},
	{
		type: 'error',
		name: 'LayerZeroLogic_OnlyDittoBridgeReceiverCanCallThisMethod',
		inputs: [],
	},
	{
		type: 'error',
		name: 'LayerZeroLogic_VaultCannotUseCrossChainLogic',
		inputs: [],
	},
	{
		type: 'error',
		name: 'MEVCheck_DeviationOfPriceTooHigh',
		inputs: [],
	},
	{
		type: 'error',
		name: 'NativeWrapper_InsufficientBalance',
		inputs: [],
	},
	{
		type: 'error',
		name: 'PriceChecker_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'PriceChecker_NotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'PriceDifferenceChecker_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'PriceDifferenceChecker_InvalidPercentageDeviation',
		inputs: [],
	},
	{
		type: 'error',
		name: 'PriceDifferenceChecker_NotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'SSTORE2_DeploymentFailed',
		inputs: [],
	},
	{
		type: 'error',
		name: 'StargateLogic_MultisenderParamsDoNotMatchInLength',
		inputs: [],
	},
	{
		type: 'error',
		name: 'StargateLogic_NotEnoughBalanceForFee',
		inputs: [],
	},
	{
		type: 'error',
		name: 'StargateLogic_OnlyDittoBridgeReceiverCanCallThisMethod',
		inputs: [],
	},
	{
		type: 'error',
		name: 'StargateLogic_VaultCannotUseCrossChainLogic',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TimeChecker_AlreadyInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TimeChecker_NotInitialized',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TransferHelper_SafeApproveError',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TransferHelper_SafeGetBalanceError',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TransferHelper_SafeTransferError',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TransferHelper_SafeTransferFromError',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TransferHelper_SafeTransferNativeError',
		inputs: [],
	},
	{
		type: 'error',
		name: 'UnauthorizedAccount',
		inputs: [
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'Vault_CannotReplaceSelector',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Vault_FunctionDoesNotExist',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Vault_InvalidConstructorData',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Vault_ModuleAlreadyAdded',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'Vault_ModuleDoesNotAdded',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'Vault_ModuleIsInactive',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'Vault_ModuleNotListed',
		inputs: [
			{
				name: 'moduleAddress',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'VersionUpgradeLogic_CannotUpdateToCurrentVersion',
		inputs: [],
	},
	{
		type: 'error',
		name: 'VersionUpgradeLogic_VersionDoesNotExist',
		inputs: [],
	},
] as const;
