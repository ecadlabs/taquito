import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
import { securityWrongAnnotations } from './data/security-wrong-annotations-contract';

// TC-009: Check whether wrong field annotations are leading to failed transactions.
/** 
 * The annotation test TC-009 is a general test to check whether the smart contracts still behave/react the same way. 
 * It is basically to understand and know that the smart contract primitives are still working as we thought they are working. 
 * If they may suddenly (e.g. with a protocol upgrade) change, this may open a (security) issue (e.g. external contracts can no longer be 
 * called, if annotation is done in a wrong way).

 * With the current behavior of annotations, we sometimes suggest in our smart contract assessment to not use field annotations, 
 * when calling other contracts. E.g. if a DEX crafts his calls to external contract and does not use any annotations 
 * (https://github.com/InferenceAG/TezosSecurityBaselineChecking/blob/master/testcases/TC-009/execute_test.sh#L36), 
 * the DEX is still able to interact e.g. with smart contracts which are not FA1.2/FA2 compatible, because they are using wrong annotations 
 * (e.g. "to" instead of "to_" for FA2 transfer entrypoints).
 *  
 * An example of the test contract is here: https://better-call.dev/ithacanet/KT1C4NcV4ebR6gS7SzbavkkSx3HYhWTBPVJ9/operations
 * 
 * The contract used has six entrypoints:
 * 
 * entrypoint:          parameter:
 * 
 * add                  (pair %add (nat %valueA) (nat %valueB))
 * addNoAnnot           (pair %addNoAnnot nat nat)
 * addWrongAnnot        (pair %addWrongAnnot (nat %a) (nat %b))
 * 
 * call                 (pair %call (string %entrypoint) (pair %param (nat %valueA) (nat %valueB)))
 * callNoAnnot          (pair %callNoAnnot (string %entrypoint) (pair %param nat nat))
 * callWrongAnnot       (pair %callWrongAnnot (string %entrypoint) (pair %param (nat %a) (nat %b)))
 * 
 * The test checks 9 cases: For each call entrypoint the tests call each of the three add entrypoints.
 * Its not entriely clear what should happen in each case. 
 * 
 * For example, 
 *    the first case calls "add" and passes nat %valueA and nat %valueB to CONTRACT %add (pair (nat %valueA) (nat %valueB)), so the annots and params match 
 *    the second case calls "addNoAnnot" and passes nat and nat to CONTRACT %addNoAnnot (pair (nat %valueA) (nat %valueB)), and here the  annots and params 
 *    do not match because there are no annots.
 *    the third case calls "addWrongAnnot" and passes nat a and nat b (where a and b are the annots) to CONTRACT %add (pair nat nat) and here the annots 
 *    and params do not match.
 * 
 *    When run the tests get unexpected exceptions such as 
 *        [a] Value is not a number: undefined
 *        [valueA] Value is not a number: undefined
 * 
 *  With Jakarta there is a change regarding Annotations: https://tezos.gitlab.io/protocols/013_jakarta.html#michelson. 
 *  This means the sub testcases 3 & 7 in TC-009 will behave differently in Jakarta.
 *        
 */

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const jakartanet = protocol === Protocols.PtJakart2 ? test : test.skip;
  const ithacanet = protocol === Protocols.Psithaca2 ? test : test.skip;

  describe(`Test contracts to verify wrong field annotations are leading to failed transactions using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    ithacanet('Verify annotation combinations on ithacanet', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

      //Testcase #1
      //Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      //Calling Michelson code: CONTRACT %add (pair (nat %valueA) (nat %valueB)) ;

      const op1 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
              entrypoint: 'add',
              param: {
                valueA: `1`,
                valueB: `2`,
              },
            })
            .send();
        })
        .then((op1) => {
          return op1.confirmation().then(() => op1.hash);
        });

      //Testcase #2
      // Calls entrypoint: (pair %addNoAnnot nat nat))
      // Calling Michelson code: CONTRACT %addNoAnnot (pair (nat %valueA) (nat %valueB)) ;
      try {
        const op2 = await Tezos.contract
          .at(contractAddition.address)
          .then((contract) => {
            return contract.methodsObject
              .call({
                entrypoint: 'addNoAnnot',
                param: {
                  0: `1`,
                  1: `2`,
                },
              })
              .send();
          })
          .then((op2) => {
            console.log(`Awaiting for ${op2.hash} to be confirmed...`);
            return op2.confirmation().then(() => op2.hash);
          });
      } catch (error: any) {
        expect(error.message).toContain('[valueA] Value is not a number: undefined');
      }

      //Testcase #3
      // Calls entrypoint: (pair %addWrongAnnot (nat %a) (nat %b))
      // Calling Michelson code: CONTRACT %addWrongAnnot (pair (nat %valueA) (nat %valueB)) ;
      
      try{
      const op3 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
              entrypoint: 'AddWrongAnnot',
              param: {
                a: `1`,
                b: `2`,
              },
            })
            .send();
        })
        .then((op3) => {
          return op3.confirmation(3).then(() => op3.hash);
        });
      } catch (error: any) {
        expect(error.message).toContain('[valueA] Value is not a number: undefined');
      }

      //Testcase #4
      // Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      // Calling Michelson code: CONTRACT %add (pair nat nat) ;

      const op4 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callNoAnnot({
              entrypoint: 'Add',
              param: {
                valueA: `1`,
                valueB: `2`,
                1: `1`,
                2: `2`,
              },
            })
            .send();
        })
        .then((op4) => {
          return op4.confirmation().then(() => op4.hash);
        });

      //Testcase #5
      // Calls entrypoint: CONTRACT %addNoAnnot (pair nat nat) ;
      // Calling Michelson code: CONTRACT %addNoAnnot (pair (nat %valueA) (nat %valueB)) ;

      const op5 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callNoAnnot({
              entrypoint: 'AddNoAnnot',
              param: {
                1: `1`,
                2: `2`,
              },
            })
            .send();
        })
        .then((op5) => {
          return op5.confirmation().then(() => op5.hash);
        });

      //Testcase #6
      // Calls entrypoint: CONTRACT %addWrongAnnot (pair nat nat) ;
      // Calling Michelson code: CONTRACT %addWrongAnnot (pair (nat %valueA) (nat %valueB)) ;

      const op6 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callNoAnnot({
              entrypoint: 'AddWrongAnnot',
              param: {
                1: `1`,
                2: `2`,
              },
            })
            .send();
        })
        .then((op6) => {
          return op6.confirmation().then(() => op6.hash);
        });

      //Testcase #7
      // Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b)) ;

      // const op7 = await Tezos.contract
      //   .at(contractAddition.address)
      //   .then((contract) => {
      //     return contract.methodsObject
      //       .callWrongAnnot({
      //         entrypoint: 'Add',
      //         param: {
      //           a: `1`,
      //           b: `2`,
      //         },
      //       })
      //       .send();
      //   })
      //   .then((op7) => {
      //     return op7.confirmation().then(() => op7.hash);
      //   });

      //Testcase #8
      // Calls entrypoint: (pair %addNoAnnot nat nat))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b))

      try{
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callWrongAnnot({
              entrypoint: 'AddNoAnnot',
              param: {
                1: `1`,
                2: `2`,
              },
            })
            .send();
        })
        .then((op8) => {
          return op8.confirmation().then(() => op8.hash);
        })
      } catch (error: any) {
        expect(error.message).toContain('[a] Value is not a number: undefined');
      }

        //Testcase #9
      // Calls entrypoint: (pair %addWrongAnnot (nat %a) (nat %b))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b))

      const op9 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callWrongAnnot({
              entrypoint: 'AddWrongAnnot',
              param: {
                a: `1`,
                b: `2`,
              },
            })
            .send();
        })
        .then((op9) => {
          return op9.confirmation().then(() => op9.hash);
        });
    });

    jakartanet('Verify annotation combinations on jakartanet', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

      //Testcase #3
      // Calls entrypoint: (pair %addWrongAnnot (nat %a) (nat %b))
      // Calling Michelson code: CONTRACT %addWrongAnnot (pair (nat %valueA) (nat %valueB)) ;

      const op10 = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
              entrypoint: 'AddWrongAnnot',
              param: {
                valueA: `1`,
                valueB: `2`,
              },
            })
            .send();
        })
        .then((op10) => {
          return op10.confirmation().then(() => op10.hash);
        });

      //Testcase #7
      // Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b)) ;

      try {
        const op11 = await Tezos.contract
          .at(contractAddition.address)
          .then((contract) => {
            return contract.methodsObject
              .callWrongAnnot({
                entrypoint: 'Add',
                param: {
                  valueA: `1`,
                  valueB: `2`,
                },
              })
              .send();
          })
          .then((op11) => {
            console.log(`Awaiting for ${op11.hash} to be confirmed...`);
            return op11.confirmation().then(() => op11.hash);
          });
      } catch (ex) {
        expect(ex).toEqual(
          expect.objectContaining({
            message: expect.stringContaining('[a] Value is not a number: undefined'),
          })
        );
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineCheckin
