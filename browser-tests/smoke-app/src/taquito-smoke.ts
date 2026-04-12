import { setSmokeResult, toErrorResult } from './smoke-shared';

declare const __RAW_TAQUITO_URL__: string;

setSmokeResult({ status: 'loading' });

void (async () => {
  try {
    const { MichelsonMap, OpKind, TezosToolkit } = await import(/* @vite-ignore */ __RAW_TAQUITO_URL__);
    const tezos = new TezosToolkit('https://example.invalid');
    const map = new MichelsonMap();

    setSmokeResult({
      status: 'ok',
      exports: ['TezosToolkit', 'MichelsonMap', 'OpKind'],
      summary: {
        toolkitType: typeof tezos,
        mapSize: map.size,
        transactionKind: OpKind.TRANSACTION,
      },
    });
  } catch (error) {
    setSmokeResult(toErrorResult(error));
  }
})();
