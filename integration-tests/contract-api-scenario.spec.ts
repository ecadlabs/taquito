import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";

CONFIGS.forEach(({ lib, rpc }) => {
  const Tezos = lib;
  describe(`Test contract api using: ${rpc}`, () => {
    it('Simple origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: `parameter string;
        storage string;
        code {CAR;
              PUSH string "Hello ";
              CONCAT;
              NIL operation; PAIR};
        `,
        init: `"test"`,
        fee: 30000,
        storageLimit: 2000,
        gasLimit: 90000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Simple ligo origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: ligoSample,
        init: { int: "0" },
        fee: 30000,
        storageLimit: 2000,
        gasLimit: 90000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      const contract = await op.contract();
      const storage: any = await contract.storage()
      expect(storage.toString()).toEqual("0")
      const opMethod = await contract.methods.main("2").send({
        fee: 30000,
        storageLimit: 2000,
        gasLimit: 90000,
      });

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const storage2: any = await contract.storage()
      expect(storage2.toString()).toEqual("2")
      done();
    });

    it('Simple contract storage', async (done) => {
      const contract = await Tezos.contract.at("KT1AsziDG3FY7qcHhYp6DwNgeDc3bf7PT4hw")
      expect(await contract.storage()).toBe("Hello Tezos!")
      done();
    });
  });
})
