import VaultABI from '../../abis/VaultABI.json';
import type { ActionResult } from '../types';

export interface Erc20Token {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  name: string;
}

export type MultiSenderItem = {
  asset: Erc20Token | null;
  amount: bigint;
  to: `0x${string}`;
};

type MultiSenderOptions = {
  items: MultiSenderItem[];
  vaultAddress: `0x${string}`;
};

export function multisender(options: MultiSenderOptions): ActionResult {
  return async (adapter) => {
    const { items, vaultAddress } = options;
    const callData = new Set<{ to: `0x${string}`; callData: string }>();

    for (const item of items) {
      if (!item.to || !item.amount) continue;

      const asset = item.asset
      const amount = item.amount;

      if (!asset) {
        callData.add({
          to: vaultAddress,
          callData: adapter.encodeFunctionCall(VaultABI, 'withdrawNative', [item.to, amount]),
        });
      } else {
        callData.add({
          to: vaultAddress,
          callData: adapter.encodeFunctionCall(VaultABI, 'withdrawERC20', [
            asset.address,
            item.to,
            amount,
          ]),
        });
      }
    }

    return { callData, value: BigInt(0) };
  };
}
