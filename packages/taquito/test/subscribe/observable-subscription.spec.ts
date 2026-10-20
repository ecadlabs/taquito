import { defer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { ObservableSubscription } from '../../src/subscribe/observable-subscription';

describe('Observable subscription test', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toMatchObject(expected);
    });
  });

  it('the observable emits 3 data', async () => {
    testScheduler.run(({ cold, flush }) => {
      const stub = vi.fn();
      const observable$ = cold('a-b-c');
      const subscriber = new ObservableSubscription(observable$, true);
      subscriber.on('data', stub);

      flush();

      expect(stub).toBeCalledTimes(3);
    });
  });

  it('the observable retries on error when the property "shouldRetry" is set to true', async () => {
    testScheduler.run(({ cold, flush }) => {
      const stub = vi.fn();
      const errStub = vi.fn();
      const value = ['a-#', 'b-#', 'c'];
      let i = 0;
      const observable$ = defer(() => {
        return cold(value[i++]);
      });
      const subscriber = new ObservableSubscription(observable$, true);
      subscriber.on('data', stub);
      subscriber.on('error', errStub);

      flush();

      expect(stub).toBeCalledTimes(3);
      expect(errStub).toBeCalledTimes(2);
    });
  });

  it('the observable does not retry on error when the property "shouldRetry" is set to false', async () => {
    testScheduler.run(({ cold, flush }) => {
      const stub = vi.fn();
      const errStub = vi.fn();
      const value = ['a-#', 'b-#', 'c'];
      let i = 0;
      const observable$ = defer(() => {
        return cold(value[i++]);
      });
      const subscriber = new ObservableSubscription(observable$, false);
      subscriber.on('data', stub);
      subscriber.on('error', errStub);

      flush();

      expect(stub).toBeCalledTimes(1);
      expect(errStub).toBeCalledTimes(1);
    });
  });

  it('notifies errorListeners without duplicates when a bounded retry(2) exhausts', () => {
    testScheduler.run(({ cold, flush }) => {
      const errStub = vi.fn();
      let subscriptions = 0;
      const err1 = new Error('attempt 1');
      const err2 = new Error('attempt 2');
      const err3 = new Error('attempt 3');
      const errors = [err1, err2, err3];
      const observable$ = defer(() => {
        const err = errors[subscriptions++];
        return cold('#', undefined, err);
      });
      const subscriber = new ObservableSubscription(observable$, true, retry(2));
      subscriber.on('error', errStub);

      flush();

      expect(subscriptions).toBe(3);
      expect(errStub).toHaveBeenCalledTimes(3);
      expect(errStub.mock.calls.map(([e]) => e)).toEqual([err1, err2, err3]);
    });
  });

  it('stops retrying when close() is called inside an error listener', () => {
    testScheduler.run(({ cold, flush }) => {
      const dataStub = vi.fn();
      const errStub = vi.fn();
      const closeStub = vi.fn();
      let subscriptions = 0;
      const observable$ = defer(() => {
        subscriptions++;
        return subscriptions === 1 ? cold('#', undefined, new Error('fail 1')) : cold('a');
      });
      const subscriber = new ObservableSubscription(observable$, true);
      subscriber.on('data', dataStub);
      subscriber.on('close', closeStub);
      subscriber.on('error', (err) => {
        errStub(err);
        subscriber.close();
      });

      flush();

      expect(subscriptions).toBe(1);
      expect(errStub).toHaveBeenCalledTimes(1);
      expect(closeStub).toHaveBeenCalledTimes(1);
      expect(dataStub).not.toHaveBeenCalled();
    });
  });

  it('notifies close listeners when close() is called explicitly', () => {
    testScheduler.run(({ cold, flush }) => {
      const dataStub = vi.fn();
      const closeStub = vi.fn();
      const observable$ = cold('a-b-c');
      const subscriber = new ObservableSubscription(observable$, true);
      subscriber.on('data', (val) => {
        dataStub(val);
        subscriber.close();
      });
      subscriber.on('close', closeStub);

      flush();

      expect(dataStub).toHaveBeenCalledTimes(1);
      expect(closeStub).toHaveBeenCalledTimes(1);
    });
  });
});
