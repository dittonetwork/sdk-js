import React from 'react';
import { Button } from '../components/ui';
import { useSDK } from '@metamask/sdk-react';
import { ethers, parseUnits } from 'ethers';
import {
  Chain,
  InMemoryStorage,
  PriceTrigger,
  Provider as DittoProvider,
  SmartWalletFactory,
  TimeBasedTrigger,
  TimeScale,
  tokens,
  UniswapSwapActionCallDataBuilder,
  WorkflowsFactory,
  BrowserStorage,
  Address,
  InstantTrigger,
  MultiSenderAction,
  Erc20TokenABI as ERC20_ABI,
} from '@ditto-network/core';
import { EthersSigner, EthersContractFactory } from '@ditto-network/ethers';
import useLocalStorage from '../hooks/use-local-storage';

const networkNames = {
  [Chain.Polygon]: 'Polygon Mainnet',
  [Chain.Arbitrum]: 'Arbitrum Mainnet',
};
const nativeSymbols = {
  [Chain.Polygon]: 'MATIC',
  [Chain.Arbitrum]: 'ETH',
};

const ConnectWalletButton = () => {
  const { sdk, connected, connecting } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn('No accounts found', err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  return (
    <div className="relative">
      {connected ? (
        <Button onClick={disconnect}>Disconnect</Button>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          Connect
        </Button>
      )}
    </div>
  );
};

interface Token {
  address: Address;
  name: string;
  decimals: number;
  symbol: string;
  chain: Chain;
}

const tokensMap: Record<Chain, Record<string, Token>> = {
  [Chain.Polygon]: {
    wmatic: {
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      name: 'Wrapped MATIC',
      decimals: 18,
      symbol: 'WMATIC',
      chain: Chain.Polygon,
    },
    usdt: {
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      name: 'USDT',
      decimals: 6,
      symbol: 'USDT',
      chain: Chain.Polygon,
    },
  },
  [Chain.Arbitrum]: {},
};

export function App() {
  const { account, chainId: _chainId } = useSDK();
  const chainId = Number(_chainId) as Chain | undefined;
  const tokens = chainId ? tokensMap[chainId] : {};
  console.log('tokens', chainId, tokens);

  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [provider, setProvider] = React.useState<DittoProvider | null>(null);
  const [swFactory, setSWFactory] = React.useState<SmartWalletFactory | null>(null);
  const [isAuthenticated, setAuth] = React.useState(false);
  const [swAddress, setSWAddress] = React.useState<Address | null>(null);
  const [nextSwAddress, setNextSWAddress] = React.useState<Address | null>(null);
  const [workflowHash, setWorkflowHash] = React.useState<string>('');
  const [nextVaultId, setNextVaultId] = useLocalStorage<number>('nextVaultId', 1);
  const [balance, setBalance] = React.useState<string | null>(null);
  const [isDeployed, setIsDeployed] = React.useState<boolean>(false);
  const [isNextDeployed, setIsNextDeployed] = React.useState<boolean>(false);
  const [usdtBalance, setUsdtBalance] = React.useState<string | null>(null);
  const [ethBalance, setEthBalance] = React.useState<string | null>(null);
  const [swEthBalance, setSwEthBalance] = React.useState<string | null>(null);
  const [swUsdtBalance, setSwUsdtBalance] = React.useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = React.useState<{ name: string; chainId: number } | null>(
    null
  );

  const commonConfig = React.useMemo(
    () => ({
      chainId: chainId!,
      recipient: swAddress as Address,
      accountAddress: account as Address,
      vaultAddress: swAddress as Address,
      provider: provider!,
    }),
    [chainId, account, swAddress, provider]
  );

  React.useEffect(() => {
    if (chainId) initProvider();
  }, [chainId]);

  const fetchSmartWalletBalances = async (swAddress: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum!);
      const ethBalance = await ethersProvider.getBalance(swAddress);
      setSwEthBalance(ethers.formatEther(ethBalance));

      const usdtToken = new ethers.Contract(tokens.usdt.address, ERC20_ABI, ethersProvider);
      const usdtBalance = await usdtToken.balanceOf(swAddress);
      setSwUsdtBalance(ethers.formatUnits(usdtBalance, tokens.usdt.decimals));
    } catch (error) {
      console.error('Error fetching smart wallet balances:', error);
    }
  };

  const fetchBalances = async (
    address: string,
    provider: ethers.Provider,
    signer: ethers.Signer
  ) => {
    try {
      const ethBalance = await provider.getBalance(address);
      setEthBalance(ethers.formatEther(ethBalance));

      const usdtToken = new ethers.Contract(tokens.usdt.address, ERC20_ABI, signer);
      const usdtBalance = await usdtToken.balanceOf(address);
      setUsdtBalance(ethers.formatUnits(usdtBalance, tokens.usdt.decimals));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const initProvider = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await ethersProvider.getSigner();
      const provider = new DittoProvider({
        signer: new EthersSigner(signer),
        storage: new BrowserStorage(),
        contractFactory: new EthersContractFactory(signer),
      });
      const swFactory = new SmartWalletFactory(provider);
      const needAuth = await provider.needAuthentication();

      setAuth(!needAuth);
      setSigner(signer);
      setProvider(provider);
      setSWFactory(swFactory);

      // Fetch balance
      if (account) fetchBalances(account, ethersProvider, signer);

      const [isDeployed, nextVaultId, vaultAddress] = chainId
        ? await Promise.all([
            swFactory.isVaultWithIdExists(1, +chainId),
            swFactory.getNextVaultId(+chainId),
            swFactory.getVaultAddress(+chainId),
          ])
        : [false, 1, '', ''];
      const nextVaultAddress = chainId
        ? await swFactory.getVaultAddress(+chainId, nextVaultId)
        : '';

      setIsDeployed(isDeployed);

      if (vaultAddress) {
        setSWAddress(vaultAddress as Address);
        fetchSmartWalletBalances(vaultAddress);
      }
      if (nextVaultAddress) setNextSWAddress(nextVaultAddress);

      setNextVaultId(nextVaultId);
    } catch (error) {
      console.error('Error initializing provider:', error);
    }
  };

  // handleSignSDKClick
  const authenticate = async () => {
    if (!provider) return;

    try {
      const needAuth = await provider.needAuthentication();
      if (needAuth) await provider.authenticate();
      setAuth(true);
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleGetSmartWalletAddressClick = async () => {
    if (!provider || !signer || !chainId || !swFactory) return;
    const newSWID = nextVaultId + 1
    try {
      setNextVaultId(newSWID);
      const vaultAddress = await swFactory.getVaultAddress(+chainId, newSWID);
      const isNextDeployed = await swFactory.isVaultWithIdExists(newSWID, +chainId);
      setNextSWAddress(vaultAddress);
      setIsNextDeployed(isNextDeployed);
    } catch (error) {
      console.error('Error getting smart wallet address:', error);
    }
  };

  const deploySmartWallet = async (swId = 1) => {
    if (!provider || !signer || !chainId || !swFactory) return;

    try {
      const vault = await swFactory.createVault(+chainId, swId);
      const vaultAddress = vault.getAddress()!;
      setSWAddress(vaultAddress);
      setNextVaultId(nextVaultId + 1); // Increment vault ID and save to local storage
    } catch (error) {
      console.error('Error deploying smart wallet:', error);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!account || !provider || !signer || !chainId || !swAddress) return;

    try {
      const workflowFactory = new WorkflowsFactory(provider);

      const wf = await workflowFactory.create({
        name: 'MultiSender Action Example',
        triggers: [
          // new InstantTrigger(),
        ],
        actions: [
          new MultiSenderAction(
            {
              items: [
                {
                  to: '0x5ee2eDC922BcdBBfEFEB4AC8959C1E5dd93ECa05' as Address,
                  amount: parseUnits('1', tokens.usdt.decimals),
                  asset: tokens.usdt,
                },
                {
                  to: '0x5ee2eDC922BcdBBfEFEB4AC8959C1E5dd93ECa05' as Address,
                  amount: parseUnits('1', tokens.usdt.decimals),
                  asset: tokens.usdt,
                },
              ],
            },
            commonConfig
          ),
        ],
        chainId,
      });

      const deployedWorkflow = await wf.buildAndDeploy(swAddress, account as Address);

      setWorkflowHash(deployedWorkflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  return (
    <div className="w-full h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col py-4 px-10 h-screen max-w-[800px] mx-auto">
        <h1 className="text-4xl font-bold">Getting started with Ditto Network</h1>

        {/* Step 1: Connect Wallet */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 1: Connect Wallet</h2>
            <p className="text-gray-600">To get the signer</p>
            <div className="flex flex-col gap-2">
              <ConnectWalletButton />
              <p className="text-gray-600">
                Wallet: {account ? '✅ ' + account : '❌ Not initialized'}
                <br />
                Network:{' '}
                {chainId
                  ? networkNames[Number(chainId) as Chain] || Number(chainId)
                  : '❌ Not initialized'}{' '}
                <br />
                Balance: {ethBalance} {nativeSymbols[chainId as Chain]}, {usdtBalance} USDT <br />
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Initialize Provider */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 2: Initialize Provider</h2>
            <p className="text-gray-600">Initialize the provider to start using the SDK</p>
            <div className="flex flex-col gap-2">
              <Button className="w-min" onClick={initProvider}>
                Init provider
              </Button>
              <p className="text-gray-600">
                Provider: {provider ? '✅ Initialized' : '❌ Not initialized'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Authenticate */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 3: Authenticate</h2>
            <p className="text-gray-600">API Authentication (for history) - sign a message</p>
            <div className="flex flex-col gap-2">
              <Button className="w-min" onClick={authenticate}>
                Sign message
              </Button>
              <p className="text-gray-600">
                Login status: {isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <h2 className="text-2xl font-bold">Step 4: Get Smart Wallet Address and Deploy</h2>
            <p className="text-gray-600">
              By default, the first smart wallet will be deployed with id=1. Address of Smart Wallet predicted based on the account address and id.
            </p>
            <p className="text-gray-600">
              Smart Wallet Address: {isDeployed ? '✅' : '❌'} {swAddress} {isDeployed ? '(deployed)' : '(not deployed)'}
              <br />
              Balance: {swEthBalance} {nativeSymbols[chainId as Chain]}, {swUsdtBalance} USDT <br />
            </p>
            <div className="flex gap-4 items-center">
              <Button
                className="w-min"
                onClick={() => deploySmartWallet(/* default */)}
                disabled={isDeployed}
              >
                {isDeployed ? 'Deployed' : 'Deploy'}
              </Button>
            </div>

            <details className="mt-6">
              <summary className="text-2xl font-bold cursor-pointer">Step 4.1: Predict Address of Next Smart Wallet</summary>
              <div className="flex flex-col gap-2">
                <p className="text-gray-600">
                  You can predict the address of the smart wallet before deploying it. <br/>
                  Next wallet id: {nextVaultId}
                </p>
                <div className="flex gap-4 items-center">
                  <Button className="w-min" onClick={handleGetSmartWalletAddressClick}>
                    Get Next Address
                  </Button>
                </div>
                {nextVaultId !== 1 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-gray-600">
                      Next Smart Wallet Address: {isNextDeployed ? '✅' : '❌'} {nextSwAddress} {isNextDeployed ? '(deployed)' : '(not deployed)'}
                      <br />
                    </div>
                    <div className="flex gap-2">
                      <Button className="w-min" onClick={() => deploySmartWallet(nextVaultId)}>
                        Deploy
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </details>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <h2 className="text-2xl font-bold">Step 5: Create Workflow</h2>
            <p className="text-gray-600">Compose actions and triggers to create a workflow.</p>
            <Button className="w-min" onClick={handleCreateWorkflow}>
              Create
            </Button>
            <p className="text-gray-600">
              Workflow hash: {workflowHash ? `✅ ${workflowHash}` : '❌ Not created'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
