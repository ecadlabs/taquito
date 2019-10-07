import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TaquitoService } from '../../taquito.service';

@Component({
  selector: 'tz-select-key',
  templateUrl: './select-key.component.html',
  styleUrls: ['./select-key.component.scss'],
})
export class SelectKeyComponent implements OnInit {
  public error$ = new Subject();

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {}
}
