import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject, throwError } from 'rxjs';
import { catchError, pluck, switchMap, tap } from 'rxjs/operators';
import { Network } from 'src/app/models/network.model';

import { TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
})
export class ContractDetailsComponent {
  public contractAddress$ = this.route.params.pipe(pluck('contract'));
  public network$ = this.route.data.pipe(pluck('network'));

  public loading$ = new BehaviorSubject<boolean>(true);
  public error$ = new Subject();

  public contract$ = combineLatest([this.network$, this.contractAddress$]).pipe(
    switchMap(([network, contract]) => {
      this.taquito.setNetwork(Network.getUrl(network));
      return this.taquito.getContract(contract);
    }),
    catchError(error => {
      this.error$.next(error);
      this.loading$.next(false);

      return throwError(error);
    }),
    tap(_ => this.loading$.next(false))
  );

  constructor(
    private taquito: TaquitoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSearch(event) {
    this.router.navigate([event.network, event.contract]).catch(console.error);
  }
}
