import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { TaquitoService } from 'src/app/taquito.service';

import { Signer } from '../../models/signer.model';

@Component({
  selector: 'tz-signer-select',
  templateUrl: './signer-select.component.html',
  styleUrls: ['./signer-select.component.scss'],
})
export class SignerSelectComponent implements OnInit {
  public Signer = Signer;
  public importing$ = new Subject();
  public signer;

  @Output()
  public error: EventEmitter<any> = new EventEmitter();

  constructor(private taquito: TaquitoService) {}

  ngOnInit() {
    this.selectTezBridgeSigner();
  }

  onReadFile(file) {
    const fileReader = new FileReader();

    fileReader.onload = _ => {
      this.importing$.next(true);

      const key = JSON.parse(fileReader.result.toString());

      this.taquito
        .importFaucetKey(key)
        .then(_ => (this.signer = Signer.Faucet))
        .catch(error => {
          this.importing$.next(false);

          this.error.emit(
            error.body && error.body.length !== 0
              ? error
              : { body: 'Unable to import selected faucet key.' }
          );
        });
    };

    fileReader.onerror = _ => {
      fileReader.abort();
      this.error.emit(fileReader.error.message);
    };

    fileReader.readAsText(file);
  }

  selectTezBridgeSigner() {
    this.taquito.selectTezBridgeSigner();
    this.signer = Signer.TezBridge;
  }
}
