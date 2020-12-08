import { HttpBackend } from "@taquito/http-utils";

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
        const _response:JSON = await this.httpBackend.createRequest({
            url: _uri,
            mimeType: "text; charset=utf-8"
        })

        return _response;
    }
}