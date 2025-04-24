import { Secp256k1 } from '@cosmjs/crypto';
import { fromHex, toBech32 } from '@cosmjs/encoding';
import { rawSecp256k1PubkeyToRawAddress } from '@cosmjs/tendermint-rpc';
import { hashMessage, recoverPublicKey } from 'viem';

async function getPublicKey(merkleRoot: string, signature: `0x${string}`) {
	const msgHash = hashMessage(merkleRoot);

	return recoverPublicKey({
		hash: msgHash,
		signature,
	});
}

/**
 * Gets Cosmos address from public key
 * @param pubKey Public key in hex format with 0x prefix
 * @returns Address in Bech32 format
 * @throws {Error} If public key is empty or invalid
 */
export async function getAddressFromPubKey(
	pubKey: `0x${string}`,
): Promise<string> {
	if (!pubKey || pubKey === '0x' || pubKey.length < 4) {
		throw new Error('Public key cannot be empty');
	}

	// Check if the public key is a valid hex string
	if (!/^0x[0-9a-fA-F]+$/.test(pubKey)) {
		throw new Error('Invalid public key format');
	}

	try {
		const cleanPubKey = pubKey.trim().replace(/^0x/i, '').toLowerCase();

		const rawPubKey = fromHex(cleanPubKey);
		const compressed = await Secp256k1.compressPubkey(rawPubKey);

		const rawAddr = rawSecp256k1PubkeyToRawAddress(compressed); // Uint8Array

		return toBech32('ditto', rawAddr);
	} catch (error) {
		console.error('Error getting address from pub key', error);
		throw error;
	}
}

/**
 * Gets Kepler address from merkle root and signature
 * @param merkleRoot Merkle root string
 * @param signature Ethereum signature
 * @returns Promise that resolves to Bech32 address
 */
export async function getKeplerAddress({
	msg,
	signature,
}: {
	msg: string;
	signature: `0x${string}`;
}): Promise<string> {
	if (!msg) {
		throw new Error('Msg cannot be empty');
	}

	if (!signature || signature === '0x') {
		throw new Error('Signature cannot be empty');
	}

	const pubKey = await getPublicKey(msg, signature);

	return getAddressFromPubKey(pubKey);
}
