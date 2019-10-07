import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Network } from '../../models/network.model';

@Component({
  selector: 'tz-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  public Network = Network;

  @Input()
  public network = Network.Alphanet;

  @Input()
  public contract = '';

  @Output()
  public search: EventEmitter<any> = new EventEmitter();

  public findContract;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.findContract = this.fb.group({
      network: [this.network, Validators.required],
      contract: [this.contract, Validators.required],
    });
  }
}
