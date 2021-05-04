import { Observable, Subscription as RXJSSubscription, Subject, NEVER, OperatorFunction } from 'rxjs';
import { Subscription } from './interface';
import { takeUntil, tap, catchError, retry } from 'rxjs/operators';

export class ObservableSubscription<T> implements Subscription<T> {
  private errorListeners: Array<(error: Error) => void> = [];
  private messageListeners: Array<(data: T) => void> = [];
  private closeListeners: Array<() => void> = [];
  private completed$ = new Subject();

  constructor(obs: Observable<T>, 
              private shouldRetry: boolean = false, 
              private operatorFunction: OperatorFunction<T,T> = retry<T>()) {
    
    obs
      .pipe(
        takeUntil(this.completed$),
        tap(
          (data: T) => {
            this.call(this.messageListeners, data);
          },
          (error) => {
            this.call(this.errorListeners, error);
          },
          () => {
            this.call(this.closeListeners);
          }
        ),
        this.shouldRetry ? operatorFunction : tap(),
        catchError(() => NEVER)
      )
      .subscribe();
  }

  private call<K>(listeners: Array<(val: K) => void>, value?: K) {
    for (const l of listeners) {
      try {
        l(value!);
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  private remove(listeners: Array<any>, value: any) {
    const idx = listeners.indexOf(value);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  }

  public on(type: 'error', cb: (error: Error) => void): void;
  // tslint:disable-next-line: unified-signatures
  public on(type: 'data', cb: (data: T) => void): void;
  public on(type: 'close', cb: () => void): void;

  public on(type: 'data' | 'error' | 'close', cb: any): void {
    switch (type) {
      case 'data':
        this.messageListeners.push(cb);
        break;
      case 'error':
        this.errorListeners.push(cb);
        break;
      case 'close':
        this.closeListeners.push(cb);
        break;
      default:
        throw new Error(`Trying to register on an unsupported event: ${type}`);
    }
  }

  public off(type: 'error', cb: (error: Error) => void): void;
  // tslint:disable-next-line: unified-signatures
  public off(type: 'data', cb: (data: T) => void): void;
  public off(type: 'close', cb: () => void): void;

  public off(type: 'data' | 'error' | 'close', cb: any): void {
    switch (type) {
      case 'data':
        this.remove(this.messageListeners, cb);
        break;
      case 'error':
        this.remove(this.errorListeners, cb);
        break;
      case 'close':
        this.remove(this.closeListeners, cb);
        break;
      default:
        throw new Error(`Trying to unregister on an unsupported event: ${type}`);
    }
  }

  public close() {
    this.completed$.next();
  }
}
