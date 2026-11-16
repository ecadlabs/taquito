import { describe, it, expect } from 'vitest';
import { TezosToolkit } from '../src/taquito';
import {
  first,
  second,
  wallet,
  ReadFixture,
  prepareIdentity,
  deferred,
} from './data/wallet-identity-fixtures';

describe('wallet identity compatibility', () => {
  it.each([
    {
      name: 'an undefined wallet',
      update: (toolkit: TezosToolkit) => toolkit.setWalletProvider(undefined),
    },
    {
      name: 'an empty provider update',
      update: (toolkit: TezosToolkit) => toolkit.setProvider({}),
    },
    {
      name: 'an RPC update',
      update: (toolkit: TezosToolkit) => toolkit.setProvider({ rpc: 'http://127.0.0.1:2' }),
    },
    {
      name: 'a confirmation configuration update',
      update: (toolkit: TezosToolkit) =>
        toolkit.setProvider({ config: { confirmationPollingTimeoutSecond: 120 } }),
    },
  ])('retains cached identities after $name', async ({ update }) => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    const provider = wallet();
    toolkit.setReadProvider(new ReadFixture());
    toolkit.setWalletProvider(provider);
    await Promise.all([toolkit.wallet.pkh(), toolkit.wallet.pk()]);
    await prepareIdentity(toolkit);
    const calls = { pkh: provider.getPKH.mock.calls.length, pk: provider.getPK.mock.calls.length };
    update(toolkit);
    // setProvider may reset its read adapter. Keep subsequent preparation inside this fixture.
    toolkit.setReadProvider(new ReadFixture());
    expect(await Promise.all([toolkit.wallet.pkh(), toolkit.wallet.pk()])).toEqual([
      first.pkh,
      first.pk,
    ]);
    expect((await prepareIdentity(toolkit)).opOb.contents).toMatchObject([
      { source: first.pkh, public_key: first.pk },
    ]);
    expect(provider.getPKH).toHaveBeenCalledTimes(calls.pkh);
    expect(provider.getPK).toHaveBeenCalledTimes(calls.pk);
  });
  it.each(['pkh', 'pk'] satisfies Array<'pkh' | 'pk'>)(
    'retains ordinary %s cache hits and explicit refresh',
    async (method) => {
      const toolkit = new TezosToolkit('http://127.0.0.1:1');
      const provider = wallet();
      toolkit.setWalletProvider(provider);
      const getter = method === 'pkh' ? provider.getPKH : provider.getPK;
      const oldValue = method === 'pkh' ? first.pkh : first.pk;
      const newValue = method === 'pkh' ? second.pkh : second.pk;
      expect(await toolkit.wallet[method]()).toBe(oldValue);
      getter.mockResolvedValue(newValue);
      expect(await toolkit.wallet[method]()).toBe(oldValue);
      expect(getter).toHaveBeenCalledTimes(1);
      expect(await toolkit.wallet[method]({ forceRefetch: true })).toBe(newValue);
      expect(await toolkit.wallet[method]()).toBe(newValue);
      expect(getter).toHaveBeenCalledTimes(2);
    }
  );
  it.each(['pkh', 'pk'] satisfies Array<'pkh' | 'pk'>)(
    'preserves %s cache and error identity after a failed forced refresh',
    async (method) => {
      const toolkit = new TezosToolkit('http://127.0.0.1:1');
      const provider = wallet();
      toolkit.setWalletProvider(provider);
      const getter = method === 'pkh' ? provider.getPKH : provider.getPK;
      const value = method === 'pkh' ? first.pkh : first.pk;
      expect(await toolkit.wallet[method]()).toBe(value);
      const error = new Error('Controlled wallet failure');
      getter.mockRejectedValueOnce(error);
      await expect(toolkit.wallet[method]({ forceRefetch: true })).rejects.toBe(error);
      expect(await toolkit.wallet[method]()).toBe(value);
    }
  );
  it('keeps the cached pair of a pending reveal coherent', async () => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setReadProvider(new ReadFixture());
    toolkit.setWalletProvider(wallet());
    await prepareIdentity(toolkit);
    const pending = prepareIdentity(toolkit);
    toolkit.setWalletProvider(wallet(second));
    expect((await pending).opOb.contents).toMatchObject([
      { source: first.pkh, public_key: first.pk },
    ]);
  });
  it('reads PKH before asking a permission-dependent provider for its PK', async () => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setReadProvider(new ReadFixture());
    const provider = wallet();
    const ready = deferred<string>();
    let initialized = false;
    provider.getPKH.mockImplementation(async () => {
      await ready.promise;
      initialized = true;
      return first.pkh;
    });
    provider.getPK.mockImplementation(async () => {
      if (!initialized) throw new Error('Permission is not initialized');
      return first.pk;
    });
    toolkit.setWalletProvider(provider);
    const pending = prepareIdentity(toolkit);
    ready.resolve(first.pkh);
    expect((await pending).opOb.contents).toMatchObject([
      { source: first.pkh, public_key: first.pk },
    ]);
  });
  it('keeps the cached wallet pair during a pending public reveal estimate', async () => {
    class RevealedReadFixture extends ReadFixture {
      override async isAccountRevealed() {
        return true;
      }
    }
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setReadProvider(new RevealedReadFixture());
    toolkit.setWalletProvider(wallet());
    await prepareIdentity(toolkit);
    const pending = toolkit.estimate.reveal();
    const replacement = wallet(second);
    replacement.getPK.mockRejectedValue(new Error('Replacement must not provide this key'));
    toolkit.setWalletProvider(replacement);
    expect(await pending).toBeUndefined();
    expect(replacement.getPK).not.toHaveBeenCalled();
  });
});
