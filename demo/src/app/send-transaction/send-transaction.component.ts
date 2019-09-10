import { Component, OnInit } from '@angular/core';
import { TezosService } from '../tezos.service';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'tz-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss']
})
export class SendTransactionComponent implements OnInit {

  public address$ = this.tezos.signingAddress$;
  public txs = this.tezos.transactions;

  public formGroup = this._fb.group({
    'to': [''],
    'amount': ['100'],
  })

  constructor(
    private tezos: TezosService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  async send() {
    try {
      await this.tezos.sendTransaction(this.formGroup.value)
    } catch (ex) {
      console.error(ex)
    }
  }


  public chooseSigner() {
    this.tezos.activateSigner();
  }
}
