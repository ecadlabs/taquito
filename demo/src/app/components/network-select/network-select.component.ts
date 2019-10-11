import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaquitoService } from 'src/app/taquito.service';

import { Network } from '../../models/network.model';
import { NetworkSelectService } from './network-select.service';

@Component({
  selector: 'tz-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss'],
})
export class NetworkSelectComponent implements OnInit, OnDestroy {
  public Network = Network;
  public network = new FormControl();

  public networkOptions$ = this.networkSelect.networkOptions$;

  private subscriptions = new Subscription();

  constructor(private networkSelect: NetworkSelectService, private taquito: TaquitoService) {}

  ngOnInit() {
    // Set network from user input
    this.subscriptions.add(
      this.network.valueChanges.subscribe(network => {
        this.taquito.setNetwork(network);
      })
    );

    // Update selection from programmatic input
    this.subscriptions.add(
      this.networkSelect.selectedNetwork$.subscribe(network => {
        this.network.patchValue(network, { emitEvent: false });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
