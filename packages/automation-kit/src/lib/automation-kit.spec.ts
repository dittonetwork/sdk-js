import { describe, it, expect, beforeAll } from 'vitest';
import { EthersAdapter } from './adapters';
import { createAutomationKit, predictVaultAddress } from './automation-kit';

const INFURA_API_URL = 'https://polygon-mainnet.infura.io/v3/59dd0510a4c340019bd60a17743e8a02'
const PRIVATE_KEY = 'ba3bf6e43012410ef1ffe058b66b1057bf1a82740c6eacf52d2a80eae5c1e908'

describe('AutomationKit', () => {
  const vaultId = 1;
  
  beforeAll(async () => {
    await createAutomationKit({
      adapter: new EthersAdapter(INFURA_API_URL, PRIVATE_KEY),
    })
  });

  it('predictVaultAddress', async () => {
    const predictedAddress = await predictVaultAddress(vaultId);
    console.log('Predicted Vault Address:', predictedAddress);
    expect(predictedAddress).toBe('0xAac36bae824f924307D64932b4Fe3d54f3D79c82');
  });
});
