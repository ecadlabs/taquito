// import { Context } from '../../src/context';
// import { PrepareProvider } from '../../src/prepare/prepare-provider';
// import {
//   originationOp, transactionOp
// } from './data';

// import { InvalidPrepareParamsError} from '../../src/error';

// describe('PrepareProvider test', () => {
//   let prepareProvider: PrepareProvider;

//   let mockReadProvider: {
//     getBlockHash: jest.Mock<any, any>,
//     getNextProtocol: jest.Mock<any, any>,
//     getCounter: jest.Mock<any, any>
//   }

//   let mockRpcClient: {
//     getBlockHeader: jest.Mock<any, any>,
//     getProtocols: jest.Mock<any, any>,
//     getContract: jest.Mock<any, any>
//   }

//   let mockSigner: {
//     publicKeyHash: jest.Mock<any, any>
//   }

//   mockReadProvider = {
//     getBlockHash: jest.fn(),
//     getNextProtocol: jest.fn(),
//     getCounter: jest.fn()
//   }

//   mockRpcClient = {
//     getBlockHeader: jest.fn(),
//     getProtocols: jest.fn(),
//     getContract: jest.fn(),
//   }

//   mockSigner = {
//     publicKeyHash: jest.fn()
//   }

//   beforeAll(() => {
//     mockRpcClient.getContract.mockResolvedValue({
//       counter: 0,
//       script: {
//         code: [],
//         storage: 'sampleStorage',
//       },
//     });
//     mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test_block_header' });
//     mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });

//     mockSigner.publicKeyHash.mockResolvedValue('test_public_key_hash');

//     mockReadProvider.getBlockHash.mockResolvedValue('test_block_hash');
//     mockReadProvider.getNextProtocol.mockResolvedValue('test_protocol');
//     mockReadProvider.getCounter.mockResolvedValue('0');

//     const context = new Context(mockRpcClient as any, mockSigner as any);
//     context.readProvider = mockReadProvider as any;

//     prepareProvider = new PrepareProvider(context);
//   });

//   describe('originate', () => {
//     it('should return a prepared Origination operation', async () => {

//       const prepared = await prepareProvider.originate({ operation: originationOp });

//       expect(prepared).toEqual({
//         opOb: {
//           branch: 'test_block_hash',
//           contents: [
//             {
//               kind: 'origination',
//               fee: '1',
//               gas_limit: '2',
//               storage_limit: '2',
//               balance: '100',
//               script: {
//                 code: [
//                   {
//                     prim: 'storage',
//                     args: [
//                       {
//                         prim: 'pair',
//                         args: [
//                           {
//                             prim: 'big_map',
//                             args: [
//                               {
//                                 prim: 'address'
//                               },
//                               {
//                                 prim: 'pair',
//                                 args: [
//                                   {
//                                     prim: 'nat'
//                                   },
//                                   {
//                                     prim: 'map',
//                                     args: [
//                                       {
//                                         prim: 'address'
//                                       },
//                                       {
//                                         prim: 'nat'
//                                       }
//                                     ]
//                                   }
//                                 ]
//                               }
//                             ]
//                           },
//                           {
//                             prim: 'pair',
//                             args: [
//                               {
//                                 prim: 'address'
//                               },
//                               {
//                                 prim: 'pair',
//                                 args: [
//                                   {
//                                     prim: 'bool'
//                                   },
//                                   {
//                                     prim: 'nat'
//                                   }
//                                 ]
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     ]
//                   }
//                 ],
//                 storage: {
//                   prim: 'Pair',
//                   args: [
//                     [],
//                     {
//                       prim: 'Pair',
//                       args: [
//                         {
//                           string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
//                         },
//                         {
//                           prim: 'Pair',
//                           args: [
//                             {
//                               prim: 'False'
//                             },
//                             {
//                               int: '200'
//                             }
//                           ]
//                         }
//                       ]
//                     }
//                   ]
//                 }
//               },
//               source: 'test_public_key_hash',
//               counter: '1'
//             }
//           ],
//           protocol: 'test_protocol'
//         },
//         counter: 0
//       });
//     });

//     it('should throw an error if parameters does not have related operation kind to the method', async () => {
//       expect(
//         async () => {
//           await prepareProvider.originate({ operation: transactionOp })
//         }
//       ).toThrowError(InvalidPrepareParamsError)
//     });
//   });

//   describe('transaction', () => {
//     it('should return a prepared Transaction operation', async () => {
//       const prepared = await prepareProvider.transaction({ operation: transactionOp })

//       expect(prepared).toEqual({
//         opOb: {
//           branch: 'test_block_hash',
//           contents: [
//             {
//               kind: 'transaction',
//               fee: '1',
//               gas_limit: '2',
//               storage_limit: '2',
//               amount: '5',
//               destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
//               source: 'test_public_key_hash',
//               counter: '2'
//             }
//           ],
//           protocol: 'test_protocol'
//         },
//         counter: 0
//       })

//     });
//   });

//   describe('activation', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('drainDelegate', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('reveal', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('delegation', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('registerGlobalConstant', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('txRollupOrigination', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('txRollupSubmitBatch', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('updateConsensusKey', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('transferTicket', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('increasePaidStorage', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('ballot', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });

//   describe('proposals', () => {
//     it('should return a prepared x operation', async () => {

//     });
//   });
// });
