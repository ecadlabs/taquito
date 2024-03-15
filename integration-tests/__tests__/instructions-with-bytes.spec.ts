import { CONFIGS } from "../config";
import { addContract, lslContract, lsrContract, notContract, orContract, xorContract } from "../data/instructions-with-bytes-contracts";

CONFIGS().forEach(({ lib, setup }) => {
  const Tezos = lib;

  describe(`Test origination of contract with instructions now supporting bytes`, () => {

    beforeEach(async () => {
      await setup();
    });

    it(`Should be able to orignate contract with ADD parameter in michelson contract with bytes`, async () => {
      const contract = await Tezos.contract.originate({
        code: addContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

    it(`Should be able to orignate contract with LSL parameter in michelson contract with bytes`, async () => {
      const contract = await Tezos.contract.originate({
        code: lslContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

    it(`Should be able to orignate contract with LSR parameter in michelson contract with bytes`, async () => {
      const contract = await Tezos.contract.originate({
        code: lsrContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

    it(`Should be able to orignate contract with NOT parameter in michelson contract with bytes`, async () => {
      const contract = await Tezos.contract.originate({
        code: notContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

    it(`Should be able to orignate contract with OR parameter in michelson contract with bytes`, async () => {
      const contract = await Tezos.contract.originate({
        code: orContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });

    it(`Should be able to orignate contract with XOR parameter in michelson contract with bytes`, async () => {
      const contract = await Tezos.contract.originate({
        code: xorContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
    });
  });
});
