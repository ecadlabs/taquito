import { CONFIGS } from "../config";
import { bytesAndInt, bytesAndNat } from "../data/instructions-bytes-conversions-contracts";

CONFIGS().forEach(({ lib, setup }) => {
  const Tezos = lib;

  describe(`Test origination of contract with instructions now supporting bytes conversion`, () => {

    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 });
    });

    it(`Should be able to originate a contract with BYTES -> INT -> BYTES instructions`, async () => {
      const contract = await Tezos.contract.originate({
        code: bytesAndInt,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

    it(`Should be able to originate a contract with BYTES -> NAT -> BYTES instructions`, async () => {
      const contract = await Tezos.contract.originate({
        code: bytesAndNat,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

  });
});
