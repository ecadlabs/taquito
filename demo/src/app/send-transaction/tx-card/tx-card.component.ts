import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tz-tx-card',
  templateUrl: './tx-card.component.html',
  styleUrls: ['./tx-card.component.scss']
})
export class TxCardComponent implements OnInit {

  @Input()
  tx

  constructor() { }

  ngOnInit() {
  }

}
