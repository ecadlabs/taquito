import { HttpBackend } from "@taquito/http-utils";
import { RequestOptions } from "../interfaceMetadataProvider";


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
    async getMetadataHTTP(_uri: string, options?: RequestOptions): Promise<JSON> {
        const _response:JSON = await this.httpBackend.createRequest({
            url: _uri,
            headers: options?.headers,
            mimeType: options?.mimeType
        })

        return _response;
    }
}