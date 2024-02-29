import { CONFIGS } from "../../config";
import { recFactApplyStore, recursiveLambda, reduceMap } from "../../data/lambda-rec";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test deploying and interacting with contracts having recursive lambda through the contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true);
    })

    it('Verify that a contract having the LAMBDA_REC instruction in its code can be deployed', async () => {
      const deployContract = await Tezos.contract.originate({
        code: recFactApplyStore,
        storage: { 0: 3 }
      });

      await deployContract.confirmation();
      expect(deployContract.hash).toBeDefined();
      expect(deployContract.status).toEqual('applied');

    });

    it('Verify that a contract entrypoint having a type lambda can be called with a recursive lambda', async () => {
      const deployContract = await Tezos.contract.originate({
        code: reduceMap,
        storage: [1]
      });
      await deployContract.confirmation();
      const contract = await deployContract.contract();

      const op = await contract.methodsObject.default({
        0: { prim: "Lambda_rec", args: recursiveLambda },
        1: [1]
      }).send();

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');

    });
  });
})
