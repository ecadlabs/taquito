import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import {
  BadSigningDataError,
  KeyNotFoundError,
  OperationNotAuthorizedError,
} from '../src/errors';
import { RemoteSigner } from '../src/taquito-remote-signer';

/**
 * RemoteSigner test
 */
describe('RemoteSigner test', () => {
  let httpBackend: {
    createRequest: jest.Mock<any, any>;
  };

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn(),
    };
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
        sig: 'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
      });

      done();
    });

    it('Should sign messages with 5 digit edsig prefix', async (done) => {
      const signer = new RemoteSigner(
        'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      httpBackend.createRequest
        .mockResolvedValueOnce({
          signature:
            'edsigu38iivupB2WoYAUtithpX28W1y9vZDHHQxGdm2XD6DFaiEYRbKAgrj33KEorjiXFSYQrQER1rLQHqkaN5WDDKg8E9QHvNZ',
        })
        .mockResolvedValueOnce({
          public_key: 'edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V',
        });

      const signed = await signer.sign(
        '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000'
      );

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'http://127.0.0.1:6732/keys/tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY',
        headers: undefined,
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(
        '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000'
      );

      expect(httpBackend.createRequest.mock.calls[1][0]).toEqual({
        method: 'GET',
        url: 'http://127.0.0.1:6732/keys/tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY',
        headers: undefined,
      });

      expect(signed).toEqual({
        bytes:
          '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000',
        prefixSig:
          'edsigu38iivupB2WoYAUtithpX28W1y9vZDHHQxGdm2XD6DFaiEYRbKAgrj33KEorjiXFSYQrQER1rLQHqkaN5WDDKg8E9QHvNZ',
        sbytes:
          '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000e029a32d628fe101d9c07f82bfd34c86c0b04ee7e3bbe317420ea098944464f18d701857c42fae94ff81bfaf838b6c16df1188ca462bd78b5dd1a2b7371f3108',
        sig: 'sigsKFbsguu6KmUyVbarrdZiqzF94zaaQh3GWu2gXE5sEdQQbq6RFbmfo8GeC4eFLtzzwEUidf1iSX6xYARMsF8d48HAxQv9',
      });

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
      ).rejects.toThrowError(
        /Signature failed verification against public key/
      );

      done();
    });

    it('Should fail if pkh is invalid', async (done) => {
      try {
        new RemoteSigner(
          'tz9iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
          'http://127.0.0.1:6732',
          {},
          httpBackend as any
        );
      } catch (error: any) {
        expect(error.message).toContain('is invalid');
      }
      done();
    });

    it('Should strip trailing slashes when creating URL because it is assumed to be included in path', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732///',
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
        sig: 'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
      });
      done();
    });

    it('Verify error message for signer.publicKey HttpResponse failure with STATUS_CODE.NOT_FOUND', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.NOT_FOUND,
        'err',
        'test',
        'https://test.com'
      );

      httpBackend.createRequest.mockRejectedValue(expectedError);

      try {
        await signer.publicKey();
      } catch (error: any) {
        expect(error).toBeInstanceOf(KeyNotFoundError);
      }
      done();
    });

    it('Verify error messages for signer.sign HttpResponse failure with STATUS_CODE.FORBIDDEN', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.FORBIDDEN,
        'err',
        'test',
        'https://test.com'
      );

      httpBackend.createRequest.mockRejectedValue(expectedError);

      try {
        await signer.sign(
          '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000'
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(OperationNotAuthorizedError);
      }
      done();
    });

    it('Verify error messages for HttpResponse failure with STATUS_CODE.BAD_REQUEST', async (done) => {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'http://127.0.0.1:6732',
        {},
        httpBackend as any
      );

      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.BAD_REQUEST,
        'err',
        'test',
        'https://test.com'
      );

      httpBackend.createRequest.mockRejectedValue(expectedError);

      try {
        await signer.sign(
          '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000'
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadSigningDataError);
      }
      done();
    });
  });
});
