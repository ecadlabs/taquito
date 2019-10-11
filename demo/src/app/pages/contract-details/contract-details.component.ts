import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, from, of, Subject } from 'rxjs';
import { catchError, pluck, switchMap, tap } from 'rxjs/operators';
import { NetworkSelectService } from 'src/app/components/network-select/network-select.service';

import { TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
})
export class ContractDetailsComponent implements OnInit {
  private networkFromUrl$ = this.route.data.pipe(pluck('network'));
  public contractAddressFromUrl$ = this.route.params.pipe(pluck('contract'));

  public loading$ = new BehaviorSubject<boolean>(true);
  public error$ = new Subject();
  public network;

  public contract$ = combineLatest([this.networkFromUrl$, this.contractAddressFromUrl$]).pipe(
    switchMap(([network, contract]) => {
      this.error$.next(null);
      this.loading$.next(true);

      this.taquito.setNetwork(network);

      return from(this.taquito.getContract(contract)).pipe(
        catchError(error => {
          this.error$.next(error);
          return of(null);
        })
      );
    }),
    tap(contract => {
      this.loading$.next(false);
    })
  );

  constructor(
    private networkSelect: NetworkSelectService,
    private taquito: TaquitoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.networkSelect.selectedNetwork$.subscribe(network => (this.network = network));
  }

  onSearch(event) {
    this.router.navigate([this.network, event.contract]).catch(console.error);
  }
}
