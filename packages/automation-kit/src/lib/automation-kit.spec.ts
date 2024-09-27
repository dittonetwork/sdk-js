import { describe, it, expect, beforeEach } from 'vitest';
import { EthersAdapter, Web3Adapter, ViemAdapter } from './adapters';
import { createAutomationKit, predictVaultAddress, getLatestVersion, deploySmartWallet } from './automation-kit';

const INFURA_API_URL = 'https://polygon-mainnet.infura.io/v3/59dd0510a4c340019bd60a17743e8a02';
const PRIVATE_KEY = 'ba3bf6e43012410ef1ffe058b66b1057bf1a82740c6eacf52d2a80eae5c1e908';

const adapters = [
  new EthersAdapter(INFURA_API_URL, PRIVATE_KEY),
  new Web3Adapter(INFURA_API_URL, PRIVATE_KEY),
  new ViemAdapter(INFURA_API_URL, PRIVATE_KEY),
];

const vaultId = 1;

adapters.forEach((adapter) => {
  const name = adapter.constructor.name;
  describe(`AutomationKit with ${name}`, () => {
    beforeEach(async () => {
      await createAutomationKit({ adapter });
    });

    it('predictVaultAddress', async () => {
      const predictedAddress = await predictVaultAddress(vaultId);
      console.log(`[${name}] Predicted Vault Address:`, predictedAddress);
      expect(predictedAddress).toBe('0xAac36bae824f924307D64932b4Fe3d54f3D79c82');
    });

    it('getLatestVersion', async () => {
      const versions = await getLatestVersion();
      console.log(`[${name}] Latest version:`, versions);
      expect(versions).toBe('9');
    });

    it('should deploy a smart wallet', async () => {
      const vaultId = 1000;
      const success = await deploySmartWallet(vaultId, true);
      console.log(`[${name}] Smart wallet deployed with ID ${vaultId}:`, success);
      expect(success).toBe('0xEbD37837c93b930F89Cf25740A21cEB6895AccCF');
    });
  });
});
