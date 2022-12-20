// import { Context } from '../../src/context';
// import { RPCOriginationOperation } from '../../src/operations';
// import { PrepareProvider } from '../../src/prepare/prepare-provider';

// describe('PrepareProvider test', () => {
//   let prepareProvider: PrepareProvider;

//   let mockReadProvider: {
//     getBlockHash: jest.Mock<any, any>,
//     getNextProtocol: jest.Mock<any, any>,
//     getHeadCounter: jest.Mock<any, any>
//   }

//   let mockSigner: {
//     publicKeyHash: jest.Mock<any, any>
//   }

//   let mockContext: {
//     signer: any,
//     readProvider: any
//   };

//   mockReadProvider = {
//     getBlockHash: jest.fn(),
//     getNextProtocol: jest.fn(),
//     getHeadCounter: jest.fn()
//   }

//   mockSigner = {
//     publicKeyHash: jest.fn()
//   }

//   const originationOp = {
//     kind: 'origination',
//     fee: 1,
//     gas_limit: 2,
//     storage_limit: 2,
//     balance: '100',
//     script: {
//       code: `parameter string;
//       storage string;
//       code {CAR;
//             PUSH string "Hello ";
//             CONCAT;
//             NIL operation; PAIR};
//       `,
//       storage: '"test"'
//     }
//   } as RPCOriginationOperation

//   beforeEach(() => {

//     mockSigner.publicKeyHash.mockResolvedValue('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu');
//     mockReadProvider.getBlockHash.mockResolvedValue('test');
//     mockReadProvider.getHeadCounter.mockResolvedValue('1');
//     mockReadProvider.getNextProtocol.mockResolvedValue('test');

//     const context = new Context(mockReadProvider as any, mockSigner as any);

//     prepareProvider = new PrepareProvider(context);
//   })
//   it('should returned a Prepared origination operation', async () => {

//     const prep = await prepareProvider.originate(originationOp);

//     console.log(prep);

//     expect(prep).toBeDefined();
//   })
// })
