import { rxSandbox } from 'rx-sandbox';
import { defer } from 'rxjs';
import { Context } from '../../src/context';
import { createNewPollingBasedHeadObservable } from '../../src/wallet/operation-factory';
import { distinctUntilKeyChanged, switchMap } from 'rxjs/operators';
describe('createNewPollingBasedHeadObservable', () => {
  const createFakeBlock = (level: number) => ({ hash: `test_${level}` });

  it('Should give a new head each time it polls', async (done) => {
    const { cold, flush, scheduler, getMessages, e, advanceTo, s } = rxSandbox.create();
    const timer = cold<number>('a-b');

    const blocks = [
      cold('(a|)', { a: createFakeBlock(0) }),
      cold('(a|)', { a: createFakeBlock(1) }),
    ];

    let currentBlock = 0;

    const blockObs = timer.pipe(
      switchMap(() => {
        return defer(() => {
          return blocks[currentBlock++];
        });
      }),
      distinctUntilKeyChanged('hash')
    );

    const obs = createNewPollingBasedHeadObservable(blockObs as any, new Context('url'), scheduler);

    const messages = getMessages(obs);

    advanceTo(0);

    expect(messages).toEqual(e('a', { a: createFakeBlock(0) }));
    expect(blocks[0].subscriptions).toEqual([s('(^!)--')]);
    expect(blocks[1].subscriptions).toEqual([]);

    flush();

    expect(messages).toEqual(e('a-b', { a: createFakeBlock(0), b: createFakeBlock(1) }));
    expect(blocks[0].subscriptions).toEqual([s('(^!)--')]);
    expect(blocks[1].subscriptions).toEqual([s('--(^!)')]);

    done();
  });

  it('Should not emit new head if the hash did not changed', async (done) => {
    const { cold, flush, scheduler, getMessages, e, advanceTo, s } = rxSandbox.create();
    const timer = cold<number>('a-b');

    const blocks = [
      cold('(a|)', { a: createFakeBlock(0) }),
      cold('(a|)', { a: createFakeBlock(0) }),
    ];

    let currentBlock = 0;

    const blockObs = timer.pipe(
      switchMap(() => {
        return defer(() => {
          return blocks[currentBlock++];
        });
      }),
      distinctUntilKeyChanged('hash')
    );

    const obs = createNewPollingBasedHeadObservable(blockObs as any, new Context('url'), scheduler);

    const messages = getMessages(obs);

    advanceTo(0);

    expect(messages).toEqual(e('a', { a: createFakeBlock(0) }));
    expect(blocks[0].subscriptions).toEqual([s('(^!)--')]);

    flush();

    // Should still subscribe to the observable but do not emit anything
    expect(messages).toEqual(e('a', { a: createFakeBlock(0) }));
    expect(blocks[1].subscriptions).toEqual([s('--(^!)')]);

    done();
  });
});
