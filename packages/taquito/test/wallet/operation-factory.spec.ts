import { rxSandbox } from 'rx-sandbox';
import { defer } from 'rxjs';
import { Context } from '../../src/context';
import {
  createNewPollingBasedHeadObservable,
  cacheUntil,
} from '../../src/wallet/operation-factory';
import { switchMap } from 'rxjs/operators';
describe('createNewPollingBasedHeadObservable', () => {
  const createFakeBlock = (level: number) => ({ hash: `test_${level}` });

  it('Should resolve give a new head each time it polls', async (done) => {
    const { cold, flush, scheduler, getMessages, e, advanceTo, s } = rxSandbox.create();
    const timer = cold<number>('a-b');

    const blocks = [
      cold('(a|)', { a: createFakeBlock(0) }),
      cold('(a|)', { a: createFakeBlock(1) }),
    ];

    let currentBlock = 0;

    const blockObs = defer(() => {
      return blocks[currentBlock++];
    });

    const obs = createNewPollingBasedHeadObservable(
      timer,
      blockObs as any,
      new Context('url'),
      scheduler
    );

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

    const blockObs = defer(() => {
      return blocks[currentBlock++];
    });

    const obs = createNewPollingBasedHeadObservable(
      timer,
      blockObs as any,
      new Context('url'),
      scheduler
    );

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

describe('Cache until operator', () => {
  it('should subscribe to source and replay the last value until cacheInvalidator emits', async (done) => {
    const { cold, flush, hot, getMessages, e, s } = rxSandbox.create();
    const vals = [cold('a'), cold('b'), cold('c'), cold('d')];

    let currentVals = 0;

    const source = defer(() => {
      return vals[currentVals++];
    });

    const cacheInvalidator = hot('^--a---------');
    const poller = cold('ab-c------d--');

    const cachedSource = source.pipe(cacheUntil(cacheInvalidator));

    const obs = poller.pipe(
      switchMap(() => {
        return cachedSource;
      })
    );

    const messages = getMessages(obs);
    flush();

    expect(messages).toEqual(e('aa-b------b--'));
    expect(vals[0].subscriptions).toEqual([s('(^!)--')]);
    expect(vals[1].subscriptions).toEqual([s('---(^!)')]);
    expect(vals[2].subscriptions).toEqual([]);
    expect(vals[3].subscriptions).toEqual([]);

    done();
  });
});
