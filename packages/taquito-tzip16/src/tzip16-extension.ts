import { Context, Extension } from "@taquito/taquito";
import { Handler, MetadataProvider, MetadataProviderInterface } from "./metadata-provider";
import { HttpHandler } from "./handlers/http-handler";
import { TezosStorageHandler } from "./handlers/tezos-storage-handler";
import { IpfsHandler } from "./handlers/ipfs-handler";

export const DEFAULT_HANDLERS = new Map<string, Handler>([
    ['http', new HttpHandler()],
    ['https', new HttpHandler()],
    ['tezos-storage', new TezosStorageHandler()],
    ['ipfs', new IpfsHandler()]
])
export class Tzip16Module implements Extension {
    private _metadataProvider: MetadataProviderInterface;

    constructor(metadataProvider?: MetadataProviderInterface) {
        this._metadataProvider = metadataProvider ? metadataProvider : new MetadataProvider(DEFAULT_HANDLERS);
    }

    configureContext(context: Context) {
        Object.assign(context, { metadataProvider: this._metadataProvider });
    }
}