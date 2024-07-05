import React from 'react';
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
  CallDataBuilder,
  CustomContractCall,
} from '@ditto-network/core';
import { EthersSigner, EthersContractFactory } from '@ditto-network/ethers';
import disperseAbi from '../lib/disperse-abi';

import { Button, Textarea } from '../components/ui';
import useLocalStorage from '../hooks/use-local-storage';

const networkNames = {
  [Chain.Polygon]: 'Polygon Mainnet',
  [Chain.Arbitrum]: 'Arbitrum Mainnet',
};
const nativeSymbols = {
  [Chain.Polygon]: 'MATIC',
  [Chain.Arbitrum]: 'ETH',
};
const exploerUrls = {
  [Chain.Polygon]: 'https://polygonscan.com',
  [Chain.Arbitrum]: 'https://arbiscan.io',
};

function parseInput(inputStrings: string[]): [Address, string][] {
  // Initialize an empty array to store the parsed output
  const parsedOutput: [Address, string][] = [];

  // Define a regular expression pattern to match the different formats
  const pattern = /([0-9a-fA-Fx]+)[\s,=]+([\d.]+)/g;

  // Iterate over each input string
  inputStrings.forEach((inputStr) => {
    // Find all matches in the input string based on the defined pattern
    const matches = inputStr.matchAll(pattern);

    // Iterate over each match
    for (const match of matches) {
      // Extract address and amount from the match
      const address = match[1];
      const amount = match[2];

      // Append the parsed address and amount to the output array
      parsedOutput.push([address as Address, amount]);
    }
  });

  // Return the parsed output as a 2D array
  return parsedOutput;
}

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
        <Button variant="outline" onClick={disconnect}>
          Disconnect Wallet
        </Button>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

const shortenAddress = (address: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

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
  const { account, chainId: _chainId, connected } = useSDK();
  const chainId = Number(_chainId) as Chain | undefined;
  const tokens = chainId ? tokensMap[chainId] : {};

  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [provider, setProvider] = React.useState<DittoProvider | null>(null);
  const [swFactory, setSWFactory] = React.useState<SmartWalletFactory | null>(null);
  const [isAuthenticated, setAuth] = React.useState(false);
  const [swAddress, setSWAddress] = React.useState<Address | null>(null);
  const [nextSwAddress, setNextSWAddress] = React.useState<Address | null>(null);
  const [lastTxHash, setLastTxHash] = React.useState<string>('');
  const [nextVaultId, setNextVaultId] = useLocalStorage<number>('nextVaultId', 1);
  const [isDeployed, setIsDeployed] = React.useState<boolean>(false);
  const [isNextDeployed, setIsNextDeployed] = React.useState<boolean>(false);
  const [usdtBalance, setUsdtBalance] = React.useState<string | null>(null);
  const [ethBalance, setEthBalance] = React.useState<string | null>(null);
  const [swEthBalance, setSwEthBalance] = React.useState<string | null>(null);
  const [swUsdtBalance, setSwUsdtBalance] = React.useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = React.useState<{ name: string; chainId: number } | null>(
    null
  );
  const [rawRecipients, setRecepients] = React.useState<string>('');
  const recepients = rawRecipients ? parseInput(rawRecipients.split('\n')) : [];

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

      const [isDeployed, lastVaultId] = chainId
        ? await Promise.all([
            swFactory.isVaultWithIdExists(1, +chainId),
            swFactory.getLastVaultId(+chainId),
          ])
        : [false, 1, ''];
      const vaultAddress = chainId ? await swFactory.getVaultAddress(+chainId, 1) : '';
      const nextVaultAddress = chainId
        ? await swFactory.getVaultAddress(+chainId, lastVaultId + 1)
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
    const newSWID = nextVaultId + 1;
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
        triggers: [new InstantTrigger()],
        actions: [
          // new MultiSenderAction(
          //   {
          //     items: recepients.map(([to, amount]) => ({
          //       to,
          //       amount: parseUnits(amount, tokens.usdt.decimals),
          //       asset: tokens.usdt,
          //     })),
          //   },
          //   commonConfig
          // ),
          new CustomContractCall(
            {
              items: [
                {
                  contract: '0xD152f549545093347A162Dce210e7293f1452150',
                  abi: disperseAbi,
                  method: 'disperse',
                  args: [
                    recepients.map(([to]) => to),
                    recepients.map(([, amount]) => parseUnits(amount, tokens.usdt.decimals)),
                  ],
                },
              ],
              value: recepients.reduce(
                (acc, [, amount]) => acc + parseUnits(amount, tokens.usdt.decimals),
                BigInt(0)
              ),
            },
            commonConfig
          ),
        ],
        chainId,
      });

      const deployedWorkflow = await wf.buildAndDeploy(swAddress, account as Address);

      setLastTxHash(deployedWorkflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const handleRecepientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRecepients(value);
  };

  const swAddressLink = `${exploerUrls[chainId as Chain]}/address/${swAddress}`;

  return (
    <div className="w-full h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col py-4 px-10 h-screen max-w-[800px] mx-auto">
        <h1 className="flex items-center gap-4 text-4xl font-bold">
          <img className="icon" src="/logo.svg" alt="Ditto Logo" />
          Getting started with Ditto SDK
        </h1>

        {/* Step 1: Connect Wallet */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 1: Connect Wallet & Initialize SDK</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <ConnectWalletButton />
                <Button
                  variant="outline"
                  className="w-min"
                  disabled={!connected}
                  onClick={initProvider}
                >
                  Init provider
                </Button>
                <Button
                  variant="outline"
                  className="w-min"
                  disabled={!connected}
                  onClick={authenticate}
                >
                  Auth API
                </Button>
              </div>
              <p className="text-gray-600">
                Network:{' '}
                {chainId
                  ? networkNames[Number(chainId) as Chain] || Number(chainId)
                  : '❌ Not initialized'}{' '}
                <br />
                Wallet: {account ? '✅' : '❌'}{' '}
                {account ? (
                  <a
                    className="link"
                    href={`${exploerUrls[chainId as Chain]}/address/${account}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {account}
                  </a>
                ) : (
                  'Not connected'
                )}
                <br />
                Balance:{' '}
                {connected ? (
                  <>
                    {ethBalance} {nativeSymbols[chainId as Chain]}, {usdtBalance} USDT
                  </>
                ) : (
                  '-'
                )}{' '}
                <br />
                Provider:{' '}
                {provider
                  ? '✅ Initialized'
                  : '❌ Initialize the provider to start using the SDK'}{' '}
                <br />
                Login status:{' '}
                {isAuthenticated
                  ? '✅ API Authentication (for history)'
                  : '❌ API Authentication (for history) - sign a message'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Authenticate */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2 mt-6">
            <h2 className="text-2xl font-bold">Step 3: Get Smart Wallet Address and Deploy</h2>
            <p className="text-gray-600">
              By default, the first smart wallet will be deployed with id=1. Address of Smart Wallet
              predicted based on the account address and id.
            </p>
            <p className="text-gray-600">
              Smart Wallet Address: {isDeployed ? '✅' : '❌'}{' '}
              {swAddress ? (
                <>
                  <a className="link" href={swAddressLink} target="_blank" rel="noreferrer">
                    {swAddress}
                  </a>{' '}
                  {isDeployed ? '(deployed)' : '(not deployed)'}
                </>
              ) : (
                'Not connected'
              )}
              <br />
              Balance:{' '}
              {connected ? (
                <>
                  {swEthBalance} {nativeSymbols[chainId as Chain]}, {swUsdtBalance} USDT
                </>
              ) : (
                '-'
              )}{' '}
              <br />
            </p>
            <div className="flex gap-4 items-center">
              <Button
                className="w-min"
                onClick={() => deploySmartWallet(/* default */)}
                disabled={!connected || isDeployed}
              >
                {isDeployed ? 'Deployed' : 'Deploy'}
              </Button>
            </div>

            <details className="mt-6">
              <summary className="text-2xl -ml-[20px] font-bold cursor-pointer">
                Step 4: Predict Address of Next Smart Wallet
              </summary>
              <div className="flex flex-col gap-2">
                <p className="text-gray-600">
                  You can predict the address of the smart wallet before deploying it. <br />
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
                      Next Smart Wallet Address: {isNextDeployed ? '✅' : '❌'} {nextSwAddress}{' '}
                      {isNextDeployed ? '(deployed)' : '(not deployed)'}
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

          <div className="flex flex-col gap-2 mt-6 mb-12">
            <h2 className="text-2xl font-bold">Step 5: Try Intant MultiSender Action</h2>
            <p className="text-gray-600">Disperse USDT to multiple addresses.</p>
            <Textarea
              rows={3}
              placeholder={`0x123... 1.0\n0x456..., 2.0\n0x789...=3.0`}
              value={rawRecipients}
              onChange={handleRecepientsChange}
            />
            <div className="flex gap-4 items-center">
              <Button
                className="w-min"
                onClick={handleCreateWorkflow}
                disabled={!account || !isDeployed}
              >
                Create
              </Button>
              <p className="text-gray-600">
                {lastTxHash ? (
                  <a
                    className="link"
                    href={`${exploerUrls[chainId as Chain]}/tx/${lastTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on explorer {shortenAddress(lastTxHash)}
                  </a>
                ) : !isDeployed ? (
                  <span className="text-gray-600">❗️ You need to deploy the smart wallet first.</span>
                ) : (
                  <span className="text-gray-600">
                    It will immidiately distribute USDT to the addresses you provided.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
