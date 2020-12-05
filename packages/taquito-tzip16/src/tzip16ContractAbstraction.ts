import { Context, ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { bytes2Char } from './tzip16-utils';
import { MetadataProvider } from './metadataProvider';
import { MetadataEnvelope, RequestOptions } from './interfaceMetadataProvider';
import { MetadataNotFound, UriNotFound } from './tzip16Errors';
import { RpcClient } from '@taquito/rpc';
import { ParameterSchema } from '@taquito/michelson-encoder';
import { MetadataInterface } from './metadataInterface'

export class MetadataView {
    constructor(
        private constractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private rpc: RpcClient,
        private returnType: any,
        private code: any,
        private parameter: any,
        private args: any[]
    ) { }

    async execute() {
        const sto: any = this.constractAbstraction.script.code.find((x: any) => x.prim === 'storage');
        const contractStorageType = sto!.args[0];
        const storage: any = await this.rpc.getStorage(this.constractAbstraction.address);
        let arg: any;
        if (this.parameter) {
            const metadataViewSchema = new ParameterSchema(this.parameter);
            arg = metadataViewSchema.Encode(...this.args);
        }


        // no param
        const scriptNoParam = {
            script: [
                { prim: 'parameter', args: [contractStorageType] },
                { prim: 'storage', args: [{ prim: 'option', args: [this.returnType] }] },
                {
                    prim: 'code',
                    args: [
                        [
                            { prim: 'CAR' },
                            this.code,
                            { prim: 'SOME' },
                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                            { prim: 'PAIR' }
                        ]
                    ]
                }
            ],
            storage: { prim: 'None' },
            input: { prim: 'Pair', args: storage.args },
            amount: '0',
            chain_id: 'NetXm8tYqnMWky1'
        };
        console.log(JSON.stringify(scriptNoParam))

        // with param
        const scriptWithParam = {
            script: [
                { prim: 'parameter', args: [{ prim: 'pair', args: [this.parameter, contractStorageType] }] },
                { prim: 'storage', args: [{ prim: 'option', args: [this.returnType] }] },
                {
                    prim: 'code',
                    args: [
                        [
                            { prim: 'CAR' },
                            this.code,
                            { prim: 'SOME' },
                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                            { prim: 'PAIR' }
                        ]
                    ]
                }
            ],
            storage: { prim: 'None' },
            input: { prim: 'Pair', args: [arg, storage] },
            amount: '0',
            chain_id: 'NetXm8tYqnMWky1'
        };

        const script = this.parameter ? scriptWithParam : scriptNoParam;
        const result = await this.rpc.runCode(script);
        result.storage.args[0];
        const viewResultSchema = new ParameterSchema(this.returnType);
        return viewResultSchema.Execute(result.storage.args[0]);
    }
}

export class Tzip16ContractAbstraction {
    private _fetcher: MetadataProvider;

    public metadataViews: { [key: string]: (...args: any[]) => MetadataView } = {};

    constructor(
        private constractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private context: Context,
        private options?: RequestOptions
    ) { 
        this._fetcher = new MetadataProvider()
    }

    private async getUriOrFail(): Promise<string> {
        const storage: Storage = await this.constractAbstraction.storage();
        let metadataField;
        let uri;
        if (storage.metadata) {
            metadataField = storage.metadata;
        } else {
            throw new MetadataNotFound();
        }
        try {
            uri = await metadataField.get('');
        } catch (err) {
            throw new UriNotFound();
        }
        return uri;
    }

    /**
     * @description Return an object containing the metadata, the uri, an optional integrity check result and an optional sha256 hash
     * 
     */
    async getMetadata(): Promise<MetadataEnvelope> {
        const uri = await this.getUriOrFail();
        const metadata = await this._fetcher.provideMetadata(this.constractAbstraction, bytes2Char(uri), this.context, this.options);
        return metadata;
    }

    async getMetadataViews() {
        const rpc = this.context.rpc;
        const abs = this.constractAbstraction;

        const { metadata } = await this.getMetadata();

        if (metadata.views) {
            for (let i = 0; i < metadata.views.length; i++) {
                const name = metadata.views[i].name;
                console.log(name);

                for (let j = 0; j < metadata.views[i].implementations.length; j++) {
                    if (Object.keys(metadata.views[i].implementations[j])[0] === 'michelson-storage-view') {
                        const view = Object.values(metadata.views[i].implementations[j])[0];
                        //const annotations = view.annotations;
                        const returnType = view['return-type'];
                        const code = view.code;
                        let parameter: any;
                        if (view.parameter) {
                            parameter = view.parameter
                        };

                        const metadataView = function (...args: any[]) {
                            return new MetadataView(abs, rpc, returnType, code, parameter, args);
                        };
                        this.metadataViews[name] = metadataView;
                    } else if (Object.keys(metadata.views[i].implementations[j])[0] === 'rest-api-query') {
                        // TODO
                    }
                }
            }
        }
    }
}
