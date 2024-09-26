export interface ContractCallParams {
  address: string;
  abi: any;
  method: string;
  args: any[];
  type?: 'view' | 'write';
}

export abstract class AbstractAdapter {
  abstract getChainId(): Promise<string>;
  abstract contractCall(params: ContractCallParams): Promise<any>;
  abstract sendTransaction(params: ContractCallParams): Promise<any>;
}
