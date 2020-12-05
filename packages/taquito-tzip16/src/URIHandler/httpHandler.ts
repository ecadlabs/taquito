import { HttpBackend } from "@taquito/http-utils";
import { MetadataInterface } from "../metadataInterface";


export class HTTPHandler {
    httpBackend: HttpBackend;
    constructor() {
        this.httpBackend = new HttpBackend();
    }
    /**
     * Returns metadata at an http resource
     * @param _uri a URI for locating metadata
     */
    async getMetadataHTTP(_uri: string): Promise<MetadataInterface> {
        const response: MetadataInterface = await this.httpBackend.createRequest({
            url: _uri
        })
        return response;
    }

    /**
     * Returns metadata at an http resource
     * @param _uri a URI for locating metadata
     */
    async getMetadataHTTPS(_uri: string): Promise<MetadataInterface> {
        const response:MetadataInterface = await this.httpBackend.createRequest({
            url: _uri
        })
        return response;
    }
}