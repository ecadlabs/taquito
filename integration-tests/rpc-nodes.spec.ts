import { CONFIGS } from './config';
import { DefaultContractType } from "@taquito/taquito";
import { RpcClientCache, RpcClient, RPCRunViewParam, RPCRunScriptViewParam, PendingOperations, PvmKind } from '@taquito/rpc';
import { encodeExpr } from '@taquito/utils';
import { Schema } from '@taquito/michelson-encoder';
import { tokenBigmapCode, tokenBigmapStorage } from './data/token_bigmap';
import { ticketCode, ticketStorage } from './data/code_with_ticket';
import { _describe, _it } from "./test-utils";
import stringify from 'json-stringify-safe';

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
    const unrestrictedRPCNode = rpc.endsWith("ecadinfra.com") ? test.skip : test;

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
        console.log('Failed to originate ticket contract', stringify(e));
      }

    });

    const rpcList: Array<string> = [rpc];

    rpcList.forEach(async (rpc) => {
      Tezos.setRpcProvider(rpc);

      const rpcClient = new RpcClientCache(new RpcClient(rpc));

      _describe(`Test calling all methods from RPC node: ${rpc}`, () => {
        _it('Verify rpcClient.getBlockHash returns the head block hash', async () => {
          const blockHash = await rpcClient.getBlockHash();
          expect(blockHash).toBeDefined();
        });

        _it('Verify rpcClient.getLiveBlocks returns the ancestors of the head block', async () => {
          const liveBlocks = await rpcClient.getLiveBlocks();
          expect(liveBlocks).toBeDefined();
        });

        _it(`Verify rpcClient.getBalance for known baker returns the balance of the address`, async () => {
          const balance = await rpcClient.getBalance(knownBaker);
          expect(balance).toBeDefined();
        });

        _it(`Verify that rpcClient.getStorage for know contract returns the data of a contract`, async () => {
          const storage = await rpcClient.getStorage(knownContract);
          expect(storage).toBeDefined();
        });

        _it(`Verify that rpcClient.getScript for know contract returns the code and data of a contract`, async () => {
          const script = await rpcClient.getScript(knownContract);
          expect(script).toBeDefined();
        });

        _it(`Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode`, async () => {
          const script = await rpcClient.getNormalizedScript(knownContract);
          expect(script).toBeDefined();
        });

        _it(`Verify that rpcClient.getContract returns the complete status of a contract`, async () => {
          const contract = await rpcClient.getContract(knownContract);
          expect(contract).toBeDefined();
        });

        _it(`Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract`, async () => {
          const managerKey = await rpcClient.getManagerKey(knownBaker);
          expect(managerKey).toBeDefined();
        });

        _it(`Verify that rpcClient.getDelegate for known baker returns the delegate of the contract`, async () => {
          const delegate = await rpcClient.getDelegate(knownBaker);
          expect(delegate).toBeDefined();
        });

        _it(`Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map`, async () => {
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

        _it(`Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC`, async () => {
          const delegates = await rpcClient.getDelegates(knownBaker);
          expect(delegates).toBeDefined();
        });

        _it(`Fetches voting information about a delegate from RPC`, async () => {
          const votinInfo = await rpcClient.getVotingInfo(knownBaker);
          expect(votinInfo).toBeDefined();
        });

        _it('Verify that rpcClient.getConstants returns all constants from RPC', async () => {
          const constants = await rpcClient.getConstants();
          expect(constants).toBeDefined();
        });

        _it('Verify that rpcClient.getBlock returns all the information about a block', async () => {
          const blockInfo = await rpcClient.getBlock();
          expect(blockInfo).toBeDefined();
        });

        _it('Verify that rpcClient.getBlockHeader returns whole block header', async () => {
          const blockHeader = await rpcClient.getBlockHeader();
          expect(blockHeader).toBeDefined();
        });

        _it('Verify that rpcClient.getBlockMetadata returns all metadata associated to the block', async () => {
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

        unrestrictedRPCNode('Verify that rpcClient.getEndorsingRights retrieves the list of delegates allowed to endorse a block', async () => {
          const endorsingRights = await rpcClient.getEndorsingRights();
          expect(endorsingRights).toBeDefined();
          expect(endorsingRights[0].delegates).toBeDefined();
          expect(endorsingRights[0].delegates![0].delegate).toBeDefined();
          expect(typeof endorsingRights[0].delegates![0].delegate).toEqual('string');
          expect(endorsingRights[0].delegates![0].endorsing_power).toBeDefined();
          expect(typeof endorsingRights[0].delegates![0].endorsing_power).toEqual('number');
          expect(endorsingRights[0].delegates![0].first_slot).toBeDefined();
          expect(typeof endorsingRights[0].delegates![0].first_slot).toEqual('number');
          expect(endorsingRights[0].delegate).toBeUndefined();
        });

        _it('Verify that rpcClient.getBallotList returns ballots casted so far during a voting period', async () => {
          const ballotList = await rpcClient.getBallotList();
          expect(ballotList).toBeDefined();
        });

        _it('Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period', async () => {
          const ballot = await rpcClient.getBallots();
          expect(ballot).toBeDefined();
        });

        _it('Verify that rpcClient.getCurrentPeriod returns current period kind', async () => {
          const currentPeriodKind = await rpcClient.getCurrentPeriod();
          expect(currentPeriodKind).toBeDefined();
        });

        _it('Verify that rpcClient.getCurrentProposal returns current proposal under evaluation', async () => {
          const currentProposalUnderEvaluation = await rpcClient.getCurrentProposal();
          expect(currentProposalUnderEvaluation).toBeDefined();
        });

        _it('Verify that rpcClient.getCurrentQuorum returns current expected quorum', async () => {
          const currentQuorum = await rpcClient.getCurrentQuorum();
          expect(currentQuorum).toBeDefined();
        });

        _it('Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls', async () => {
          const voteListings = await rpcClient.getVotesListings();
          expect(voteListings).toBeDefined();
        });

        _it('Verify that rpcClient.getProposals returns list of proposals with number of supporters', async () => {
          const proposals = await rpcClient.getProposals();
          expect(proposals).toBeDefined();
        });

        _it('Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes', async () => {
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
        _it('Verify that rpcClient.injectOperation injects an operation in node and broadcast it', async () => {
          try {
            await rpcClient.injectOperation('operation');
          } catch (ex: any) {
            expect(ex.message).toContain('112 is an invalid char');
          }
        });

        _it('Verify that rpcClient.preapplyOperations simulates the validation of an operation', async () => {
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

        _it('Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract', async () => {
          const entrypoints = await rpcClient.getEntrypoints(knownContract);
          expect(entrypoints).toBeDefined();
        });

        _it('Verify that rpcClient.getChainId returns chain ID', async () => {
          const chainId = await rpcClient.getChainId();
          expect(chainId).toBeDefined();
        });

        _it('Verify that rpcClient.runOperation runs an operation without signature checks', async () => {
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

        _it('Verify that rpcClient.simulateOperation simulates an operation without signature checks', async () => {
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

        _it('Verify that rpcClient.runView executes tzip4 views', async () => {

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

        _it('Verify that rpcClient.runScriptView executes michelson view', async () => {
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

        _it('Verify that rpcClient.getSuccessorPeriod will get the voting period of next block', async () => {
          const successorPeriod = await rpcClient.getSuccessorPeriod();
          expect(successorPeriod).toBeDefined();
        });

        _it('Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID', async () => {
          const saplingStateId = (await rpcClient.getStorage(knownSaplingContract) as any)['int'];
          const saplingDiffById = await rpcClient.getSaplingDiffById(saplingStateId);
          expect(saplingDiffById).toBeDefined();
        });

        _it('Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state', async () => {
          const saplingDiffByContract = await rpcClient.getSaplingDiffByContract(
            knownSaplingContract
          );
          expect(saplingDiffByContract).toBeDefined();
        });

        _it('Verify that rpcClient.getProtocols will list past and present Tezos protocols', async () => {
          const protocols = await rpcClient.getProtocols();
          expect(protocols).toEqual({ protocol, next_protocol: protocol });
        });

        _it('Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage', async () => {
          const usedSpace = await rpcClient.getStorageUsedSpace(knownContract);
          expect(usedSpace).toBeDefined();
        });

        _it('Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage', async () => {
          const paidSpace = await rpcClient.getStoragePaidSpace(knownContract);
          expect(paidSpace).toBeDefined();
        });

        _it('Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract', async () => {
          const ticketBalance = await rpcClient.getTicketBalance(ticketContract.address, { ticketer: ticketContract.address, content_type: { prim: 'string' }, content: { string: 'abc' } });
          expect(ticketBalance).toBeDefined();
        });

        _it('Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract', async () => {
          const ticketBalances = await rpcClient.getAllTicketBalances(ticketContract.address);
          expect(ticketBalances).toBeInstanceOf(Array);
          expect(ticketBalances[0].ticketer).toBe(ticketContract.address);
          expect(ticketBalances[0].content_type).toBeDefined();
          expect(ticketBalances[0].content).toBeDefined();
          expect(ticketBalances[0].amount).toBeDefined();
        });

        _it('Verify that rpcClient.getPendingOperations will retrieve the pending operations in mempool', async () => {
          const pendingOperations: PendingOperations = await rpcClient.getPendingOperations();
          expect(pendingOperations).toBeDefined();
          expect(pendingOperations.applied).toBeInstanceOf(Array);
          expect(pendingOperations.refused).toBeInstanceOf(Array);
          expect(pendingOperations.outdated).toBeInstanceOf(Array);
          expect(pendingOperations.branch_delayed).toBeInstanceOf(Array);
          expect(pendingOperations.branch_refused).toBeInstanceOf(Array);
        });

        _it('Verify that rpcClient.getOriginationProof will retrieve the proof needed for smart rollup originate', async () => {
          const proof = await rpcClient.getOriginationProof({
            kernel: '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
            kind: PvmKind.WASM2
          })
          const hexRegex = RegExp('^[a-fA-F0-9]+$');
          expect(proof).toBeDefined();
          expect(hexRegex.test(proof)).toEqual(true);
        })
      });
    });
  }
);
