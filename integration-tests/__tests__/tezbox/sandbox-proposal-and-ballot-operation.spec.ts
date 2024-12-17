import { CONFIGS, isSandbox, sleep } from '../../config';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { LocalForger } from '@taquito/local-forging';
import { OperationContentsAndResultBallot, OperationContentsAndResultProposals, VotingPeriodBlockResult, OperationContentsProposals } from '@taquito/rpc';

CONFIGS().forEach(async ({ rpc, protocol }) => {
  const tezboxnet = isSandbox({ rpc }) ? test : test.skip;
  const baker1 = new TezosToolkit(rpc);
  const baker2 = new TezosToolkit(rpc);
  const baker3 = new TezosToolkit(rpc);
  let localForger = new LocalForger();
  const proposal = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK';
  const ballot = 'yay';
  let prepared: any;
  let blockTime: number
  let currentPeriod: VotingPeriodBlockResult;

  async function sleepUntil(period: string): Promise<void> {
    currentPeriod = await baker1.rpc.getCurrentPeriod();
    while (currentPeriod.voting_period.kind !== period) {
      await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
      currentPeriod = await baker1.rpc.getCurrentPeriod()
    }
  }

  describe(`Test Preparation of proposals and ballot ops using PrepareProvider in ${protocol.substring(0, 8)} with tezbox`, () => {
    beforeAll(async () => {
      // tezbox provision of 3 bakers, ref https://github.com/tez-capital/tezbox/blob/main/configuration/bakers.hjson
      baker1.setSignerProvider(new InMemorySigner('edsk4ArLQgBTLWG5FJmnGnT689VKoqhXwmDPBuGx3z4cvwU9MmrPZZ'));
      baker2.setSignerProvider(new InMemorySigner('edsk39qAm1fiMjgmPkw1EgQYkMzkJezLNewd7PLNHTkr6w9XA2zdfo'));
      baker3.setSignerProvider(new InMemorySigner('edsk2uqQB9AY4FvioK2YMdfmyMrer5R8mGFyuaLLFfSRo8EoyNdht3'));

      // get block time from protocol constants
      const constants = await baker1.rpc.getConstants();
      blockTime = constants.minimal_block_delay!.toNumber();
    });

    tezboxnet('should prepare a proposals operation correctly in proposal period', async () => {
      await sleepUntil('proposal')

      prepared = await baker1.prepare.proposals({ proposals: [proposal] });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('proposals');
    });

    tezboxnet('should toForge a prepared proposals operation accepted by both forgers', async () => {
      const toForge = await baker1.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await baker1.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    })

    tezboxnet('should toPreapply a prepared a proposals operation accepted by rpc in proposal period', async () => {
      await sleepUntil('proposal')

      const toPreapply = await baker1.rpc.preapplyOperations(await baker1.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      const content = toPreapply[0].contents[0] as OperationContentsAndResultProposals;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('proposals');
      expect((toPreapply[0].contents[0] as OperationContentsAndResultProposals).source).toBe(await baker1.signer.publicKeyHash());
      expect((toPreapply[0].contents[0] as OperationContentsAndResultProposals).period).toBe((prepared.opOb.contents[0] as OperationContentsProposals).period);
      expect((toPreapply[0].contents[0] as OperationContentsAndResultProposals).proposals).toBeInstanceOf(Array);
      expect((toPreapply[0].contents[0] as OperationContentsAndResultProposals).proposals[0]).toEqual(proposal);

    })

    tezboxnet('Should be able to inject proposals operation in proposal period', async () => {
      await sleepUntil('proposal')

      const proposalsOp = await baker1.contract.proposals({
        proposals: [proposal]
      });
      await proposalsOp.confirmation();

      expect(proposalsOp.includedInBlock).toBeDefined();
      expect(proposalsOp.status).toBeDefined();
      expect(proposalsOp.hash).toBeDefined();
      expect(proposalsOp.operationResults).toBeDefined();
      expect(proposalsOp.proposals).toEqual([proposal]);
      expect(proposalsOp.period).toBeDefined();

      // injecting 2 more proposals from baker baker2 and baker3 to reach above quorum
      const baker2Op = await baker2.contract.proposals({ proposals: [proposal] });
      await baker2Op.confirmation();
      expect(baker2Op.includedInBlock).toBeDefined();
      const baker3Op = await baker3.contract.proposals({ proposals: [proposal] });
      await baker3Op.confirmation();
      expect(baker3Op.includedInBlock).toBeDefined();
    });

    tezboxnet('should prepare a ballot operation correctly in exploration period', async () => {
      // if it's still proposal period make the test sleep to get into exploration period to prepare ballot operation
      await sleepUntil('exploration')

      prepared = await baker1.prepare.ballot({ proposal, ballot });
      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents[0].kind).toEqual('ballot');
    });

    tezboxnet('Should be able to forge ballot operations accepted by both forgers', async () => {
      const toForge = await baker1.prepare.toForge(prepared);
      const localForged = await localForger.forge(toForge);
      const rpcForged = await baker1.rpc.forgeOperations(toForge);
      expect(localForged).toEqual(rpcForged);
    })

    tezboxnet('should toPreapply a prepared a ballot operation accepted by rpc in proposal period in exploration period', async () => {
      // if it's still proposal period make the test sleep to get into exploration period to preapply ballot operation
      await sleepUntil('exploration')

      const toPreapply = await baker1.rpc.preapplyOperations(await baker1.prepare.toPreapply(prepared));
      expect(toPreapply).toBeInstanceOf(Array);
      expect(toPreapply[0].contents).toBeInstanceOf(Array);
      const content = toPreapply[0].contents[0] as OperationContentsAndResultBallot;
      expect(content).toBeInstanceOf(Object);
      expect(content.kind).toEqual('ballot');
      expect((toPreapply[0].contents[0] as OperationContentsAndResultBallot).source).toEqual(await baker1.signer.publicKeyHash());
      expect((toPreapply[0].contents[0] as OperationContentsAndResultBallot).proposal).toEqual(proposal);
      expect((toPreapply[0].contents[0] as OperationContentsAndResultBallot).ballot).toEqual(ballot);
    })
    tezboxnet('Should be able to inject ballot operation in exploration period', async () => {
      // if it's still proposal period make the test sleep to get into exploration period to inject ballot operation
      await sleepUntil('exploration')

      const explorationBallotOp = await baker1.contract.ballot({
        proposal,
        ballot
      });
      await explorationBallotOp.confirmation();

      expect(explorationBallotOp.includedInBlock).toBeDefined();
      expect(explorationBallotOp.status).toBeDefined();
      expect(explorationBallotOp.hash).toBeDefined();
      expect(explorationBallotOp.operationResults).toBeDefined();
      expect(explorationBallotOp.proposal).toBe(proposal);
      expect(explorationBallotOp.period).toBeDefined();
      expect(explorationBallotOp.ballot).toBe(ballot);
    });
  });
});
