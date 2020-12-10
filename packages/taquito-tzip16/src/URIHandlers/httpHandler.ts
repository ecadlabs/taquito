import { HttpBackend } from "@taquito/http-utils";
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
    async getMetadataHTTP(_uri: string): Promise<JSON> {
        const _response:any = await this.httpBackend.createRequest({
            url: _uri,
            mimeType: "text; charset=utf-8",
        })
        const response = JSON.parse(JSON.stringify(_response));
        return response;
    }

    async getMetadataNonJSON(_uri: string): Promise<JSON> {
        const _response:any = await this.httpBackend.createRequest({
            url: _uri,
            mimeType: "text; charset=utf-8",
            json: false
        })
        const response = JSON.parse(JSON.stringify(_response));
        return response;
    }
}