import { Injectable } from '@angular/core';
import { Tezos } from '@tezos-ts/tezos-ts'
import { BehaviorSubject, of, Observable } from 'rxjs';

const provider = 'https://api.tez.ie/rpc/mainnet';
Tezos.setProvider({ rpc: provider });

import { switchMap, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TezosService {
  private tezos = Tezos;

  private _currentAddress$ = new BehaviorSubject('KT1BvVxWM6cjFuJNet4R9m64VDCN2iMvjuGE');

  public addressDetail$ = this._currentAddress$.pipe(switchMap(async (address) => {
    try {
      return {
        balance: await this.tezos.tz.getBalance(address),
        storage: await this.tezos.contract.getStorage(address),
        address,
      }
    } catch (ex) {
      return { balance: null, storage: {}, address: this._currentAddress$.value };
    }
  }))

  public latestHead$ = new Observable((sub) => {
    this.tezos.stream.subscribe('head').on('data', (data) => {
      sub.next(data)
    })
  })

  public setAddress(address: string) {
    this._currentAddress$.next(address);
  }

  public getAddress() {
    return this._currentAddress$.value;
  }
}
