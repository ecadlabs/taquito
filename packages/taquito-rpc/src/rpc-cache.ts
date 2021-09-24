import { HttpBackend } from '@taquito/http-utils';
import { RpcClient } from './taquito-rpc';
import { defaultChain, defaultRPCOptions, RpcClientInterface, RPCOptions } from './rpc-client-interface';
import {
    BakingRightsQueryArguments,
    BakingRightsResponse,
    BalanceResponse,
    BallotListResponse,
    BallotsResponse,
    BigMapGetResponse,
    BigMapKey,
    BigMapResponse,
    BlockHeaderResponse,
    BlockMetadata,
    BlockResponse,
    ConstantsResponse,
    ContractResponse,
    CurrentProposalResponse,
    CurrentQuorumResponse,
    DelegateResponse,
    DelegatesResponse,
    EndorsingRightsQueryArguments,
    EndorsingRightsResponse,
    EntrypointsResponse,
    ManagerKeyResponse,
    PackDataParams,
    PeriodKindResponse,
    ProposalsResponse,
    SaplingDiffResponse,
    ScriptResponse,
    StorageResponse,
    VotesListingsResponse,
    VotingPeriodBlockResult
} from './types';

interface CachedDataInterface {
    [key: string]: {
        handle: Function;
        response: any;
    };
}
const defaultTtl = 1000;

export class RpcCacheDecorator extends RpcClient implements RpcClientInterface {
    private _cache: CachedDataInterface = {};
    constructor(
        rpcUrl: string,
        rpcChain: string = defaultChain,
        httpBackend: HttpBackend = new HttpBackend(),
        protected ttl = defaultTtl
    ) {
        super(rpcUrl, rpcChain, httpBackend);
    }

    private serializeKey(url: string, params: any[], data?: any) {
        let param: string = '';
        params.forEach((element) => {
            if (typeof element === 'object') {
                param = param + JSON.stringify(element);
            } else {
                param = param + element;
            }
        });
        if (data) {
            return `${url}/${param}/${JSON.stringify(data)}`;
        } else {
            return `${url}/${param}`;
        }
    }

    private has(key: string) {
        console.log('keyyyy', key)
        return key in this._cache;
    }

    private get(key: string) {
        console.log('get from cache');
        return this._cache[key].response;
    }

    private put(key: string, response: any) {
        let handle = setTimeout(() => {
            return this.remove(key);
        }, this.ttl);

        Object.assign(this._cache, { [key]: { handle, response } });
    }

    private remove(key: string) {
        delete this._cache[key];
    }

    async getBlockHash({ block }: RPCOptions = defaultRPCOptions): Promise<string> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBlockHash({ block });
            this.put(key, response);
            return response;
        }
    }

    async getLiveBlocks({ block }: RPCOptions = defaultRPCOptions): Promise<string[]> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getLiveBlocks({ block });
            this.put(key, response);
            return response;
        }
    }

    async getBalance(address: string, { block }: RPCOptions = defaultRPCOptions): Promise<BalanceResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBalance(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getStorage(address: string, { block }: { block: string } = defaultRPCOptions): Promise<StorageResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getStorage(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getScript(address: string, { block }: { block: string } = defaultRPCOptions): Promise<ScriptResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getScript(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getContract(address: string, { block }: { block: string } = defaultRPCOptions): Promise<ContractResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getContract(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getManagerKey(
        address: string,
        { block }: { block: string } = defaultRPCOptions
    ): Promise<ManagerKeyResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getManagerKey(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getDelegate(address: string, { block }: { block: string } = defaultRPCOptions): Promise<DelegateResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getDelegate(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getBigMapKey(
        address: string,
        key: BigMapKey,
        { block }: { block: string } = defaultRPCOptions
    ): Promise<BigMapGetResponse> {
        const keyUrl = this.serializeKey(this.url, [block, address, key]);
        if (this.has(keyUrl)) {
            return this.get(keyUrl);
        } else {
            const response = await super.getBigMapKey(address, key, { block });
            this.put(keyUrl, response);
            return response;
        }
    }

    async getBigMapExpr(
        id: string,
        expr: string,
        { block }: { block: string } = defaultRPCOptions
    ): Promise<BigMapResponse> {
        const key = this.serializeKey(this.url, [block, id, expr]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBigMapExpr(id, expr, { block });
            this.put(key, response);
            return response;
        }
    }

    async getDelegates(address: string, { block }: { block: string } = defaultRPCOptions): Promise<DelegatesResponse> {
        const key = this.serializeKey(this.url, [block, address]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getDelegates(address, { block });
            this.put(key, response);
            return response;
        }
    }

    async getConstants({ block }: RPCOptions = defaultRPCOptions): Promise<ConstantsResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getConstants({ block });
            this.put(key, response);
            return response;
        }
    }

    async getBlock({ block }: RPCOptions = defaultRPCOptions): Promise<BlockResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBlock({ block });
            this.put(key, response);
            return response;
        }
    }

    async getBlockHeader({ block }: RPCOptions = defaultRPCOptions): Promise<BlockHeaderResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBlockHeader({ block });
            this.put(key, response);
            return response;
        }
    }

    async getBlockMetadata({ block }: RPCOptions = defaultRPCOptions): Promise<BlockMetadata> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBlockMetadata({ block });
            this.put(key, response);
            return response;
        }
    }

    async getBakingRights(
        args: BakingRightsQueryArguments = {},
        { block }: RPCOptions = defaultRPCOptions
    ): Promise<BakingRightsResponse> {
        const key = this.serializeKey(this.url, [block, args]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBakingRights(args, { block });
            this.put(key, response);
            return response;
        }
    }

    async getEndorsingRights(
        args: EndorsingRightsQueryArguments = {},
        { block }: RPCOptions = defaultRPCOptions
    ): Promise<EndorsingRightsResponse> {
        const key = this.serializeKey(this.url, [block, args]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getEndorsingRights(args, { block });
            this.put(key, response);
            return response;
        }
    }

    async getBallotList({ block }: RPCOptions = defaultRPCOptions): Promise<BallotListResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBallotList({ block });
            this.put(key, response);
            return response;
        }
    }

    async getBallots({ block }: RPCOptions = defaultRPCOptions): Promise<BallotsResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getBallots({ block });
            this.put(key, response);
            return response;
        }
    }

    async getCurrentPeriodKind({ block }: RPCOptions = defaultRPCOptions): Promise<PeriodKindResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getCurrentPeriodKind({ block });
            this.put(key, response);
            return response;
        }
    }

    async getCurrentProposal({ block }: RPCOptions = defaultRPCOptions): Promise<CurrentProposalResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getCurrentProposal({ block });
            this.put(key, response);
            return response;
        }
    }

    async getCurrentQuorum({ block }: RPCOptions = defaultRPCOptions): Promise<CurrentQuorumResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getCurrentQuorum({ block });
            this.put(key, response);
            return response;
        }
    }

    async getVotesListings({ block }: RPCOptions = defaultRPCOptions): Promise<VotesListingsResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getVotesListings({ block });
            this.put(key, response);
            return response;
        }
    }

    async getProposals({ block }: RPCOptions = defaultRPCOptions): Promise<ProposalsResponse> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getProposals({ block });
            this.put(key, response);
            return response;
        }
    }

    async getEntrypoints(contract: string, { block }: RPCOptions = defaultRPCOptions): Promise<EntrypointsResponse> {
        const key = this.serializeKey(this.url, [block, contract]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getEntrypoints(contract, { block });
            this.put(key, response);
            return response;
        }
    }

    async getChainId() {
        const key = this.serializeKey(this.url, []);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getChainId();
            this.put(key, response);
            return response;
        }
    }

    async packData(data: PackDataParams, { block }: RPCOptions = defaultRPCOptions) {
        const key = this.serializeKey(this.url, [block, data]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.packData(data, { block });
            this.put(key, response);
            return response;
        }
    }

    async getCurrentPeriod({ block }: RPCOptions = defaultRPCOptions): Promise<VotingPeriodBlockResult> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getCurrentPeriod({ block });
            this.put(key, response);
            return response;
        }
    }

    async getSuccessorPeriod({ block }: RPCOptions = defaultRPCOptions): Promise<VotingPeriodBlockResult> {
        const key = this.serializeKey(this.url, [block]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getSuccessorPeriod({ block });
            this.put(key, response);
            return response;
        }
    }

    async getSaplingDiffById(
        id: string,
        { block }: { block: string } = defaultRPCOptions
    ): Promise<SaplingDiffResponse> {
        const key = this.serializeKey(this.url, [block, id]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getSaplingDiffById(id, { block });
            this.put(key, response);
            return response;
        }
    }

    async getSaplingDiffByContract(
        contract: string,
        { block }: { block: string } = defaultRPCOptions
    ): Promise<SaplingDiffResponse> {
        const key = this.serializeKey(this.url, [block, contract]);
        if (this.has(key)) {
            return this.get(key);
        } else {
            const response = await super.getSaplingDiffByContract(contract, { block });
            this.put(key, response);
            return response;
        }
    }
}
