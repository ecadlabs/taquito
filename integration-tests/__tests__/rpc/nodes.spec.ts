import { CONFIGS } from '../../config';
import { DefaultContractType, Protocols } from "@taquito/taquito";
import { RpcClientCache, RpcClient, RPCRunViewParam, RPCRunScriptViewParam, PendingOperationsV1, PendingOperationsV2 } from '@taquito/rpc';
import { encodeExpr } from '@taquito/utils';
import { Schema } from '@taquito/michelson-encoder';
import { tokenBigmapCode, tokenBigmapStorage } from '../../data/token_bigmap';
import { ticketCode, ticketStorage } from '../../data/code_with_ticket';

CONFIGS().forEach(
  ({
    lib,
    protocol,
    rpc,
    setup,
    knownBaker,
    knownContract,
    knownBigMapContract,
    knownSaplingContract,
    knownViewContract,
  }) => {
    const Tezos = lib;
    const unrestrictedRPCNode = rpc.includes("teztnets.com") ? test : test.skip;
    const parisnet = protocol === Protocols.PsParisCZ ? test : test.skip;
    const quebecnet = protocol === Protocols.PsQuebecn ? test : test.skip;
    let ticketContract: DefaultContractType;

    beforeAll(async () => {
      await setup();

      try {
        // originate ticket contract
        const ticketOp = await Tezos.contract.originate({
          code: ticketCode,
          storage: ticketStorage,
        });
        await ticketOp.confirmation();
        ticketContract = await ticketOp.contract();
        // contract call to issue tickets
        const ticketCallOp = await ticketContract.methods.auto_call(1).send();
        await ticketCallOp.confirmation();
      } catch (e) {
        console.log('Failed to originate ticket contract', JSON.stringify(e));
      }

    });

    const rpcList: Array<string> = [rpc];

    rpcList.forEach(async (rpc) => {
      Tezos.setRpcProvider(rpc);

      const rpcClient = new RpcClientCache(new RpcClient(rpc));

      describe(`Test calling all methods from RPC node: ${rpc}`, () => {
        it('Verify that rpcClient.getBlockHash returns the head block hash', async () => {
          const blockHash = await rpcClient.getBlockHash();
          expect(blockHash).toBeDefined();
        });

        it('Verify that rpcClient.getLiveBlocks returns the ancestors of the head block', async () => {
          const liveBlocks = await rpcClient.getLiveBlocks();
          expect(liveBlocks).toBeDefined();
        });

        it(`Verify that rpcClient.getBalance for knownBaker returns the spendable balance excluding frozen bonds`, async () => {
          const balance = await rpcClient.getBalance(knownBaker);
          expect(balance).toBeDefined();
        });

        quebecnet(`Verify that rpcClient.getSpendable for knownBaker returns the spendable balance excluding frozen bonds`, async () => {
          const balance = await rpcClient.getSpendable(knownBaker);
          expect(balance).toBeDefined();
        });

        it(`Verify that rpcClient.getBalanceAndFrozenBonds for knownBaker returns the full balance`, async () => {
          const balance = await rpcClient.getBalanceAndFrozenBonds(knownBaker);
          expect(balance).toBeDefined();
        });

        quebecnet(`Verify that rpcClient.getSpendableAndFrozenBonds for knownBaker returns the full balance`, async () => {
          const balance = await rpcClient.getSpendableAndFrozenBonds(knownBaker);
          expect(balance).toBeDefined();
        });

        it(`Verify that rpcClient.getFullBalance for knownBaker returns the full balance`, async () => {
          const balance = await rpcClient.getFullBalance(knownBaker);
          expect(balance).toBeDefined();
        });

        it(`Verify that rpcClient.getStakedBalance for knownBaker returns the staked balance`, async () => {
          const balance = await rpcClient.getStakedBalance(knownBaker);
          expect(balance).toBeDefined();
        });

        it(`Verify that rpcClient.getUnstakedFinalizableBalance for knownBaker returns the unstaked finalizable balance`, async () => {
          const balance = await rpcClient.getUnstakedFinalizableBalance(knownBaker);
          expect(balance).toBeDefined();
        });

        it(`Verify that rpcClient.getUnstakedFrozenBalance for knownBaker returns the unstaked frozen balance`, async () => {
          const balance = await rpcClient.getUnstakedFrozenBalance(knownBaker);
          expect(balance).toBeDefined();
        });

        it(`Verify that rpcClient.getUnstakeRequests for knownBaker returns the unstaked requests`, async () => {
          const response = await rpcClient.getUnstakeRequests('tz1KqYu4VQG67fgq1Pfn93ASoZxhSW7mTDbC');
          expect(response).toBeDefined();
        });

        it(`Verify that rpcClient.getStorage for knownContract returns the data of a contract`, async () => {
          const storage = await rpcClient.getStorage(knownContract);
          expect(storage).toBeDefined();
        });

        it(`Verify that rpcClient.getScript for know contract returns the code and data of a contract`, async () => {
          const script = await rpcClient.getScript(knownContract);
          expect(script).toBeDefined();
        });

        it(`Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode`, async () => {
          const script = await rpcClient.getNormalizedScript(knownContract);
          expect(script).toBeDefined();
        });

        it(`Verify that rpcClient.getContract returns the complete status of a contract`, async () => {
          const contract = await rpcClient.getContract(knownContract);
          expect(contract).toBeDefined();
        });

        it(`Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract`, async () => {
          const managerKey = await rpcClient.getManagerKey(knownBaker);
          expect(managerKey).toBeDefined();
        });

        it(`Verify that rpcClient.getDelegate for known baker returns the delegate of the contract`, async () => {
          const delegate = await rpcClient.getDelegate(knownBaker);
          expect(delegate).toBeDefined();
        });

        it(`Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map`, async () => {
          const schema = new Schema({
            prim: 'big_map',
            args: [
              { prim: 'address' },
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'map',
                    args: [{ prim: 'address' }, { prim: 'nat' }],
                    annots: ['%allowances'],
                  },
                  { prim: 'nat', annots: ['%balance'] },
                ],
              },
            ],
            annots: ['%ledger'],
          });
          const { key, type } = schema.EncodeBigMapKey('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP');
          const { packed } = await rpcClient.packData({ data: key, type });
          const contract = await Tezos.contract.at(knownBigMapContract);
          const storage: any = await contract.storage();
          const id = Number(storage.ledger.id);
          const encodedExpr = encodeExpr(packed);
          const bigMapValue = await rpcClient.getBigMapExpr(id.toString(), encodedExpr);
          expect(bigMapValue).toBeDefined();
        });

        it(`Verify that rpcClient.getAllDelegates returns all delegates from RPC`, async () => {
          const allDelegates = await rpcClient.getAllDelegates();
          expect(allDelegates).toBeDefined();

          const allViableDelegates = await rpcClient.getAllDelegates({ active: true, with_minimal_stake: true });
          expect(allViableDelegates).toBeDefined();

          expect(allViableDelegates.length).toBeLessThanOrEqual(allDelegates.length);
        });

        it(`Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC`, async () => {
          const delegates = await rpcClient.getDelegates(knownBaker);
          expect(delegates).toBeDefined();
        });

        it(`Verify that rpc.getVotingInfo for known baker returns voting information about a delegate from RPC`, async () => {
          const votinInfo = await rpcClient.getVotingInfo(knownBaker);
          expect(votinInfo).toBeDefined();
        });

        it('Verify that rpcClient.getConstants returns all constants from RPC', async () => {
          const constants = await rpcClient.getConstants();
          expect(constants).toBeDefined();
        });

        it('Verify that rpcClient.getBlock returns all the information about a block', async () => {
          const blockInfo = await rpcClient.getBlock();
          expect(blockInfo).toBeDefined();
        });

        it('Verify that rpcClient.getBlockHeader returns whole block header', async () => {
          const blockHeader = await rpcClient.getBlockHeader();
          expect(blockHeader).toBeDefined();
        });

        it('Verify that rpcClient.getBlockMetadata returns all metadata associated to the block', async () => {
          const blockMetadata = await rpcClient.getBlockMetadata();
          expect(blockMetadata).toBeDefined();
        });

        unrestrictedRPCNode('Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block', async () => {
          const bakingRights = await rpcClient.getBakingRights({
            max_round: '2'
          });
          expect(bakingRights).toBeDefined();
          expect(bakingRights[0].round).toBeDefined();
          expect(bakingRights[0].priority).toBeUndefined();
        });

        unrestrictedRPCNode('Verify that rpcClient.getAttestationRights retrieves the list of delegates allowed to attest a block', async () => {
          const attestationRights = await rpcClient.getAttestationRights();
          expect(attestationRights).toBeDefined();
          expect(attestationRights[0].delegates).toBeDefined();
          expect(attestationRights[0].delegates![0].delegate).toBeDefined();
          expect(typeof attestationRights[0].delegates![0].delegate).toEqual('string');
          expect(attestationRights[0].delegates![0].attestation_power).toBeDefined();
          expect(typeof attestationRights[0].delegates![0].attestation_power).toEqual('number');
          expect(attestationRights[0].delegates![0].first_slot).toBeDefined();
          expect(typeof attestationRights[0].delegates![0].first_slot).toEqual('number');
          expect(attestationRights[0].delegate).toBeUndefined();
        });

        it('Verify that rpcClient.getBallotList returns ballots casted so far during a voting period', async () => {
          const ballotList = await rpcClient.getBallotList();
          expect(ballotList).toBeDefined();
        });

        it('Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period', async () => {
          const ballot = await rpcClient.getBallots();
          expect(ballot).toBeDefined();
        });

        it('Verify that rpcClient.getCurrentPeriod returns current period kind', async () => {
          const currentPeriodKind = await rpcClient.getCurrentPeriod();
          expect(currentPeriodKind).toBeDefined();
        });

        it('Verify that rpcClient.getCurrentProposal returns current proposal under evaluation', async () => {
          const currentProposalUnderEvaluation = await rpcClient.getCurrentProposal();
          expect(currentProposalUnderEvaluation).toBeDefined();
        });

        it('Verify that rpcClient.getCurrentQuorum returns current expected quorum', async () => {
          const currentQuorum = await rpcClient.getCurrentQuorum();
          expect(currentQuorum).toBeDefined();
        });

        it('Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls', async () => {
          const voteListings = await rpcClient.getVotesListings();
          expect(voteListings).toBeDefined();
        });

        it('Verify that rpcClient.getProposals returns list of proposals with number of supporters', async () => {
          const proposals = await rpcClient.getProposals();
          expect(proposals).toBeDefined();
        });

        it('Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes', async () => {
          const operation: any = {
            branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
            contents: [
              {
                kind: 'origination',
                counter: '1',
                source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
                fee: '10000',
                gas_limit: '10',
                storage_limit: '10',
                balance: '0',
                script: {
                  code: tokenBigmapCode,
                  storage: tokenBigmapStorage,
                },
              },
            ],
          };

          const forgeOrigination = await rpcClient.forgeOperations(operation);
          expect(forgeOrigination).toBeDefined();
        });

        // We will send invalid signedOpBytes and see if the node returns the expected error message
        it('Verify that rpcClient.injectOperation injects an operation in node and broadcast it', async () => {
          try {
            await rpcClient.injectOperation('operation');
          } catch (ex: any) {
            expect(ex.message).toContain('112 is an invalid char');
          }
        });

        it('Verify that rpcClient.preapplyOperations simulates the validation of an operation', async () => {
          try {
            // the account needs to be revealed first
            const reveal = await Tezos.contract.reveal({});
            await reveal.confirmation();
          } catch (ex) {
            expect(ex).toEqual(expect.objectContaining({
              message: expect.stringContaining('has already been revealed')
            }));
          }

          try {
            const operation: any = {
              branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
              contents: [
                {
                  kind: 'origination',
                  counter: '1',
                  source: await Tezos.signer.publicKeyHash(),
                  fee: '10000',
                  gas_limit: '10',
                  storage_limit: '10',
                  balance: '0',
                  script: {
                    code: tokenBigmapCode,
                    storage: tokenBigmapStorage,
                  },
                },
              ],
              protocol: `${protocol}`,
              signature:
                'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
            };

            await rpcClient.preapplyOperations([operation]);
          } catch (ex: any) {
            expect(ex.message).toMatch('contract.counter_in_the_past');
          }
        });

        it('Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract', async () => {
          const entrypoints = await rpcClient.getEntrypoints(knownContract);
          expect(entrypoints).toBeDefined();
        });

        it('Verify that rpcClient.getChainId returns chain ID', async () => {
          const chainId = await rpcClient.getChainId();
          expect(chainId).toBeDefined();
        });

        it('Verify that rpcClient.runOperation runs an operation without signature checks', async () => {
          try {
            const chainId = await rpcClient.getChainId();
            expect(chainId).toBeDefined();

            const operation: any = {
              chain_id: chainId,
              operation: {
                branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
                contents: [
                  {
                    kind: 'origination',
                    counter: '1',
                    source: await Tezos.signer.publicKeyHash(),
                    fee: '10000',
                    gas_limit: '10',
                    storage_limit: '10',
                    balance: '0',
                    script: {
                      code: tokenBigmapCode,
                      storage: tokenBigmapStorage,
                    },
                  },
                ],
                signature:
                  'edsigtcagjMz6xtr45ummgsxgj7V6tQGRMerspzSVLJuE2bmBv6dGffCXYqokNgymY7uY7c97kpFrzMr5dhjqwKGsUb6kSP3B97',
              },
            };

            await rpcClient.runOperation(operation);
          } catch (ex: any) {
            expect(ex.message).toMatch('contract.counter_in_the_past');
          }
        });

        it('Verify that rpcClient.simulateOperation simulates an operation without signature checks', async () => {
          try {
            const chainId = await rpcClient.getChainId();
            expect(chainId).toBeDefined();

            const operation: any = {
              chain_id: chainId,
              operation: {
                branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
                contents: [
                  {
                    kind: 'origination',
                    counter: '1',
                    source: await Tezos.signer.publicKeyHash(),
                    fee: '10000',
                    gas_limit: '10',
                    storage_limit: '10',
                    balance: '0',
                    script: {
                      code: tokenBigmapCode,
                      storage: tokenBigmapStorage,
                    },
                  },
                ],
              },
            };

            await rpcClient.simulateOperation(operation);
          } catch (e: any) {
            expect(e.message).toMatch('contract.counter_in_the_past');
          }

        });

        it('Verify that rpcClient.runView executes tzip4 views', async () => {

          const chainId = await Tezos.rpc.getChainId();

          const params: RPCRunViewParam = {
            contract: knownBigMapContract,
            entrypoint: 'getBalance',
            chain_id: chainId,
            input: {
              string: 'tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP'
            }
          };

          const views = await Tezos.rpc.runView(params);
          expect(views).toBeDefined();
          expect(views).toEqual({ "data": { "int": "100" } });
        });

        it('Verify that rpcClient.runScriptView executes michelson view', async () => {
          const chainId = await Tezos.rpc.getChainId();
          const params: RPCRunScriptViewParam = {
            contract: knownViewContract!,
            view: 'add',
            chain_id: chainId,
            input: {
              int: '0'
            }
          };

          const views = await Tezos.rpc.runScriptView(params);
          expect(views).toBeDefined();
          expect(views).toEqual({ "data": { "int": "2" } });
        });

        it('Verify that rpcClient.getSuccessorPeriod will get the voting period of next block', async () => {
          const successorPeriod = await rpcClient.getSuccessorPeriod();
          expect(successorPeriod).toBeDefined();
        });

        it('Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID', async () => {
          const saplingStateId = (await rpcClient.getStorage(knownSaplingContract) as any)['int'];
          const saplingDiffById = await rpcClient.getSaplingDiffById(saplingStateId);
          expect(saplingDiffById).toBeDefined();
        });

        it('Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state', async () => {
          const saplingDiffByContract = await rpcClient.getSaplingDiffByContract(
            knownSaplingContract
          );
          expect(saplingDiffByContract).toBeDefined();
        });

        it('Verify that rpcClient.getProtocols will list past and present Tezos protocols', async () => {
          const protocols = await rpcClient.getProtocols();
          expect(protocols).toEqual({ protocol, next_protocol: protocol });
        });

        it('Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage', async () => {
          const usedSpace = await rpcClient.getStorageUsedSpace(knownContract);
          expect(usedSpace).toBeDefined();
        });

        it('Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage', async () => {
          const paidSpace = await rpcClient.getStoragePaidSpace(knownContract);
          expect(paidSpace).toBeDefined();
        });

        it('Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract', async () => {
          const ticketBalance = await rpcClient.getTicketBalance(ticketContract.address, { ticketer: ticketContract.address, content_type: { prim: 'string' }, content: { string: 'abc' } });
          expect(ticketBalance).toBeDefined();
        });

        it('Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract', async () => {
          const ticketBalances = await rpcClient.getAllTicketBalances(ticketContract.address);
          expect(ticketBalances).toBeInstanceOf(Array);
          expect(ticketBalances[0].ticketer).toBe(ticketContract.address);
          expect(ticketBalances[0].content_type).toBeDefined();
          expect(ticketBalances[0].content).toBeDefined();
          expect(ticketBalances[0].amount).toBeDefined();
        });

        it(`Verify that rpcClient.getAdaptiveIssuanceLaunchCycle will retrieve launch cycle 6 for ${rpc}`, async () => {
          const launchCycle = await rpcClient.getAdaptiveIssuanceLaunchCycle();
          if (rpc.includes('ghostnet')) {
            expect(launchCycle).toEqual(1054);
          } else if (rpc.includes('parisnet')) {
            expect(launchCycle).toEqual(6);
          } else if (rpc.includes('quebecnet') || rpc.includes('weeklynet')) {
            expect(launchCycle).toEqual(5);
          }
        })

        parisnet('Verify that rpcClient.getPendingOperations v1 will retrieve the pending operations in mempool with property applied', async () => {
          const pendingOperations = await rpcClient.getPendingOperations({ version: '1' }) as PendingOperationsV1;
          expect(pendingOperations).toBeDefined();
          expect(pendingOperations.applied).toBeInstanceOf(Array);
          expect(pendingOperations.refused).toBeInstanceOf(Array);
          expect(pendingOperations.outdated).toBeInstanceOf(Array);
          expect(pendingOperations.branch_delayed).toBeInstanceOf(Array);
          expect(pendingOperations.branch_refused).toBeInstanceOf(Array);
        });

        it('Verify that rpcClient.getPendingOperations v2 will retrieve the pending operations in mempool with property validated', async () => {
          const pendingOperations = await rpcClient.getPendingOperations({ version: '2' }) as PendingOperationsV2;
          expect(pendingOperations).toBeDefined();
          expect(pendingOperations.validated).toBeInstanceOf(Array);
          expect(pendingOperations.refused).toBeInstanceOf(Array);
          expect(pendingOperations.outdated).toBeInstanceOf(Array);
          expect(pendingOperations.branch_delayed).toBeInstanceOf(Array);
          expect(pendingOperations.branch_refused).toBeInstanceOf(Array);
        });
      });
    });
  }
);
