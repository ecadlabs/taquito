import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'tz-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  public contract = new FormControl('', Validators.required);

  @Output()
  public search: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
