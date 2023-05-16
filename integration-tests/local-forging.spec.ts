import { CONFIGS } from "./config";
import { commonCases } from './data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);

  describe(`Test local forger: ${rpc}`, () => {
    // all protocols
    // commonCases.forEach(({ name, operation, expected }) => {
    //   it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
    //     const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
    //     const result = await localForger.forge(operation);
    //     const rpcResult = await Tezos.rpc.forgeOperations(operation);
    //     expect(result).toEqual(rpcResult);
    //     expect(await localForger.parse(result)).toEqual(expected || operation);

    //     done();
    //   });
    // });

    it('should be able to parse forged bytes', async done => {
      const localforger = new LocalForger(protocol as unknown as ProtocolsHash);
      const parsed = await localforger.parse('243e510d2587e2d64fab893ada523bc8620b647a13852d70d7cc44b7f83807196c01c3199e27c4aeb565af2247a51367e4fe1d57496e00ebf41890d627b295020001b06bcc79f21a464d718417de4950b38b75cb5b5400ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0005034f034d031b6c01c3199e27c4aeb565af2247a51367e4fe1d57496e00ecf41890d627b295020001b06bcc79f21a464d718417de4950b38b75cb5b5400ff020000003e02000000390320053d036d0743035d0100000024747a31636a796a613154553666697969466176336d4641646e44734352654a31326850440346034e031b6c01c3199e27c4aeb565af2247a51367e4fe1d57496e00edf41890d627b295020001b06bcc79f21a464d718417de4950b38b75cb5b5400ff0200000013020000000e0320053d036d053e035d034e031b');

      const parsed2 = await localforger.parse('243e510d2587e2d64fab893ada523bc8620b647a13852d70d7cc44b7f83807196c01c3199e27c4aeb565af2247a51367e4fe1d57496e8805ebf418b919000001b06bcc79f21a464d718417de4950b38b75cb5b5400ff020000004602000000410320053d036d0743035d0100000024747a31655935417161316b5844466f6965624c3238656d7958466f6e65416f5667317a68031e0743036a0005034f034d031b6c01c3199e27c4aeb565af2247a51367e4fe1d57496eaa04ecf4188f12000001b06bcc79f21a464d718417de4950b38b75cb5b5400ff020000003e02000000390320053d036d0743035d0100000024747a31636a796a613154553666697969466176336d4641646e44734352654a31326850440346034e031b6c01c3199e27c4aeb565af2247a51367e4fe1d57496ea904edf4188612000001b06bcc79f21a464d718417de4950b38b75cb5b5400ff0200000013020000000e0320053d036d053e035d034e031b');


      console.log(JSON.stringify(parsed));
      console.log(JSON.stringify(parsed2));

      expect(parsed).toBeDefined();
      
      done();
    })
  });
});
