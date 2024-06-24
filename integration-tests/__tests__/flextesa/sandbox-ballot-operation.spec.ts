/**
 *  This test is not being run by any runner, 
 *  will keep for future reference if an alternative sandbox is available
 */

import { VotingPeriodBlockResult } from '@taquito/rpc';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS, isSandbox, sleep } from '../../config';

CONFIGS().forEach(async ({ lib, rpc, protocol, setup }) => {
  const flextesanet = isSandbox({ rpc }) ? test : test.skip;
  let blocksPerVotingPeriod: number;
  let blockTime: number;
  let currentPeriod: VotingPeriodBlockResult;

  // Our ci flextesa script have 3 bakers Alice, Bob and Charlie (.github/workflows/main.yml)
  const Alice = lib; // Alice's secret key is passed through the command to run test is configured by integration-tests/config.ts
  const Bob = new TezosToolkit(rpc);
  Bob.setSignerProvider(new InMemorySigner('edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt'));
  const Charlie = new TezosToolkit(rpc);
  Charlie.setSignerProvider(new InMemorySigner('edsk3RgWvbKKA1atEUcaGwivge7QtckHkTL9nQJUXQKY5r8WKp4pF4'));

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 8)} with flextesa`, () => {
    beforeAll(async () => {
      await setup();
      let constants = await Alice.rpc.getConstants();
      blocksPerVotingPeriod = constants.blocks_per_cycle * constants.cycles_per_voting_period!;
      blockTime = constants.minimal_block_delay!.toNumber();
    });

    flextesanet('Should be able to inject proposal operation in proposal period', async () => {

      // double check if it's proposal period so that we can inject proposal operation
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        const proposalsOp = await Alice.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await proposalsOp.confirmation();

        expect(proposalsOp.operationResults).toBeDefined();
        expect(proposalsOp.operationResults?.kind).toEqual('proposals');
        expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
        expect(proposalsOp.includedInBlock).toBeDefined();
        expect(proposalsOp.hash).toBeDefined();

        // injecting 2 more proposals from baker Bob and Charlie to reach above quorum
        const BobOp = await Bob.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await BobOp.confirmation();
        const CharlieOp = await Charlie.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await CharlieOp.confirmation();
      }
    });

    flextesanet('Should be able to inject ballot operation in exploration period', async () => {
      // if it's still proposal period make the test sleep to get into exploration period to inject ballot operation
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
      };
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
      }
    });
  });
});
