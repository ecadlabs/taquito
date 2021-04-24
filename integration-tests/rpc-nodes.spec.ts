import { CONFIGS } from "./config";
import { RpcClient, ScriptResponse } from '@taquito/rpc';
import { encodeExpr } from '@taquito/utils';
import { Schema } from '@taquito/michelson-encoder';
import { tokenBigmapCode, tokenBigmapStorage } from './data/token_bigmap';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, knownBaker, knownContract, setup, protocol }) => {
    const Tezos = lib;

      beforeEach(async (done) => {
        await setup()
        done()
      })

      let rpcList: Array<string> = [];
      let contractBigMapStorage: string;

      if (protocol === Protocols.PtEdo2Zk) {
        rpcList = [
            'https://api.tez.ie/rpc/edonet'
        ];

        contractBigMapStorage = 'KT1H1Xc8NGmiZYxK7S4F2eixZyNNWBj1x8Ae'
      }

      else if (protocol === Protocols.PsFLorena) {
        rpcList = [
           'https://api.tez.ie/rpc/florencenet',
        ];
        contractBigMapStorage = 'KT1GxaxWUHaFzaYkfqwPsj5x75UYgSXzawnD';
      }

rpcList.forEach(async rpc => {
    Tezos.setRpcProvider(rpc)

    const rpcClient: RpcClient = new RpcClient(rpc);

    describe(`Test calling all methods from RPC node: ${rpc}`, () => {

        it('Get the head block hash', async (done) => {

            const blockHash = await rpcClient.getBlockHash();
            expect(blockHash).toBeDefined();
            done()
        })

        it('List the ancestors of the head block', async (done) => {
                const liveBlocks = await rpcClient.getLiveBlocks();
                expect(liveBlocks).toBeDefined();
            done()
        })

        it(`Access the balance of an address`, async (done) => {
            const balance = await rpcClient.getBalance(knownBaker);
            expect(balance).toBeDefined();
            done()
        })

        it(`Access the data of a contract`, async (done) => {
            const storage = await rpcClient.getStorage(knownContract);
            expect(storage).toBeDefined();
            done()
        })

        it(`Access the code and data of a contract`, async (done) => {
            const script = await rpcClient.getScript(knownContract);
            expect(script).toBeDefined();
            done()
        })

        it(`Access the complete status of a contract`, async (done) => {
            const contract = await rpcClient.getContract(knownContract);
            expect(contract).toBeDefined();
            done()
        })

        it(`Access the manager key of a contract`, async (done) => {
            const managerKey = await rpcClient.getManagerKey(knownBaker);
            expect(managerKey).toBeDefined();
            done()
        })

        it(`Access the delegate of a contract`, async (done) => {
            const delegate = await rpcClient.getDelegate(knownBaker);
            expect(delegate).toBeDefined();
            done()
        })

        it(`Access the value associated with a key in a big map`, async (done) => {
            const schema = await rpcClient.getScript(contractBigMapStorage);
            let contractSchema: Schema;
            if (Schema.isSchema(schema)) {
                contractSchema = schema;
            } else {
                contractSchema = Schema.fromRPCResponse({ script: schema as ScriptResponse });
            }
            const { key, type } = contractSchema.EncodeBigMapKey('1');
            const { packed } = await rpcClient.packData({ data: key, type });
            const contract = await Tezos.contract.at(contractBigMapStorage)
            const storage: any = await contract.storage();
            const id = Number(storage.id);
            const encodedExpr = encodeExpr(packed);
            const bigMapValue = await rpcClient.getBigMapExpr(id.toString(), encodedExpr);
            expect(bigMapValue).toBeDefined();
            done()
        })

        it(`Fetches information about a delegate from RPC`, async (done) => {
            const delegates = await rpcClient.getDelegates(knownBaker);
            expect(delegates).toBeDefined();
            done()
        })

        it('Get all constants from RPC', async (done) => {
            const constants = await rpcClient.getConstants();
            expect(constants).toBeDefined();
            done()
        })

        it('Get all the information about a block', async (done) => {
            const blockInfo = await rpcClient.getBlock();
            expect(blockInfo).toBeDefined();
            done()
        })

        it('Get the whole block header', async (done) => {
            const blockHeader = await rpcClient.getBlockHeader();
            expect(blockHeader).toBeDefined();
            done()
        })

        it('Get all the metadata associated to the block', async (done) => {
            const blockMetadata = await rpcClient.getBlockMetadata();
            expect(blockMetadata).toBeDefined();
            done()
        })

        it('Retrieves the list of delegates allowed to bake a block', async (done) => {
            const bakingRights = await rpcClient.getBakingRights();
            expect(bakingRights).toBeDefined();
            done()
        })

        it('Retrieves the list of delegates allowed to endorse a block', async (done) => {
            const endorsingRights = await rpcClient.getEndorsingRights();
            expect(endorsingRights).toBeDefined();
            done()
        })

        it('Get ballots casted so far during a voting period', async (done) => {
            const ballotList = await rpcClient.getBallotList();
            expect(ballotList).toBeDefined();
            done()
        })

        it('Get sum of ballots casted so far during a voting period', async (done) => {
            const ballot = await rpcClient.getBallots();
            expect(ballot).toBeDefined();
            done()
        })

        it('Get current period kind', async (done) => {
            const currentPeriodKind = await rpcClient.getCurrentPeriodKind();
            expect(currentPeriodKind).toBeDefined();
            done()
        })

        it('Get current proposal under evaluation', async (done) => {
            const currentProposalUnderEvaluation = await rpcClient.getCurrentProposal();
            expect(currentProposalUnderEvaluation).toBeDefined();
            done()
        })

        it('Get current expected quorum', async (done) => {
            const currentQuorum = await rpcClient.getCurrentQuorum();
            expect(currentQuorum).toBeDefined();
            done()
        })

        it('List of delegates with their voting weight, in number of rolls', async (done) => {
            const voteListings = await rpcClient.getVotesListings();
            expect(voteListings).toBeDefined();
            done()
        })

        it('List of proposals with number of supporters', async (done) => {
            const proposals = await rpcClient.getProposals();
            expect(proposals).toBeDefined();
            done()
        })

        it('Forge an operation returning the unsigned bytes', async (done) => {
            const operation:any = {
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
            }

            const forgeOrigination = await rpcClient.forgeOperations(operation);
            expect(forgeOrigination).toBeDefined();
            done()
        })

        // We will send invalid signedOpBytes and see if the node returns the expected error message
        it('Inject an operation in node and broadcast it', async (done) => {
            try{
                const injectedOperation = await rpcClient.injectOperation('operation');
            } catch (ex) {
                expect(ex.message).toMatch('Invalid_argument "Hex.to_char: 112 is an invalid char')
            }
            done()
        })

        it('Simulate the validation of an operation', async (done) => {
            try {
                const operation:any = {
                    branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
                    contents: [
                    {
                        kind: 'origination',
                        counter: '1',
                        source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
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
                    signature: 'edsigtcagjMz6xtr45ummgsxgj7V6tQGRMerspzSVLJuE2bmBv6dGffCXYqokNgymY7uY7c97kpFrzMr5dhjqwKGsUb6kSP3B97'
                }

                await rpcClient.preapplyOperations([operation]);

        } catch (ex) {
            expect(ex.message).toMatch('contract.counter_in_the_past')
        }
            done()
        })

        it('Get the list of entrypoints of the contract', async (done) => {
            const entrypoints = await rpcClient.getEntrypoints(knownContract);
            expect(entrypoints).toBeDefined();
            done()
        })

        it('Get chain ID', async (done) => {
            const chainId = await rpcClient.getChainId();
            expect(chainId).toBeDefined();
            done()
        })

        it('Run an operation without signature checks', async (done) => {
            try {
                const operation: any = {
                    chain_id: "NetXjD3HPJJjmcd",
                    operation:{
                        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
                        contents: [
                        {
                            kind: 'origination',
                            counter: '1',
                            source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
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
                        signature: 'edsigtcagjMz6xtr45ummgsxgj7V6tQGRMerspzSVLJuE2bmBv6dGffCXYqokNgymY7uY7c97kpFrzMr5dhjqwKGsUb6kSP3B97'
                    }
                }

                await rpcClient.runOperation(operation);

        } catch (ex) {
            expect(ex.message).toMatch('contract.counter_in_the_past')
        }
            done()
        })
      });
});

    })
