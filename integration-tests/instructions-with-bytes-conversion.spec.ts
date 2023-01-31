import { CONFIGS } from "./config";
import { Protocols } from "@taquito/taquito";
import { bytesAndInt, bytesAndNat } from "./data/instructions-bytes-conversions-contracts";
import { HttpResponseError } from "@taquito/http-utils";

CONFIGS().forEach(({ lib, protocol, setup }) => {
  const Tezos = lib;
  const limanet = protocol === Protocols.PtLimaPtL ? test : test.skip;
  const mumbaiAndAlpha = protocol === Protocols.PtMumbaii || protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test origination of contract with instructions now supporting bytes conversion`, () => {

    beforeEach(async (done) => {
      await setup();
      done();
    });

    mumbaiAndAlpha(`Should be able to originate a contract with BYTES -> INT -> BYTES instructions`, async done => {
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

    mumbaiAndAlpha(`Should be able to originate a contract with BYTES -> NAT -> BYTES instructions`, async done => {
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

    limanet('Should fail with non-supported BYTES and NAT instructions', async (done) => {
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
