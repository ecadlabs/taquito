import { BigMapId } from './handlers/tezos-storage-handler';
import {
  BigMapAbstraction,
  Context,
  ContractAbstraction,
  ContractProvider,
  Wallet,
} from '@taquito/taquito';
import { bytesToString } from '@taquito/utils';
import { MetadataEnvelope, MetadataProviderInterface } from './metadata-provider';
import {
  BigMapContractMetadataNotFoundError,
  UnconfiguredContractMetadataProviderError,
  UriNotFoundError,
} from './errors';
import BigNumber from 'bignumber.js';
import { Schema } from '@taquito/michelson-encoder';
import { ViewFactory } from './viewKind/viewFactory';
import { View } from './viewKind/interface';
import { ViewDefinition } from './metadata-interface';

export type MetadataContext = Context & {
  metadataProvider: MetadataProviderInterface;
};

const metadataBigMapType = {
  prim: 'big_map',
  args: [{ prim: 'string' }, { prim: 'bytes' }],
  annots: ['%metadata'],
};
export class Tzip16ContractAbstraction {
  private _metadataProvider: MetadataProviderInterface;
  private _metadataEnvelope?: MetadataEnvelope;
  private _metadataEnvelopePromise?: Promise<MetadataEnvelope>;
  private _viewFactory = new ViewFactory();
  private _metadataViewsObject: { [key: string]: () => View } = {};

  constructor(
    private constractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    private context: MetadataContext
  ) {
    this._metadataProvider = context.metadataProvider;
  }

  private async findMetadataBigMap(): Promise<BigMapAbstraction> {
    const metadataBigMapId = this.constractAbstraction.schema.FindFirstInTopLevelPair<BigMapId>(
      this.constractAbstraction.readBlock === 'head'
        ? await this.context.readProvider.getStorage(this.constractAbstraction.address, 'head')
        : this.constractAbstraction.script.storage,
      metadataBigMapType
    );

    if (!metadataBigMapId || !metadataBigMapId.int) {
      throw new BigMapContractMetadataNotFoundError(metadataBigMapId);
    }

    return new BigMapAbstraction(
      new BigNumber(metadataBigMapId['int']),
      new Schema(metadataBigMapType),
      this.context.contract,
      this.constractAbstraction.readBlock
    );
  }

  private async getUriOrFail() {
    const metadataBigMap = await this.findMetadataBigMap();
    const uri = await metadataBigMap.get<string>('');
    if (!uri) {
      throw new UriNotFoundError();
    }
    return uri;
  }

  /**
   * Fetch and cache the contract metadata envelope on this `Tzip16ContractAbstraction` instance.
   * Subsequent calls to `getMetadata()`, `metadataViews()`, and the `metadata*()` accessors
   * reuse the cached envelope without re-fetching.
   *
   * @returns an object containing the parsed `metadata`, the `uri`, the `sha256Hash` of the raw
   * metadata string, and an optional `integrityCheckResult` (`true` when verified via a
   * `sha256://` commitment or a content-verifying handler such as `IpfsHttpHandler`).
   */
  async getMetadata() {
    if (!this._metadataProvider) {
      throw new UnconfiguredContractMetadataProviderError();
    }
    if (!this._metadataEnvelope) {
      if (!this._metadataEnvelopePromise) {
        this._metadataEnvelopePromise = (async () => {
          try {
            const uri = await this.getUriOrFail();
            const envelope = await this._metadataProvider.provideMetadata(
              this.constractAbstraction,
              bytesToString(uri),
              this.context
            );
            this._metadataEnvelope = envelope;
            return envelope;
          } finally {
            this._metadataEnvelopePromise = undefined;
          }
        })();
      }
      return this._metadataEnvelopePromise;
    }
    return this._metadataEnvelope;
  }

  async metadataName() {
    if (!this._metadataEnvelope) {
      await this.getMetadata();
    }
    return this._metadataEnvelope!.metadata.name;
  }

  async metadataDescription() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.description;
  }

  async metadataVersion() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.version;
  }

  async metadataLicense() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.license;
  }

  async metadataAuthors() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.authors;
  }

  async metadataHomepage() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.homepage;
  }

  async metadataSource() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.source;
  }

  async metadataInterfaces() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.interfaces;
  }

  async metadataErrors() {
    if (!this._metadataEnvelope) await this.getMetadata();
    return this._metadataEnvelope!.metadata.errors;
  }

  /**
   * Build and cache off-chain view implementations from the cached metadata envelope returned by
   * `getMetadata()`. If `getMetadata()` has already resolved on this instance, `metadataViews()`
   * uses that same cached envelope without re-fetching.
   */
  async metadataViews() {
    if (Object.keys(this._metadataViewsObject).length === 0) {
      await this.initializeMetadataViewsList();
    }
    return this._metadataViewsObject;
  }

  private async initializeMetadataViewsList() {
    const { metadata } = await this.getMetadata();
    const metadataViews: any = {};
    metadata.views?.forEach((view) => this.createViewImplementations(view, metadataViews));
    this._metadataViewsObject = metadataViews;
  }

  private generateIndexedViewName(viewName: string, metadataViews: object) {
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
    for (const viewImplementation of view?.implementations ?? []) {
      if (view.name) {
        // when views have the same name, add an index at the end of the name
        const viewName = this.generateIndexedViewName(view.name, metadataViews);
        const metadataView = this._viewFactory.getView(
          viewName,
          this.context.rpc,
          this.context.readProvider,
          this.constractAbstraction,
          viewImplementation
        );
        if (metadataView) {
          metadataViews[viewName] = metadataView;
        } else {
          console.warn(
            `Skipped generating ${viewName} because the view has an unsupported type: ${this._viewFactory.getImplementationType(
              viewImplementation
            )}`
          );
        }
      }
    }
  }
}
