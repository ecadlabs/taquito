import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private contracts = [
    '/alphanet/KT1WhouvVKZFH94VXj9pa8v4szvfrBwXoBUj',
    '/alphanet/KT1FU74GimCeEVRAEZGURb6TWU8jK1N6zFJy',
  ];

  constructor(private router: Router) {}

  onSearch(event) {
    this.router.navigate([event.network, event.contract]).catch(console.error);
  }

  onPickRandom() {
    const i = Math.floor(Math.random() * Math.floor(this.contracts.length));
    this.router.navigateByUrl(this.contracts[i]).catch(console.error);
  }
}
