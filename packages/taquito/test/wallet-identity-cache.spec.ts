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
describe('wallet provider identity changes', () => {
  it('reads both identities from an explicitly replaced wallet provider', async () => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setWalletProvider(wallet());
    expect(await Promise.all([toolkit.wallet.pkh(), toolkit.wallet.pk()])).toEqual([
      first.pkh,
      first.pk,
    ]);
    toolkit.setWalletProvider(wallet(second));
    expect(await Promise.all([toolkit.wallet.pkh(), toolkit.wallet.pk()])).toEqual([
      second.pkh,
      second.pk,
    ]);
  });
  it('prepares a reveal with the new provider public key and source after replacement', async () => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setReadProvider(new ReadFixture());
    toolkit.setWalletProvider(wallet());
    expect((await prepareIdentity(toolkit)).opOb.contents).toMatchObject([
      { source: first.pkh, public_key: first.pk },
    ]);
    toolkit.setWalletProvider(wallet(second));
    expect((await prepareIdentity(toolkit)).opOb.contents).toMatchObject([
      { source: second.pkh, public_key: second.pk },
    ]);
  });

  it.each([
    { method: 'pkh', oldFirst: true },
    { method: 'pkh', oldFirst: false },
    { method: 'pk', oldFirst: true },
    { method: 'pk', oldFirst: false },
  ] satisfies Array<{ method: 'pkh' | 'pk'; oldFirst: boolean }>)(
    'does not cache an old $method result when oldFirst=$oldFirst',
    async ({ method, oldFirst }) => {
      const toolkit = new TezosToolkit('http://127.0.0.1:1');
      const old = wallet();
      const pending = deferred<string>();
      const oldGetter = method === 'pkh' ? old.getPKH : old.getPK;
      oldGetter.mockImplementationOnce(() => pending.promise);
      toolkit.setWalletProvider(old);
      const oldRead = toolkit.wallet[method]();
      toolkit.setWalletProvider(wallet(second));
      const oldValue = method === 'pkh' ? first.pkh : first.pk;
      const newValue = method === 'pkh' ? second.pkh : second.pk;
      if (oldFirst) {
        pending.resolve(oldValue);
        expect(await oldRead).toBe(oldValue);
      }
      expect(await toolkit.wallet[method]()).toBe(newValue);
      if (!oldFirst) {
        pending.resolve(oldValue);
        expect(await oldRead).toBe(oldValue);
      }
      expect(await toolkit.wallet[method]()).toBe(newValue);
    }
  );

  it('refreshes both toolkit and preparation identities when the same provider is reinstalled', async () => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setReadProvider(new ReadFixture());
    const provider = wallet();
    toolkit.setWalletProvider(provider);
    await Promise.all([toolkit.wallet.pkh(), toolkit.wallet.pk()]);
    await prepareIdentity(toolkit);
    provider.getPKH.mockResolvedValue(second.pkh);
    provider.getPK.mockResolvedValue(second.pk);
    toolkit.setWalletProvider(provider);
    expect(await Promise.all([toolkit.wallet.pkh(), toolkit.wallet.pk()])).toEqual([
      second.pkh,
      second.pk,
    ]);
    expect((await prepareIdentity(toolkit)).opOb.contents).toMatchObject([
      { source: second.pkh, public_key: second.pk },
    ]);
  });
  it('keeps a cold pending preparation on its original provider without refilling the replacement cache', async () => {
    const toolkit = new TezosToolkit('http://127.0.0.1:1');
    toolkit.setReadProvider(new ReadFixture());
    const original = wallet();
    const ready = deferred<string>();
    original.getPKH.mockImplementationOnce(() => ready.promise);
    toolkit.setWalletProvider(original);
    const pending = prepareIdentity(toolkit);
    toolkit.setWalletProvider(wallet(second));
    expect((await prepareIdentity(toolkit)).opOb.contents).toMatchObject([
      { source: second.pkh, public_key: second.pk },
    ]);
    ready.resolve(first.pkh);
    expect((await pending).opOb.contents).toMatchObject([
      { source: first.pkh, public_key: first.pk },
    ]);
    expect(original.getPK).toHaveBeenCalledTimes(1);
    expect((await prepareIdentity(toolkit)).opOb.contents).toMatchObject([
      { source: second.pkh, public_key: second.pk },
    ]);
  });
});
