import { CONFIGS, sleep } from './config';
import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';
import { localForger } from '@taquito/local-forging';
import { send } from 'process';
import { validateAddress } from '@taquito/utils';

const _mainContractJsLigo = `type storage = int
type parameter = {p: int, ad: address, t: tez, newStore: int}

export const main = ({p, ad, t, newStore} : parameter, store : storage) => {
    if (p == 1) {
        return [list([]), newStore];
    }
    assert_with_error(p != 4, "The main contract fails if parameter is four");
    let tran = Tezos.transaction(p, t, Option.unopt(Tezos.get_contract_opt(ad)));
    let event1 = Tezos.emit("%intFromMainContract", p + 1);
    if (store == 1) {
        let event2 = Tezos.emit("%stringFromMainContract", "lorem ipsum");
        return [list([event1, event2, tran]), newStore];
    } else {
        return [list([event1, tran]), newStore];
    }
}`;

const _calledContractJSLigo = `type storage = unit
type parameter = int

export const main = (param: parameter, store: storage) => {
  assert_with_error(param != 5, "The called contract fails if parameter is five");
  return [list([Tezos.emit("%eventFromCalledContract", param + 1)]), store];
}`;

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  let calledContractAddress: string;
  let mainContractAddress: string;
  let secondUser: TezosToolkit;

  describe(`Polling Subscribe Provider using ${rpc}`, () => {
    beforeAll(async (done) => {
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
          storage: 0,
        });
        await calledContract.confirmation();
        calledContractAddress = calledContract.contractAddress!;

        let mainContract = await Tezos.contract.originate({
          code: `{ parameter (pair (pair (address %ad) (int %newStore)) (int %p) (mutez %t)) ;
            storage int ;
            code { UNPAIR ;
                   UNPAIR ;
                   UNPAIR ;
                   DIG 2 ;
                   UNPAIR ;
                   PUSH int 1 ;
                   DUP 2 ;
                   COMPARE ;
                   EQ ;
                   IF { SWAP ; DIG 2 ; DIG 4 ; DROP 4 ; NIL operation }
                      { PUSH int 4 ;
                        DUP 2 ;
                        COMPARE ;
                        NEQ ;
                        IF {}
                           { PUSH string "The main contract fails if parameter is four" ; FAILWITH } ;
                        DIG 2 ;
                        CONTRACT int ;
                        IF_NONE { PUSH string "option is None" ; FAILWITH } {} ;
                        DIG 2 ;
                        DUP 3 ;
                        TRANSFER_TOKENS ;
                        PUSH int 1 ;
                        DIG 2 ;
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
                   PAIR } }`,
          storage: 0,
        });
        await mainContract.confirmation();
        mainContractAddress = mainContract.contractAddress!;
      } catch (e) {
        console.log(e);
      }
      done();
    });

    beforeEach(async (done) => {
      const contract = await Tezos.contract.at(mainContractAddress!);
      const resetStorageOperation = await contract.methodsObject.default({
        ad: calledContractAddress,
        newStore: 0,
        p: 1,
        t: 0
      }).send();
      await resetStorageOperation.confirmation();
      done();
    });

    it('should be able to subscribe to events with tag and address params given', async (done) => {
      const data: any = [];

      const eventSub = Tezos.stream.subscribeEvent({
        tag: 'intFromMainContract',
        address: mainContractAddress,
      });

      eventSub.on('data', (x) => {
        data.push(x);
      });

      const contract1 = await Tezos.contract.at(mainContractAddress!);
      const contract2 = await secondUser.contract.at(mainContractAddress!);
      

      const operation1 = contract1.methodsObject.default({
        ad: calledContractAddress,
        newStore: 0,
        p: 0,
        t: 0
      });

      const operation2 = contract2.methodsObject.default({
        ad: calledContractAddress,
        newStore: 0,
        p: 0,
        t: 0
      });

      const sent1 = await operation1.send();
      const sent2 = await operation2.send();

      await sent1.confirmation();
      await sent2.confirmation();

      await sleep(3000);

      eventSub.close();

      expect(data.length).toEqual(2);
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
          ad: calledContractAddress,
          newStore: 1,
          p: 0,
          t: 0
        });
  
        const operation2 = contract2.methodsObject.default({
          ad: calledContractAddress,
          newStore: 0,
          p: 0,
          t: 0
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
      expect(data[1].event.result.status).toEqual('backtracked');
      done();
    });

    it('should properly filter events from failed operations', async (done) => {
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
          ad: calledContractAddress,
          newStore: 1,
          p: 0,
          t: 0
        });
  
        const operation2 = contract2.methodsObject.default({
          ad: calledContractAddress,
          newStore: 0,
          p: 0,
          t: 0
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
      done();
    });
  });
});

/* 
1- Send two transactions from two users in parallel
2- The first transaction will change a value in storage
3- The second transaction depends on that value and does an extra thing
4- Because of the extra thing (emits the event), the gas cost will be higher than estimated
5- The second transaction will fail (gas exhaustion, backtracked)
6- The second transaction ends up on the block (as backtracked)
7- The event emitted from the second transaction will be received

8- check that the cost estimation of the two transactions are equal, but in reality, the second transaction costs more gas
*/
