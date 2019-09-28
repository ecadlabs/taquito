import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Network, TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.scss'],
})
export class NewContractComponent implements OnInit, OnDestroy {
  private sampleCode = `parameter string;
storage string;

code {
  CAR;
  PUSH string "Hello ";
  CONCAT;
  NIL operation;
  PAIR
};
`;

  public network$ = this.taquito.network$.pipe(
    map(network => (network === Network.Alphanet ? 'Alphanet' : 'Mainnet'))
  );

  public newContract = this.fb.group({
    code: [this.sampleCode, Validators.required],
    init: ['"world"', Validators.required],
    balance: [1],
    fee: [30000],
    gasLimit: [90000],
    storageLimit: [2000],
    delegate: [''],
    delegatable: [false],
    spendable: [false],
  });

  public aceOptions = {
    printMargin: false,
  };

  public error$ = new Subject();

  public deploying$ = new BehaviorSubject<boolean>(false);
  private subscriptions = new Subscription();

  constructor(private taquito: TaquitoService, private fb: FormBuilder) {}

  ngOnInit() {
    this.taquito
      .importFaucetKey()
      .then(_ => console.log('Successfully imported Faucet key.'))
      .catch(error => console.log(error));

    this.subscriptions.add(
      this.deploying$.subscribe(deploying => {
        deploying ? this.newContract.disable() : this.newContract.enable();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  displaySuccess() {
    console.log('here');
    this.deploying$.next(false);
    this.error$.next(null);
  }

  displayError(error) {
    this.deploying$.next(false);
    this.error$.next(error.body.length === 0 ? 'Unable to fulfill the request.' : error.body);
  }

  onDeploy() {
    this.deploying$.next(true);

    this.taquito
      .originate(this.newContract.value)
      .then(op => op.contract())
      .then(contract => this.displaySuccess())
      .catch(error => this.displayError(error));
  }
}
