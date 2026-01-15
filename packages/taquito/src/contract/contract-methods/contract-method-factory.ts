import type { Wallet } from '../../wallet/wallet';
import { ContractProvider } from '../interface';
import { ContractMethodObject } from './contract-method-object-param';
import { ParameterSchema, ViewSchema } from '@taquito/michelson-encoder';
import { RpcClientInterface, MichelsonV1Expression } from '@taquito/rpc';
import { OnChainView } from './contract-on-chain-view';
import { TzReadProvider } from '../../read-provider/interface';

export class ContractMethodFactory<T extends ContractProvider | Wallet> {
  constructor(
    private provider: T,
    private contractAddress: string
  ) {}

  createContractMethodObjectParam(
    smartContractMethodSchema: ParameterSchema,
    smartContractMethodName: string,
    args: any[],
    isMultipleEntrypoint = true,
    isAnonymous = false
  ) {
    return new ContractMethodObject<T>(
      this.provider,
      this.contractAddress,
      smartContractMethodSchema,
      smartContractMethodName,
      args,
      isMultipleEntrypoint,
      isAnonymous
    );
  }

  createContractViewObjectParam(
    rpc: RpcClientInterface,
    readProvider: TzReadProvider,
    smartContractViewSchema: ViewSchema,
    contractStorageType: MichelsonV1Expression,
    viewArgs: any
  ) {
    return new OnChainView(
      rpc,
      readProvider,
      this.contractAddress,
      smartContractViewSchema,
      contractStorageType,
      viewArgs
    );
  }
}
