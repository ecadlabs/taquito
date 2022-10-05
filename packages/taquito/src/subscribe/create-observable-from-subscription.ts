import { BlockResponse } from '@taquito/rpc';
import { Observable } from 'rxjs';
import { OperationContent, Subscription } from './interface';

export function createObservableFromSubscription<
  T extends BlockResponse | string | OperationContent
>(sub: Subscription<T>) {
  return new Observable<T>((subscriber) => {
    sub.on('data', (data: T) => {
      subscriber.next(data);
    });

    sub.on('error', (error: Error) => {
      subscriber.error(error);
    });

    sub.on('close', () => {
      subscriber.complete();
    });

    return () => {
      sub.close();
    };
  });
}
