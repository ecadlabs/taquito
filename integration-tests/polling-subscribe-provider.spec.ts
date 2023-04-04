import { CONFIGS, sleep } from "./config";
import { PollingSubscribeProvider } from "@taquito/taquito";
import { localForger } from '@taquito/local-forging';
import { send } from "process";
import { validateAddress } from "@taquito/utils";

const _mainContractJsLigo = `type storage = unit
type parameter = {p: int, ad: address, t: tez}

export const main = ({p, ad, t} : parameter, store : storage) => {
    assert_with_error(p != 4, "The main contract fails if parameter is four");
    let tran = Tezos.transaction(p, t, Option.unopt(Tezos.get_contract_opt(ad)));
    let event1 = Tezos.emit("%intFromMainContract", p + 1);
    let event2 = Tezos.emit("%stringFromMainContract", "lorem ipsum");
    return [list([event1, event2, tran]), store];
}`;

const _calledContractJSLigo = `type storage = unit
type parameter = int

export const main = (param: parameter, store: storage) => {
  assert_with_error(param != 5, "The called contract fails if parameter is five");
  return [list([Tezos.emit("%eventFromCalledContract", param + 1)]), store];
}`;


CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let calledContractAddress: string;
  let mainContractAddress: string;

  describe(`Polling Subscribe Provider using ${rpc}`, () => {
    beforeAll(async (done) => {
      await setup();

      Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ shouldObservableSubscriptionRetry: true, pollingIntervalMilliseconds: 1000 }));

      try {
        const calledContract = await Tezos.contract.originate({
          code: `{ parameter int ;
            storage unit ;
            code { UNPAIR ;
                   PUSH int 5 ;
                   DUP 2 ;
                   COMPARE ;
                   NEQ ;
                   IF {}
                      { PUSH string "The called contract fails if parameter is five" ; FAILWITH } ;
                   SWAP ;
                   NIL operation ;
                   PUSH int 1 ;
                   DIG 3 ;
                   ADD ;
                   EMIT %eventFromCalledContract int ;
                   CONS ;
                   PAIR } }`,
          storage: 0  
        });
        await calledContract.confirmation();
        calledContractAddress = calledContract.contractAddress!;

        let mainContract = await Tezos.contract.originate({
          code: `{ parameter (pair (pair (address %ad) (int %p)) (mutez %t)) ;
            storage unit ;
            code { UNPAIR ;
                   UNPAIR ;
                   UNPAIR ;
                   PUSH int 4 ;
                   DUP 3 ;
                   COMPARE ;
                   NEQ ;
                   IF {}
                      { PUSH string "The main contract fails if parameter is four" ; FAILWITH } ;
                   CONTRACT int ;
                   IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
                   DIG 2 ;
                   DUP 3 ;
                   TRANSFER_TOKENS ;
                   PUSH int 1 ;
                   DIG 2 ;
                   ADD ;
                   EMIT %intFromMainContract int ;
                   PUSH string "lorem ipsum" ;
                   EMIT %stringFromMainContract string ;
                   DIG 3 ;
                   NIL operation ;
                   DIG 4 ;
                   CONS ;
                   DIG 2 ;
                   CONS ;
                   DIG 2 ;
                   CONS ;
                   PAIR } }`,
          storage: 0
        });
        await mainContract.confirmation();
        mainContractAddress = mainContract.contractAddress!;
      } catch(e) {
        console.log(e);
      }
      done();
    });

    it('should be able to subscribe to events with tag and address params given', async (done) => {
      const data: any = [];

      const eventSub = Tezos.stream.subscribeEvent({
        tag: 'intFromMainContract',
        address: mainContractAddress
      });

      eventSub.on('data', (x) => {
        data.push(x);
      });

      const contract = await Tezos.contract.at(mainContractAddress!);
      const op = await contract.methods.default(calledContractAddress, 2, 0).send();

      await op.confirmation();

      console.log(op);

      await sleep(3000);

      eventSub.close();

      expect(data.length).toEqual(1);
      expect(data[0].opHash).toBeDefined();
      expect(data[0].blockHash).toBeDefined();
      expect(data[0].level).toBeDefined();
      expect(data[0].kind).toEqual('event');
      expect(data[0].source).toEqual(mainContractAddress);
      expect(data[0].tag).toEqual('intFromMainContract');
      expect(data[0].type).toBeDefined();
      expect(data[0].payload).toBeDefined();
      expect(data[0].result).toBeDefined();

      done();
    });

    it('should include events from failed operations when not filtering', async (done) => {
      const data: any = [];

      const eventSub = Tezos.stream.subscribeEvent({
        address: mainContractAddress,
      });

      eventSub.on('error', (x) => {
        data.push({
          type: 'error',
          x
        });
      });

      eventSub.on('data', (x) => {
        data.push({
          type: 'data',
          x
        });
      });

      const contract = await Tezos.contract.at(mainContractAddress!);
      try {
        const startingBlock = await Tezos.rpc.getBlockHeader();
        console.log(`Starting Block: ${startingBlock.level}`);
        const call = contract.methods.default(calledContractAddress, 2, 0);
        const op = await call.send({
          fee: 1124,
          gasLimit: 7000, //7835,
          storageLimit: 10000,
        });

        await op.confirmation();
        console.log(op);
        console.log(`It succeeded!`);
      } catch(e) {
        const endingBlock = await Tezos.rpc.getBlockHeader();
        console.log(`Ending Block: ${endingBlock.level}`);
        console.log(mainContractAddress);
        console.log(e);
        // Failure is expected
      }
      
      await sleep(5000);
      eventSub.close();

      console.log(JSON.stringify(data));
      expect(data.length).toEqual(1);
      done();
    });

  })
})
