import { TezosToolkit, OpKind, DetachedBatchParams } from '../../src/taquito';

function publicTypeChecks(tezos: TezosToolkit, pkh: string) {
  const workflow = tezos.prepareFor({ pkh });
  const batch: DetachedBatchParams[] = [{ kind: OpKind.TRANSACTION, to: pkh, amount: 1 }];
  workflow.prepare.batch(batch);
  // @ts-expect-error Activation is not a detached manager operation.
  workflow.prepare.batch([{ kind: OpKind.ACTIVATION, pkh, secret: '' }]);
  // @ts-expect-error Explicit reveal batches are outside this workflow.
  workflow.prepare.batch([{ kind: OpKind.REVEAL }]);
  // @ts-expect-error Rollup support is not exposed in this first contribution.
  workflow.prepare.batch([{ kind: OpKind.SMART_ROLLUP_ADD_MESSAGES, message: [] }]);
  // @ts-expect-error Legacy signer-dependent conversion is not exposed.
  workflow.prepare.toPreapply({});
}
void publicTypeChecks;
