import { DittoWorkflow, WorkflowInitOptions, WorkflowStatus } from './types';
import { CallData, CallDataBuilderReturnData, RepeatableCallDataBuilder } from './builders/types';
import { DittoProvider } from '../provider/types';
import VaultABI from '../blockchain/abi/VaultABI.json';
import IUniversalVault from '../blockchain/abi/IUniversalVault.json';
import { toUtf8Bytes } from '../utils/to-utf8-bytes';
import { prop } from 'rambda';
import { isInstantTrigger } from './triggers/utils/is-instant-trigger';
import { isAddressesEqual } from '../blockchain/tokens/utils/is-addresses-equal';
import { Address, TxHash } from '../types';

const SUPPORTED_CHAINS_GELATO = [56, 43114, 42161, 8217, 42220];

const DEP_ADDRESS = "0xAC25714dc88A615D2f22f638264A0df5a9EbD70b";

export class Workflow implements DittoWorkflow {
  constructor(
    private readonly options: WorkflowInitOptions,
    private readonly provider: DittoProvider
  ) {}

  private shouldRunOnGelato(): boolean {
    return SUPPORTED_CHAINS_GELATO.includes(this.options.chainId);
  }

  public async buildAndDeploy(vaultAddress: Address, accountAddress: Address): Promise<TxHash> {
    const { maxGasPrice = 500e9, maxGasLimit = 10e5 } = this.options;
    const callData = new Set<CallData>();
    const vaultInterface = this.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));

    const actionsCallData = await Promise.all(this.options.actions.map((action) => action.build()));
    const triggersCallData = await Promise.all(
      this.options.triggers.map((trigger) => trigger.build())
    );

    const value = [...actionsCallData, ...triggersCallData].reduce((acc, item) => {
      return acc + BigInt(item.value);
    }, BigInt(0));

    const vaultRelativeActionsCallData = this.getVaultRelativeCallData(
      actionsCallData,
      vaultAddress
    ).map((item) => item.callData);
    const vaultRelativeTriggersCallData = this.getVaultRelativeCallData(
      triggersCallData,
      vaultAddress
    );

    this.getNotVaultRelativeCallData(actionsCallData, vaultAddress).forEach((item) =>
      callData.add(item)
    );
    this.getNotVaultRelativeCallData(triggersCallData, vaultAddress).forEach((item) =>
      callData.add(item)
    );

    const triggersCallDataChunk = vaultRelativeTriggersCallData.map((cd) => [
      cd.callData,
      cd.viewData ?? toUtf8Bytes(''),
      toUtf8Bytes(Math.random().toString()),
      cd.initData ?? toUtf8Bytes(''),
    ]);
    const actionsCallDataChunk = vaultRelativeActionsCallData.map((cd) => [
      cd,
      toUtf8Bytes(''),
      toUtf8Bytes(''),
      //
    ]);

    const repeatCount = this.getRepeatCount();
    const encodedAddWorkflowCall = this.shouldRunOnGelato()
      ? vaultInterface.encodeFunctionData('addWorkflowAndGelatoTask', [
          triggersCallDataChunk,
          actionsCallDataChunk,
          vaultAddress,
          repeatCount,
        ])
      : vaultInterface.encodeFunctionData('addWorkflow', [
          triggersCallDataChunk,
          actionsCallDataChunk,
          DEP_ADDRESS,
          repeatCount,
          maxGasLimit,
          maxGasPrice,
        ]);

    const instant =
      this.options.triggers.length === 0 ||
      (this.options.triggers.length === 1 && isInstantTrigger(this.options.triggers[0]));
    const encodedMultiCall = instant
      ? vaultInterface.encodeFunctionData('multicall', [vaultRelativeActionsCallData])
      : vaultInterface.encodeFunctionData('multicall', [[encodedAddWorkflowCall]]);

    let hash = '';
    try {
      // deploy section
      await Promise.all(
        Array.from(callData).map(async (cd) => {
          const tx = await this.provider.getSigner().sendTransaction({
            from: accountAddress,
            to: cd.to,
            data: cd.callData,
          });
          await tx.wait();
        })
      );

      const tx = await this.provider.getSigner().sendTransaction({
        from: accountAddress,
        to: vaultAddress,
        data: encodedMultiCall,
        value,
      });

      hash = tx.hash;
    } catch (error: unknown) {
      const data = prop('data', error);
      const signature = IUniversalVault.find((item) => item.signature === data);
      if (
        signature?.name ===
        'DexLogicLib_NotEnoughTokenBalances (DexLogicLib_NotEnoughTokenBalances)'
      ) {
        throw new Error('Not enough token balances');
      }
      if (signature?.name === 'NativeWrapper_InsufficientBalance') {
        throw new Error('Not enough token balances (NativeWrapper_InsufficientBalance)');
      }
      if (signature?.name) {
        throw new Error(signature.name + ' error');
      }

      throw error;
    }

    return hash;
  }

  public activate(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public deactivate(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public getId(): string {
    return '';
  }

  public getStatus(): WorkflowStatus {
    return WorkflowStatus.ACTIVE;
  }

  public isActivated(): boolean {
    return false;
  }

  public getRepeatCount(): number {
    const defaultValue = 1;

    return (
      this.options.triggers
        .filter((trigger) => trigger instanceof RepeatableCallDataBuilder)
        .reduce((acc, trigger) => {
          return acc + (trigger as RepeatableCallDataBuilder).getRepeatCount();
        }, 0) || defaultValue
    );
  }

  private getVaultRelativeCallData(
    buildCallData: CallDataBuilderReturnData[],
    vaultAddress: Address
  ) {
    return buildCallData
      .map((item) => item.callData)
      .map((item) => Array.from(item))
      .flat()
      .filter((item) => isAddressesEqual(item.to, vaultAddress));
  }

  private getNotVaultRelativeCallData(
    buildCallData: CallDataBuilderReturnData[],
    vaultAddress: Address
  ) {
    return buildCallData
      .map((item) => item.callData)
      .map((item) => Array.from(item))
      .flat()
      .filter((item) => !isAddressesEqual(item.to, vaultAddress));
  }
}
