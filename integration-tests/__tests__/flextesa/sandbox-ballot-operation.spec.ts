import { VotingPeriodBlockResult } from '@taquito/rpc';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS, isSandbox, sleep } from '../../config';

CONFIGS().forEach(async ({ lib, rpc, protocol, setup }) => {
  const tezboxnet = isSandbox({ rpc }) ? test : test.skip;
  let blockTime: number;
  let currentPeriod: VotingPeriodBlockResult;

  // Our ci tezbox script have 2 bakers Bob and Alice (.github/workflows/main.yml)
  const Bob = lib; // Bob's secret key is passed through the command to run test is configured by integration-tests/config.ts
  const Alice = new TezosToolkit(rpc);
  Alice.setSignerProvider(new InMemorySigner('edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'));

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 8)} with tezbox`, () => {
    beforeAll(async () => {
      await setup();
      let constants = await Bob.rpc.getConstants();
      blockTime = constants.minimal_block_delay!.toNumber();
    });

    tezboxnet('Should be able to inject proposal operation in proposal period', async () => {

      // double check if it's proposal period so that we can inject proposal operation
      currentPeriod = await Bob.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        const proposalsOp = await Bob.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await proposalsOp.confirmation();

        expect(proposalsOp.operationResults).toBeDefined();
        expect(proposalsOp.operationResults?.kind).toEqual('proposals');
        expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
        expect(proposalsOp.includedInBlock).toBeDefined();
        expect(proposalsOp.hash).toBeDefined();

        // injecting 2 more proposals from baker Alice and Alice to reach above quorum
        const AliceOp = await Alice.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await AliceOp.confirmation();
      }
    });

    tezboxnet('Should be able to inject ballot operation in exploration period', async () => {
      // if it's still proposal period make the test sleep to get into exploration period to inject ballot operation
      currentPeriod = await Bob.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
      };
      currentPeriod = await Bob.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'exploration') {
        const explorationBallotOp = await Bob.contract.ballot({
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
      }
    });
  });
});
