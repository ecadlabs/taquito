import { ChestKeyValidationError, ChestKeyToken } from '../../src/tokens/chest-key';

describe('ChestKey token', () => {
  let token: ChestKeyToken;
  beforeEach(() => {
    token = new ChestKeyToken({ prim: 'chest_key', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode hex string to Michelson bytes format', () => {
      expect(
        token.EncodeObject(
          'ac91a7a0efcd9e97bdc29f8c8184e3c5d8dbea9eb284e1a3fdd9bafa9c8380d5f793cbb4ac869cfbafac82c7f896a991a48ef48bb79189a2a997a3bee183b4f8dce0d4e781869ac0d5ab8ad3a48894bfb690b4d6b3b1a7fdcbf6f39a87bac7b59cf9a3b9d1d2d09ea1ca8af9fee7acac82e89aeea09ee7a1acf38dddc2d8bdb9e6ffced5da9cb4d284d9f692d29bc28cadc6ead09bd9b2ffe8ccb392ef8c96e9b7a3d3c0b9caceb3dee6b9dcefb5ff98a9e98186edb69bbbdec8f48490c897ecd5d0dbc587dedac3fba6e2beb4d6f5e2e3c9e4dfdbfcc0b182dff283efbfdbdba997c0c6bdcedc85d5e19a89bf9c8484dfe3c0d1deb08ceffb96bad9edffbfe4f6dfb882b1eddcbdbef39297b0b4d19bfb988185859ba795f9dfffc6b5f4b6e8d6fbe28303c1fadc829d9bf1a992cae0c3c2acd7a2bb8bbe93cb87b7e1aec883aada82c7fac889f1dfe6e2bab8f18f9087aebffef0b3ab8bfed9a5be84a9a7bcabf2dfb0c4d399b7b3dda9deadecf0c1e491cac4a49e8ca5aadebef39dc4dae8b1d3bb93c8ebb0f6c586c0d7cba1cbfccaabf0cbdd95969fa4b3f59af3fa8ca0f1a0f6d09b958eaad8fcd595d1defee1c989b5cadcb9f8a7bfaea1e2969899ee83ffd8e683f9dec4decfe0aff1d5c2dcd3abb6c8c6bce4c8e2f79eb6fde3b8a3a3add5fad4e5ebc8de93ae909ffb8cccc3e6a9ed8ed6b8cd88cab29086d4e8f99be4bebf84f494b0f5fce4e0c4d092e4ce80cca0a7c69fb2bef380ece0e189d9ede0eac9f5a4a5d2f79a9094dbdf91add38b92e5cbeea680effcea83eee7b697c593ab97adb1eff48402'
        )
      ).toEqual({
        bytes:
          'ac91a7a0efcd9e97bdc29f8c8184e3c5d8dbea9eb284e1a3fdd9bafa9c8380d5f793cbb4ac869cfbafac82c7f896a991a48ef48bb79189a2a997a3bee183b4f8dce0d4e781869ac0d5ab8ad3a48894bfb690b4d6b3b1a7fdcbf6f39a87bac7b59cf9a3b9d1d2d09ea1ca8af9fee7acac82e89aeea09ee7a1acf38dddc2d8bdb9e6ffced5da9cb4d284d9f692d29bc28cadc6ead09bd9b2ffe8ccb392ef8c96e9b7a3d3c0b9caceb3dee6b9dcefb5ff98a9e98186edb69bbbdec8f48490c897ecd5d0dbc587dedac3fba6e2beb4d6f5e2e3c9e4dfdbfcc0b182dff283efbfdbdba997c0c6bdcedc85d5e19a89bf9c8484dfe3c0d1deb08ceffb96bad9edffbfe4f6dfb882b1eddcbdbef39297b0b4d19bfb988185859ba795f9dfffc6b5f4b6e8d6fbe28303c1fadc829d9bf1a992cae0c3c2acd7a2bb8bbe93cb87b7e1aec883aada82c7fac889f1dfe6e2bab8f18f9087aebffef0b3ab8bfed9a5be84a9a7bcabf2dfb0c4d399b7b3dda9deadecf0c1e491cac4a49e8ca5aadebef39dc4dae8b1d3bb93c8ebb0f6c586c0d7cba1cbfccaabf0cbdd95969fa4b3f59af3fa8ca0f1a0f6d09b958eaad8fcd595d1defee1c989b5cadcb9f8a7bfaea1e2969899ee83ffd8e683f9dec4decfe0aff1d5c2dcd3abb6c8c6bce4c8e2f79eb6fde3b8a3a3add5fad4e5ebc8de93ae909ffb8cccc3e6a9ed8ed6b8cd88cab29086d4e8f99be4bebf84f494b0f5fce4e0c4d092e4ce80cca0a7c69fb2bef380ece0e189d9ede0eac9f5a4a5d2f79a9094dbdf91add38b92e5cbeea680effcea83eee7b697c593ab97adb1eff48402',
      });
    });

    it('Should encode Uint8Array to Michelson bytes format', () => {
      const uint8 = new Uint8Array([21, 31]);
      expect(token.EncodeObject(uint8)).toEqual({
        bytes: '151f',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(ChestKeyValidationError);
      expect(() => token.EncodeObject('4')).toThrowError(ChestKeyValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode bytes string to Michelson bytes format', () => {
      expect(
        token.Encode([
          'ac91a7a0efcd9e97bdc29f8c8184e3c5d8dbea9eb284e1a3fdd9bafa9c8380d5f793cbb4ac869cfbafac82c7f896a991a48ef48bb79189a2a997a3bee183b4f8dce0d4e781869ac0d5ab8ad3a48894bfb690b4d6b3b1a7fdcbf6f39a87bac7b59cf9a3b9d1d2d09ea1ca8af9fee7acac82e89aeea09ee7a1acf38dddc2d8bdb9e6ffced5da9cb4d284d9f692d29bc28cadc6ead09bd9b2ffe8ccb392ef8c96e9b7a3d3c0b9caceb3dee6b9dcefb5ff98a9e98186edb69bbbdec8f48490c897ecd5d0dbc587dedac3fba6e2beb4d6f5e2e3c9e4dfdbfcc0b182dff283efbfdbdba997c0c6bdcedc85d5e19a89bf9c8484dfe3c0d1deb08ceffb96bad9edffbfe4f6dfb882b1eddcbdbef39297b0b4d19bfb988185859ba795f9dfffc6b5f4b6e8d6fbe28303c1fadc829d9bf1a992cae0c3c2acd7a2bb8bbe93cb87b7e1aec883aada82c7fac889f1dfe6e2bab8f18f9087aebffef0b3ab8bfed9a5be84a9a7bcabf2dfb0c4d399b7b3dda9deadecf0c1e491cac4a49e8ca5aadebef39dc4dae8b1d3bb93c8ebb0f6c586c0d7cba1cbfccaabf0cbdd95969fa4b3f59af3fa8ca0f1a0f6d09b958eaad8fcd595d1defee1c989b5cadcb9f8a7bfaea1e2969899ee83ffd8e683f9dec4decfe0aff1d5c2dcd3abb6c8c6bce4c8e2f79eb6fde3b8a3a3add5fad4e5ebc8de93ae909ffb8cccc3e6a9ed8ed6b8cd88cab29086d4e8f99be4bebf84f494b0f5fce4e0c4d092e4ce80cca0a7c69fb2bef380ece0e189d9ede0eac9f5a4a5d2f79a9094dbdf91add38b92e5cbeea680effcea83eee7b697c593ab97adb1eff48402',
        ])
      ).toEqual({
        bytes:
          'ac91a7a0efcd9e97bdc29f8c8184e3c5d8dbea9eb284e1a3fdd9bafa9c8380d5f793cbb4ac869cfbafac82c7f896a991a48ef48bb79189a2a997a3bee183b4f8dce0d4e781869ac0d5ab8ad3a48894bfb690b4d6b3b1a7fdcbf6f39a87bac7b59cf9a3b9d1d2d09ea1ca8af9fee7acac82e89aeea09ee7a1acf38dddc2d8bdb9e6ffced5da9cb4d284d9f692d29bc28cadc6ead09bd9b2ffe8ccb392ef8c96e9b7a3d3c0b9caceb3dee6b9dcefb5ff98a9e98186edb69bbbdec8f48490c897ecd5d0dbc587dedac3fba6e2beb4d6f5e2e3c9e4dfdbfcc0b182dff283efbfdbdba997c0c6bdcedc85d5e19a89bf9c8484dfe3c0d1deb08ceffb96bad9edffbfe4f6dfb882b1eddcbdbef39297b0b4d19bfb988185859ba795f9dfffc6b5f4b6e8d6fbe28303c1fadc829d9bf1a992cae0c3c2acd7a2bb8bbe93cb87b7e1aec883aada82c7fac889f1dfe6e2bab8f18f9087aebffef0b3ab8bfed9a5be84a9a7bcabf2dfb0c4d399b7b3dda9deadecf0c1e491cac4a49e8ca5aadebef39dc4dae8b1d3bb93c8ebb0f6c586c0d7cba1cbfccaabf0cbdd95969fa4b3f59af3fa8ca0f1a0f6d09b958eaad8fcd595d1defee1c989b5cadcb9f8a7bfaea1e2969899ee83ffd8e683f9dec4decfe0aff1d5c2dcd3abb6c8c6bce4c8e2f79eb6fde3b8a3a3add5fad4e5ebc8de93ae909ffb8cccc3e6a9ed8ed6b8cd88cab29086d4e8f99be4bebf84f494b0f5fce4e0c4d092e4ce80cca0a7c69fb2bef380ece0e189d9ede0eac9f5a4a5d2f79a9094dbdf91add38b92e5cbeea680effcea83eee7b697c593ab97adb1eff48402',
      });
    });

    it('Should encode Uint8Array to bytes', () => {
      const uint8 = new Uint8Array([115, 2, 65]);
      expect(token.Encode([uint8])).toEqual({
        bytes: '730241',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(ChestKeyValidationError);
      expect(() => token.Encode([23])).toThrowError(ChestKeyValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('ChestKeyValidationError');
      }
    });
  });

  describe('Execute', () => {
    it('Should extract hex string from Michelson data', () => {
      expect(
        token.Execute({
          bytes:
            'ac91a7a0efcd9e97bdc29f8c8184e3c5d8dbea9eb284e1a3fdd9bafa9c8380d5f793cbb4ac869cfbafac82c7f896a991a48ef48bb79189a2a997a3bee183b4f8dce0d4e781869ac0d5ab8ad3a48894bfb690b4d6b3b1a7fdcbf6f39a87bac7b59cf9a3b9d1d2d09ea1ca8af9fee7acac82e89aeea09ee7a1acf38dddc2d8bdb9e6ffced5da9cb4d284d9f692d29bc28cadc6ead09bd9b2ffe8ccb392ef8c96e9b7a3d3c0b9caceb3dee6b9dcefb5ff98a9e98186edb69bbbdec8f48490c897ecd5d0dbc587dedac3fba6e2beb4d6f5e2e3c9e4dfdbfcc0b182dff283efbfdbdba997c0c6bdcedc85d5e19a89bf9c8484dfe3c0d1deb08ceffb96bad9edffbfe4f6dfb882b1eddcbdbef39297b0b4d19bfb988185859ba795f9dfffc6b5f4b6e8d6fbe28303c1fadc829d9bf1a992cae0c3c2acd7a2bb8bbe93cb87b7e1aec883aada82c7fac889f1dfe6e2bab8f18f9087aebffef0b3ab8bfed9a5be84a9a7bcabf2dfb0c4d399b7b3dda9deadecf0c1e491cac4a49e8ca5aadebef39dc4dae8b1d3bb93c8ebb0f6c586c0d7cba1cbfccaabf0cbdd95969fa4b3f59af3fa8ca0f1a0f6d09b958eaad8fcd595d1defee1c989b5cadcb9f8a7bfaea1e2969899ee83ffd8e683f9dec4decfe0aff1d5c2dcd3abb6c8c6bce4c8e2f79eb6fde3b8a3a3add5fad4e5ebc8de93ae909ffb8cccc3e6a9ed8ed6b8cd88cab29086d4e8f99be4bebf84f494b0f5fce4e0c4d092e4ce80cca0a7c69fb2bef380ece0e189d9ede0eac9f5a4a5d2f79a9094dbdf91add38b92e5cbeea680effcea83eee7b697c593ab97adb1eff48402',
        })
      ).toEqual(
        'ac91a7a0efcd9e97bdc29f8c8184e3c5d8dbea9eb284e1a3fdd9bafa9c8380d5f793cbb4ac869cfbafac82c7f896a991a48ef48bb79189a2a997a3bee183b4f8dce0d4e781869ac0d5ab8ad3a48894bfb690b4d6b3b1a7fdcbf6f39a87bac7b59cf9a3b9d1d2d09ea1ca8af9fee7acac82e89aeea09ee7a1acf38dddc2d8bdb9e6ffced5da9cb4d284d9f692d29bc28cadc6ead09bd9b2ffe8ccb392ef8c96e9b7a3d3c0b9caceb3dee6b9dcefb5ff98a9e98186edb69bbbdec8f48490c897ecd5d0dbc587dedac3fba6e2beb4d6f5e2e3c9e4dfdbfcc0b182dff283efbfdbdba997c0c6bdcedc85d5e19a89bf9c8484dfe3c0d1deb08ceffb96bad9edffbfe4f6dfb882b1eddcbdbef39297b0b4d19bfb988185859ba795f9dfffc6b5f4b6e8d6fbe28303c1fadc829d9bf1a992cae0c3c2acd7a2bb8bbe93cb87b7e1aec883aada82c7fac889f1dfe6e2bab8f18f9087aebffef0b3ab8bfed9a5be84a9a7bcabf2dfb0c4d399b7b3dda9deadecf0c1e491cac4a49e8ca5aadebef39dc4dae8b1d3bb93c8ebb0f6c586c0d7cba1cbfccaabf0cbdd95969fa4b3f59af3fa8ca0f1a0f6d09b958eaad8fcd595d1defee1c989b5cadcb9f8a7bfaea1e2969899ee83ffd8e683f9dec4decfe0aff1d5c2dcd3abb6c8c6bce4c8e2f79eb6fde3b8a3a3add5fad4e5ebc8de93ae909ffb8cccc3e6a9ed8ed6b8cd88cab29086d4e8f99be4bebf84f494b0f5fce4e0c4d092e4ce80cca0a7c69fb2bef380ece0e189d9ede0eac9f5a4a5d2f79a9094dbdf91add38b92e5cbeea680effcea83eee7b697c593ab97adb1eff48402'
      );
    });
  });

  describe('ExtractSchema', () => {
    it('Should generate the schema properly.', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'chest_key',
        schema: 'chest_key',
      });
    });
  });
});
