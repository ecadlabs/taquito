import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

import { TaquitoService } from '../taquito.service';

@Component({
  selector: 'tz-contract-state-card',
  templateUrl: './contract-state-card.component.html',
  styleUrls: ['./contract-state-card.component.scss'],
})
export class ContractStateCardComponent implements OnInit {
  public loading$ = this.taquito.loading$;
  public contract$ = this.taquito.contract$.pipe(
    tap(contract => console.log(`contract card ${JSON.stringify(contract)}`))
  );

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {}
}
