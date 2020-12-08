import { Context, Extension } from "@taquito/taquito";
import { MetadataProviderInterface } from "./interfaceMetadataProvider";
import { MetadataProvider } from "./metadataProvider";

export class Tzip16Module implements Extension {
    private _metadataProvider: MetadataProviderInterface;


    constructor(metadataProvider?: MetadataProviderInterface) {
        this._metadataProvider = metadataProvider? metadataProvider: new MetadataProvider();
    }

    configureContext(context: Context) {
        Object.assign(context, { metadataProvider: this._metadataProvider });
    }
}