import { OperationContentsAndResultDelegation, OperationContentsAndResultIncreasePaidStorage, OperationContentsAndResultOrigination, OperationContentsAndResultRegisterGlobalConstant, OperationContentsAndResultReveal, OperationContentsAndResultSmartRollupAddMessages, OperationContentsAndResultSmartRollupOriginate, OperationContentsAndResultTransaction, OperationContentsAndResultTransferTicket, OperationContentsAndResultUpdateConsensusKey, PvmKind } from '@taquito/rpc';
import { OpKind, UnitValue, PreparedOperation } from '@taquito/taquito';
import { CONFIGS } from '../config';
import { LocalForger } from '@taquito/local-forging';
const crypto = require('crypto');

CONFIGS().forEach(({ lib, setup, createAddress, knownTicketContract }) => {
  const Tezos = lib;
  let pkh: string;
  let code = `parameter unit; storage unit; code {CAR; NIL operation; PAIR};`;
  let localForger = new LocalForger();
  let prepared: PreparedOperation
  let method: any, args: any

  describe(`Test Preparation of operations using PrepareProvider`, () => {
    beforeAll(async () => {
      await setup(true);
      pkh = await Tezos.signer.publicKeyHash();
    })

    it('should prepare a reveal operation correctly', async () => {
      prepared = await Tezos.prepare.reveal({})
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('reveal');
    });

    it('should toForge a prepared reveal operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared reveal operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      const content = toPreapply[0].contents[0] as OperationContentsAndResultReveal;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('reveal');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');

      // injected so the rest of tests will run smoothly
      const op = await Tezos.contract.reveal({})
      await op.confirmation();
    });

    it('should prepare an originate operation correctly', async () => {
      prepared = await Tezos.prepare.originate({ code, storage: UnitValue });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('origination');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared originate operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared originate operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultOrigination;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('origination');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a contract call operation correctly', async () => {
      // send 3 tickets to the pkh
      let contract = await Tezos.contract.at(knownTicketContract);
      method = await contract.methodsObject.default({ 0: pkh, 1: '3' });

      prepared = await Tezos.prepare.contractCall(method);
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('transaction');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared contract call operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared contract call operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultTransaction;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('transaction');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');

      // injected so transferTicket test can run
      const op = await method.send();
      await op.confirmation();
    })

    it('should prepare a transaction operation correctly', async () => {
      prepared = await Tezos.prepare.transaction({ to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', amount: 5 });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('transaction');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared transaction operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared transaction operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultTransaction;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('transaction');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a delegation operation correctly', async () => {
      args = { source: pkh, delegate: pkh }
      prepared = await Tezos.prepare.delegation(args);
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('delegation');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared delegation operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared delegation operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultDelegation;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('delegation');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');

      // injected so the updateConcensusKey test can run
      const op = await Tezos.contract.setDelegate(args)
      await op.confirmation();
      expect(op.includedInBlock).toBeDefined
    })

    it('should prepare a registerGlobalConstant operation correctly', async () => {
      prepared = await Tezos.prepare.registerGlobalConstant({ value: { prim: 'list', args: [{ prim: 'nat' }], annots: [`%${crypto.randomBytes(3).toString('hex')}`] } });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('register_global_constant');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared registerGlobalConstant operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared registerGlobalConstant operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultRegisterGlobalConstant;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('register_global_constant');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a updateConcensusKey operation correctly', async () => {
      let concensusAccount = await createAddress();
      // let fundOp = await Tezos.contract.transfer({ to: await concensusAccount.signer.publicKeyHash(), amount: 1 });
      // await fundOp.confirmation();

      prepared = await Tezos.prepare.updateConsensusKey({ pk: await concensusAccount.signer.publicKey() });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('update_consensus_key');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared updateConcensusKey operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared updateConcensusKey operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultUpdateConsensusKey;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('update_consensus_key');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a transferTicket operation correctly', async () => {
      prepared = await Tezos.prepare.transferTicket({
        ticketContents: { string: "Ticket" },
        ticketTy: { prim: "string" },
        ticketTicketer: knownTicketContract,
        ticketAmount: 1,
        destination: pkh,
        entrypoint: 'default',
      });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('transfer_ticket');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared transferTicket operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared transferTicket operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultTransferTicket;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('transfer_ticket');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a increasePaidStorage operation correctly', async () => {
      prepared = await Tezos.prepare.increasePaidStorage({ amount: 1, destination: knownTicketContract });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('increase_paid_storage');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared increasePaidStorage operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared increasePaidStorage operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultIncreasePaidStorage;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('increase_paid_storage');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a smartRollupOriginate operation correctly', async () => {
      args = {
        pvmKind: PvmKind.WASM2,
        kernel: '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
        parametersType: { prim: 'bytes' }
      }
      prepared = await Tezos.prepare.smartRollupOriginate(args);
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('smart_rollup_originate');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared smartRollupOriginate operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared smartRollupOriginate operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultSmartRollupOriginate;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('smart_rollup_originate');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');

      // injected so smart-rollup-add-messages test can run
      const op = await Tezos.contract.smartRollupOriginate(args)
      await op.confirmation();
    })

    it('should prepare a smartRollupAddMessages operation correctly', async () => {
      prepared = await Tezos.prepare.smartRollupAddMessages({ message: ['0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'] });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('smart_rollup_add_messages');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared smartRollupAddMessages operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared smartRollupAddMessages operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      let content = toPreapply[0].contents[0] as OperationContentsAndResultSmartRollupAddMessages;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('smart_rollup_add_messages');
      expect(content.metadata).toBeInstanceOf(Object);
      expect(content.metadata.operation_result).toBeInstanceOf(Object);
      expect(content.metadata.operation_result.status).toEqual('applied');
    })

    it('should prepare a batch operation correctly', async () => {
      prepared = await Tezos.prepare.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          amount: 1,
        },
        {
          kind: OpKind.ORIGINATION,
          code,
          storage: UnitValue,
        },
      ]);
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('transaction');
      expect(prepared.opOb.contents[1].kind).toEqual('origination');
      expect(prepared.opOb.protocol).toBeDefined();
    })

    it('should toForge a prepared batch operation accepted by both forgers', async () => {
      const toForge = await Tezos.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await Tezos.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    });

    it('should toPreapply a prepared batch operation accepted by rpc', async () => {
      const toPreapply = await Tezos.rpc.preapplyOperations(await Tezos.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);

      let content0 = toPreapply[0].contents[0] as OperationContentsAndResultTransaction;
      expect(content0).toBeInstanceOf(Object);
      expect(content0.kind).toEqual('transaction');
      expect(content0.metadata).toBeInstanceOf(Object);
      expect(content0.metadata.operation_result).toBeInstanceOf(Object);
      expect(content0.metadata.operation_result.status).toEqual('applied');

      let content1 = toPreapply[0].contents[1] as OperationContentsAndResultOrigination;
      expect(content1).toBeInstanceOf(Object);
      expect(content1.kind).toEqual('origination');
      expect(content1.metadata).toBeInstanceOf(Object);
      expect(content1.metadata.operation_result).toBeInstanceOf(Object);
      expect(content1.metadata.operation_result.status).toEqual('applied');
    })
  })
})