import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@taquito/taquito';
import { Subject } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  private currentContract$ = new Subject<string>();

  public loading$ = new Subject<boolean>();

  public contract$ = this.currentContract$.pipe(
    tap(_ => this.loading$.next(true)),
    switchMap(async address => {
      let contract = null;
      let storage = null;

      try {
        contract = await this.taquito.contract.at(address);
        console.log(`contract ${JSON.stringify(contract)}`);

        storage = await contract.storage();
        console.log(`storage ${JSON.stringify(storage)}`);
      } catch (error) {
        console.log(`error ${JSON.stringify(error)}`);
      }

      return contract;
    }),
    tap(_ => this.loading$.next(false)),
    shareReplay()
  );

  public setContract(address: string) {
    return this.currentContract$.next(address);
  }

  public setNetwork(url: string) {
    this.taquito.setProvider({ rpc: url });
  }
}
