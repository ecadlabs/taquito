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
      try {
        const contract = await this.taquito.contract.at(address);

        console.log(contract.methods);
        console.log(JSON.stringify(contract.methods));

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

  public setNetwork(url: string) {
    console.log(url);
    this.taquito.setProvider({ rpc: url });
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

  public originate() {
    return this.taquito.contract.originate({
      balance: '1',
      code: `parameter string;
    storage string;
    code {CAR;
          PUSH string "Hello ";
          CONCAT;
          NIL operation; PAIR};
    `,
      init: `"test"`,
      fee: 30000,
      storageLimit: 2000,
      gasLimit: 90000,
    });
  }
}
