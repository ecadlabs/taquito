import { Context } from '../../src/context';
import { DelegationWalletOperation, WalletOperation } from '../../src/wallet';
import { rxSandbox } from 'rx-sandbox';
import { defer } from 'rxjs';
import { createNewPollingBasedHeadObservable } from '../../src/wallet/operation-factory';
import { distinctUntilKeyChanged, switchMap } from 'rxjs/operators';

describe('Wallet Delegation Operation', () => {
  const opHashForReveal = 'opDG6pEwoEE69vFBJWiHCj3AU7uZGDr7EXNr97hY83CMcme1DcF';
  const opHashForDelegation = 'op9k2niDDeAc72cTKiFgDBxSiPwBb6YM5zpvNTXVNW8BmeCwprT';

  const createFakeBlock = (level: number) => ({ hash: `test_${level}` });
  const { cold, scheduler } = rxSandbox.create();
  const timer = cold<number>('a-b');

  const blocks = [cold('(a|)', { a: createFakeBlock(0) }), cold('(a|)', { a: createFakeBlock(1) })];

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

  it('Verify that DelegationWalletOperation is instantiable', () => {
    expect(new DelegationWalletOperation(opHashForReveal, new Context('url'), obs)).toBeInstanceOf(
      WalletOperation
    );
  });

  it('Should return operation contents for reveal operation ', async () => {
    const delegationOperation = new DelegationWalletOperation(
      opHashForReveal,
      new Context('url'),
      obs
    );

    expect(delegationOperation.revealOperation()).toBeInstanceOf(Promise);
    expect(delegationOperation.revealOperation()).toBeDefined;
    expect(typeof delegationOperation.revealOperation()).toEqual('object');

    const result = delegationOperation.operationResults();
    expect(result).toBeInstanceOf(Promise);
  });

  it('Should return operation contents for delegation operation ', async () => {
    const delegationOperation = new DelegationWalletOperation(
      opHashForDelegation,
      new Context('url'),
      obs
    );

    expect(delegationOperation.delegationOperation()).toBeInstanceOf(Promise);
    expect(delegationOperation.delegationOperation()).toBeDefined;
    expect(typeof delegationOperation.delegationOperation()).toEqual('object');
    const result = delegationOperation.operationResults();
    expect(result).toBeInstanceOf(Promise);
  });

  it('Should return operation status', async () => {
    const delegationOperation = new DelegationWalletOperation(
      opHashForDelegation,
      new Context('url'),
      obs
    );

    expect(delegationOperation.status()).toBeInstanceOf(Promise);
    expect(delegationOperation.status()).toBeDefined;
    expect(typeof delegationOperation.status()).toEqual('object');
  });
});
