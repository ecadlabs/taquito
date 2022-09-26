import { CONFIGS } from "./config";
import { Protocols, PollingSubscribeProvider } from "@taquito/taquito";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const kathmandunetAndMondaynet = protocol === Protocols.PtKathman || Protocols.ProtoALpha ? test: test.skip;
  let eventContractAddress: string;
  
  describe(`Polling Subscribe Provider using ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();

      Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ shouldObservableSubscriptionRetry: true, pollingIntervalMilliseconds: 1000 }));
      
      try {
        const op = await Tezos.contract.originate({
          code: `{ parameter unit ;
            storage unit ;
            code { DROP ;
                   UNIT ;
                   PUSH nat 10 ;
                   LEFT string ;
                   EMIT %first ;
                   PUSH string "lorem ipsum" ;
                   RIGHT nat ;
                   EMIT %second (or (nat %number) (string %words)) ;
                   NIL operation ;
                   SWAP ;
                   CONS ;
                   SWAP ;
                   CONS ;
                   PAIR } }`,
          storage: 0
        });
        await op.confirmation();
        
        eventContractAddress = op.contractAddress!;
      } catch(e) {
        console.log(e);
      }
      done();
    });

    kathmandunetAndMondaynet('should be able to subscribe to events with tag and address params given', async (done) => {
      const data: any = [];
      
      const eventSub = Tezos.stream.subscribeEvent({
        tag: 'first',
        address: eventContractAddress
      });

      eventSub.on('data', (x) => {
        data.push(x);
      });
      
      const contract = await Tezos.contract.at(eventContractAddress!);
      const op = await contract.methods.default().send();
      
      await op.confirmation();

      await sleep(3000);

      eventSub.close();

      expect(data.length).toEqual(1);
      expect(data[0].opHash).toBeDefined();
      expect(data[0].blockHash).toBeDefined();
      expect(data[0].level).toBeDefined();
      expect(data[0].kind).toEqual('event');
      expect(data[0].source).toEqual(eventContractAddress);
      expect(data[0].tag).toEqual('first');
      expect(data[0].type).toBeDefined();
      expect(data[0].payload).toBeDefined();
      expect(data[0].result).toBeDefined();

      done();
    });
  })
})