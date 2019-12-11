import { CONFIGS } from "./config";
import { createTransferOperation, TransactionOperation, flattenOperationContent, MAGIC_BYTES_BUF } from "@taquito/taquito";

CONFIGS.forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  beforeEach(async (done) => {
    await setup();
    done();
  })

  describe(`Wallet building blocks: ${rpc}`, () => {
    it('Should be able to rely on public api to sign and inject', async (done) => {
      const forgeOperation = async (params: { amount: number, to: string }) => {
        // Use the estimator API to get an approximation of the fees, gas and storage
        const estimation = await Tezos.estimate.transfer(params);

        // Map the params to a partial RPC operation content
        const operation = await createTransferOperation({
          ...params,
          ...estimation,
        });

        // Create an RPC compliant operation from the partial list of operation contents (Apply counter and add reveal operation if necessary)
        const prepared = await Tezos.preparer.prepare([operation])

        // Forge the operation
        const forged = await Tezos.forger.forge(prepared);

        return {
          operation,
          prepared,
          forged,
        }
      }

      const signAndInject = async ({ operation, forged, prepared }: any) => {
        // Sign the forged bytes using the current signer
        const signature = await Tezos.signer.sign(forged, MAGIC_BYTES_BUF.Generic())

        // Make a call to the preapply rpc endpoint (this is a pre-validation of the operation)
        const preapplyResponse = await Tezos.rpc.preapplyOperations([{ ...prepared, signature: signature.prefixSig }])

        // Split the RPC response between successful operation content and error ones
        // This contains all the internal operation that could have been made by a smart contract
        const { opResponse, errors } = flattenOperationContent(preapplyResponse)

        if (errors.length) {
          throw new Error('Operation contains errors')
        }

        // If no error were discovered we inject the signed operation into the network
        const hash = await Tezos.injector.inject(signature.sbytes)

        // Create a standard Taquito operation that allow us to wait for confirmation and get some details
        return new TransactionOperation(
          hash,
          operation,
          await Tezos.signer.publicKeyHash(),
          { opOb: prepared, opbytes: forged },
          opResponse,
          Tezos['_context'].clone()
        )
      }

      // Execute both functions
      const { forged, operation, prepared } = await forgeOperation({ amount: 1, to: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' })
      const op = await signAndInject({ forged, operation, prepared })
      await op.confirmation();
      done();
    })
  })
})
