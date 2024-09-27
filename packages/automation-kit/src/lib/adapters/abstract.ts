export interface ContractCallParams {
  address: string;
  abi: any;
  method: string;
  args: any[];
  type?: 'view' | 'write';
}

export abstract class AbstractAdapter {
  abstract getAddress(): Promise<string>;
  abstract getChainId(): Promise<string>;
  abstract readContract(params: ContractCallParams): Promise<any>;
  abstract writeContract(params: ContractCallParams): Promise<any>;
}
