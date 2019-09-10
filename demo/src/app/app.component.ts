import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { TezosService } from './tezos.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'demo';

  public loading$ = combineLatest(this.tezos.blockLoading$, this.tezos.addressLoading$).pipe(map(([block, address]) => block || address));

  constructor(private tezos: TezosService) { }
}
