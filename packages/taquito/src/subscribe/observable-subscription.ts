/* eslint-disable no-dupe-class-members */
import { Observable, Subject, NEVER, OperatorFunction } from 'rxjs';
import { Subscription } from './interface';
import { takeUntil, tap, catchError, retry } from 'rxjs/operators';

/**
 *  @category Error
 *  @description Error that indicates an unsupported event being passed or used
 */
export class UnsupportedEventError extends Error {
  public name = 'UnsupportedEventError';
  constructor(public message: string) {
    super(message);
  }
}
export class ObservableSubscription<T> implements Subscription<T> {
  private errorListeners: Array<(error: Error) => void> = [];
  private messageListeners: Array<(data: T) => void> = [];
  private closeListeners: Array<() => void> = [];
  private completed$ = new Subject();

  constructor(
    obs: Observable<T>,
    private shouldRetry: boolean = false,
    private operatorFunction: OperatorFunction<T, T> = retry<T>()
  ) {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        throw new UnsupportedEventError(`Trying to register on an unsupported event: ${type}`);
    }
  }

  public off(type: 'error', cb: (error: Error) => void): void;
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
        throw new UnsupportedEventError(`Trying to unregister on an unsupported event: ${type}`);
    }
  }

  public close() {
    this.completed$.next();
  }
}
