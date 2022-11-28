import { CONFIGS } from './config';
import { Protocols } from "@taquito/taquito";
import { RpcClientCache, RpcClient, RPCRunViewParam, RPCRunScriptViewParam } from '@taquito/rpc';
import { encodeExpr } from '@taquito/utils';
import { Schema } from '@taquito/michelson-encoder';
import { tokenBigmapCode, tokenBigmapStorage } from './data/token_bigmap';

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
    txRollupAddress,
  }) => {
    const Tezos = lib;

    const limanetAndAlpha = protocol === Protocols.PtLimaPtL || protocol === Protocols.ProtoALpha ? test : test.skip;
    const kathmandunetAndAlpha = protocol === Protocols.PtKathman || protocol === Protocols.ProtoALpha ? test : test.skip;

    beforeAll(async (done) => {
      await setup()
      done()
    });

    const rpcList: Array<string> = [rpc];

    rpcList.forEach(async (rpc) => {
      Tezos.setRpcProvider(rpc);

      const rpcClient = new RpcClientCache(new RpcClient(rpc));

      describe(`Test calling all methods from RPC node: ${rpc}`, () => {
        it('Verify rpcClient.getBlockHash returns the head block hash', async (done) => {
          const blockHash = await rpcClient.getBlockHash();
          expect(blockHash).toBeDefined();
          done();
        });

        it('Verify rpcClient.getLiveBlocks returns the ancestors of the head block', async (done) => {
          const liveBlocks = await rpcClient.getLiveBlocks();
          expect(liveBlocks).toBeDefined();
          done();
        });

        it(`Verify rpcClient.getBalance for known baker returns the balance of the address`, async (done) => {
          const balance = await rpcClient.getBalance(knownBaker);
          expect(balance).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getStorage for know contract returns the data of a contract`, async (done) => {
          const storage = await rpcClient.getStorage(knownContract);
          expect(storage).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getScript for know contract returns the code and data of a contract`, async (done) => {
          const script = await rpcClient.getScript(knownContract);
          expect(script).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode`, async (done) => {
          const script = await rpcClient.getNormalizedScript(knownContract);
          expect(script).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getContract returns the complete status of a contract`, async (done) => {
          const contract = await rpcClient.getContract(knownContract);
          expect(contract).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract`, async (done) => {
          const managerKey = await rpcClient.getManagerKey(knownBaker);
          expect(managerKey).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getDelegate for known baker returns the delegate of the contract`, async (done) => {
          const delegate = await rpcClient.getDelegate(knownBaker);
          expect(delegate).toBeDefined();
          done();
        });

        it(`Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map`, async (done) => {
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
          done();
        });

        it(`Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC`, async (done) => {
          const delegates = await rpcClient.getDelegates(knownBaker);
          expect(delegates).toBeDefined();
          done();
        });

        it(`Fetches voting information about a delegate from RPC`, async (done) => {
          const votinInfo = await rpcClient.getVotingInfo(knownBaker);
          expect(votinInfo).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getConstants returns all constants from RPC', async (done) => {
          const constants = await rpcClient.getConstants();
          expect(constants).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getBlock returns all the information about a block', async (done) => {
          const blockInfo = await rpcClient.getBlock();
          expect(blockInfo).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getBlockHeader returns whole block header', async (done) => {
          const blockHeader = await rpcClient.getBlockHeader();
          expect(blockHeader).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getBlockMetadata returns all metadata associated to the block', async (done) => {
          const blockMetadata = await rpcClient.getBlockMetadata();
          expect(blockMetadata).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block', async (done) => {
          const bakingRights = await rpcClient.getBakingRights({
            max_round: '2'
          });
          expect(bakingRights).toBeDefined();
          expect(bakingRights[0].round).toBeDefined();
          expect(bakingRights[0].priority).toBeUndefined();
          done();
        });

        it('Verify that rpcClient.getEndorsingRights retrieves the list of delegates allowed to endorse a block', async (done) => {
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
          done();
        });

        it('Verify that rpcClient.getBallotList returns ballots casted so far during a voting period', async (done) => {
          const ballotList = await rpcClient.getBallotList();
          expect(ballotList).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period', async (done) => {
          const ballot = await rpcClient.getBallots();
          expect(ballot).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getCurrentPeriod returns current period kind', async (done) => {
          const currentPeriodKind = await rpcClient.getCurrentPeriod();
          expect(currentPeriodKind).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getCurrentProposal returns current proposal under evaluation', async (done) => {
          const currentProposalUnderEvaluation = await rpcClient.getCurrentProposal();
          expect(currentProposalUnderEvaluation).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getCurrentQuorum returns current expected quorum', async (done) => {
          const currentQuorum = await rpcClient.getCurrentQuorum();
          expect(currentQuorum).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls', async (done) => {
          const voteListings = await rpcClient.getVotesListings();
          expect(voteListings).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getProposals returns list of proposals with number of supporters', async (done) => {
          const proposals = await rpcClient.getProposals();
          expect(proposals).toBeDefined();
          done();
        });

        it('Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes', async (done) => {
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
          done();
        });

        // We will send invalid signedOpBytes and see if the node returns the expected error message
        it('Verify that rpcClient.injectOperation injects an operation in node and broadcast it', async (done) => {
          try {
            await rpcClient.injectOperation('operation');
          } catch (ex: any) {
            expect(ex.message).toContain('112 is an invalid char');
          }
          done();
        });

        it('Verify that rpcClient.preapplyOperations simulates the validation of an operation', async (done) => {
          try {
            // the account needs to be revealed first
            const reveal = await Tezos.contract.reveal({});
            await reveal.confirmation();
          } catch (ex) {
            expect(ex).toEqual(expect.objectContaining({
              message: expect.stringContaining('has already been revealed')
            }))
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
          done();
        });

        it('Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract', async (done) => {
          const entrypoints = await rpcClient.getEntrypoints(knownContract);
          expect(entrypoints).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getChainId returns chain ID', async (done) => {
          const chainId = await rpcClient.getChainId();
          expect(chainId).toBeDefined();
          done();
        });

        it('Verify that rpcClient.runOperation runs an operation without signature checks', async (done) => {
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
          done();
        });

        it('Verify that rpcClient.runView executes tzip4 views', async (done) => {

          const chainId = await Tezos.rpc.getChainId();

          const params: RPCRunViewParam = {
            contract: knownBigMapContract,
            entrypoint: 'getBalance',
            chain_id: chainId,
            input: {
              string: 'tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP'
            }
          }

          const views = await Tezos.rpc.runView(params)
          expect(views).toBeDefined();
          expect(views).toEqual({ "data": { "int": "100" } });
          done();
        });

        it('Verify that rpcClient.runScriptView executes michelson view', async (done) => {
          const chainId = await Tezos.rpc.getChainId();
          const params: RPCRunScriptViewParam = {
            contract: knownViewContract!,
            view: 'add',
            chain_id: chainId,
            input: {
              int: '0'
            }
          }

          const views = await Tezos.rpc.runScriptView(params)
          expect(views).toBeDefined();
          expect(views).toEqual({ "data": { "int": "2" } });
          done();
        });

        it('Verify that rpcClient.getSuccessorPeriod will get the voting period of next block', async (done) => {
          const successorPeriod = await rpcClient.getSuccessorPeriod();
          expect(successorPeriod).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID', async (done) => {
          const saplingStateId = (await rpcClient.getStorage(knownSaplingContract) as any)['int']
          const saplingDiffById = await rpcClient.getSaplingDiffById(saplingStateId);
          expect(saplingDiffById).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state', async (done) => {
          const saplingDiffByContract = await rpcClient.getSaplingDiffByContract(
            knownSaplingContract
          );
          expect(saplingDiffByContract).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getProtocols will list past and present Tezos protocols', async (done) => {
          const protocols = await rpcClient.getProtocols();
          expect(protocols).toEqual({ protocol, next_protocol: protocol });
          done();
        });

        it('Verify that rpcClient.getTxRollupInbox will access the inbox of a transaction rollup on jakartanet', async (done) => {
          const inbox = await rpcClient.getTxRollupInbox(txRollupAddress, '0');
          expect(inbox).toBeDefined();
          done();
        });

        it('Verify that rpcClient.getTxRollupState will access the state of a rollup on jakartanet', async (done) => {
          const state = await rpcClient.getTxRollupState(txRollupAddress);
          expect(state).toBeDefined();
          done();
        });

        kathmandunetAndAlpha('Verify that rpcClient.getTxRollupInbox will access the inbox of a transaction rollup', async (done) => {
          const inbox = await rpcClient.getTxRollupInbox(txRollupAddress, '0');
          expect(inbox).toBeDefined();
          done();
        });

        kathmandunetAndAlpha('Verify that rpcClient.getTxRollupState will access the state of a rollup', async (done) => {
          const state = await rpcClient.getTxRollupState(txRollupAddress);
          expect(state).toBeDefined();
          done();
        });

        limanetAndAlpha('Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage', async (done) => {
          const usedSpace = await rpcClient.getStorageUsedSpace(knownContract);
          expect(usedSpace).toBeDefined();
          done();
        });

        limanetAndAlpha('Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage', async (done) => {
          const paidSpace = await rpcClient.getStoragePaidSpace(knownContract);
          expect(paidSpace).toBeDefined();
          done();
        });
      });
    });
  }
);
