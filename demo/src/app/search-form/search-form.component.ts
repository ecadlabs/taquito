import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'tz-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  public searchForm = this.fb.group({
    network: ['https://alphanet-node.tzscan.io', Validators.required],
    contract: ['', Validators.required],
  });

  @Output()
  public search: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  onSubmit() {
    this.search.emit(this.searchForm.value);
  }
}
