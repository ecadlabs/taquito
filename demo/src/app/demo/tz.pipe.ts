import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js'
BigNumber.config({ DECIMAL_PLACES: 2 })

@Pipe({
  name: 'tz'
})
export class TzPipe implements PipeTransform {

  transform(amount: any, ...args: any[]): any {
    const bigNum = new BigNumber(amount);
    if (bigNum.isNaN()) {
      return amount;
    }

    return `${new BigNumber(amount).div(Math.pow(10, 6)).toString()} ꜩ`;
  }

}
