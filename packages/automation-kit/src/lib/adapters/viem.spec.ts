import { describe, it, expect, beforeAll } from 'vitest';

import { ViemAdapter } from './viem';

const INFURA_API_URL = 'https://polygon-mainnet.infura.io/v3/59dd0510a4c340019bd60a17743e8a02'
const PRIVATE_KEY = 'ba3bf6e43012410ef1ffe058b66b1057bf1a82740c6eacf52d2a80eae5c1e908'

describe('ViemAdapter', () => {
  let adapter: ViemAdapter;

  beforeAll(async () => {
    adapter = new ViemAdapter(INFURA_API_URL, PRIVATE_KEY);
  });

  it('should fetch network information', async () => {
    const chainId = await adapter.getChainId();
    console.log(`Connected to chain with ID: ${chainId}`);
    expect(chainId).toBe('137');
  });

  it('should return the correct account address', async () => {
    const accountAddress = await adapter.getAddress();
    console.log(`Current account address: ${accountAddress}`);
    expect(accountAddress).toBe('0x1c031bC61096531F998d5FbdB1e383eDDddfd76f');
  });
});
