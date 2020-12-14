import { HttpBackend } from "@taquito/http-utils";
import { MetadataInterface } from "../metadataInterface";

export class HTTPFetcher {
    httpBackend: HttpBackend;
    constructor() {
        this.httpBackend = new HttpBackend();
    }
    /**
     * Gets metadata at a uri location using http/https
     * @param _uri https uri to locate the metadata
     */
    async getMetadataHTTP(_uri: string): Promise<JSON> {
        const _response: any = await this.httpBackend.createRequest({
            url: _uri,
            mimeType: "text; charset=utf-8",
        })
        const response = JSON.parse(JSON.stringify(_response));
        return response;
    }

    /**
     * Gets
     * @param _uri http/https uri to locate the metadata
     */
    async getMetadataNonJSON(_uri: string): Promise<JSON> {
        const _response: any = await this.httpBackend.createRequest({
            url: _uri,
            mimeType: "text; charset=utf-8",
            json: false
        })
        const response = JSON.parse(JSON.stringify(_response));
        return response;
    }
}