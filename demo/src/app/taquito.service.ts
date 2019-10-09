import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@taquito/taquito';
import { OriginateParams } from '@taquito/taquito/dist/types/operations/types';
import { TezBridgeSigner } from '@taquito/tezbridge-signer';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  public setNetwork(url: string) {
    this.taquito.setProvider({ rpc: url });
  }

  public importFaucetKey(key) {
    const email = key.email;
    const password = key.password;
    const mnemonic = key.mnemonic.join(' ');
    const secret = key.secret;

    return this.taquito.importKey(email, password, mnemonic, secret);
  }

  public selectTezBridgeSigner() {
    this.taquito.setProvider({ signer: new TezBridgeSigner() });
  }

  public originate(contract: OriginateParams) {
    return this.taquito.contract.originate(contract);
  }

  public async getContract(address: string) {
    const contract = await this.taquito.contract.at(address);

    return {
      account: await this.taquito.rpc.getContract(address),
      storage: await contract.storage(),
      script: contract.script,
    };
  }
}
