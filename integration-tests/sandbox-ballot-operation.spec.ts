import { VotingPeriodBlockResult } from '@taquito/rpc';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, rpc, protocol, setup }) => {
  const flextesanet = rpc === 'http://localhost:20000' ? test : test.skip;

  // Our ci flextesa script have 4 bakers default, Alice, Bob and Charlie (.github/workflows/main.yml)
  const Alice = lib;
  const Bob = new TezosToolkit(rpc);
  const Charlie = new TezosToolkit(rpc);
  let blocksPerVotingPeriod: number;
  let blockTime: number;
  let currentPeriod: VotingPeriodBlockResult;

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 8)} with flextesa`, () => {
    beforeAll(async (done) => {
      await setup();
      // configure baker Bob and Charlie
      Bob.setSignerProvider(new InMemorySigner('edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt'));
      Charlie.setSignerProvider(new InMemorySigner('edsk3RgWvbKKA1atEUcaGwivge7QtckHkTL9nQJUXQKY5r8WKp4pF4'));

      // get protocol constants
      let constants = await Alice.rpc.getConstants();
      blocksPerVotingPeriod = constants.blocks_per_cycle * constants.cycles_per_voting_period!;
      blockTime = constants.minimal_block_delay!.toNumber();
      currentPeriod = await Alice.rpc.getCurrentPeriod();

      // if proposal period remaining blocks is less then 5 make the test sleep to get into next voting period
      if (currentPeriod.voting_period.kind === 'proposal' && currentPeriod.remaining < 5) {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
      }
      done();
    });

    flextesanet('Should be able to inject proposal operation in proposal period', async (done) => {

      // double check if it's proposal period so that we can inject proposal operation
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        const proposalsOp = await Alice.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await proposalsOp.confirmation();
        expect(proposalsOp.operationResults).toBeDefined();
        expect(proposalsOp.operationResults?.kind).toEqual('proposals');
        expect(proposalsOp.operationResults?.source).toEqual(await Alice.signer.publicKeyHash());
        expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
        expect(proposalsOp.includedInBlock).toBeDefined();
        expect(proposalsOp.hash).toBeDefined();
        expect(proposalsOp.period).toBe(currentPeriod.voting_period.index);
        done();
      }
    });

    flextesanet('Should be able to check currentProposal from rpc in exploration period', async (done) => {

      // In proposal period injecting 2 more proposals from baker Bob and Charlie to reach above quorum
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        const BobOp = await Bob.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        const CharlieOp = await Charlie.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await Promise.all([BobOp.confirmation(), CharlieOp.confirmation()]);
      }

      // if it's still proposal period make the test sleep to get into exploration period to check getCurrentProposal
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
      };
      if (currentPeriod.voting_period.kind === 'exploration') {
        expect(await Alice.rpc.getCurrentProposal()).toBe('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK')
      }
      done()

    });

    flextesanet('Should be able to inject ballot operation in exploration period and getBallotList from rpc', async (done) => {

      // double check if it's exploration period so that we can inject ballot operation
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'exploration') {
        const explorationBallotOp = await Alice.contract.ballot({
          proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
          ballot: 'yay'
        });
        await explorationBallotOp.confirmation();
        expect(explorationBallotOp.operationResults).toBeDefined();
        expect(explorationBallotOp.operationResults?.kind).toEqual('ballot');
        expect(explorationBallotOp.operationResults?.proposal).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
        expect(explorationBallotOp.operationResults?.ballot).toEqual('yay');
        expect(explorationBallotOp.includedInBlock).toBeDefined();
        expect(explorationBallotOp.hash).toBeDefined();
        expect((await Alice.rpc.getBallotList())[0].pkh).toBe(await Alice.signer.publicKeyHash());
        expect((await Alice.rpc.getBallotList())[0].ballot).toBe('yay');

        done();
      }
    });
  });
});