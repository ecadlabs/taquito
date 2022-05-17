import { CONFIGS } from './config';
import { securityWrongAnnotations } from './data/security-wrong-annotations-contract';

// TC-009: Check whether wrong field annotations are leading to failed transactions.

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts to verfiy wrong field annotations are leading to failed transactions using: ${rpc}`, () => {
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

      //Calls entrypoint: (pair %add (nat %valueA) (nat %valueB))
      //Calling Michelson code: CONTRACT %add (pair (nat %valueA) (nat %valueB)) ;

      try {
      const op = await Tezos.contract
        .at(contractAddition.address)
        .then((contract) => {
          return contract.methodsObject
            .call({
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
    });

    it('Verify call addNoAnnot', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify call AddWrongAnnot fails due to not matching field annotations', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify callNoAnnot Add', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify callNoAnnot AddNoAnnot', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify callNoAnnot AddWrongAnnot.', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify callWrongAnnot Add.', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify callWrongAnnot AddNoAnnot.', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();
      const contractAddition = await addition.contract();

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
    });

    it('Verify callWrongAnnot AddWrongAnnot.', async () => {
      const addition = await Tezos.contract.originate({
        code: securityWrongAnnotations,
        init: `0`,
      });
      await addition.confirmation();

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
