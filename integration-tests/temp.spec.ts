    import { CONFIGS } from "./config";
    
    CONFIGS().forEach(({ lib, rpc, setup }) => {
      const Tezos = lib;
      describe(`Test temp: ${rpc}`, () => {
    
        beforeEach(async (done) => {
          await setup()
          done()
        })
        it('temp test 1', async () => {
            Tezos.contract
  .at('KT1UzQzHzpBxbT5HaUk8GPTYy1Xb54K96cJH')
  .then((myContract) => {
    return myContract
      .storage()
      .then((myStorage:any) => {
        //When called on a map, the get method returns the value directly
        const valueMap = myStorage['themap'].get({
          0: '1', //nat
          1: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', //address
        });
        console.log(`The value associated with the specified key of the map is ${valueMap}.`);
        return myContract.storage();
      })

      .then((myStorage:any) => {
        //When called on a bigMap, the get method returns a promise
        return myStorage['thebigmap'].get({
          0: '10', //nat
          1: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', //address
        });
      })
      .then((valueBigMap) => {
        console.log(`The value associated with the specified key of the bigMap is ${valueBigMap}.`);
      });
  })
  .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
        });

      });
    })