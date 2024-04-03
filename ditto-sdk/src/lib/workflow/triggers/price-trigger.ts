import { TriggerCallDataBuilder, Triggers } from './types';
import { CallData, CallDataBuilderReturnData } from '../builders/types';
import { Token, V3_CORE_FACTORY_ADDRESSES } from '@uniswap/sdk-core';
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk';
import { ZERO_ADDRESS } from '../../blockchain/addresses/zero-address';
import { dittoOracleAddresses } from '../../blockchain/addresses/oracles';
import { uniswapPoolFactoryAddresses } from '../../blockchain/addresses/uniswap-pool-factories';
import DittoOracleABI from '../../blockchain/abi/DittoOracleABI.json';
import VaultABI from '../../blockchain/abi/VaultABI.json';
import { getRandomBytes } from '../../utils/get-random-bytes';
import { DittoContractInterface } from '../../blockchain/contracts/types';
import { Maybe } from '../../types';

export class PriceTriggerCallDataBuilder extends TriggerCallDataBuilder<Triggers.Price> {
  public async build(): Promise<CallDataBuilderReturnData> {
    const vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));

    const { poolAddress } = this.computeUniswapPoolAddress(
      this.commonCallDataBuilderConfig.chainId,
      this.config.tokenAddress,
      this.config.baseTokenAddress,
      this.config.uniswapPoolFeeTier
    );

    if (poolAddress === ZERO_ADDRESS)
      throw new Error('Uniswap pool not found for price-based trigger');

    const targetRate = await this.getTargetRate();

    const initData = vaultInterface
      .encodeFunctionData('priceCheckerUniswapInitialize', [
        poolAddress,
        targetRate,
        getRandomBytes(32),
      ])
      .slice(0, -64);

    const callDataArray = new Set<CallData>();
    callDataArray.add({
      to: this.commonCallDataBuilderConfig.vaultAddress,
      initData,
      callData: this.getSigHash(vaultInterface)!,
      viewData: this.getSigHash(vaultInterface)!,
    });

    return {
      callData: callDataArray,
      value: BigInt(0),
    };
  }

  private computeUniswapPoolAddress(
    chainId: number,
    token0: string,
    token1: string,
    feeAmount: FeeAmount
  ) {
    const tokenA = new Token(chainId, token0, 0);
    const tokenB = new Token(chainId, token1, 0);

    return {
      poolAddress: computePoolAddress({
        factoryAddress: V3_CORE_FACTORY_ADDRESSES[chainId],
        tokenA: tokenA.sortsBefore(tokenB) ? tokenB : tokenA,
        tokenB: tokenA.sortsBefore(tokenB) ? tokenA : tokenB,
        fee: feeAmount,
      }),
      tokenA,
      tokenB,
    };
  }

  private async getTargetRate(): Promise<string> {
    const isBaseFirstToken =
      parseInt(this.config.baseTokenAddress) > parseInt(this.config.tokenAddress);

    if (isBaseFirstToken) {
      return this.config.triggerAtPrice.toString();
    }

    const oracleAddress = dittoOracleAddresses[this.commonCallDataBuilderConfig.chainId];
    const uniswapFactoryAddress =
      uniswapPoolFactoryAddresses[this.commonCallDataBuilderConfig.chainId];

    const oracleContract = await this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContract(oracleAddress, JSON.stringify(DittoOracleABI));

    const targetRateBN = await oracleContract.call<unknown[], bigint>('consult', [
      this.config.baseTokenAddress,
      this.config.triggerAtPrice,
      this.config.tokenAddress,
      this.config.uniswapPoolFeeTier,
      uniswapFactoryAddress,
    ]);

    const targetRate = targetRateBN.toString();

    if (!targetRate) throw new Error('Target rate not calculated for price-based trigger');

    const rateBN = BigInt(targetRate);
    const priceBN = BigInt(this.config.triggerAtPrice);

    return priceBN > BigInt(1)
      ? (rateBN / priceBN).toString(0)
      : (rateBN * (BigInt(1) / priceBN)).toString();
  }

  private getSigHash(vaultInterface: DittoContractInterface): Maybe<string> {
    const gtSigHash = vaultInterface.selector('uniswapCheckGTTargetRate');
    const ltSigHash = vaultInterface.selector('uniswapCheckLTTargetRate');
    const isBaseFirstToken =
      parseInt(this.config.baseTokenAddress) > parseInt(this.config.tokenAddress);
    const direction = !this.config.priceMustBeHigherThan;

    /*
    * If isBaseFirstToken is true, then sigHash will be ltSigHash if direction is also true, otherwise it will be gtSigHash.
      If isBaseFirstToken is false, then sigHash will be gtSigHash if direction is false, otherwise it will be ltSigHash.
    * */
    if (isBaseFirstToken) {
      return direction ? ltSigHash : gtSigHash;
    }
    return direction ? gtSigHash : ltSigHash;
  }
}
