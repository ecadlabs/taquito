import { CONFIGS, isSandbox, sleep } from '../../config';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { OperationContentsAndResultBallot, OperationContentsAndResultProposals, VotingPeriodBlockResult, OperationContentsProposals } from '@taquito/rpc';

CONFIGS().forEach(async ({ rpc, protocol }) => {
  const tezboxnet = isSandbox({ rpc }) ? test : test.skip;
  const baker1 = new TezosToolkit(rpc);
  const baker2 = new TezosToolkit(rpc);
  const baker3 = new TezosToolkit(rpc);
  const proposal = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK';
  const ballot = 'yay';
  let blockTime: number
  let currentPeriod: VotingPeriodBlockResult;

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 8)} with tezbox`, () => {
    beforeAll(async () => {
      // tezbox provision of 3 bakers, ref https://github.com/tez-capital/tezbox/blob/main/configuration/bakers.hjson
      baker1.setSignerProvider(new InMemorySigner('edsk4ArLQgBTLWG5FJmnGnT689VKoqhXwmDPBuGx3z4cvwU9MmrPZZ'));
      baker2.setSignerProvider(new InMemorySigner('edsk39qAm1fiMjgmPkw1EgQYkMzkJezLNewd7PLNHTkr6w9XA2zdfo'));
      baker3.setSignerProvider(new InMemorySigner('edsk2uqQB9AY4FvioK2YMdfmyMrer5R8mGFyuaLLFfSRo8EoyNdht3'));

      // get block time from protocol constants
      const constants = await baker1.rpc.getConstants();
      blockTime = constants.minimal_block_delay!.toNumber();
    });

    tezboxnet('Should be able to prepare proposal accepted by preapply endpoint', async () => {
      // check if it's in proposal period to start proposal test
      currentPeriod = await baker1.rpc.getCurrentPeriod();
      while (currentPeriod.voting_period.kind !== 'proposal') {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
        currentPeriod = await baker1.rpc.getCurrentPeriod()
      }

      const proposalPrepared = await baker1.prepare.proposals({ proposals: [proposal] });
      const proposalPreapplied = await baker1.rpc.preapplyOperations(await baker1.prepare.toPreapply(proposalPrepared));

      expect(proposalPreapplied).toBeInstanceOf(Array);
      expect(proposalPreapplied[0].contents).toBeInstanceOf(Array);
      expect(proposalPreapplied[0].contents[0].kind).toBe('proposals');
      expect((proposalPreapplied[0].contents[0] as OperationContentsAndResultProposals).source).toBe(await baker1.signer.publicKeyHash());
      expect((proposalPreapplied[0].contents[0] as OperationContentsAndResultProposals).period).toBe((proposalPrepared.opOb.contents[0] as OperationContentsProposals).period);
      expect((proposalPreapplied[0].contents[0] as OperationContentsAndResultProposals).proposals).toBeInstanceOf(Array);
      expect((proposalPreapplied[0].contents[0] as OperationContentsAndResultProposals).proposals[0]).toEqual(proposal);
    });

    tezboxnet('Should be able to inject proposal operation in proposal period', async () => {
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

    tezboxnet('Should be able to prepare ballot operations accepted by preapply endpoint', async () => {
      // if it's still proposal period make the test sleep to get into exploration period to inject ballot operation
      while (currentPeriod.voting_period.kind !== 'exploration') {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
        currentPeriod = await baker1.rpc.getCurrentPeriod()
      }

      const ballotPrepared = await baker1.prepare.ballot({ proposal, ballot });
      const preappliedBallot = await baker1.rpc.preapplyOperations(await baker1.prepare.toPreapply(ballotPrepared));

      expect(preappliedBallot).toBeInstanceOf(Array);
      expect(preappliedBallot[0].contents).toBeInstanceOf(Array);
      expect(preappliedBallot[0].contents[0].kind).toEqual('ballot');
      expect((preappliedBallot[0].contents[0] as OperationContentsAndResultBallot).source).toEqual(await baker1.signer.publicKeyHash());
      expect((preappliedBallot[0].contents[0] as OperationContentsAndResultBallot).proposal).toEqual(proposal);
      expect((preappliedBallot[0].contents[0] as OperationContentsAndResultBallot).ballot).toEqual(ballot);
    });

    tezboxnet('Should be able to inject ballot operation in exploration period', async () => {
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
