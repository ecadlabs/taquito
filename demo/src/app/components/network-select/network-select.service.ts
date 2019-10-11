import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from 'src/app/models/network.model';

@Injectable({
  providedIn: 'root',
})
export class NetworkSelectService {
  public networkOptions$ = new BehaviorSubject([]);
  public selectedNetwork$ = new BehaviorSubject<Network>(null);

  constructor() {
    this.networkOptions$.next(
      Network.values().map(network => ({ network: network, disabled: false }))
    );
  }

  select(network: Network) {
    this.selectedNetwork$.next(network);
  }

  disable(networks: Network[], disable: boolean) {
    this.networkOptions$.next(
      this.networkOptions$.value.map(option =>
        networks.includes(option.network) ? { ...option, disabled: disable } : option
      )
    );
  }
}
