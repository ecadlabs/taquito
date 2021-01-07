import { BigMapAbstraction, Context, ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { bytes2Char } from './tzip16-utils';
import { MetadataEnvelope, MetadataProviderInterface } from './metadata-provider';
import { BigMapMetadataNotFound, UnconfiguredMetadataProviderError, UriNotFound } from './tzip16-errors';
import BigNumber from 'bignumber.js';
import { Schema } from '@taquito/michelson-encoder';
import { ViewFactory } from './viewKind/viewFactory';
import { View } from './viewKind/interface';

export type MetadataContext = Context & {
    metadataProvider: MetadataProviderInterface;
};

type BigMapId = { int: string };

const metadataBigMapType = {
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'bytes' }],
    annots: ['%metadata']
};
export class Tzip16ContractAbstraction {
    private _metadataProvider: MetadataProviderInterface;
    private _metadataEnveloppe?: MetadataEnvelope;
    private _viewFactory = new ViewFactory();
    private _isViewInitialised: boolean = false;
    private _metadataViewsObject: { [key: string]: (...args: any[]) => View } = {};

    constructor(
        private constractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private context: MetadataContext
    ) {
        this._metadataProvider = context.metadataProvider;
    }

    private findMetadataBigMap(): BigMapAbstraction {
        const metadataBigMapId = this.constractAbstraction.schema.FindFirstInTopLevelPair<BigMapId>(
            this.constractAbstraction.script.storage,
            metadataBigMapType
        );

        if (!metadataBigMapId) {
            throw new BigMapMetadataNotFound();
        }

        return new BigMapAbstraction(
            new BigNumber(metadataBigMapId['int']),
            new Schema(metadataBigMapType),
            this.context.contract
        );
    }

    private async getUriOrFail() {
        const metadataBigMap = this.findMetadataBigMap();
        const uri = await metadataBigMap.get<string>('');
        if (!uri) {
            throw new UriNotFound();
        }
        return uri;
    }

    /**
     * @description Return an object containing the metadata, the uri, an optional integrity check result and an optional sha256 hash
     */
    async getMetadata() {
        if (!this._metadataProvider) {
            throw new UnconfiguredMetadataProviderError();
        }
        if (!this._metadataEnveloppe) {
            const uri = await this.getUriOrFail();
            this._metadataEnveloppe = await this._metadataProvider.provideMetadata(
                this.constractAbstraction,
                bytes2Char(uri),
                this.context
            );
        }
        return this._metadataEnveloppe;
    }

    async metadataViews() {
        if (!this._isViewInitialised) {
            await this.initializeMetadataViewsList();
        }
        return this._metadataViewsObject;
    }

    private async initializeMetadataViewsList() {
        const { metadata } = await this.getMetadata();

        if (metadata.views) {
            for (let view of metadata.views) {
                if (view.implementations) {
                    for (let viewImplementation of view.implementations) {
                        if (view.name) {
                            // when views have the same name, add an index at the end of the name
                            let viewName = view.name;
                            let i = 1;
                            if (viewName in this._metadataViewsObject) {
                                while (`${viewName}${i}` in this._metadataViewsObject) {
                                    i++;
                                }
                                viewName = `${view.name}${i}`;
                            }
                            const metadataView = this._viewFactory.getView(
                                view.name,
                                this.context.rpc,
                                this.constractAbstraction,
                                viewImplementation
                            );
                            // if typeof metadataView === 'undefined', the view has an unsupported type and is ignored
                            if (typeof metadataView !== 'undefined') {
                                this._metadataViewsObject[viewName] = metadataView;
                            }
                        }
                    }
                }
            }
        }
        this._isViewInitialised = true;
    }
}
