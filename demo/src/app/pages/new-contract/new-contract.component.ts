import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Contract } from '@taquito/taquito/dist/types/contract/contract';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Network } from 'src/app/models/network.model';

import { TaquitoService } from '../../taquito.service';

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

  constructor(private taquito: TaquitoService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.subscriptions.add(
      this.deploying$.subscribe(deploying => {
        deploying ? this.newContract.disable() : this.newContract.enable();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateTo(contract: Contract) {
    this.deploying$.next(false);
    this.error$.next(null);

    this.router.navigate(['alphanet', contract.address]).catch(error => console.log(error));
  }

  displayError(error) {
    console.error(error);

    this.deploying$.next(false);
    this.error$.next(
      error.body && error.body.length !== 0 ? error.body : 'Unable to fulfill the request.'
    );
  }

  onDeploy() {
    this.deploying$.next(true);

    this.taquito.setNetwork(Network.getUrl(Network.Alphanet));

    this.taquito
      .importFaucetKey()
      .then(_ => this.taquito.originate(this.newContract.value))
      .then(op => op.contract())
      .then(contract => this.navigateTo(contract))
      .catch(error => this.displayError(error));
  }
}
