import { Component, OnInit } from '@angular/core';

import { TaquitoService } from './taquito.service';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Tezos TS Demo';

  public loading$ = this.taquito.loading$;

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {}

  onSearch(event) {
    this.taquito.setNetwork(event.network);
    this.taquito.setContract(event.contract);
  }
}
