import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaquitoService } from 'src/app/taquito.service';

@Component({
  selector: 'tz-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss'],
})
export class NetworkSelectComponent implements OnInit, OnDestroy {
  public network = new FormControl('', Validators.required);

  private subscriptions = new Subscription();

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.network.valueChanges.subscribe(value => this.taquito.setNetwork(value))
    );

    this.network.patchValue('https://tezos-dev.cryptonomic-infra.tech');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
