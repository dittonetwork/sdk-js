import { describe, expect, it, vi } from 'vitest';
import { getAddressFromPubKey, getKeplerAddress } from '../address';

// Mock viem
vi.mock('viem', () => ({
	hashMessage: vi
		.fn()
		.mockImplementation(
			() =>
				'0x1234567890123456789012345678901234567890123456789012345678901234',
		),
	recoverPublicKey: vi.fn().mockImplementation(({ signature }) => {
		if (
			signature ===
			'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
		) {
			return '0x04b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b72';
		}
		return '0x04c97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71c97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b72';
	}),
}));

describe('address utils', () => {
	describe('getAddressFromPubKey', () => {
		it('should correctly generate address from public key', async () => {
			const pubKey =
				'0x04b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b72';

			const address = await getAddressFromPubKey(pubKey);

			// Check that address starts with 'ditto' prefix
			expect(address.startsWith('ditto')).toBe(true);

			// Check address length
			expect(address.length).toBe(44);

			// Check Bech32 address format
			expect(address).toMatch(/^ditto1[a-z0-9]{38}$/);
		});

		it('should generate different addresses for different public keys', async () => {
			const pubKey1 =
				'0x04b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b72';
			const pubKey2 =
				'0x04c97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71c97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b72';

			const address1 = await getAddressFromPubKey(pubKey1);
			const address2 = await getAddressFromPubKey(pubKey2);

			expect(address1).not.toBe(address2);
		});

		it('should handle empty public key correctly', async () => {
			const pubKey = '0x' as `0x${string}`;

			await expect(getAddressFromPubKey(pubKey)).rejects.toThrow(
				'Public key cannot be empty',
			);
		});

		it('should handle invalid public key format', async () => {
			const pubKey = '0xInvalid' as `0x${string}`;

			await expect(getAddressFromPubKey(pubKey)).rejects.toThrow(
				'Invalid public key format',
			);
		});
	});

	describe('getKeplerAddress', () => {
		it('should generate correct address from merkle root and signature', async () => {
			const merkleRoot =
				'0x1234567890123456789012345678901234567890123456789012345678901234';
			const signature =
				'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

			const address = await getKeplerAddress({ msg: merkleRoot, signature });
			expect(address).toMatch(/^ditto1[a-z0-9]{38}$/);
		});

		it('should generate same address for same merkle root and signature', async () => {
			const merkleRoot =
				'0x1234567890123456789012345678901234567890123456789012345678901234';
			const signature =
				'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

			const address1 = await getKeplerAddress({ msg: merkleRoot, signature });
			const address2 = await getKeplerAddress({ msg: merkleRoot, signature });
			expect(address1).toBe(address2);
		});

		it('should generate different addresses for different private keys', async () => {
			const merkleRoot =
				'0x1234567890123456789012345678901234567890123456789012345678901234';
			const signature1 =
				'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
			const signature2 =
				'0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

			const address1 = await getKeplerAddress({
				msg: merkleRoot,
				signature: signature1,
			});
			const address2 = await getKeplerAddress({
				msg: merkleRoot,
				signature: signature2,
			});
			expect(address1).not.toBe(address2);
		});

		it('should handle empty merkle root', async () => {
			const signature =
				'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

			await expect(getKeplerAddress({ msg: '', signature })).rejects.toThrow(
				'Msg cannot be empty',
			);
		});

		it('should handle empty signature', async () => {
			const merkleRoot =
				'0x1234567890123456789012345678901234567890123456789012345678901234';

			await expect(
				getKeplerAddress({ msg: merkleRoot, signature: '0x' }),
			).rejects.toThrow('Signature cannot be empty');
		});
	});
});
