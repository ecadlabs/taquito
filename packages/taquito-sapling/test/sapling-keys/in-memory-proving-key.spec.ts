import { InMemoryProvingKey } from '../../src/sapling-keys/in-memory-proving-key';

describe('InMemoryProvingKey', () => {
  it('Should be instantiable with provingKey key', async (done) => {
    const inMemoryProvingKey = new InMemoryProvingKey(
      '44259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed962717403f80bf8cb9a8da8deb290913e9302be00c56f4565d917a6170be1880f42bb709'
    );
    expect(inMemoryProvingKey).toBeDefined();
    done();
  });

  it('Should be instantiable with encrypted spending key', async (done) => {
    const inMemoryProvingKey = await InMemoryProvingKey.fromSpendingKey(
      'MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14',
      'test'
    );
    expect(inMemoryProvingKey).toBeDefined();
    done();
  });

  it('Should be instantiable with unencrypted spending key', async (done) => {
    const inMemoryProvingKey = await InMemoryProvingKey.fromSpendingKey(
      'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
    );
    expect(inMemoryProvingKey).toBeDefined();
    done();
  });
});
