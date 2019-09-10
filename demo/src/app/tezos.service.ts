import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@tezos-ts/tezos-ts'
import { BehaviorSubject, Observable, Subject, defer } from 'rxjs';
import { TezBridgeSigner } from '@tezos-ts/tezbridge-signer'

const provider = 'https://alphanet-node.tzscan.io';
Tezos.setProvider({ rpc: provider, });

import { switchMap, map, tap, shareReplay, debounceTime, filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TezosService {
  private tezos: TezosToolkit = Tezos;

  public blockLoading$ = new Subject();
  public addressLoading$ = new Subject();

  private _signer$ = new BehaviorSubject<TezBridgeSigner>(null);

  public signingAddress$ = this._signer$.pipe(filter((x) => !!x), switchMap((signer) => {
    return signer.publicKeyHash();
  }), shareReplay())

  public activateSigner() {
    const signer = new TezBridgeSigner();
    this.tezos.setProvider({ rpc: this._currentNetwork$.value, signer });
    this._signer$.next(signer);
  }

  private _currentAddress$ = new BehaviorSubject('KT1BvVxWM6cjFuJNet4R9m64VDCN2iMvjuGE');
  public _currentNetwork$ = new BehaviorSubject('https://alphanet-node.tzscan.io');

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
          contract: await this.tezos.rpc.getContract(address),
          storage: null,
          address,
        }
      } catch (ex) {
        return {} as any;
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
        return this.tezos.rpc.getBlock({ block: head })
      } catch (ex) {
        return {} as any
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

  public transactions = [];

  public async sendTransaction({ to, amount }) {
    const tx = await this.tezos.contract.transfer({ to, amount });
    this.transactions.push({
      op: tx,
      confirmed: tx.confirmation(),
      to,
      amount,
      from: await this._signer$.value.publicKeyHash(),
    })
    return tx;
  }
}
