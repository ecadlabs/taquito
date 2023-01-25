import { CONFIGS } from "./config";
import { Protocols } from "@taquito/taquito";
import { bytesAndInt, bytesAndNat } from "./data/instructions-bytes-conversions-contracts";
import { HttpResponseError } from "@taquito/http-utils";

CONFIGS().forEach(({ lib, protocol, setup }) => {
  const Tezos = lib;
  const limanet = protocol === Protocols.PtLimaPtL ? test : test.skip;
  const mumbaiAndAlpha = protocol === Protocols.PtMumbaii || protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test origination of contract with instructions now supporting bytes`, () => {

    beforeEach(async (done) => {
      await setup();
      done();
    });

    mumbaiAndAlpha(`Should be able to orignate contract with ADD parameter in michelson contract with bytes`, async done => {
      const contract = await Tezos.contract.originate({
        code: bytesAndInt,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
      done();
    });

    mumbaiAndAlpha(`Should be able to orignate contract with LSL parameter in michelson contract with bytes`, async done => {
      const contract = await Tezos.contract.originate({
        code: bytesAndNat,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
      done();
    });

    limanet('Should fail to originate a contract for AND with bytes', async (done) => {
      try {
        const contract = await Tezos.contract.originate({
          code: bytesAndInt,
          storage: 0
        });
        await contract.confirmation();
      } catch (err) {
        expect(err).toBeInstanceOf(HttpResponseError);
      }
      done();
    });

  });
});
