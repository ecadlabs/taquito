import { Component, OnInit } from '@angular/core';

import { TaquitoService } from './taquito.service';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Tezos TS Demo';

  // public loading$ = combineLatest(this.tezos.blockLoading$, this.tezos.addressLoading$).pipe(
  //   map(([block, address]) => block || address)
  // );

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {}

  onSearch(event) {
    this.taquito.setNetwork(event.network);

    this.taquito.getContract(event.contract).then(contract => console.log(contract));

    console.log(event);
  }
}
