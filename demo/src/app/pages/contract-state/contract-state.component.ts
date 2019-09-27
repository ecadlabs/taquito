import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';

import { TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-contract-state',
  templateUrl: './contract-state.component.html',
  styleUrls: ['./contract-state.component.scss'],
})
export class ContractStateComponent implements OnInit {
  public contractAddress$ = this.route.params.pipe(pluck('contract'));
  public loading$ = this.taquito.loading$;
  public contract$ = this.taquito.contract$;

  constructor(private taquito: TaquitoService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.contractAddress$.subscribe(address => {
      this.taquito.setContract(address);
    });
  }
}
