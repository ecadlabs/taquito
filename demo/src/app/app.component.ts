import { Component, OnInit } from '@angular/core';

import { Network } from './models/network.model';
import { TaquitoService } from './taquito.service';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Taquito Demo';

  public network = Network.Babylonnet;

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {
    this.taquito.setNetwork(this.network);
  }
}
