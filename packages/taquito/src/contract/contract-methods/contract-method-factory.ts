import { Wallet } from '../../wallet';
import { ContractProvider } from '../../contract';
import { ContractMethodObject } from './contract-method-object-param';
import { ContractMethod } from './contract-method-flat-param';
import { ParameterSchema, ViewSchema } from '@taquito/michelson-encoder';
import { RpcClientInterface, MichelsonV1Expression } from '@taquito/rpc';
import { OnChainView } from './contract-on-chain-view';
import { TzReadProvider } from '../../read-provider/interface';

export class ContractMethodFactory<T extends ContractProvider | Wallet> {
  constructor(private provider: T, private contractAddress: string) {}

  createContractMethodFlatParams(
    smartContractMethodSchema: ParameterSchema,
    smartContractMethodName: string,
    args: any[],
    isMultipleEntrypoint = true,
    isAnonymous = false
  ) {
    return new ContractMethod<T>(
      this.provider,
      this.contractAddress,
      smartContractMethodSchema,
      smartContractMethodName,
      args,
      isMultipleEntrypoint,
      isAnonymous
    );
  }

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
