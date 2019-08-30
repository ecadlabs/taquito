import { Component, OnInit } from '@angular/core';
import { TezosService } from '../tezos.service';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'tz-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  public addressInput = new FormControl(this.tezos.getAddress());
  public autoRefreshToggle = new FormControl(true);

  public head$ = this.tezos.latestHead$;

  public addressDetail$ = this.tezos.addressDetail$;

  constructor(private tezos: TezosService) { }

  ngOnInit() {
    this.addressDetail$.subscribe(({ address }) => {
      this.addressInput.patchValue(address, { emitEvent: false })
    })

    combineLatest(
      this.addressInput.valueChanges.pipe(startWith(this.addressInput.value)),
      this.head$.pipe(
        filter(() => {
          return this.autoRefreshToggle.value;
        })
      ))
      .subscribe(([value, _toggle]) => {
        this.tezos.setAddress(value);
      })
  }

}
