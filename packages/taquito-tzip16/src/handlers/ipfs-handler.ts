import {
  HttpBackend,
  HttpRequestFailed,
  HttpResponseError,
  HttpTimeoutError,
} from '@taquito/http-utils';
import { ContractAbstraction, ContractProvider, Wallet, Context } from '@taquito/taquito';
import { Handler, Tzip16Uri } from '../metadata-provider';

export class IpfsHttpHandler implements Handler {
  private _ipfsGateway: string;
  public httpBackend = new HttpBackend();

  constructor(ipfsGateway?: string) {
    this._ipfsGateway = ipfsGateway ? ipfsGateway : 'ipfs.filebase.io';
  }

  async getMetadata(
    _contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    { location }: Tzip16Uri,
    _context: Context
  ): Promise<string> {
    const url = `https://${this._ipfsGateway}/ipfs/${location.substring(2)}/`;
    try {
      return await this.httpBackend.createRequest<string>({
        url,
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
        json: false,
      });
    } catch (error) {
      const guidance =
        `IPFS metadata retrieval failed at ${url}. Check gateway availability and that the content is retrievable. ` +
        `Configure a reliable gateway with IpfsHttpHandler('your-gateway-hostname').`;

      if (error instanceof HttpResponseError) {
        throw new HttpResponseError(
          `${guidance} ${error.message}`,
          error.status,
          error.statusText,
          error.body,
          error.url
        );
      }
      if (error instanceof HttpRequestFailed || error instanceof HttpTimeoutError) {
        error.message = `${guidance} ${error.message}`;
      }
      throw error;
    }
  }
}
