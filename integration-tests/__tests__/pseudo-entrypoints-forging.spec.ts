import { CONFIGS } from "../config";
import { DefaultContractType, UnitValue } from "@taquito/taquito";
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'

CONFIGS().forEach(({ rpc, protocol, setup, lib }) => {
  const Tezos = lib;

  describe(`Test forging pseudo entrypoints: ${rpc}`, () => {
    let contract: DefaultContractType
    // for every new protocol need to check https://tezos.gitlab.io/shell/p2p_api.html#alpha-entrypoint-determined-from-data-8-bit-tag for the latest entrypoints and corresponding tag
    let tallinnEntrypoint = { 0: 'default', 1: 'root', 2: 'do', 3: 'set_delegate', 4: 'remove_delegate', 5: 'deposit', 6: 'stake', 7: 'unstake', 8: 'finalize_unstake', 9: 'set_delegate_parameters' }

    beforeAll(async () => {
      await setup();
      try {
        // for every new entrypoint will need to modify the contract code to have new entrypoint covered
        let op = await Tezos.contract.originate({
          code: [{ "prim": "parameter", "args": [{ "prim": "or", "args": [{ "prim": "unit", "annots": ["%default"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%root"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%do"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%set_delegate"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%remove_delegate"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%deposit"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%stake"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%unstake"] }, { "prim": "or", "args": [{ "prim": "unit", "annots": ["%finalize_unstake"] }, { "prim": "unit", "annots": ["%set_delegate_parameters"] }] }] }] }] }] }] }] }] }] }] }, { "prim": "storage", "args": [{ "prim": "string" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "default" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "root" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "do" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "set_delegate" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "remove_delegate" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "deposit" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "stake" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "unstake" }] }], [{ "prim": "IF_LEFT", "args": [[{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "finalize_unstake" }] }], [{ "prim": "DROP" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "set_delegate_parameters" }] }]] }]] }]] }]] }]] }]] }]] }]] }]] }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
          storage: 'init'
        })
        await op.confirmation();
        contract = await op.contract();
      } catch (e) { console.log(e) }
    })

    Object.values(tallinnEntrypoint).forEach(name => {
      it(`Verify that local forge will return same result as for rpc forge for entrypoints name ${name}`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const methodObject = await contract.methodsObject[name](UnitValue)
        const prepared = await Tezos.prepare.contractCall(methodObject)
        const operation = Tezos.prepare.toForge(prepared)
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
      });
    })

  });
});
