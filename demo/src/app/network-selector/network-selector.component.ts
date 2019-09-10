import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TezosService } from '../tezos.service';

@Component({
  selector: 'tz-network-selector',
  templateUrl: './network-selector.component.html',
  styleUrls: ['./network-selector.component.scss']
})
export class NetworkSelectorComponent implements OnInit {

  public networkSelect = new FormControl('https://alphanet-node.tzscan.io');

  constructor(
    private tezos: TezosService
  ) { }

  ngOnInit() {
    this.networkSelect.valueChanges.subscribe((val) => {
      this.tezos.setNetwork(val);
    })
  }

}
