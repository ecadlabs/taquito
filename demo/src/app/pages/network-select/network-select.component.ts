import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Network, TaquitoService } from 'src/app/taquito.service';

@Component({
  selector: 'tz-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss'],
})
export class NetworkSelectComponent implements OnInit {
  private subscriptions = new Subscription();

  constructor(
    private taquito: TaquitoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.pipe(pluck('network')).subscribe(network => {
      this.taquito.setNetwork(Network.valueOf(network));
    });

    this.taquito.network$.subscribe(network => {
      const path = this.route.snapshot.firstChild.url.reduce(
        (path, url) => `${path}/${url.path}`,
        Network.getNetwork(network)
      );

      this.router.navigateByUrl(path).catch(error => console.log(error));
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
