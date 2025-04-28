import type { TypedData, TypedDataDomain, WalletClient } from 'viem';
import { signTypedData } from 'viem/actions';

/**
 * Input data required for building a signer
 */
type SignerInput = {
	domain: TypedDataDomain;
};

/**
 * Interface for the signer that will sign the workflow
 */
type WorkflowSigner = {
	/**
	 * Signs the provided merkle root
	 * @param merkleRoot - The merkle root to sign
	 * @returns A promise that resolves to the signature
	 */
	sign(merkleRoot: string): Promise<`0x${string}`>;
};

/**
 * Type for the workflow signer builder
 */
type WorkflowSignerBuilder = {
	setDomain(domain: TypedDataDomain): WorkflowSignerBuilder;
	build(): Promise<WorkflowSigner>;
};

/**
 * Types for merkle root signature
 */
const MERKLE_ROOT_TYPES: TypedData = {
	MerkleRoot: [{ name: 'root', type: 'bytes32' }],
};

/**
 * Creates a builder for workflow signers
 * @param walletClient - The wallet client to use for signing
 * @returns An object with methods to configure and build the signer
 */
function createWorkflowSignerBuilder(
	walletClient: WalletClient,
): WorkflowSignerBuilder {
	const state: Partial<SignerInput> = {};

	/**
	 * Sets the domain for EIP-712 signature
	 * @param domain - The domain configuration
	 * @returns The builder instance for method chaining
	 */
	const setDomain = (domain: TypedDataDomain): WorkflowSignerBuilder => {
		state.domain = domain;
		return builder;
	};

	/**
	 * Builds the signer
	 * @returns A promise that resolves to the configured signer
	 * @throws Error if required fields are missing
	 */
	const build = async (): Promise<WorkflowSigner> => {
		const { domain } = state;

		if (!domain) {
			throw new Error(
				'Missing required data to build signer: domain is required',
			);
		}

		/**
		 * Request permission to access wallet addresses
		 */
		await walletClient.requestAddresses();

		/**
		 * Get address from wallet
		 */
		const [address] = await walletClient.getAddresses();

		return {
			sign: async (merkleRoot: string): Promise<`0x${string}`> => {
				return signTypedData(walletClient, {
					account: address,
					domain,
					types: MERKLE_ROOT_TYPES,
					primaryType: 'MerkleRoot',
					message: { root: merkleRoot },
				});
			},
		};
	};

	const builder: WorkflowSignerBuilder = {
		setDomain,
		build,
	};

	return builder;
}

export {
	createWorkflowSignerBuilder,
	MERKLE_ROOT_TYPES,
	type WorkflowSigner,
	type WorkflowSignerBuilder,
};
