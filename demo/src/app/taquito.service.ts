import { Injectable } from '@angular/core';
import { Tezos, TezosToolkit } from '@taquito/taquito';
import { OriginateParams } from '@taquito/taquito/dist/types/operations/types';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  private taquito: TezosToolkit = Tezos;

  public async getContract(address: string) {
    const contract = await this.taquito.contract.at(address);

    return {
      account: await this.taquito.rpc.getContract(address),
      storage: await contract.storage(),
      script: contract.script,
    };
  }

  public setNetwork(url: string) {
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

  public originate(contract: OriginateParams) {
    return this.taquito.contract.originate(contract);
  }
}
