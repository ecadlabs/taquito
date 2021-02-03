import { HttpBackend } from "@taquito/http-utils";
import { ContractAbstraction, ContractProvider, Wallet, Context } from "@taquito/taquito";
import { Handler, Tzip16Uri } from "../metadata-provider";

export class IpfsHttpHandler implements Handler {
    private _ipfsGateway: string;
    private _httpBackend = new HttpBackend();

    constructor(ipfsGatheway?:string){
        this._ipfsGateway = ipfsGatheway? ipfsGatheway: 'ipfs.io';
    }

    async getMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, { location }: Tzip16Uri, _context: Context): Promise<string> {
        return this._httpBackend.createRequest<string>({
            url: `https://${this._ipfsGateway}/ipfs/${location.substring(2)}/`,
            method: 'GET',
            headers: {'Content-Type': 'text/plain'},
            mimeType: "text; charset=utf-8",
            json: false
        })
    }
}