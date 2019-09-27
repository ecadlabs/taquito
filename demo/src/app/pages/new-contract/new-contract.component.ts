import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.scss'],
})
export class NewContractComponent implements OnInit {
  public aceOptions = {
    printMargin: false,
  };

  public newContract = this.fb.group({
    code: ['', Validators.required],
    init: ['', Validators.required],
    balance: [0],
    fee: [0],
    gasLimit: [0],
    storageLimit: [0],
    delegate: [''],
    delegatable: [false],
    spendable: [false],
  });

  constructor(private taquito: TaquitoService, private fb: FormBuilder) {}

  ngOnInit() {
    this.taquito
      .importFaucetKey()
      .then(_ => this.taquito.originate())
      .then(op => op.contract())
      .then(contract => console.log(contract))
      .catch(error => console.log(error));
  }
}
