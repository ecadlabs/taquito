import { CONFIGS } from "./config";
import { delay, retryWhen, tap, scan } from 'rxjs/operators';
CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test account delegation with estimation using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    it(rpc+'Test custom retry logic with an invalid RPC URL', async (done) => {
        const provider = 'https://api.tez.ie/rpc/notValid';

        let attemptCount = 0;
        Tezos.setProvider({ rpc: provider, config: { shouldObservableSubscriptionRetry: true, observableSubscriptionRetryFunction: 
            retryWhen(error =>
                error.pipe(
                scan((acc, error) => {
                    if (acc >= 2) throw error;
                    console.log("attempt " + acc);
                    attemptCount++;
                    return acc + 1;
                }, 1),
                delay(3000),
                tap(() => {console.log("Retrying ...");})
                )
            )}
        });

        const bakerEndorsementFilter = {
        and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'endorsement' }]
        }
        const bakerDelegation = {
        and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
        }
        const sub = Tezos.stream.subscribeOperation({
        or: [bakerEndorsementFilter, bakerDelegation]
        })
        //console.log(sub);
        //expect(attemptCount).toEqual(1);
        //sub.on('data', )
        done();
    });
  });
})