import { HttpBackend } from "@taquito/http-utils";
import { ContractAbstraction, ContractProvider, Wallet, Context } from "@taquito/taquito";
import { Handler, Tzip16Uri } from "../metadata-provider";

export class HttpHandler implements Handler {
    httpBackend: HttpBackend;
    constructor() {
        this.httpBackend = new HttpBackend();
    }
    async getMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, { protocol, location }: Tzip16Uri, _context: Context) {
        return this.httpBackend.createRequest<string>({
            url: `${protocol}:${decodeURIComponent(location)}`,
            method: 'GET',
            mimeType: "text; charset=utf-8",
            json: false
        })
    }
}