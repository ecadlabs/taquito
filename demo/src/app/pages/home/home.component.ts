import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NetworkSelectService } from 'src/app/components/network-select/network-select.service';
import { Network } from 'src/app/models/network.model';

@Component({
  selector: 'tz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private contracts = {
    [Network.Alphanet]: [
      '/alphanet/KT1WhouvVKZFH94VXj9pa8v4szvfrBwXoBUj',
      '/alphanet/KT1FU74GimCeEVRAEZGURb6TWU8jK1N6zFJy',
    ],
    [Network.Babylonnet]: [
      '/babylonnet/KT1X4QG7UErqXL2BEW5HSnBF4ZFs1nmsiDR8',
      '/babylonnet/KT1PFP1aviGALwHT9GbSHywv3rYUW1uNexdM',
    ],
    [Network.Mainnet]: [
      '/mainnet/KT1GgUJwMQoFayRYNwamRAYCvHBLzgorLoGo',
      '/mainnet/KT1Q1kfbvzteafLvnGz92DGvkdypXfTGfEA3',
    ],
  };

  public disableNewContractButton$ = this.networkSelect.selectedNetwork$.pipe(
    map(network => network !== Network.Babylonnet)
  );

  private network;

  constructor(private networkSelect: NetworkSelectService, private router: Router) {}

  ngOnInit() {
    this.networkSelect.selectedNetwork$.subscribe(network => (this.network = network));
  }

  onNewContract() {
    this.router.navigate(['new']).catch(console.error);
  }

  onSearch(event) {
    this.router.navigate([this.network, event.contract]).catch(console.error);
  }

  onPickRandom() {
    const contracts = this.contracts[this.network];
    const i = Math.floor(Math.random() * Math.floor(contracts.length));
    this.router.navigateByUrl(contracts[i]).catch(console.error);
  }
}
