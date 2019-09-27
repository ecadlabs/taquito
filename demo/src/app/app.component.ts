import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TaquitoService } from './taquito.service';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Taquito Demo';

  public loading$ = this.taquito.loading$;

  constructor(private taquito: TaquitoService, private router: Router) {}

  ngOnInit() {}

  onSearch(contract) {
    this.router.navigate([contract]);
  }
}
