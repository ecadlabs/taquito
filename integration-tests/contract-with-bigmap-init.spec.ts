import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { tokenBigmapCode } from "./data/token_bigmap";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Token with big map and with initial data using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Originage token contract with big map and with initialize storage/bigmaps', async (done) => {
      const addr = await Tezos.signer.publicKeyHash();
      const initialStorage = {
        owner: addr,
        accounts: MichelsonMap.fromLiteral({
          [addr]: {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          },
          "tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD": {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          },
          "tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2": {
            balance: "2",
            allowances: MichelsonMap.fromLiteral({
              KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv: "1",
              [addr]: "1"
            })
          },
          "tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS": {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          },
          "KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv": {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          }
        }),
        totalSupply: "6"
      }

      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenBigmapCode,
        storage: initialStorage
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract()
      const storage: any = await contract.storage()
      const got = (await storage.accounts.get(addr) ).allowances.get(addr).toString()
      const want = (initialStorage.accounts.get(addr) as {balance: string, allowances: MichelsonMap<string, string> }).allowances.get(addr)
      expect(got).toEqual(want)
      done();
    });
  });
})
