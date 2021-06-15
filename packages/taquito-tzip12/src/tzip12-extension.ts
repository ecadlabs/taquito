import { Context, Extension } from "@taquito/taquito";
import { DEFAULT_HANDLERS, MetadataProviderInterface, MetadataProvider } from '@taquito/tzip16'

// The same default metadataProvider is used for tzip16 and tzip12
export class Tzip12Module implements Extension {
    private _metadataProvider: MetadataProviderInterface;

    constructor(metadataProvider?: MetadataProviderInterface) {
        this._metadataProvider = metadataProvider ? metadataProvider : new MetadataProvider(DEFAULT_HANDLERS);
    }

    configureContext(context: Context) {
        Object.assign(context, { metadataProvider: this._metadataProvider });
    }
}