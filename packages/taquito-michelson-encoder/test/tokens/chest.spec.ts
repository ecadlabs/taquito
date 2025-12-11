import { ChestValidationError, ChestToken } from '../../src/tokens/chest';

describe('Chest token', () => {
  let token: ChestToken;
  beforeEach(() => {
    token = new ChestToken({ prim: 'chest', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode hex string to Michelson bytes format', () => {
      expect(
        token.EncodeObject(
          'bea8a8b993f2fdb2c3d7f8a9b4e2bba3def2edd5928a82878a81ace6b8e2c0efc5c7dbe9e6b88bca86b0df94f6b5c4d2d4f7f6e9a183fde1edd2b3fc9d9f9c8de6b7c1e580bdb284d7eca9e485cb84b8e386bfa09fe297c5df94eacdd9c090e6eab39aa6ffa69df9fabec2d6b5ba94a6bec4c387dae38ec6b7bdf793e1edb8d2c5e49bd7c1ba84b69afe89d3bd9799bfadfec2e2ddcc88b8d2e0a99f9cc9b0deb682b1c6c8d1bea2e695b2ebd1a6d8eebeddeea3a4b2d983d6cc9cd1a8d0e0c4f4cb8fffb9ddd1f9abb4dbc3ee808cf1cbbd91c7e4859eecfad5b2add3d4b8dae7e0fdabc9f0b29ac78784b7bd8bcaed91ca93cb95ccd79ac8d8b184d1f4f8b0fed1d5d3f3b1ed9dfcd5f483b5a581d79ef5cbbe98889b80bd80f0f9fdd5f3bed5f38653a7f490dddec8d782d2b2b8c1bc9999859fbbc2dd97ed9df4b5b9879588c8ea93c4bfbcaed1efeac4e8bdcab1c3818fa8e8e8b3c6978cabf08c8daddaa2fbbf81d88fda95cecb8591fd90d98ad3b29698c5a4e3ac8e95f7dba0ff91a6ff97d1e1f8c9fb9ef6afae95ac908bb4b9b3b8f8ed8780bfbac6f39cf1f7cab980abcacedeac90afe5bfcda8dab990ffb3a2ad9b889e94e8b6d1f099f5cef7dbacd799e0f2ccf9e7b7c6e591bddeee8895cc89f2d9839ef0afe08ed783c7869685f5fca5cdebf9889ef2839a8ebd88eeb8ebfbd5dab8a4ec86a6a488b1b6f8fe828b8fefaaf9dbd6ddddaaeea4d8e6d5fca2dfdd9af1bdeca1bcf09ab898a49dcbc9f3f99f83fdb690c7cbb7cff5cbca88eafe8ff5eec980aadbe4c2be87b7b098adc3bfd6b1b3a106e1cae5665a7f70a26b8e06979288e26222009d7b6e40acb900000021a1fb7e9f43f45b19d4a5ed10cf729c233612d82ea642e09efd90873e66952e97bb'
        )
      ).toEqual({
        bytes:
          'bea8a8b993f2fdb2c3d7f8a9b4e2bba3def2edd5928a82878a81ace6b8e2c0efc5c7dbe9e6b88bca86b0df94f6b5c4d2d4f7f6e9a183fde1edd2b3fc9d9f9c8de6b7c1e580bdb284d7eca9e485cb84b8e386bfa09fe297c5df94eacdd9c090e6eab39aa6ffa69df9fabec2d6b5ba94a6bec4c387dae38ec6b7bdf793e1edb8d2c5e49bd7c1ba84b69afe89d3bd9799bfadfec2e2ddcc88b8d2e0a99f9cc9b0deb682b1c6c8d1bea2e695b2ebd1a6d8eebeddeea3a4b2d983d6cc9cd1a8d0e0c4f4cb8fffb9ddd1f9abb4dbc3ee808cf1cbbd91c7e4859eecfad5b2add3d4b8dae7e0fdabc9f0b29ac78784b7bd8bcaed91ca93cb95ccd79ac8d8b184d1f4f8b0fed1d5d3f3b1ed9dfcd5f483b5a581d79ef5cbbe98889b80bd80f0f9fdd5f3bed5f38653a7f490dddec8d782d2b2b8c1bc9999859fbbc2dd97ed9df4b5b9879588c8ea93c4bfbcaed1efeac4e8bdcab1c3818fa8e8e8b3c6978cabf08c8daddaa2fbbf81d88fda95cecb8591fd90d98ad3b29698c5a4e3ac8e95f7dba0ff91a6ff97d1e1f8c9fb9ef6afae95ac908bb4b9b3b8f8ed8780bfbac6f39cf1f7cab980abcacedeac90afe5bfcda8dab990ffb3a2ad9b889e94e8b6d1f099f5cef7dbacd799e0f2ccf9e7b7c6e591bddeee8895cc89f2d9839ef0afe08ed783c7869685f5fca5cdebf9889ef2839a8ebd88eeb8ebfbd5dab8a4ec86a6a488b1b6f8fe828b8fefaaf9dbd6ddddaaeea4d8e6d5fca2dfdd9af1bdeca1bcf09ab898a49dcbc9f3f99f83fdb690c7cbb7cff5cbca88eafe8ff5eec980aadbe4c2be87b7b098adc3bfd6b1b3a106e1cae5665a7f70a26b8e06979288e26222009d7b6e40acb900000021a1fb7e9f43f45b19d4a5ed10cf729c233612d82ea642e09efd90873e66952e97bb',
      });
    });

    it('Should encode Uint8Array to Michelson bytes format', () => {
      const uint8 = new Uint8Array([21, 31]);
      expect(token.EncodeObject(uint8)).toEqual({
        bytes: '151f',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(ChestValidationError);
      expect(() => token.EncodeObject('4')).toThrowError(ChestValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode bytes string to Michelson bytes format', () => {
      expect(
        token.Encode([
          'bea8a8b993f2fdb2c3d7f8a9b4e2bba3def2edd5928a82878a81ace6b8e2c0efc5c7dbe9e6b88bca86b0df94f6b5c4d2d4f7f6e9a183fde1edd2b3fc9d9f9c8de6b7c1e580bdb284d7eca9e485cb84b8e386bfa09fe297c5df94eacdd9c090e6eab39aa6ffa69df9fabec2d6b5ba94a6bec4c387dae38ec6b7bdf793e1edb8d2c5e49bd7c1ba84b69afe89d3bd9799bfadfec2e2ddcc88b8d2e0a99f9cc9b0deb682b1c6c8d1bea2e695b2ebd1a6d8eebeddeea3a4b2d983d6cc9cd1a8d0e0c4f4cb8fffb9ddd1f9abb4dbc3ee808cf1cbbd91c7e4859eecfad5b2add3d4b8dae7e0fdabc9f0b29ac78784b7bd8bcaed91ca93cb95ccd79ac8d8b184d1f4f8b0fed1d5d3f3b1ed9dfcd5f483b5a581d79ef5cbbe98889b80bd80f0f9fdd5f3bed5f38653a7f490dddec8d782d2b2b8c1bc9999859fbbc2dd97ed9df4b5b9879588c8ea93c4bfbcaed1efeac4e8bdcab1c3818fa8e8e8b3c6978cabf08c8daddaa2fbbf81d88fda95cecb8591fd90d98ad3b29698c5a4e3ac8e95f7dba0ff91a6ff97d1e1f8c9fb9ef6afae95ac908bb4b9b3b8f8ed8780bfbac6f39cf1f7cab980abcacedeac90afe5bfcda8dab990ffb3a2ad9b889e94e8b6d1f099f5cef7dbacd799e0f2ccf9e7b7c6e591bddeee8895cc89f2d9839ef0afe08ed783c7869685f5fca5cdebf9889ef2839a8ebd88eeb8ebfbd5dab8a4ec86a6a488b1b6f8fe828b8fefaaf9dbd6ddddaaeea4d8e6d5fca2dfdd9af1bdeca1bcf09ab898a49dcbc9f3f99f83fdb690c7cbb7cff5cbca88eafe8ff5eec980aadbe4c2be87b7b098adc3bfd6b1b3a106e1cae5665a7f70a26b8e06979288e26222009d7b6e40acb900000021a1fb7e9f43f45b19d4a5ed10cf729c233612d82ea642e09efd90873e66952e97bb',
        ])
      ).toEqual({
        bytes:
          'bea8a8b993f2fdb2c3d7f8a9b4e2bba3def2edd5928a82878a81ace6b8e2c0efc5c7dbe9e6b88bca86b0df94f6b5c4d2d4f7f6e9a183fde1edd2b3fc9d9f9c8de6b7c1e580bdb284d7eca9e485cb84b8e386bfa09fe297c5df94eacdd9c090e6eab39aa6ffa69df9fabec2d6b5ba94a6bec4c387dae38ec6b7bdf793e1edb8d2c5e49bd7c1ba84b69afe89d3bd9799bfadfec2e2ddcc88b8d2e0a99f9cc9b0deb682b1c6c8d1bea2e695b2ebd1a6d8eebeddeea3a4b2d983d6cc9cd1a8d0e0c4f4cb8fffb9ddd1f9abb4dbc3ee808cf1cbbd91c7e4859eecfad5b2add3d4b8dae7e0fdabc9f0b29ac78784b7bd8bcaed91ca93cb95ccd79ac8d8b184d1f4f8b0fed1d5d3f3b1ed9dfcd5f483b5a581d79ef5cbbe98889b80bd80f0f9fdd5f3bed5f38653a7f490dddec8d782d2b2b8c1bc9999859fbbc2dd97ed9df4b5b9879588c8ea93c4bfbcaed1efeac4e8bdcab1c3818fa8e8e8b3c6978cabf08c8daddaa2fbbf81d88fda95cecb8591fd90d98ad3b29698c5a4e3ac8e95f7dba0ff91a6ff97d1e1f8c9fb9ef6afae95ac908bb4b9b3b8f8ed8780bfbac6f39cf1f7cab980abcacedeac90afe5bfcda8dab990ffb3a2ad9b889e94e8b6d1f099f5cef7dbacd799e0f2ccf9e7b7c6e591bddeee8895cc89f2d9839ef0afe08ed783c7869685f5fca5cdebf9889ef2839a8ebd88eeb8ebfbd5dab8a4ec86a6a488b1b6f8fe828b8fefaaf9dbd6ddddaaeea4d8e6d5fca2dfdd9af1bdeca1bcf09ab898a49dcbc9f3f99f83fdb690c7cbb7cff5cbca88eafe8ff5eec980aadbe4c2be87b7b098adc3bfd6b1b3a106e1cae5665a7f70a26b8e06979288e26222009d7b6e40acb900000021a1fb7e9f43f45b19d4a5ed10cf729c233612d82ea642e09efd90873e66952e97bb',
      });
    });

    it('Should encode Uint8Array to bytes', () => {
      const uint8 = new Uint8Array([115, 2, 65]);
      expect(token.Encode([uint8])).toEqual({
        bytes: '730241',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(ChestValidationError);
      expect(() => token.Encode([23])).toThrowError(ChestValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('ChestValidationError');
      }
    });
  });

  describe('Execute', () => {
    it('Should extract hex string from Michelson data', () => {
      expect(
        token.Execute({
          bytes:
            'bea8a8b993f2fdb2c3d7f8a9b4e2bba3def2edd5928a82878a81ace6b8e2c0efc5c7dbe9e6b88bca86b0df94f6b5c4d2d4f7f6e9a183fde1edd2b3fc9d9f9c8de6b7c1e580bdb284d7eca9e485cb84b8e386bfa09fe297c5df94eacdd9c090e6eab39aa6ffa69df9fabec2d6b5ba94a6bec4c387dae38ec6b7bdf793e1edb8d2c5e49bd7c1ba84b69afe89d3bd9799bfadfec2e2ddcc88b8d2e0a99f9cc9b0deb682b1c6c8d1bea2e695b2ebd1a6d8eebeddeea3a4b2d983d6cc9cd1a8d0e0c4f4cb8fffb9ddd1f9abb4dbc3ee808cf1cbbd91c7e4859eecfad5b2add3d4b8dae7e0fdabc9f0b29ac78784b7bd8bcaed91ca93cb95ccd79ac8d8b184d1f4f8b0fed1d5d3f3b1ed9dfcd5f483b5a581d79ef5cbbe98889b80bd80f0f9fdd5f3bed5f38653a7f490dddec8d782d2b2b8c1bc9999859fbbc2dd97ed9df4b5b9879588c8ea93c4bfbcaed1efeac4e8bdcab1c3818fa8e8e8b3c6978cabf08c8daddaa2fbbf81d88fda95cecb8591fd90d98ad3b29698c5a4e3ac8e95f7dba0ff91a6ff97d1e1f8c9fb9ef6afae95ac908bb4b9b3b8f8ed8780bfbac6f39cf1f7cab980abcacedeac90afe5bfcda8dab990ffb3a2ad9b889e94e8b6d1f099f5cef7dbacd799e0f2ccf9e7b7c6e591bddeee8895cc89f2d9839ef0afe08ed783c7869685f5fca5cdebf9889ef2839a8ebd88eeb8ebfbd5dab8a4ec86a6a488b1b6f8fe828b8fefaaf9dbd6ddddaaeea4d8e6d5fca2dfdd9af1bdeca1bcf09ab898a49dcbc9f3f99f83fdb690c7cbb7cff5cbca88eafe8ff5eec980aadbe4c2be87b7b098adc3bfd6b1b3a106e1cae5665a7f70a26b8e06979288e26222009d7b6e40acb900000021a1fb7e9f43f45b19d4a5ed10cf729c233612d82ea642e09efd90873e66952e97bb',
        })
      ).toEqual(
        'bea8a8b993f2fdb2c3d7f8a9b4e2bba3def2edd5928a82878a81ace6b8e2c0efc5c7dbe9e6b88bca86b0df94f6b5c4d2d4f7f6e9a183fde1edd2b3fc9d9f9c8de6b7c1e580bdb284d7eca9e485cb84b8e386bfa09fe297c5df94eacdd9c090e6eab39aa6ffa69df9fabec2d6b5ba94a6bec4c387dae38ec6b7bdf793e1edb8d2c5e49bd7c1ba84b69afe89d3bd9799bfadfec2e2ddcc88b8d2e0a99f9cc9b0deb682b1c6c8d1bea2e695b2ebd1a6d8eebeddeea3a4b2d983d6cc9cd1a8d0e0c4f4cb8fffb9ddd1f9abb4dbc3ee808cf1cbbd91c7e4859eecfad5b2add3d4b8dae7e0fdabc9f0b29ac78784b7bd8bcaed91ca93cb95ccd79ac8d8b184d1f4f8b0fed1d5d3f3b1ed9dfcd5f483b5a581d79ef5cbbe98889b80bd80f0f9fdd5f3bed5f38653a7f490dddec8d782d2b2b8c1bc9999859fbbc2dd97ed9df4b5b9879588c8ea93c4bfbcaed1efeac4e8bdcab1c3818fa8e8e8b3c6978cabf08c8daddaa2fbbf81d88fda95cecb8591fd90d98ad3b29698c5a4e3ac8e95f7dba0ff91a6ff97d1e1f8c9fb9ef6afae95ac908bb4b9b3b8f8ed8780bfbac6f39cf1f7cab980abcacedeac90afe5bfcda8dab990ffb3a2ad9b889e94e8b6d1f099f5cef7dbacd799e0f2ccf9e7b7c6e591bddeee8895cc89f2d9839ef0afe08ed783c7869685f5fca5cdebf9889ef2839a8ebd88eeb8ebfbd5dab8a4ec86a6a488b1b6f8fe828b8fefaaf9dbd6ddddaaeea4d8e6d5fca2dfdd9af1bdeca1bcf09ab898a49dcbc9f3f99f83fdb690c7cbb7cff5cbca88eafe8ff5eec980aadbe4c2be87b7b098adc3bfd6b1b3a106e1cae5665a7f70a26b8e06979288e26222009d7b6e40acb900000021a1fb7e9f43f45b19d4a5ed10cf729c233612d82ea642e09efd90873e66952e97bb'
      );
    });
  });

  describe('ExtractSchema', () => {
    it('Should generate the schema properly.', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'chest',
        schema: 'chest',
      });
    });
  });
});
