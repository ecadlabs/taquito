import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";
import { tokenCode, tokenInit } from "./data/tokens";
import { voteSample } from "./data/vote-contract";

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
        storage: 0,
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

    it('Token origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(await Tezos.signer.publicKeyHash()),
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();
      const opMethod = await contract.methods.mint(await Tezos.signer.publicKeyHash(), 100).send({
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      });

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Token origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: voteSample,
        storage: {
          mgr1: {
            addr: await Tezos.signer.publicKeyHash(),
          },
          mgr2: {
            addr: await Tezos.signer.publicKeyHash(),
            key: await Tezos.signer.publicKeyHash(),
          },
        },
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Simple contract storage', async (done) => {
      const contract = await Tezos.contract.at("KT1AsziDG3FY7qcHhYp6DwNgeDc3bf7PT4hw")
      expect(await contract.storage()).toBe("Hello Tezos!")
      done();
    });
  });
})
