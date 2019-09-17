import { InMemorySigner } from '../src/tezos-ts-signer';

describe('inmemory-signer', () => {
  it('fromFundraiser', async done => {
    const signer = InMemorySigner.fromFundraiser(
      'rtphpwty.yohjelcp@tezos.example.org',
      'HMYlTEu0EF',
      [
        'zone',
        'cheese',
        'venture',
        'sad',
        'marriage',
        'attitude',
        'borrow',
        'limit',
        'country',
        'agent',
        'away',
        'raven',
        'nerve',
        'laptop',
        'oven',
      ].join(' ')
    );

    expect(await signer.publicKeyHash()).toBe('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu');
    done();
  });

  it('Invalid key', async done => {
    expect(function () {
      const signer = new InMemorySigner('test');
    }).toThrow('Unsupported key type');
    done();
  });

  it('(tz1) Invalid key unable to decode', async done => {
    expect(function () {
      const signer = new InMemorySigner('edsk4TjJWEszkHKono7XMnepqwi37FrbVt1KCsifJeAGimxheShG');
    }).toThrow('Invalid checksum');
    done();
  });

  it('(tz2) Invalid key unable to decode', async done => {
    expect(function () {
      const signer = new InMemorySigner('spsk4TjJWEszkHKono7XMnepqwi37FrbVt1KCsifJeAGimxheShG');
    }).toThrow('Invalid checksum');
    done();
  });

  it('(tz3) Invalid key unable to decode', async done => {
    expect(function () {
      const signer = new InMemorySigner('p2sk4TjJWEszkHKono7XMnepqwi37FrbVt1KCsifJeAGimxheShG');
    }).toThrow('Invalid checksum');
    done();
  });

  it('Tz1 64 bytes', async done => {
    const signer = new InMemorySigner(
      'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV'
    );
    expect(await signer.publicKey()).toEqual(
      'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH'
    );
    expect(await signer.publicKeyHash()).toEqual('tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs');
    expect(await signer.secretKey()).toEqual(
      'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV'
    );

    expect((await signer.sign('123', new Uint8Array([3]))).sig).toEqual(
      'signvMhyzCmfN6JCYnqbtLCHdReCqwQM9viGJm1QPsiTrLGhrMi1eEmAsoXVjfNB1cJwnP9rj6i3cVCZeucqkPcsDuKmT9me'
    );
    done();
  });

  it('Tz1 32 bytes', async done => {
    const signer = new InMemorySigner('edsk4TjJWEszkHKono7XMnepVqwi37FrpbVt1KCsifJeAGimxheShG');
    expect(await signer.publicKey()).toEqual(
      'edpkuhmrbunxumoiVdQuxBZUPMmwkPt7yLtY5Qnua3VJVTLWr3vXXa'
    );
    expect(await signer.publicKeyHash()).toEqual('tz1b9kV41KV9N3sp69ycLdSoZ2Ak8jXwtNPv');
    expect(await signer.secretKey()).toEqual(
      'edskS8rh49SrQHQxMu5sVsyRXX3Kaodfgbk8qqtTFjxSg2tJbLEtbMnimfJzSz7TTZQeP7EMhZoegHbQWa548RcXJP9kn2J8P8'
    );

    expect((await signer.sign('1234', new Uint8Array([3]))).sig).toEqual(
      'sigpKAnfQGzG4Rk5pV7z9mx2TL9veQCHD7qN4PhsUZMj1BqsumBoApBS9Ue616vKVymxrzfZE2L4h27zzxRUVy6BNPRMpufb'
    );
    done();
  });

  it('Tz2', async done => {
    const signer = new InMemorySigner('spsk2rBDDeUqakQ42nBHDGQTtP3GErb6AahHPwF9bhca3Q5KA5HESE');
    expect(await signer.publicKey()).toEqual(
      'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH'
    );
    expect(await signer.publicKeyHash()).toEqual('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD');
    expect(await signer.secretKey()).toEqual(
      'spsk2rBDDeUqakQ42nBHDGQTtP3GErb6AahHPwF9bhca3Q5KA5HESE'
    );

    expect((await signer.sign('1234', new Uint8Array([3]))).sig).toEqual(
      'sigREwM1SuRN5WzjH5xGJuyeZQ9kWi8XtbA4wRqGTumJwNY18PmF1XQMLCXEQBr4frnriKHWdPUynF1vGUvPcoWrNjb3s5xp'
    );
    done();
  });

  it('Tz3', async done => {
    const signer = new InMemorySigner('p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1');
    expect(await signer.publicKey()).toEqual(
      'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB'
    );
    expect(await signer.publicKeyHash()).toEqual('tz3Lfm6CyfSTZ7EgMckptZZGiPxzs9GK59At');
    expect(await signer.secretKey()).toEqual(
      'p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1'
    );

    expect((await signer.sign('1234', new Uint8Array([3]))).sig).toEqual(
      'sigRUobRZ4oG7CvdtQfNoDe3Gqn8zrLw6RXjXVa84rX3HMzWuCuncWgDqY8wRkssofLUsfbdR6MNGJzDWaNXEwTxDktfrKmj'
    );
    done();
  });

  it('Tz3 Encrypted', async done => {
    const signer = new InMemorySigner(
      'p2esk2TFqgNcoT4u99ut5doGTUFNwo9x4nNvkpM6YMLqXrt4SbFdQnqLM3hoAXLMB2uZYazj6LZGvcoYzk16H6Et',
      'test1234'
    );
    expect(await signer.publicKey()).toEqual(
      'p2pk65zwHGP9MdvANKkp267F4VzoKqL8DMNpPfTHUNKbm8S9DUqqdpw'
    );
    expect(await signer.publicKeyHash()).toEqual('tz3hFR7NZtjT2QtzgMQnWb4xMuD6yt2YzXUt');
    expect(await signer.secretKey()).toEqual(
      'p2sk2mJNRYqs3UXJzzF44Ym6jk38RVDPVSuLCfNd5ShE5zyVdu8Au9'
    );

    expect((await signer.sign('1234', new Uint8Array([3]))).sig).toEqual(
      'sigZiUh7khZmjP1kGSSNe3LQdZC5GMpWHuyFkqcR37pwiGUJrpKaatUxWcRPBE5sHwqfydUsPM4JvK14dBMoHbCxC7VHdMZC'
    );
    done();
  });
});
