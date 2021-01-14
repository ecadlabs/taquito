import { Context, Extension } from "@taquito/taquito";
import { DEFAULT_HANDLERS, MetadataProviderInterface, MetadataProvider } from '@taquito/tzip16'

// We use the same metadataProvider for tzip16 and tzip12... Should this be change to use distinct providers?
export class Tzip12Module implements Extension {
    private _metadataProvider: MetadataProviderInterface;

    constructor(metadataProvider?: MetadataProviderInterface) {
        this._metadataProvider = metadataProvider ? metadataProvider : new MetadataProvider(DEFAULT_HANDLERS);
    }

    configureContext(context: Context) {
        Object.assign(context, { metadataProvider: this._metadataProvider });
    }
}