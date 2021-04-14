import { MichelCodecPacker } from '../../src/packer/michel-codec-packer';

describe('MichelCodecPacker test', () => {
  it('is instantiable', () => {
    expect(new MichelCodecPacker()).toBeInstanceOf(MichelCodecPacker);
  });

  describe('packData', () => {
    it('calls packDataBytes from the michel-codec package', async done => {
      const localPacker = new MichelCodecPacker();
      const result = await localPacker.packData({
          data: { string: "2019-09-26T10:59:51Z" },
          type: { prim: "timestamp" }
      });
      console.log(result)
      expect(result).toEqual({ packed: "0500a7e8e4d80b" });
      done();
    });
  });
});
