import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@taquito/taquito';
import { OriginateParams } from '@taquito/taquito/dist/types/operations/types';
import { TezBridgeSigner } from '@taquito/tezbridge-signer';

import { NetworkSelectService } from './components/network-select/network-select.service';
import { Network } from './models/network.model';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  constructor(private networkSelect: NetworkSelectService) {}

  public setNetwork(network: Network) {
    this.networkSelect.select(network);
    this.taquito.setProvider({ rpc: Network.getUrl(network) });
  }

  public importFaucetKey(key) {
    const email = key.email;
    const password = key.password;
    const mnemonic = key.mnemonic.join(' ');
    const secret = key.secret;

    return this.taquito.importKey(email, password, mnemonic, secret);
  }

  public selectTezBridgeSigner() {
    this.taquito.setProvider({ rpc: this.taquito.rpc, signer: new TezBridgeSigner() });
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
