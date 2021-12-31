import { defer } from 'rxjs';
import { rxSandbox } from 'rx-sandbox';
import { ObservableSubscription } from '../../src/subscribe/observable-subscription';

describe('Observable subscription test', () => {
    it('the observable emits 3 data', async (done) => {
        const { cold, flush } = rxSandbox.create();
        let stub = jest.fn();
        let observable$ = cold('a-b-c');
        const subscriber = new ObservableSubscription(observable$, true);
        subscriber.on('data', stub);

        flush();

        expect(stub).toBeCalledTimes(3);                
        done();
    })

    it('the observable retries on error when the property "shouldRetry" is set to true', async (done) => {
        const { cold, flush } = rxSandbox.create();
        let stub = jest.fn();
        let errStub = jest.fn();
        let value = ['a-#', 'b-#', 'c'];
        let i = 0;
        let observable$ = defer(() => {
            return cold(value[i++])
        });
        const subscriber = new ObservableSubscription(observable$, true);
        subscriber.on('data', stub);
        subscriber.on('error', errStub);

        flush();

        expect(stub).toBeCalledTimes(3);
        expect(errStub).toBeCalledTimes(2);
            
        done();
    })

    it('the observable does not retry on error when the property "shouldRetry" is set to false', async (done) => {
        const { cold, flush } = rxSandbox.create();
        let stub = jest.fn();
        let errStub = jest.fn();
        let value = ['a-#', 'b-#', 'c'];
        let i = 0;
        let observable$ = defer(() => {
            return cold(value[i++])
        });
        const subscriber = new ObservableSubscription(observable$, false);
        subscriber.on('data', stub);
        subscriber.on('error', errStub);

        flush();

        expect(stub).toBeCalledTimes(1);
        expect(errStub).toBeCalledTimes(1);
            
        done();
})

});




