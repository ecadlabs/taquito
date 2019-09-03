import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@tezos-ts/tezos-ts'
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const provider = 'https://api.tez.ie/rpc/mainnet';
Tezos.setProvider({ rpc: provider });

import { switchMap, map, tap, shareReplay, debounceTime } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TezosService {
  private tezos: TezosToolkit = Tezos;


  public blockLoading$ = new Subject();
  public addressLoading$ = new Subject();


  private _currentAddress$ = new BehaviorSubject('KT1BvVxWM6cjFuJNet4R9m64VDCN2iMvjuGE');
  private _currentNetwork$ = new BehaviorSubject('https://api.tez.ie/rpc/mainnet');

  public addressDetail$ = this._currentAddress$.pipe(
    debounceTime(500),
    switchMap((address) => this._currentNetwork$.pipe(map(() => address))),
    tap(() => this.addressLoading$.next(true)),
    switchMap(async (address) => {
      let base = { balance: null, storage: null, contract: null, history: null, address: this._currentAddress$.value };
      try {
        base = {
          balance: (await this.tezos.tz.getBalance(address)).toString(),
          history: await this.tezos.query.balanceHistory(address, { limit: 20 }),
          contract: await this.tezos['_rpcClient'].getContract(address),
          storage: null,
          address,
        }
      } catch (ex) {
        return base;
      }

      try {
        base = {
          ...base,
          storage: await this.tezos.contract.getStorage(address)
        }
      } catch (ex) {
        return base;
      }

      return base;
    }),
    tap(() => this.addressLoading$.next(false)),
    shareReplay(),
  )

  public latestHead$ = this._currentNetwork$.pipe(
    debounceTime(500),
    switchMap(() => {
      return new Observable<string>((sub) => {
        const subs = this.tezos.stream.subscribe('head')
        subs.on('data', (data) => {
          sub.next(data)
        })
        return () => {
          subs.close();
        }
      })
    }), shareReplay())

  public lastBlock$ = this.latestHead$.pipe(
    debounceTime(500),
    tap(() => this.blockLoading$.next(true)),
    switchMap(async (head) => {
      try {
        return this.tezos['_rpcClient'].getBlock({ block: head })
      } catch (ex) {
        return {}
      }
    }),
    tap(() => this.blockLoading$.next(false)),
    shareReplay(),
  )

  public setAddress(address: string) {
    this._currentAddress$.next(address);
  }

  public getAddress() {
    return this._currentAddress$.value;
  }

  public setNetwork(address: string) {
    this.tezos.setProvider({ rpc: address })
    this._currentNetwork$.next(address);
  }

  public getNetwork() {
    return this._currentNetwork$.value;
  }
}
