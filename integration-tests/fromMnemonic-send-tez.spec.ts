import { InMemorySigner } from "@taquito/signer";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
   describe(`Test fromMnemonic instantiation with rpc: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Should create an InMemorySigner with the fromMnemonic method and transfer tez to an account', async (done) => {
      const Tezos = lib

      const mnemonic = 'author crumble medal dose ribbon permit ankle sport final hood shadow vessel horn hawk enter zebra prefer devote captain during fly found despair business'
      // with all default values
      const signer = InMemorySigner.fromMnemonic(mnemonic)
      Tezos.setSignerProvider(signer)
      // secp256k1 key of same mnemonic
      const send = await Tezos.wallet.transfer({to: 'tz2SxDTGnT3mHzaHf6mwy6Wtw1qUX1hzm1Sw', amount: 0.1}).send()
      await send.confirmation();
      const status = await send.status()
      expect(status).toEqual('applied')
      done()
    })
  });
})
