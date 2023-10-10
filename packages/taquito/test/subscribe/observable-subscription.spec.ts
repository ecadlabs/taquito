import { defer } from 'rxjs';
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
      const stub = jest.fn();
      const observable$ = cold('a-b-c');
      const subscriber = new ObservableSubscription(observable$, true);
      subscriber.on('data', stub);

      flush();

      expect(stub).toBeCalledTimes(3);
    });
  });

  it('the observable retries on error when the property "shouldRetry" is set to true', async () => {
    testScheduler.run(({ cold, flush }) => {
      const stub = jest.fn();
      const errStub = jest.fn();
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
      const stub = jest.fn();
      const errStub = jest.fn();
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
});
