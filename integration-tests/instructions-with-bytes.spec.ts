import { CONFIGS } from "./config";
import { Protocols, TezosOperationError } from "@taquito/taquito";
import { addContract, lslContract, lsrContract, notContract, orContract, xorContract } from "./data/instructions-with-bytes-contracts";

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
        code: addContract,
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
        code: lslContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
      done();
    });

    mumbaiAndAlpha(`Should be able to orignate contract with LSR parameter in michelson contract with bytes`, async done => {
      const contract = await Tezos.contract.originate({
        code: lsrContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
      done();
    });

    mumbaiAndAlpha(`Should be able to orignate contract with NOT parameter in michelson contract with bytes`, async done => {
      const contract = await Tezos.contract.originate({
        code: notContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
      done();
    });

    mumbaiAndAlpha(`Should be able to orignate contract with OR parameter in michelson contract with bytes`, async done => {
      const contract = await Tezos.contract.originate({
        code: orContract,
        storage: 0
      });
      await contract.confirmation();
      expect(contract).toBeDefined();
      expect(contract.contractAddress).toContain("KT1");
      expect(contract.status).toEqual('applied');
      done();
    });

    mumbaiAndAlpha(`Should be able to orignate contract with XOR parameter in michelson contract with bytes`, async done => {
      const contract = await Tezos.contract.originate({
        code: xorContract,
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
          code: addContract,
          storage: 0
        });
        await contract.confirmation();
      } catch (err) {
        expect(err).toBeInstanceOf(TezosOperationError);
      }
      done();
    });

  });
});
