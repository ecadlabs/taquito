import { CONFIGS, sleep } from '../config';
import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';

/* mainContract.jsligo: This is the source code for the main contract.
If you need to change the main contract, you can change this, use the ligo compiler to compile it, and update both the Michelson code below and the jsligo here.

const _mainContractJsLigo = `type storage = int
type parameter = {mode: int, targetContractAddress: address, amount: tez, newStore: int}

export const main = ({mode, targetContractAddress, amount, newStore} : parameter, store : storage) => {
    if (mode == 1) {
        return [list([]), newStore];
    }
    assert_with_error(mode != 4, "The main contract fails if parameter is four");
    let tran = Tezos.transaction(mode, amount, Option.unopt(Tezos.get_contract_opt(targetContractAddress)));
    let event1 = Tezos.emit("%intFromMainContract", mode + 1);
    if (store == 1) {
        let event2 = Tezos.emit("%stringFromMainContract", "lorem ipsum");
        return [list([event1, event2, tran]), newStore];
    } else {
        return [list([event1, tran]), newStore];
    }
}`; */

const mainContractMichelson = `{ parameter
  (pair (pair (mutez %amount) (int %mode))
        (int %newStore)
        (address %targetContractAddress)) ;
  storage int ;
  code { UNPAIR ;
         UNPAIR ;
         UNPAIR ;
         DIG 2 ;
         UNPAIR ;
         PUSH int 1 ;
         DUP 5 ;
         COMPARE ;
         EQ ;
         IF { SWAP ; DIG 2 ; DIG 3 ; DIG 4 ; DROP 4 ; NIL operation }
            { PUSH int 4 ;
              DUP 5 ;
              COMPARE ;
              NEQ ;
              IF {}
                 { PUSH string "The main contract fails if parameter is four" ; FAILWITH } ;
              SWAP ;
              CONTRACT int ;
              IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
              DIG 2 ;
              DUP 4 ;
              TRANSFER_TOKENS ;
              PUSH int 1 ;
              DIG 3 ;
              ADD ;
              EMIT %intFromMainContract int ;
              PUSH int 1 ;
              DIG 4 ;
              COMPARE ;
              EQ ;
              IF { PUSH string "lorem ipsum" ;
                   EMIT %stringFromMainContract string ;
                   DIG 3 ;
                   NIL operation ;
                   DIG 4 ;
                   CONS ;
                   DIG 2 }
                 { DIG 2 ; NIL operation ; DIG 3 } ;
              CONS ;
              DIG 2 ;
              CONS } ;
         PAIR } }`;

/* CalledContract.jsligo:

const _calledContractJSLigo = `type storage = unit
type parameter = int

export const main = (param: parameter, store: storage) => {
  assert_with_error(param != 5, "The called contract fails if parameter is five");
  return [list([Tezos.emit("%eventFromCalledContract", param + 1)]), store];
}`; */

const calledContractMichelson = `{ parameter int ;
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
         PAIR } }`;

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  let calledContractAddress: string;
  let mainContractAddress: string;
  let secondUser: TezosToolkit;

  describe(`Polling Subscribe Provider using ${rpc}`, () => {
    beforeAll(async () => {
      await setup();

      secondUser = await createAddress();
      const secondUserAddress = await secondUser.signer.publicKeyHash();
      const transfer = await Tezos.contract.transfer({ to: secondUserAddress, amount: 1 });
      await transfer.confirmation();

      Tezos.setStreamProvider(
        Tezos.getFactory(PollingSubscribeProvider)({
          shouldObservableSubscriptionRetry: true,
          pollingIntervalMilliseconds: 1000,
        })
      );

      try {
        const calledContract = await Tezos.contract.originate({
          code: calledContractMichelson,
          storage: 0,
        });
        await calledContract.confirmation();
        calledContractAddress = calledContract.contractAddress!;

        let mainContract = await Tezos.contract.originate({
          code: mainContractMichelson,
          storage: 0,
        });
        await mainContract.confirmation();
        mainContractAddress = mainContract.contractAddress!;
      } catch (e) {
        console.log(e);
      }
    });

    beforeEach(async () => {
      const contract = await Tezos.contract.at(mainContractAddress!);
      const resetStorageOperation = await contract.methodsObject
        .default({
          targetContractAddress: calledContractAddress,
          newStore: 0,
          mode: 1,
          amount: 0,
        })
        .send();
      await resetStorageOperation.confirmation();
    });

    it('should be able to subscribe to events with tag and address params given', async () => {
      const data: any = [];

      const eventSub = Tezos.stream.subscribeEvent({
        tag: 'intFromMainContract',
        address: mainContractAddress,
      });

      eventSub.on('data', (x) => {
        data.push(x);
      });

      const contract1 = await Tezos.contract.at(mainContractAddress!);

      const operation1 = contract1.methodsObject.default({
        targetContractAddress: calledContractAddress,
        newStore: 0,
        mode: 0,
        amount: 0,
      });

      const sent1 = await operation1.send();

      await sent1.confirmation();

      await sleep(5000);
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

    });

    it.skip('should include events from failed operations when filter does not exclude events from failed operations', async () => {
      const data: any = [];

      const eventSub = Tezos.stream.subscribeEvent({
        address: mainContractAddress,
      });

      eventSub.on('error', (event) => {
        data.push({
          type: 'error',
          event,
        });
      });

      eventSub.on('data', (event) => {
        data.push({
          type: 'data',
          event,
        });
      });

      const contract1 = await Tezos.contract.at(mainContractAddress!);
      const contract2 = await secondUser.contract.at(mainContractAddress!);
      try {
        const operation1 = contract1.methodsObject.default({
          targetContractAddress: calledContractAddress,
          newStore: 1,
          mode: 0,
          amount: 0,
        });

        const operation2 = contract2.methodsObject.default({
          targetContractAddress: calledContractAddress,
          newStore: 1,
          mode: 0,
          amount: 0,
        });

        const sent1 = await operation1.send();
        const sent2 = await operation2.send();

        await sent1.confirmation();
        await sent2.confirmation();
      } catch (e) {
        // Failure is expected
      }

      await sleep(5000);
      eventSub.close();

      expect(data.length).toEqual(3);
      expect(data.filter((x: any) => x.event.result.status === 'backtracked').length).toEqual(2);
    });

    it.skip('should properly filter events from failed operations', async () => {
      const data: any = [];

      const eventSub = Tezos.stream.subscribeEvent({
        address: mainContractAddress,
        excludeFailedOperations: true,
      });

      eventSub.on('error', (event) => {
        data.push({
          type: 'error',
          event,
        });
      });

      eventSub.on('data', (event) => {
        data.push({
          type: 'data',
          event,
        });
      });

      const contract1 = await Tezos.contract.at(mainContractAddress!);
      const contract2 = await secondUser.contract.at(mainContractAddress!);
      try {
        const operation1 = contract1.methodsObject.default({
          targetContractAddress: calledContractAddress,
          newStore: 1,
          mode: 0,
          amount: 0,
        });

        const operation2 = contract2.methodsObject.default({
          targetContractAddress: calledContractAddress,
          newStore: 1,
          mode: 0,
          amount: 0,
        });

        const sent1 = await operation1.send();
        const sent2 = await operation2.send();

        await sent1.confirmation();
        await sent2.confirmation();
      } catch (e) {
        // Failure is expected
      }

      await sleep(5000);
      eventSub.close();

      expect(data.length).toEqual(1);
      expect(data[0].event.result.status).toEqual('applied');
    });
  });
});
