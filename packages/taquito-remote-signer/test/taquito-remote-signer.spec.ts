import { RemoteSigner } from '../src/taquito-remote-signer';

/**
 * RemoteSigner test
 */
describe('RemoteSigner test', () => {
  let signer: RemoteSigner;
  let httpBackend: {
    createRequest: jest.Mock<any, any>;
  };

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn(),
    };
    signer = new RemoteSigner(
      'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
      'http://127.0.0.1:6732',
      {},
      httpBackend as any
    );
  });

  it('RemoteSigner is instantiable', () => {
    expect(
      new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      )
    ).toBeInstanceOf(RemoteSigner);
  });

  describe('Sign messages', () => {
    it('Should sign messages', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      httpBackend.createRequest
        .mockResolvedValueOnce({
          signature:
            'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
        })
        .mockResolvedValueOnce({
          public_key: 'edpkuAhkJ81xGyf4PcmRMHLSaQGbDEpkGhNbcjNVnKWKR8kqkgQR3f',
        });

      const signed = await signer.sign(
        '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000'
      );

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'http://127.0.0.1:6732/keys/tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        headers: undefined,
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(
        '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000'
      );

      expect(httpBackend.createRequest.mock.calls[1][0]).toEqual({
        method: 'GET',
        url: 'http://127.0.0.1:6732/keys/tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        headers: undefined,
      });

      expect(signed).toEqual({
        bytes:
          '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000',
        prefixSig:
          'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
        sbytes:
          '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f0200000004052000030000000200009b00f3b02e3760092415595548e2bd6532b0223d8ff282d31b6f30e35592b6b91a4c37fb0a6a24cc8b5176cc497e204ab722a4711803121ff51dc5a450cfd10b',
        sig:
          'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
      });

      done();
    });

    it('Should fail if public key does not match', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      httpBackend.createRequest
        .mockResolvedValueOnce({
          signature:
            'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
        })
        .mockResolvedValueOnce({
          public_key: 'sppk7bFd7b4DWcabg4yw4N5q8rn9thycWmY21EJDCKfTskNiBH8RJrd', // Invalid public key
        });

      await expect(
        signer.sign(
          '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000'
        )
      ).rejects.toThrowError(/Requested public key does not match the initialized public key hash/);

      done();
    });

    it('Should fail if signature is invalid', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      httpBackend.createRequest
        .mockResolvedValueOnce({
          signature:
            'sigSpyZVEaJAsudrgCwqM7barZMR7XDB8xrEiEhKNz6hxeGc4EXh2NwM4TgeucxARMHYxGGZsAcwxFx5hfoerrztKtopmvvt', // Invalid signature
        })
        .mockResolvedValueOnce({
          public_key: 'edpkuAhkJ81xGyf4PcmRMHLSaQGbDEpkGhNbcjNVnKWKR8kqkgQR3f',
        });

      await expect(
        signer.sign(
          '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000'
        )
      ).rejects.toThrowError(/Signature failed verification against public key/);

      done();
    });
  });
});
