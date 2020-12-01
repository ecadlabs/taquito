import { HttpBackend } from "@taquito/http-utils";


export class HTTPHandler {
    httpBackend: HttpBackend;
    constructor() {
        this.httpBackend = new HttpBackend();
    }
    /**
     * Returns metadata at an http resource
     * @param _uri a URI for locating metadata
     */
    async getMetadataHTTP(_uri: string): Promise<JSON> {
        const response:JSON = await this.httpBackend.createRequest({
            url: _uri
        })
        return response;
    }

    /**
     * Returns metadata at an http resource
     * @param _uri a URI for locating metadata
     */
    async getMetadataHTTPS(_uri: string): Promise<JSON> {
        const response:JSON = await this.httpBackend.createRequest({
            url: _uri
        })
        return response;
    }
}