import { Tz4 } from '../src/bls-key';

describe('Tz4', () => {
  it('should retrieve public key, public key hash and secret', async (done) => {
    const signer = new Tz4('BLsk1eGhiPQXKtvvkBeXzmtVVJs6KPhEF45drF7MLjoCDcSnTGuyjL');
    expect(await signer.publicKey()).toEqual(
      'BLpk1ur5XXicWYMMzCVZZWyLZhybtyX8Zot2uCzDCZW8KcC5BdZiLVXRZvZzi4GuZYL9SarUvKpE'
    );
    expect(await signer.publicKeyHash()).toEqual('tz4TFJdv9Jd44FtBMAxi3KQT7AtazhVyaPa6');
    expect(await signer.secretKey()).toEqual(
      'BLsk1eGhiPQXKtvvkBeXzmtVVJs6KPhEF45drF7MLjoCDcSnTGuyjL'
    );
    done();
  });

  it('should throw when the private key is invalid', async (done) => {
    expect(() => {
      new Tz4('BLsk1eGhiPQXKtvv5BeXzmtVVJs6KPhEF45drF7MLjoCDcSnTGuyjL');
    }).toThrow(
      'The key BLsk1eGhiPQXKtvv5BeXzmtVVJs6KPhEF45drF7MLjoCDcSnTGuyjL is invalid. INVALID_CHECKSUM'
    );
    done();
  });
});
