import { Context, Extension } from "@taquito/taquito";
// import { MetadataProvider } from "./metadataProvider";
import { MetadataProviderInterface } from "./interfaceMetadataProvider";

export class Tzip16Module implements Extension {
    private _metadataProvider: MetadataProviderInterface;

    constructor(metadataProvider: MetadataProviderInterface) {
        this._metadataProvider = metadataProvider;
    }
    // TODO when MetadataProvider class is ready
    // change metadataProvider parameter to optional
    // create an instance of MetadataProvider if none is passed as a parameter
    /* constructor(metadataProvider?: MetadataProviderInterface) {
        this._metadataProvider = metadataProvider? metadataProvider: new MetadataProvider();
    } */

    configureContext(context: Context) {
        Object.assign(context, { metadataProvider: this._metadataProvider });
    }
}