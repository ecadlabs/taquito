import { CONFIGS } from "./config";
import { Protocols, PollingSubscribeProvider } from "@taquito/taquito";

const eventContractAddress = 'KT1GXjpeB63bXGEoMB9HR5mj6fPS7rfWSjqW';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const kathmandunet = protocol === Protocols.PtKathman ? test: test.skip;

  describe(`Polling Subscribe Provider using ${rpc}`, () => {
    beforeAll(async (done) => {
      await setup();
      done();
      
      Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ shouldObservableSubscriptionRetry: true, pollingIntervalMilliseconds: 1000 }));
    });

    kathmandunet('should be able to subscribe to events with tag and address params given', async (done) => {
      const data: any = [];
      
      const eventSub = Tezos.stream.subscribeEvent({
        tag: 'first',
        address: eventContractAddress
      });

      eventSub.on('data', (x) => {
        data.push(x);
      });
      
      const contract = await Tezos.contract.at(eventContractAddress);
      const op = await contract.methods.default().send();
      
      await op.confirmation();

      await sleep(5000);

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