import { HttpBackend } from "@taquito/http-utils";
import { ContractAbstraction, ContractProvider, Wallet, Context } from "@taquito/taquito";
import { Handler, tzip16Uri } from "../metadata-provider";

export class HttpHandler implements Handler {
    httpBackend: HttpBackend;
    constructor() {
        this.httpBackend = new HttpBackend();
    }
    async getMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, { protocol, location }: tzip16Uri, _context: Context) {
        return this.httpBackend.createRequest<string>({
            url: `${protocol}:${decodeURIComponent(location)}`,
            mimeType: "text; charset=utf-8",
            json: false
        })
    }
}