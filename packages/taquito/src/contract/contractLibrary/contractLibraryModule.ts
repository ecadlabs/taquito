import { Context } from '../../context';
import { Extension } from '../../extension/extension';
import {
    defaultRPCOptions,
    EntrypointsResponse,
    RpcClient,
    RPCOptions,
    ScriptedContracts,
    ScriptResponse
} from '@taquito/rpc';

interface contractsLib {
    [contractAddress: string]: { script: ScriptedContracts; entrypoints: EntrypointsResponse };
}

export class ContractsLibraryModule implements Extension {
    private _contractsLibrary: contractsLib = {};

    addContract(contract: contractsLib) {
        for (let value in contract) {
            Object.assign(this._contractsLibrary, { [value]: { ...contract[value] } });
        }
    }

    getContract(contractAddress: string) {
        return this._contractsLibrary[contractAddress];
    }

    configureContext(context: Context, rpc: RpcClient = new RpcWrapperContractsLibrary(context, this)) {
        context.addExtensionsConfiguration(
            () => {
                context.rpc = rpc;
            }
        )
        context.configureExtensions();
    }
}

export class RpcWrapperContractsLibrary extends RpcClient {
    constructor(private context: Context, private _contractLib: ContractsLibraryModule) {
        super(context.rpc['url'], context.rpc['chain'], context.rpc['httpBackend']);
    }

    async getScript(address: string, { block }: { block: string } = defaultRPCOptions): Promise<ScriptResponse> {
        if (
            this._contractLib &&
            this._contractLib.getContract(address) &&
            this._contractLib.getContract(address).script
        ) {
            return this._contractLib.getContract(address).script;
        } else {
            return super.getScript(address, { block });
        }
    }

    async getEntrypoints(contract: string, { block }: RPCOptions = defaultRPCOptions): Promise<EntrypointsResponse> {
        if (
            this._contractLib &&
            this._contractLib.getContract(contract) &&
            this._contractLib.getContract(contract).entrypoints
        ) {
            return this._contractLib.getContract(contract).entrypoints;
        } else {
            return super.getEntrypoints(contract, { block });
        }
    }
}
