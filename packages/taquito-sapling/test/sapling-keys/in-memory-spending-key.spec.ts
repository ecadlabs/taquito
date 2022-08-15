import { InvalidSpendingKey } from '../../src/error';
import { InMemorySpendingKey } from '../../src/sapling-keys/in-memory-spending-key';

describe('InMemorySpendingKey', () => {
  it('Should be instantiable with encrypted spending key', async (done) => {
    const SaplingKeyProvider = new InMemorySpendingKey(
      'MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14',
      'test'
    );
    const viewerKeyProvider = await SaplingKeyProvider.getInMemoryViewingKey();
    expect(viewerKeyProvider.getFullViewingKey().toString('hex')).toEqual(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a'
    );
    done();
  });

  it('Should throw error with wrong password', async (done) => {
    expect(
      () =>
        new InMemorySpendingKey(
          'MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14',
          'tes'
        )
    ).toThrowError(InvalidSpendingKey);
    done();
  });

  it('Should be instantiable with a mnemonic', async (done) => {
    const SaplingKeyProvider = await InMemorySpendingKey.fromMnemonic(
      [
        'leopard',
        'crouch',
        'simple',
        'blind',
        'castle',
        'they',
        'elder',
        'enact',
        'slow',
        'rate',
        'mad',
        'blanket',
        'saddle',
        'tail',
        'silk',
        'fury',
        'quarter',
        'obscure',
        'interest',
        'exact',
        'veteran',
        'volcano',
        'fabric',
        'cherry',
      ].join(' '),
      'm/'
    );
    const viewer = await SaplingKeyProvider.getInMemoryViewingKey();
    expect(viewer.getFullViewingKey().toString('hex')).toEqual(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a'
    );
    done();
  });
  it('should return base 58 encoded spending key with appended prefix of the decrypted spending key', async (done) => {
    const SaplingKeyProvider = await InMemorySpendingKey.fromMnemonic(
      [
        'leopard',
        'crouch',
        'simple',
        'blind',
        'castle',
        'they',
        'elder',
        'enact',
        'slow',
        'rate',
        'mad',
        'blanket',
        'saddle',
        'tail',
        'silk',
        'fury',
        'quarter',
        'obscure',
        'interest',
        'exact',
        'veteran',
        'volcano',
        'fabric',
        'cherry',
      ].join(' '),
      'm/'
    );
    const sk = SaplingKeyProvider.getSpendingKey();
    expect(sk).toEqual(
      'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
    );
    done();
  });
  it('should throw error if encrypted with no password', (done) => {
    expect(
      () =>
        new InMemorySpendingKey(
          'MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14'
        )
    ).toThrowError(InvalidSpendingKey);
    done();
  });
});
