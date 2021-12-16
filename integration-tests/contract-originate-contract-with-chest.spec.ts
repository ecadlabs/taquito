import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const hangzhounetOrHigher = (protocol === Protocols.PtHangz2 || protocol === Protocols.ProtoALpha) ? test : test.skip;
  describe(`Originate contract with timelock types (chest or chest_key) in storage and retrieve its value: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })
    hangzhounetOrHigher('originates a contract with chest in storage', async (done) => {
        const chestValue = 'bc92e2db9de1b4a8bbf8d186d3eac5e0d2aeefaccd96b3c59dabc3d4f1d1b89494c181e4cff3bfb2c0fda189edad93ddb3c5a9dfbdb5f1ae98b49ae9f395aa8f91d6e5e4b78aacbac4f3a595dbc7e6dafbe3cf8bf38ce183a7bbc7be9ae3bfe7f487a28d93c7a3cdf597a5e188828ff8d192ddf28eb4a4c9beffbf9383e9e18ccb90e3b6b499ffd1b4fbabd68ca3fab2d2eeb2f9c6fbb9fdb5dab69fbbb6e893f0eac2b2dde5dca382c7fea6fde7dae186ca99b4e9a6eb90eec9a6e080c6b3baccf8d9fbc1d0d782a3e7b28dbfeccdaec6c4f592d7dcffc8e69af2aa9eb7aeb1f7cce0d899d38eb2a5abf0c0f395ced28ca395d9cb8e9ab6f387dbdce6b4db8af0ada493e0d5ee8bf8f99ea8ae9f9386e3c69ef9ffdfa9898f8594ff97cfa0bcc3f1c64af7c88ba5f694defdd7e7bdf9afb9f5f3babde98d85b18cfd9ffd82e8de9d8ac6d4f5dacfe28ae087f5ea8da5e984abcdb888e6d2debcaf98e6d4d2d296c6d083ffaecdbffca6c7e0beded4c5eac795e6a5829bbe94f3ebaef3e6a0d1e395889a9e90d490f8afeea9bb968f8bdedaf8d288fcd8bfb68db29293e4e1b8c0a7e6ad9fe79191e9e9e8e58f9dc098fd8792adc8dea2c7facfbdddd082c2d784ecdddebc8aa6fe8abd94f0f4a3c2cdfbd99ac0f1c2929686f5cfe4bbd3e6cf87cebadcf0efc0eea29bebc5c5d496aeb0fdd9a0d3ce98a1dbd39da5d487b29ba2caf2cdffaff89cb3fe9afaffe7cb85f68b90e9e1a8df8f89ea97b589a7b9b991bec2e1bfa4edbed49fb3abe2ade2bc9dc7a5bfc3fed5f5c0dfb199cafd8bd1f59adae8dbe8b39701cb0982a71363254e51ebe33ea52ec2cd61e9234e11891cfa0000001c67e1d80f729e0621c48cc74afc15e7551eb8c198b3151605e431863f'
      const op = await Tezos.contract.originate({
        balance: "1",
        code: [{"prim":"parameter","args":[{"prim":"chest"}]},{"prim":"storage","args":[{"prim":"chest"}]},{"prim":"code","args":[[{"prim":"CAR"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
        storage: chestValue,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(chestValue);
      done();
    });

    hangzhounetOrHigher('originates a contract with chest_key in storage', async (done) => {
        const chestKeyValue = 'e4c381978ba7ebedf29781eadfe6b7e0bfcca9a581f0a5f8959efdbadacce9d1d0d8e7bdf8adff92c586f5ebd6ecb5eef6d69bf7bdd38feba7c895a0e4cee0cabaffdeacca91f69ac9a7e684b8fbf9c584c7f889998b9881bbebead2f3a48794999cb8c6a299939f95f7b0e6bcf8f4f492c398ea8fe7b3f7c591a2d9f3bbc19d9facaf91afc5fde1c0f6a0ed9be2bdf79198c787f0f5d2e28cf8d1d180c5879aa7959c98b79cb8f9b3c3a4c0c6b7ae8ed7ddddaa86d9ece78ecccac1878cfd8db7ae94e1979980ecad98d4f4fba2a8d2e7e098f5fdccbbea868ed7e085f7d0f5bbb48c84ebe78bcbc78c86d9c6b4d7ede99888d0e38d84a1aa91a5cec8d4e3e6ccabcebbe2a0e0a18aa6c090a3a9f0a4fdf3a89ecbffdccaedf6e2e8f3bcada5f8ce9a7cfde0958f89b0e3b7f6badf84f5eb94e389b2a3f1cfcadbf3cdb4bbec95e9f3cef7cca3b6f187b0e6e997cc84c7ddd0948d80b186b0b1b089c2b3bcee80f8918d8dafc1c2a6c2a193f492c6e0cfd18998fefee7fdb1c5acae8fc29be097fa9e948ec292edc997ef9bcca8eab694bff688d28c89c8adae90b19f9ef3a0f3e1abfffff0c5b7f6bddaeffbb9fbecaa98a6ed9d92e8bab9d29cadf7dfe3ada1bc89c9a59af1dffea284d7edc9f2d1c8b0fd9fcc999ce7fdfdeccc9cafe1d7d2fef1eeda8babc1f2f282a5ee919da88a8ff093a8c5f8c3fcddf5c7ccdef8ceb496a2848d8284bae2e8bdbcdfd9f1b1adffd788e880cc82d3a8c5a086cfc3fde1fad3c6a0d1dac2a4e6ccf7a0bcc9abf499888ed49cefc1f0aed9d8bef0cbaabe91e9f9adab933c'
      const op = await Tezos.contract.originate({
        balance: "1",
        code: [{"prim":"parameter","args":[{"prim":"chest_key"}]},{"prim":"storage","args":[{"prim":"chest_key"}]},{"prim":"code","args":[[{"prim":"CAR"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}],
        storage: chestKeyValue,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(chestKeyValue);
      done();
    });
  });
})
