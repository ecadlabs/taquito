import { CONFIGS } from './config';
import { securityWrongAnnotations } from './data/security-wrong-annotations-contract';

// TC-009: Check whether wrong field annotations are leading to failed transactions.
/** 
 * The contract used has six entrypoints
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
 */

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts to verify wrong field annotations are leading to failed transactions using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify call Add', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

      console.log(contractAddition.address)

      //Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      //Calling Michelson code: CONTRACT %add (pair (nat %valueA) (nat %valueB)) ;

      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
              entrypoint: 'add',
              param: {
                valueA: 1,
                valueB: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }

      // Calls entrypoint: (pair %addNoAnnot nat nat))
      // Calling Michelson code: CONTRACT %addNoAnnot (pair (nat %valueA) (nat %valueB)) ;     
      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
              entrypoint: 'addNoAnnot',
              param: {
                valueA: 1,
                valueB: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
  
      // Calls entrypoint: (pair %addWrongAnnot (nat %a) (nat %b))
      // Calling Michelson code: CONTRACT %addWrongAnnot (pair (nat %valueA) (nat %valueB)) ;
      try{
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
              entrypoint: 'AddWrongAnnot',
              param: {
                a: 1,
                b: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
    } catch (ex) {
      expect(ex).toEqual(expect.objectContaining({
        message: expect.stringContaining('[valueA] Value is not a number: undefined')
      }))
    }
  
      // Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      // Calling Michelson code: CONTRACT %add (pair nat nat) ;
      
      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callNoAnnot({
              entrypoint: 'Add',
              param: {
                1: 1,
                2: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
  
      // Calls entrypoint: CONTRACT %addNoAnnot (pair nat nat) ;
      // Calling Michelson code: CONTRACT %addNoAnnot (pair (nat %valueA) (nat %valueB)) ;
      
      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callNoAnnot({
              entrypoint: 'AddNoAnnot',
              param: {
                1: 1,
                2: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
 
      // Calls entrypoint: CONTRACT %addWrongAnnot (pair nat nat) ;
      // Calling Michelson code: CONTRACT %addWrongAnnot (pair (nat %valueA) (nat %valueB)) ;
      
      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callNoAnnot({
              entrypoint: 'AddWrongAnnot',
              param: {
                1: 1,
                2: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
 
      // Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b)) ;

      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callWrongAnnot({
              entrypoint: 'Add',
              param: {
                valueA: 1,
                valueB: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
  
      // Calls entrypoint: (pair %addNoAnnot nat nat))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b))

      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callWrongAnnot({
              entrypoint: 'AddNoAnnot',
              param: {
                a: 1,
                b: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
   
      // Calls entrypoint: (pair %addWrongAnnot (nat %a) (nat %b))
      // Calling Michelson code: CONTRACT %add (pair (nat %a) (nat %b))
      
      try{
      const contractAddition = await addition.contract();
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .callWrongAnnot({
              entrypoint: 'AddWrongAnnot',
              param: {
                a: 1,
                b: 2,
              },
            })
            .send();
        })
        .then((op) => {
          return op.confirmation(3).then(() => op.hash);
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('[a] Value is not a number: undefined')
        }))
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
