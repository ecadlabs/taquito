import { HttpBackend } from "@taquito/http-utils";
import json from "rollup-plugin-json";
import { MetadataInterface } from "../metadataInterface";

export class HTTPFetcher {
    httpBackend: HttpBackend;
    constructor() {
        this.httpBackend = new HttpBackend();
    }
    /**
     * Returns metadata using https
     * @param _uri https uri to locate the metadata
     * @param options (Optional) request parameters
     */
    async getMetadataHTTP(_uri: string): Promise<MetadataInterface> {
        const _response: MetadataInterface = await this.httpBackend.createRequest({
            url: _uri,
            mimeType: "text; charset=utf-8",
            json: false
        })

        return _response;
    }
}