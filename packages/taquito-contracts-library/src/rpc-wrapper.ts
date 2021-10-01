import { HttpBackend } from '@taquito/http-utils';
import {
    defaultRPCOptions,
    EntrypointsResponse,
    RpcClient,
    RPCOptions,
    ScriptResponse
} from '@taquito/rpc';
import { ContractsLibrary } from './taquito-contracts-library';

export class RpcWrapperContractsLibrary extends RpcClient {
    constructor(protected url: string, protected chain: string, protected httpBackend: HttpBackend, private contractslibrary: ContractsLibrary) {
        super(url, chain, httpBackend);
    }

    async getScript(address: string, { block }: { block: string } = defaultRPCOptions): Promise<ScriptResponse> {
        const contractData = this.contractslibrary.getContract(address);
        if (contractData){
            return contractData.script;
        } else {
            return super.getScript(address, { block });
        }
    }

    async getEntrypoints(contract: string, { block }: RPCOptions = defaultRPCOptions): Promise<EntrypointsResponse> {
        const contractData = this.contractslibrary.getContract(contract);
        if (contractData){
            return contractData.entrypoints;
        } else {
            return super.getEntrypoints(contract, { block });
        }
    }
}