import { Pipe, PipeTransform } from '@angular/core';
import { Tezos } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'tz',
})
export class TzPipe implements PipeTransform {
  transform(amount: any, ...args: any[]): any {
    const bigNum = new BigNumber(amount);
    if (bigNum.isNaN()) {
      return amount;
    }

    return `${new BigNumber(Tezos.format('mutez', 'tz', amount)).toFixed(2)} ꜩ`;
  }
}
