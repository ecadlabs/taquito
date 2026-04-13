import { describe, expect, it } from 'vitest';
import {
  docsLiveCodeFixtures,
  fixturePlaceholderToken,
  inferLiveCodeRuntime,
  replaceLiveCodeFixturePlaceholders,
} from '../src/utils/live-code.mjs';

describe('replaceLiveCodeFixturePlaceholders', () => {
  it('replaces known fixture placeholders in live code snippets', () => {
    const source = `const contractAddress = '${fixturePlaceholderToken('tzip12OffChainViewContract')}';`;

    expect(replaceLiveCodeFixturePlaceholders(source)).toBe(
      `const contractAddress = '${docsLiveCodeFixtures.tzip12OffChainViewContract}';`
    );
  });

  it('leaves non-placeholder text unchanged', () => {
    const source = `const contractAddress = 'KT1existing';`;

    expect(replaceLiveCodeFixturePlaceholders(source)).toBe(source);
  });
});

describe('inferLiveCodeRuntime', () => {
  it('keeps read-only snippets free of signer bootstrapping', () => {
    expect(
      inferLiveCodeRuntime({
        code: `const balance = await Tezos.tz.getBalance('tz1abc');`,
      })
    ).toEqual({
      interactionMode: 'standard',
      signerMode: 'none',
    });
  });

  it('marks operation-sending snippets as needing a fresh signer', () => {
    expect(
      inferLiveCodeRuntime({
        code: `const op = await contract.methodsObject.increment(7).send();`,
      })
    ).toEqual({
      interactionMode: 'standard',
      signerMode: 'fresh',
    });
  });

  it('marks multiline contract originations as needing a fresh signer', () => {
    expect(
      inferLiveCodeRuntime({
        code: `const contractOriginated = await Tezos.contract
  .originate({
    code: contractMapTacoShop,
    storage: storageMap,
  });`,
      })
    ).toEqual({
      interactionMode: 'standard',
      signerMode: 'fresh',
    });
  });

  it('does not auto-configure snippets that manage their own signer', () => {
    expect(
      inferLiveCodeRuntime({
        code: `await configureSigner({ fresh: true }); const op = await Tezos.contract.transfer({ to: 'tz1abc', amount: 1 });`,
      })
    ).toEqual({
      interactionMode: 'standard',
      signerMode: 'none',
    });
  });

  it('keeps wallet examples in beacon mode', () => {
    expect(
      inferLiveCodeRuntime({
        code: `const op = await Tezos.wallet.transfer({ to: 'tz1abc', amount: 1 }).send();`,
        isWallet: true,
      })
    ).toEqual({
      interactionMode: 'beacon',
      signerMode: 'none',
    });
  });

  it('detects walletconnect and ledger flows as external interactions', () => {
    expect(
      inferLiveCodeRuntime({
        code: `const walletConnect = await WalletConnect.init({ projectId: 'x' });`,
      })
    ).toEqual({
      interactionMode: 'walletconnect',
      signerMode: 'none',
    });

    expect(
      inferLiveCodeRuntime({
        code: `const transport = await TransportWebHID.create(); const signer = new LedgerSigner(transport);`,
      })
    ).toEqual({
      interactionMode: 'ledger',
      signerMode: 'none',
    });
  });
});
