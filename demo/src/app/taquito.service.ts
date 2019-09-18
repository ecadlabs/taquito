import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@tezos-ts/tezos-ts';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  public getContract(address: string) {
    return this.taquito.rpc.getContract(address);
  }

  public setNetwork(url: string) {
    this.taquito.setProvider({ rpc: url });
  }
}
