import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { Network, TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-contract-state',
  templateUrl: './contract-state.component.html',
  styleUrls: ['./contract-state.component.scss'],
})
export class ContractStateComponent implements OnInit {
  public contractAddress$ = this.route.params.pipe(pluck('contract'));
  public loading$ = this.taquito.loading$;
  public contract$ = this.taquito.contract$;
  public error$ = this.taquito.errors$;

  public network$ = this.taquito.network$.pipe(
    map(network => (network === Network.Alphanet ? 'Alphanet' : 'Mainnet'))
  );

  private subscriptions = new Subscription();

  constructor(private taquito: TaquitoService, private route: ActivatedRoute) {}

  ngOnInit() {
    // TODO Fix this a hack. Contract needs to be subscribed to before
    // a new contract is set
    this.subscriptions.add(this.contract$.subscribe());

    this.subscriptions.add(
      this.contractAddress$.subscribe(address => {
        this.taquito.setContract(address);
      })
    );
  }

  ngOnDestory() {
    this.subscriptions.unsubscribe();
  }
}
