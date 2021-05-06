import { BigMapAbstraction, Context, ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { bytes2Char } from '@taquito/utils';
import { MetadataEnvelope, MetadataProviderInterface } from './metadata-provider';
import { BigMapMetadataNotFound, UnconfiguredMetadataProviderError, UriNotFound } from './tzip16-errors';
import BigNumber from 'bignumber.js';
import { Schema } from '@taquito/michelson-encoder';
import { ViewFactory } from './viewKind/viewFactory';
import { View } from './viewKind/interface';
import { ViewDefinition } from './metadata-interface';

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
    private _metadataEnvelope?: MetadataEnvelope;
    private _viewFactory = new ViewFactory();
    private _metadataViewsObject: { [key: string]: () => View } = {};

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
        if (!this._metadataEnvelope) {
            const uri = await this.getUriOrFail();
            this._metadataEnvelope = await this._metadataProvider.provideMetadata(
                this.constractAbstraction,
                bytes2Char(uri),
                this.context
            );
        }
        return this._metadataEnvelope;
    }

    async metadataViews() {
        if (Object.keys(this._metadataViewsObject).length === 0) {
            await this.initializeMetadataViewsList();
        }
        return this._metadataViewsObject;
    }

    private async initializeMetadataViewsList() {
        const { metadata } = await this.getMetadata();
        const metadataViews: any = {};
        metadata.views?.forEach((view) => this.createViewImplementations(view, metadataViews))
        this._metadataViewsObject = metadataViews;
    }

    private generateIndexedViewName(viewName: string, metadataViews: {}) {
        let i = 1;
        if (viewName in metadataViews) {
            while (`${viewName}${i}` in metadataViews) {
                i++;
            }
            viewName = `${viewName}${i}`;
        }
        return viewName;
    }

    private createViewImplementations(view: ViewDefinition, metadataViews: any) {
        for (let viewImplementation of view?.implementations ?? []) {
            if (view.name) {
                // when views have the same name, add an index at the end of the name
                const viewName = this.generateIndexedViewName(view.name, metadataViews);
                const metadataView = this._viewFactory.getView(
                    viewName,
                    this.context.rpc,
                    this.constractAbstraction,
                    viewImplementation
                );
                if (metadataView) {
                    metadataViews[viewName] = metadataView;
                } else {
                    console.warn(`Skipped generating ${viewName} because the view has an unsupported type: ${this._viewFactory.getImplementationType(viewImplementation)}`)
                }
            }
        }
    }
}
