import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@taquito/taquito';
import { OriginateParams } from '@taquito/taquito/dist/types/operations/types';
import { BehaviorSubject, Subject } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

export enum Network {
  Alphanet = 'https://tezos-dev.cryptonomic-infra.tech',
  Mainnet = 'https://rpc.tezrpc.me',
}

export namespace Network {
  export function valueOf(value: string): Network {
    return Network[value.charAt(0).toUpperCase() + value.slice(1)];
  }

  //
  // TODO This is a hacky way to get network name. Invesigate a better way to do this,
  // similar to the way enums work in Java.
  //
  export function getNetwork(url: string) {
    return {
      'https://tezos-dev.cryptonomic-infra.tech': 'alphanet',
      'https://rpc.tezrpc.me': 'mainnet',
    }[url];
  }
}

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  private currentContract$ = new Subject<string>();

  public loading$ = new BehaviorSubject<boolean>(false);

  public network$ = new Subject<Network>();

  public contract$ = this.currentContract$.pipe(
    tap(_ => this.loading$.next(true)),
    switchMap(async address => {
      try {
        const contract = await this.taquito.contract.at(address);

        return {
          account: await this.taquito.rpc.getContract(address),
          storage: await contract.storage(),
          getstorage: await this.taquito.contract.getStorage(address),
          script: contract.script,
        };
      } catch (error) {
        console.log(error);
      }

      return null;
    }),
    tap(_ => this.loading$.next(false)),
    shareReplay()
  );

  public setContract(address: string) {
    this.currentContract$.next(address);
  }

  public setNetwork(network: Network) {
    this.network$.next(network);
    this.taquito.setProvider({ rpc: network });
  }

  public importFaucetKey() {
    const key = {
      mnemonic: [
        'charge',
        'behave',
        'venue',
        'fury',
        'crush',
        'this',
        'emotion',
        'reveal',
        'trouble',
        'wool',
        'foot',
        'have',
        'unfold',
        'twelve',
        'repair',
      ],
      secret: 'f6ef5ff55f4f1c8830e4facfb6e0a5619b449e38',
      amount: '9208243097',
      pkh: 'tz1eZgLWUtgym349zZjN2QxLVQ8bBAYBTVSr',
      password: 'VNoPz9wgeC',
      email: 'htxvbowa.fmjdvhem@tezos.example.org',
    };

    return this.taquito.importKey(key.email, key.password, key.mnemonic.join(' '), key.secret);
  }

  public originate(contract: OriginateParams) {
    return this.taquito.contract.originate(contract);
  }
}
