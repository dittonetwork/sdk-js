import { DittoProvider } from '../../provider/types';
import { Chain } from '../chains/types';
import { isNativeToken } from '../tokens/utils/is-native-token';
import Erc20TokenABI from '../abi/Erc20TokenABI.json';
import { Address } from '../../ditto-sdk';

export class BalanceCheckerService {
  constructor(private readonly provider: DittoProvider) {}

  public async hasEnoughBalance(tokenAddress: Address, amountWeis: string | bigint, chain: Chain) {
    if (isNativeToken(tokenAddress, chain)) {
      const balance = await this.provider.getSigner().getBalance(tokenAddress);
      return BigInt(balance) >= BigInt(amountWeis);
    }

    const erc20Interface = this.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(Erc20TokenABI));
    const balance = erc20Interface.encodeFunctionData('balanceOf', [tokenAddress]);
    return BigInt(balance) >= BigInt(amountWeis);
  }
}
