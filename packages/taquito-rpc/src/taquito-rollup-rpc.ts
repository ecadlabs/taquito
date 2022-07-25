import { validateAddress, ValidationResult, validateContractAddress } from '@taquito/utils';
import { RollupRpcClientInterface } from './rollup-rpc-client-interface';
import { HttpBackend } from '@taquito/http-utils';
import { defaultChain } from './rpc-client-interface';


export class RollupRpcClient implements RollupRpcClientInterface {
  constructor(
    protected url: string,
    protected chain: string = defaultChain,
    protected httpBackend: HttpBackend = new HttpBackend()
  ) {}

  protected createURL(path: string) {
    // Trim trailing slashes because it is assumed to be included in path
    return `${this.url.replace(/\/+$/g, '')}${path}`
  }

  private validateAddress(address: string) {
    if (validateAddress(address) !== ValidationResult.VALID) {
      throw new Error("add error")
    }
  }

  private validateContract(address: string) {
    if (validateContractAddress(address) !== ValidationResult.VALID) {
      throw new Error('add error')
    }
  }

  async getTxAddressBalanceCommand(tz4: string): Promise<string> {
    const url = this.createURL(`/${tz4}`)
    const filler = await Promise.resolve(url)
    return filler
  }
  async transfer(_quantity: number, _ticketAddress: string, _walletPkh: string, _tz4Destination: string): Promise<string> {
    const url = this.createURL(`/${_ticketAddress}`)
    const filler = await Promise.resolve(url)
    return filler
  }
  async withdraw(_amount: number, _ticketAddress: string, _tz4Address: string, _destinationWaller: string): Promise<string> {
    const url = this.createURL(`/${_ticketAddress}`)
    const filler = await Promise.resolve(url)
    return filler
  }

}
