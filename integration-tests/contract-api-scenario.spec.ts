import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";
import { tokenCode, tokenInit } from "./data/tokens";
import { voteSample } from "./data/vote-contract";
import { managerCode } from "./data/manager_code";
import { NoopSigner } from "taquito/src/signer/noop";

const setDelegate = (key: string) => {
  return [{ "prim": "DROP" },
  { "prim": "NIL", "args": [{ "prim": "operation" }] },
  {
    "prim": "PUSH",
    "args":
      [{ "prim": "key_hash" },
      { "string": key }]
  },
  { "prim": "SOME" }, { "prim": "SET_DELEGATE" },
  { "prim": "CONS" }]
}

const transferImplicit = (key: string, mutez: number) => {
  return [{ "prim": "DROP" },
  { "prim": "NIL", "args": [{ "prim": "operation" }] },
  {
    "prim": "PUSH",
    "args":
      [{ "prim": "key_hash" },
      { "string": key }]
  },
  { "prim": "IMPLICIT_ACCOUNT" },
  {
    "prim": "PUSH",
    "args": [{ "prim": "mutez" }, { "int": `${mutez}` }]
  },
  { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" },
  { "prim": "CONS" }]
}

const removeDelegate = () => {
  return [{ "prim": "DROP" },
  { "prim": "NIL", "args": [{ "prim": "operation" }] },
  { "prim": "NONE", "args": [{ "prim": "key_hash" }] },
  { "prim": "SET_DELEGATE" }, { "prim": "CONS" }]
}

const transferToContract = (key: string, amount: number) => {
  return [{ "prim": "DROP" },
  { "prim": "NIL", "args": [{ "prim": "operation" }] },
  {
    "prim": "PUSH",
    "args":
      [{ "prim": "address" },
      { "string": key }]
  },
  { "prim": "CONTRACT", "args": [{ "prim": "unit" }] },
  [{
    "prim": "IF_NONE",
    "args":
      [[[{ "prim": "UNIT" }, { "prim": "FAILWITH" }]],
      []]
  }],
  {
    "prim": "PUSH",
    "args": [{ "prim": "mutez" }, { "int": `${amount}` }]
  },
  { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" },
  { "prim": "CONS" }]
}

CONFIGS.forEach(({ lib, rpc }) => {
  const Tezos = lib;
  describe(`Test contract api using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await Tezos.importKey("peqjckge.qkrrajzs@tezos.example.org", "y4BX7qS1UE", [
        "skate",
        "damp",
        "faculty",
        "morning",
        "bring",
        "ridge",
        "traffic",
        "initial",
        "piece",
        "annual",
        "give",
        "say",
        "wrestle",
        "rare",
        "ability"
      ].join(" "), "7d4c8c3796fdbf4869edb5703758f0e5831f5081")
      done()
    })
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
        init: `"test"`
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Manager tz', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })
      const contract = await op.contract();
      console.log(contract.parameterSchema.ExtractSchema())
      expect(op.status).toEqual('applied')
      // Transfer token to contract
      const opTransferToContract = await Tezos.contract.transfer({ to: contract.address, amount: 1 })
      await opTransferToContract.confirmation();
      expect(op.status).toEqual('applied')
      // Transfer token from contract
      const opTransfer = await contract.methods.do(transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)).send({ amount: 0 })
      await opTransfer.confirmation();
      expect(opTransfer.status).toEqual('applied')
      // Set delegate on contract
      const opSetDelegate = await contract.methods.do(setDelegate("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh")).send({ amount: 0 })
      await opSetDelegate.confirmation();
      expect(opSetDelegate.status).toEqual('applied')
      // Remove delegate op
      const removeDelegateOp = await contract.methods.do(removeDelegate()).send({ amount: 0 })
      await removeDelegateOp.confirmation();
      expect(removeDelegateOp.status).toEqual('applied')
      // Transfer to contract
      const transferToContractOp = await contract.methods.do(transferToContract("KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK", 1)).send({ amount: 0 })
      await transferToContractOp.confirmation();
      expect(transferToContractOp.status).toEqual('applied')
      done();
    })
    it('Simple ligo origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage()
      expect(storage.toString()).toEqual("0")
      const opMethod = await contract.methods.main("2").send();

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
      const opMethod = await contract.methods.mint(await Tezos.signer.publicKeyHash(), 100).send();

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
            key: null,
          },
          mgr2: {
            addr: await Tezos.signer.publicKeyHash(),
            key: await Tezos.signer.publicKeyHash(),
          },
        }
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Transfer and wait 2 confirmations', async (done) => {
      const op = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
      const conf = await op.confirmation()
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      console.log('Confirmed in: ', conf, op.includedInBlock)
      const [first, second] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second - first).toEqual(2)
      // Retrying another time should be instant
      const [first2, second2] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second2 - first2).toEqual(2)
      done();
    })
  });
})
