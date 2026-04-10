import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import {
  sample,
  sampleStorage,
  miStr,
  miSample,
  ligoSample,
  miInit,
  originateResults,
  originateResultsMutezTrue,
  revealOp,
  originateResultsEstimate,
} from './data';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { Estimate } from '../../src/estimate/estimate';
import { Protocols } from '../../src/constants';
import {
  InvalidCodeParameter,
  InvalidDelegationSource,
  InvalidInitParameter,
} from '../../src/contract/errors';
import { preapplyResultFrom } from './helper';
import { OpKind, ParamsWithKind, TransferTicketParams } from '../../src/operations/types';
import { NoopParser } from '../../src/taquito';
import { OperationBatch } from '../../src/batch/rpc-batch-provider';
import { PvmKind } from '@taquito/rpc';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

/**
 * RPCContractProvider test
 */
describe('RpcContractProvider test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getScript: ReturnType<typeof vi.fn>;
    getStorage: ReturnType<typeof vi.fn>;
    getBigMapExpr: ReturnType<typeof vi.fn>;
    getBlockHeader: ReturnType<typeof vi.fn>;
    getEntrypoints: ReturnType<typeof vi.fn>;
    getManagerKey: ReturnType<typeof vi.fn>;
    getBlock: ReturnType<typeof vi.fn>;
    getContract: ReturnType<typeof vi.fn>;
    getBlockMetadata: ReturnType<typeof vi.fn>;
    injectOperation: ReturnType<typeof vi.fn>;
    packData: ReturnType<typeof vi.fn>;
    preapplyOperations: ReturnType<typeof vi.fn>;
    getChainId: ReturnType<typeof vi.fn>;
    getSaplingDiffById: ReturnType<typeof vi.fn>;
    getProtocols: ReturnType<typeof vi.fn>;
    getCurrentPeriod: ReturnType<typeof vi.fn>;
    getConstants: ReturnType<typeof vi.fn>;
    deleteAllCachedData: ReturnType<typeof vi.fn>;
  };

  let mockReadProvider: {
    getBlockHash: ReturnType<typeof vi.fn>;
    getNextProtocol: ReturnType<typeof vi.fn>;
    getCounter: ReturnType<typeof vi.fn>;
    getProtocolConstants: ReturnType<typeof vi.fn>;
    getScript: ReturnType<typeof vi.fn>;
    getEntrypoints: ReturnType<typeof vi.fn>;
    getBalance: ReturnType<typeof vi.fn>;
    getSpendable: ReturnType<typeof vi.fn>;
    isAccountRevealed: ReturnType<typeof vi.fn>;
    getChainId: ReturnType<typeof vi.fn>;
  };

  let mockSigner: {
    publicKeyHash: ReturnType<typeof vi.fn>;
    publicKey: ReturnType<typeof vi.fn>;
    sign: ReturnType<typeof vi.fn>;
  };

  let mockForger: {
    forge: ReturnType<typeof vi.fn>;
  };

  let mockEstimate: {
    originate: ReturnType<typeof vi.fn>;
    transfer: ReturnType<typeof vi.fn>;
    setDelegate: ReturnType<typeof vi.fn>;
    registerDelegate: ReturnType<typeof vi.fn>;
    batch: ReturnType<typeof vi.fn>;
    reveal: ReturnType<typeof vi.fn>;
    registerGlobalConstant: ReturnType<typeof vi.fn>;
    transferTicket: ReturnType<typeof vi.fn>;
    increasePaidStorage: ReturnType<typeof vi.fn>;
    updateConsensusKey: ReturnType<typeof vi.fn>;
    updateCompanionKey: ReturnType<typeof vi.fn>;
    smartRollupAddMessages: ReturnType<typeof vi.fn>;
    contractCall: ReturnType<typeof vi.fn>;
    smartRollupOriginate: ReturnType<typeof vi.fn>;
    smartRollupExecuteOutboxMessage: ReturnType<typeof vi.fn>;
    stake: ReturnType<typeof vi.fn>;
    unstake: ReturnType<typeof vi.fn>;
    finalizeUnstake: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRpcClient = {
      getBigMapExpr: vi.fn(),
      getEntrypoints: vi.fn(),
      getBlock: vi.fn(),
      getScript: vi.fn(),
      getManagerKey: vi.fn(),
      getStorage: vi.fn(),
      getBlockHeader: vi.fn(),
      getBlockMetadata: vi.fn(),
      getContract: vi.fn(),
      injectOperation: vi.fn(),
      packData: vi.fn(),
      preapplyOperations: vi.fn(),
      getChainId: vi.fn(),
      getSaplingDiffById: vi.fn(),
      getProtocols: vi.fn(),
      getCurrentPeriod: vi.fn(),
      getConstants: vi.fn(),
      deleteAllCachedData: vi.fn(),
    };

    mockForger = {
      forge: vi.fn(),
    };

    mockReadProvider = {
      getBlockHash: vi.fn(),
      getNextProtocol: vi.fn(),
      getCounter: vi.fn(),
      getProtocolConstants: vi.fn(),
      getScript: vi.fn(),
      getEntrypoints: vi.fn(),
      getBalance: vi.fn(),
      getSpendable: vi.fn(),
      isAccountRevealed: vi.fn(),
      getChainId: vi.fn(),
    };

    mockSigner = {
      publicKeyHash: vi.fn(),
      publicKey: vi.fn(),
      sign: vi.fn(),
    };

    mockEstimate = {
      originate: vi.fn(),
      transfer: vi.fn(),
      registerDelegate: vi.fn(),
      setDelegate: vi.fn(),
      batch: vi.fn(),
      reveal: vi.fn(),
      registerGlobalConstant: vi.fn(),
      transferTicket: vi.fn(),
      increasePaidStorage: vi.fn(),
      updateConsensusKey: vi.fn(),
      updateCompanionKey: vi.fn(),
      smartRollupAddMessages: vi.fn(),
      contractCall: vi.fn(),
      smartRollupOriginate: vi.fn(),
      smartRollupExecuteOutboxMessage: vi.fn(),
      stake: vi.fn(),
      unstake: vi.fn(),
      finalizeUnstake: vi.fn(),
    };

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    mockRpcClient.getCurrentPeriod.mockResolvedValue({
      voting_period: {
        index: 1,
        kind: 'exploration',
        start_position: 16,
      },
      position: 3,
      remaining: 12,
    });

    mockRpcClient.getBigMapExpr.mockResolvedValue({
      prim: 'Pair',
      args: [{ int: '100' }, []],
    });
    mockRpcClient.getContract.mockResolvedValue({
      counter: 0,
      script: {
        code: [sample],
        storage: sampleStorage,
      },
    });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
    mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });
    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
    mockRpcClient.packData.mockResolvedValue({
      packed: '747a325542477245424b7a7a5736686a586a78786951464a4e6736575232626d3647454e',
    });
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.injectOperation.mockResolvedValue(
      'oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP'
    );

    mockRpcClient.getConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      hard_gas_limit_per_block: new BigNumber(5200000),
      cost_per_byte: new BigNumber(1000),
    });

    mockReadProvider.getProtocolConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber('1040000'),
      hard_gas_limit_per_block: new BigNumber('5200000'),
      cost_per_byte: new BigNumber('250'),
      hard_storage_limit_per_operation: new BigNumber('60000'),
      minimal_block_delay: new BigNumber('30'),
      time_between_blocks: [new BigNumber('60'), new BigNumber('40')],
    });
    mockReadProvider.getScript.mockResolvedValue({
      code: [{ prim: 'parameter', args: [{ prim: 'unit' }] }, sample],
      storage: sampleStorage,
    });
    mockReadProvider.getEntrypoints.mockResolvedValue({ entrypoints: {} });
    mockReadProvider.getBalance.mockResolvedValue(new BigNumber('10000000000'));
    mockReadProvider.getNextProtocol.mockResolvedValue('test_proto');
    mockReadProvider.getBlockHash.mockResolvedValue('test');

    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.getEntrypoints.mockResolvedValue({ entrypoints: {} });
    const estimateReveal = new Estimate(1000000, 0, 64, 250);
    mockEstimate.reveal.mockResolvedValue(estimateReveal);

    const context = new Context(mockRpcClient as any, mockSigner as any);
    context.forger = mockForger;
    context.readProvider = mockReadProvider as any;
    rpcContractProvider = new RpcContractProvider(
      // deepcode ignore no-any: any is good enough
      context,
      mockEstimate as any
    );
  });

  describe('originate', () => {
    it('should produce a reveal and origination operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: miInit,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });

      const res = JSON.parse(JSON.stringify(result.raw)); // Strip symbols

      expect(res).toEqual(originateResults);
    });

    it('should not convert balance to mutez when mutez flag is set to true', async () => {
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: miInit,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
        mutez: true,
      });
      const res = JSON.parse(JSON.stringify(result.raw)); // Strip symbols

      expect(res).toEqual(originateResultsMutezTrue);
    });

    it('estimate when no fees are specified', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.originate.mockResolvedValue(estimate);

      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: miInit,
      });

      const res = JSON.parse(JSON.stringify(result.raw)); // Strip symbols

      expect(res).toEqual(originateResultsEstimate);
    });

    it('should not alter code and init object when they are array and object', async () => {
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: ligoSample,
        init: { int: '0' },
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              balance: '200000000',
              counter: '2',
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              script: {
                code: ligoSample,
                storage: { int: '0' },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '257',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should deal with code properties in atypical order', async () => {
      const order1 = ['storage', 'code', 'parameter'];
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miSample
          .concat()
          // deepcode ignore no-any: any is good enough
          .sort((a: any, b: any) => order1.indexOf(a.prim) - order1.indexOf(b.prim)),
        init: { int: '0' },
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              balance: '200000000',
              counter: '2',
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              script: {
                code: miSample,
                storage: { int: '0' },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '257',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('at', () => {
    it('should read entrypoints from the read provider by default', async () => {
      await rpcContractProvider.at('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD');

      expect(mockReadProvider.getScript).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        'head'
      );
      expect(mockReadProvider.getEntrypoints).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD'
      );
      expect(mockRpcClient.getEntrypoints).not.toHaveBeenCalled();
    });

    it('should read script and entrypoints from the requested block', async () => {
      await rpcContractProvider.at('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD', undefined, 200);

      expect(mockReadProvider.getScript).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        200
      );
      expect(mockRpcClient.getEntrypoints).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        { block: '200' }
      );
    });

    it('should retry at head when the inclusion block temporarily returns 404', async () => {
      mockReadProvider.getScript.mockRejectedValueOnce(
        new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
      );

      await rpcContractProvider.at('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD', undefined, 200);

      expect(mockReadProvider.getScript).toHaveBeenNthCalledWith(
        1,
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        200
      );
      expect(mockReadProvider.getScript).toHaveBeenNthCalledWith(
        2,
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        'head'
      );
      expect(mockReadProvider.getEntrypoints).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD'
      );
    });

    it('should read script and entrypoints from the exact block hash without head fallback', async () => {
      await rpcContractProvider.atExactBlock(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        undefined,
        'BKjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD0000000000000'
      );

      expect(mockReadProvider.getScript).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        'BKjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD0000000000000'
      );
      expect(mockRpcClient.getEntrypoints).toHaveBeenCalledWith(
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        { block: 'BKjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD0000000000000' }
      );
      expect(mockReadProvider.getEntrypoints).not.toHaveBeenCalled();
    });

    it('should keep retrying at head while the contract index catches up', async () => {
      mockReadProvider.getScript
        .mockRejectedValueOnce(
          new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
        )
        .mockRejectedValueOnce(
          new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
        )
        .mockRejectedValueOnce(
          new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
        )
        .mockResolvedValueOnce({
          code: [{ prim: 'parameter', args: [{ prim: 'unit' }] }, sample],
          storage: sampleStorage,
        });

      await rpcContractProvider.at('KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD', undefined, 200);

      expect(mockReadProvider.getScript).toHaveBeenNthCalledWith(
        1,
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        200
      );
      expect(mockReadProvider.getScript).toHaveBeenNthCalledWith(
        2,
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        'head'
      );
      expect(mockReadProvider.getScript).toHaveBeenNthCalledWith(
        3,
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        'head'
      );
      expect(mockReadProvider.getScript).toHaveBeenNthCalledWith(
        4,
        'KT1KjGmnNQ6iXWr8VHGM8n8b8EQXHc6eRsPD',
        'head'
      );
      expect(mockReadProvider.getEntrypoints).toHaveBeenCalledTimes(1);
    });
  });

  describe('transfer', () => {
    it('should produce a reveal and transaction operation', async () => {
      const result = await rpcContractProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              amount: '2000000',
              counter: '2',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: '10000',
              gas_limit: '10600',
              kind: 'transaction',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '300',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should estimate when no fee are specified', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.transfer.mockResolvedValue(estimate);

      const result = await rpcContractProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              amount: '2000000',
              counter: '2',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              kind: 'transaction',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: estimate.storageLimit.toString(),
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should retry preapply with RPC expected counters when validation is ahead of the contract index', async () => {
      mockForger.forge
        .mockResolvedValueOnce('forged-initial')
        .mockResolvedValueOnce('forged-retry');
      mockSigner.sign.mockImplementation(async (opbytes: string) => ({
        sbytes: `signed:${opbytes}`,
        prefixSig: `sig:${opbytes}`,
      }));
      mockRpcClient.preapplyOperations
        .mockRejectedValueOnce(
          new HttpResponseError(
            'Http error response: (500) counter_in_the_past',
            500 as any,
            'Internal Server Error',
            JSON.stringify([
              {
                kind: 'branch',
                id: 'proto.024-PtTALLiN.contract.counter_in_the_past',
                contract: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
                expected: '4',
                found: '1',
              },
            ]),
            'http://example.test/chains/main/blocks/head/helpers/preapply/operations'
          )
        )
        .mockResolvedValueOnce([]);

      const result = await rpcContractProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });

      expect(mockRpcClient.preapplyOperations).toHaveBeenCalledTimes(2);
      expect(mockRpcClient.preapplyOperations.mock.calls[0][0][0].contents[0].counter).toEqual('1');
      expect(mockRpcClient.preapplyOperations.mock.calls[0][0][0].contents[1].counter).toEqual('2');
      expect(mockRpcClient.preapplyOperations.mock.calls[1][0][0].contents[0].counter).toEqual('4');
      expect(mockRpcClient.preapplyOperations.mock.calls[1][0][0].contents[1].counter).toEqual('5');
      expect(mockRpcClient.injectOperation).toHaveBeenCalledWith('signed:forged-retry');
      expect(result.raw.opbytes).toEqual('signed:forged-retry');
      expect(result.raw.opOb.signature).toEqual('sig:forged-retry');
      expect(result.raw.opOb.contents[0].counter).toEqual('4');
      expect(result.raw.opOb.contents[1].counter).toEqual('5');
    });

    it('should omit reveal operation if manager is defined (BABY)', async () => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);
      const result = await rpcContractProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              amount: '2000000',
              counter: '1',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: '10000',
              gas_limit: '10600',
              kind: 'transaction',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '300',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should return parsed "with" error with string type', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(preapplyResultFrom(params).withError());
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');

      try {
        await rpcContractProvider.transfer(params);
      } catch (e: any) {
        expect(e.message).toEqual('test');
      }
    });

    it('should return parsed "with" error with int type', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(preapplyResultFrom(params).withIntError());
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');

      try {
        await rpcContractProvider.transfer(params);
      } catch (e: any) {
        expect(e.message).toEqual(5);
      }
    });

    it('should return parsed "with" error with pair type', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(
        preapplyResultFrom(params).withPairError()
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');

      try {
        await rpcContractProvider.transfer(params);
      } catch (e: any) {
        expect(JSON.parse(e.message)).toEqual({
          args: [{ int: 6 }, { string: 'taquito' }],
          prim: 'Pair',
        });
      }
    });

    it('should return parsed error from RPC result', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(
        preapplyResultFrom(params).withBalanceTooLowError()
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      await expect(rpcContractProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.contract.balance_too_low',
        message: '(temporary) proto.006-PsCARTHA.contract.balance_too_low',
      });
    });

    it('should return internal error when received from preapply', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(
        preapplyResultFrom(params).withInternalError()
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      await expect(rpcContractProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.005-PsBabyM1.gas_exhausted.operation',
        message: '(temporary) proto.005-PsBabyM1.gas_exhausted.operation',
      });
    });

    it('should retry preapply with RPC expected counters when counter_in_the_past is returned', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign
        .mockResolvedValueOnce({ sbytes: 'test-signed-1', prefixSig: 'test_sig_1' })
        .mockResolvedValueOnce({ sbytes: 'test-signed-2', prefixSig: 'test_sig_2' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockForger.forge.mockResolvedValueOnce('test').mockResolvedValueOnce('test-reforged');
      mockRpcClient.preapplyOperations
        .mockRejectedValueOnce(
          new HttpResponseError(
            'Http error response: (500) counter_in_the_past',
            500 as any,
            'Internal Server Error',
            JSON.stringify([
              {
                kind: 'branch',
                id: 'proto.024-PtTALLiN.contract.counter_in_the_past',
                contract: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
                expected: '5',
                found: '1',
              },
            ]),
            'http://example.test/chains/main/blocks/head/helpers/preapply/operations'
          )
        )
        .mockResolvedValueOnce([]);
      mockRpcClient.injectOperation.mockResolvedValue(
        'oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP'
      );
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      await rpcContractProvider.transfer(params);

      expect(mockRpcClient.preapplyOperations).toHaveBeenCalledTimes(2);
      expect(mockSigner.sign).toHaveBeenCalledTimes(2);

      const firstCallContents = mockRpcClient.preapplyOperations.mock.calls[0][0][0].contents;
      const secondCallContents = mockRpcClient.preapplyOperations.mock.calls[1][0][0].contents;

      expect(firstCallContents[0].counter).toEqual('1');
      expect(secondCallContents[0].counter).toEqual('5');
      expect(mockRpcClient.injectOperation).toHaveBeenCalledWith('test-signed-2');
    });

    it('should clear cached head reads after a successful injection', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test-signed', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      await rpcContractProvider.transfer(params);

      expect(mockRpcClient.deleteAllCachedData).toHaveBeenCalledTimes(1);
      expect(mockRpcClient.injectOperation).toHaveBeenCalledWith('test-signed');
    });

    it('should omit reveal operation if manager is defined', async () => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getManagerKey.mockResolvedValue({ key: 'test' });
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              amount: '2000000',
              counter: '1',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: '10000',
              gas_limit: '10600',
              kind: 'transaction',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '300',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('transfer - staking pseudo operations', () => {
    it('should be able to produce a reveal and stake pseudo operation', async () => {
      const result = await rpcContractProvider.stake({
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '10000',
              gas_limit: '10600',
              storage_limit: '300',
              amount: '2000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'stake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce an error if destination is passed and is different than the source', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.stake.mockResolvedValue(estimate);

      expect(async () => {
        await rpcContractProvider.stake({
          to: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
          amount: 2,
        });
      }).rejects.toThrow();
    });

    it('should be able to produce a stake operation when no fees are specified', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.stake.mockResolvedValue(estimate);

      const result = await rpcContractProvider.stake({
        amount: 2,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '301',
              gas_limit: '1',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'stake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce a stake operation without reveal when manager is defined', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.stake.mockResolvedValue(estimate);

      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.stake({
        amount: 2,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'transaction',
              fee: '301',
              gas_limit: '1',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'stake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce a reveal and unstake pseudo operation', async () => {
      const result = await rpcContractProvider.unstake({
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '10000',
              gas_limit: '10600',
              storage_limit: '300',
              amount: '2000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce a reveal and unstake pseudo operation when no fees are specified', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.unstake.mockResolvedValue(estimate);

      const result = await rpcContractProvider.unstake({
        amount: 2,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '301',
              gas_limit: '1',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce a reveal and unstake pseudo operation without reveal when account is revealed', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.unstake.mockResolvedValue(estimate);

      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.unstake({
        amount: 2,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'transaction',
              fee: '301',
              gas_limit: '1',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce a reveal and finalize_unstake pseudo operation', async () => {
      const result = await rpcContractProvider.finalizeUnstake({
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '10000',
              gas_limit: '10600',
              storage_limit: '300',
              amount: '0',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'finalize_unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should throw an error when an amount other than 0 is specified on a finalize_unstake pseudo-operation', async () => {
      await expect(
        rpcContractProvider.finalizeUnstake({
          amount: 2,
        })
      ).rejects.toThrow();
    });

    it('should be able to produce a reveal and finalize_unstake pseudo operation when no fees are specified', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.finalizeUnstake.mockResolvedValue(estimate);

      const result = await rpcContractProvider.finalizeUnstake({});

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '301',
              gas_limit: '1',
              storage_limit: '1000',
              amount: '0',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'finalize_unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce a reveal and finalize_unstake pseudo operation without reveal when account is revealed', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.finalizeUnstake.mockResolvedValue(estimate);

      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.finalizeUnstake({});

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'transaction',
              fee: '301',
              gas_limit: '1',
              storage_limit: '1000',
              amount: '0',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'finalize_unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should be able to produce finalize_unstake pseudo operation with different source and destination', async () => {
      const result = await rpcContractProvider.finalizeUnstake({
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
        to: 'tz1NFvwejbSCLBBuzCrZQgod3GkaMQJ9HoMf',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '10000',
              gas_limit: '10600',
              storage_limit: '300',
              amount: '0',
              destination: 'tz1NFvwejbSCLBBuzCrZQgod3GkaMQJ9HoMf',
              parameters: {
                entrypoint: 'finalize_unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('transferTicket', () => {
    it('validate that a reveal operation will be added when needed', async () => {
      mockRpcClient.getManagerKey.mockReturnValue(null);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };
      const result = await rpcContractProvider.transferTicket(params);

      const expectedReveal = revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');

      const expectedReturn = {
        counter: '2',
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
        fee: '804',
        gas_limit: '5009',
        kind: 'transfer_ticket',
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        storage_limit: '130',
        ticket_amount: '2',
        ticket_contents: {
          string: 'foobar',
        },
        ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticket_ty: {
          prim: 'string',
        },
      };
      const actual = result.raw.opOb.contents ?? [];
      expect(actual[0]).toEqual(expectedReveal);
      expect(actual[1]).toEqual(expectedReturn);
    });

    it('validate that a reveal option wont be added when not needed', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('test_pub_key');
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };
      const result = await rpcContractProvider.transferTicket(params);
      const expectedReturn = {
        counter: '1',
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
        fee: '804',
        gas_limit: '5009',
        kind: 'transfer_ticket',
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        storage_limit: '130',
        ticket_amount: '2',
        ticket_contents: {
          string: 'foobar',
        },
        ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticket_ty: {
          prim: 'string',
        },
      };
      const actual = result.raw.opOb.contents ?? [];

      expect(actual[0]).toEqual(expectedReturn);
    });

    it('validate that the user-specified fees will be taken into account when specified', async () => {
      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };
      const result = await rpcContractProvider.transferTicket(params);
      const expectedReveal = {
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              counter: '2',
              destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
              entrypoint: 'default',
              fee: '804',
              gas_limit: '5009',
              kind: 'transfer_ticket',
              source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              storage_limit: '130',
              ticket_amount: '2',
              ticket_contents: {
                string: 'foobar',
              },
              ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
              ticket_ty: {
                prim: 'string',
              },
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      };
      expect(result.raw).toEqual(expectedReveal);
    });

    it('validate that the fees taken from the estimate will be taken when there is no user-specified fees', async () => {
      const estimate = new Estimate(10000, 1000, 180, 1000);
      mockEstimate.transferTicket.mockResolvedValue(estimate);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };
      const result = await rpcContractProvider.transferTicket(params);
      const expected = {
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              counter: '2',
              destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
              entrypoint: 'default',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              kind: 'transfer_ticket',
              source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              storage_limit: estimate.storageLimit.toString(),
              ticket_amount: '2',
              ticket_contents: {
                string: 'foobar',
              },
              ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
              ticket_ty: {
                prim: 'string',
              },
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      };
      expect(result.raw).toEqual(expected);
    });
  });

  describe('setDelegate', () => {
    it('should produce a reveal and delegation operation', async () => {
      const estimate = new Estimate(1000000, 1000, 180, 1000);
      mockEstimate.setDelegate.mockResolvedValue(estimate);
      const result = await rpcContractProvider.setDelegate({
        source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              counter: '2',
              fee: '400',
              gas_limit: '1000',
              kind: 'delegation',
              source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              storage_limit: '1000',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should throw InvalidDelegationSource when setting a KT1 address in babylon', async () => {
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.setDelegate.mockResolvedValue(estimate);
      mockRpcClient.getBlockMetadata.mockResolvedValue({
        next_protocol: Protocols.PsBabyM1,
      });
      let error;
      try {
        await rpcContractProvider.setDelegate({
          source: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
          delegate: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
        });
      } catch (ex) {
        error = ex;
      }
      expect(error).toBeInstanceOf(InvalidDelegationSource);
    });
  });

  describe('registerDelegate', () => {
    it('should produce a reveal and delegation operation', async () => {
      const estimate = new Estimate(1000000, 1000, 180, 1000);
      mockEstimate.registerDelegate.mockResolvedValue(estimate);
      const result = await rpcContractProvider.registerDelegate({});
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              delegate: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
              fee: '400',
              gas_limit: '1000',
              kind: 'delegation',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '1000',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('reveal', () => {
    it('should produce a reveal operation', async () => {
      const estimate = new Estimate(1000000, 0, 64, 250);
      mockEstimate.reveal.mockResolvedValue(estimate);
      const result = await rpcContractProvider.reveal({});
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '284',
              gas_limit: '1000',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('registerGlobalConstant', () => {
    it('should produce a reveal and registerGlobalConstant operation', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.registerGlobalConstant.mockResolvedValue(estimate);
      const result = await rpcContractProvider.registerGlobalConstant({
        value: { prim: 'Pair', args: [{ int: '999' }, { int: '999' }] },
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              value: { prim: 'Pair', args: [{ int: '999' }, { int: '999' }] },
              counter: '2',
              fee: '385',
              gas_limit: '1230',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('increasePaidStorage', () => {
    it('should produce an increasePaidStorage operation without reveal when account is revealed', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.increasePaidStorage.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.increasePaidStorage({
        amount: 1,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      });
      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a reveal and an increasePaidStorage operation', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.increasePaidStorage.mockResolvedValue(estimate);
      const result = await rpcContractProvider.increasePaidStorage({
        amount: 1,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      });
      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a reveal and increasePaidStorageOperation with fees specified', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.increasePaidStorage.mockResolvedValue(estimate);
      const result = await rpcContractProvider.increasePaidStorage({
        amount: 1,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        fee: 500,
      });
      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '500',
              gas_limit: '1230',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('drainDelegate', () => {
    it('should produce a drain operation', async () => {
      const result = await rpcContractProvider.drainDelegate({
        consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
        destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      });
      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'drain_delegate',
              consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
              delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
              destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('ballot', () => {
    it('should produce a ballot operation', async () => {
      const result = await rpcContractProvider.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              kind: 'ballot',
              period: 1,
              proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
              ballot: 'yay',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should override when source is passed in the params', async () => {
      const result = await rpcContractProvider.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay',
        source: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              source: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
              kind: 'ballot',
              period: 1,
              proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
              ballot: 'yay',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('proposals', () => {
    it('should produce a proposals operation', async () => {
      const result = await rpcContractProvider.proposals({
        proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              kind: 'proposals',
              period: 1,
              proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should override when source is passed in params', async () => {
      const result = await rpcContractProvider.proposals({
        proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
        source: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              source: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
              kind: 'proposals',
              period: 1,
              proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('updateConsensusKey', () => {
    it('should produce an updateConsensusKey operation', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateConsensusKey.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              counter: '1',
              pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce an updateConsensusKey operation and reveal op', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateConsensusKey.mockResolvedValue(estimate);
      const result = await rpcContractProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce an updateConsensusKey operation and reveal op with fees specified', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateConsensusKey.mockResolvedValue(estimate);
      const result = await rpcContractProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
        fee: 500,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '500',
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('updateConsensusKey bls', () => {
    it('should produce an updateConsensusKey bls operation', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateConsensusKey.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.updateConsensusKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              counter: '1',
              pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
              proof:
                'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce an updateConsensusKey bls operation and reveal op', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateConsensusKey.mockResolvedValue(estimate);
      const result = await rpcContractProvider.updateConsensusKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
              proof:
                'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce an updateConsensusKey bls operation and reveal op with fees specified', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateConsensusKey.mockResolvedValue(estimate);
      const result = await rpcContractProvider.updateConsensusKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
        fee: 500,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '500',
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
              proof:
                'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('updateCompanionKey', () => {
    it('should produce an updateCompanionKey operation', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateCompanionKey.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const result = await rpcContractProvider.updateCompanionKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'update_companion_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              counter: '1',
              pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
              proof:
                'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce an updateCompanionKey operation and reveal op', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateCompanionKey.mockResolvedValue(estimate);
      const result = await rpcContractProvider.updateCompanionKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'update_companion_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
              proof:
                'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce an updateCompanionKey operation and reveal op with fees specified', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.updateCompanionKey.mockResolvedValue(estimate);
      const result = await rpcContractProvider.updateCompanionKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
        fee: 500,
      });

      expect(result.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'update_companion_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '500',
              gas_limit: estimate.gasLimit.toString(),
              storage_limit: estimate.storageLimit.toString(),
              pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
              proof:
                'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('smartRollupAddMessages', () => {
    it('should produce a smartRollupAddMessages op', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.smartRollupAddMessages.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const op = await rpcContractProvider.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
        ],
      });

      expect(op.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a smartRollupAddMessages op with reveal', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.smartRollupAddMessages.mockResolvedValue(estimate);
      const op = await rpcContractProvider.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
        ],
      });

      expect(op.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('originate with noop parser', () => {
    it('should throw InvalidCodeParameter', async () => {
      rpcContractProvider['context'].parser = new NoopParser();
      try {
        await rpcContractProvider.originate({
          delegate: 'test_delegate',
          balance: '200',
          code: miStr, // needs to be JSON Michelson
          init: miInit,
          fee: 10000,
          gasLimit: 10600,
          storageLimit: 257,
        });
      } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidCodeParameter);
        expect(err.message).toEqual('Wrong code parameter type, expected an array');
      }
    });

    it('should throw InvalidCodeParameter when missing storage part', async () => {
      rpcContractProvider['context'].parser = new NoopParser();
      try {
        await rpcContractProvider.originate({
          delegate: 'test_delegate',
          balance: '200',
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            {
              prim: 'code',
              args: [[{ prim: 'DUP' }]],
            },
          ],
          storage: 'test',
          fee: 10000,
          gasLimit: 10600,
          storageLimit: 257,
        });
      } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidCodeParameter);
        expect(err.message).toEqual('The storage section is missing from the script');
      }
    });

    it('should throw InvalidInitParameter', async () => {
      rpcContractProvider['context'].parser = new NoopParser();
      try {
        await rpcContractProvider.originate({
          delegate: 'test_delegate',
          balance: '200',
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            {
              prim: 'code',
              args: [[{ prim: 'DUP' }]],
            },
            {
              prim: 'storage',
              args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }],
            },
          ],
          init: 'test',
          fee: 10000,
          gasLimit: 10600,
          storageLimit: 257,
        });
      } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidInitParameter);
        expect(err.message).toEqual('Wrong init parameter type, expected JSON Michelson');
      }
    });

    describe('batch', () => {
      it('should produce a batch operation', async () => {
        const opToBatch: ParamsWithKind[] = [
          {
            kind: OpKind.TRANSACTION,
            to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
            amount: 2,
          },
          {
            kind: OpKind.TRANSACTION,
            to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            amount: 2,
          },
        ];

        const opBatch = new OperationBatch(rpcContractProvider['context'], mockEstimate);

        expect(rpcContractProvider.batch()).toBeInstanceOf(OperationBatch);
        expect(rpcContractProvider.batch()).toEqual(opBatch);

        expect(rpcContractProvider.batch(opToBatch)).toEqual(opBatch.with(opToBatch));
      });
    });
  });

  describe('smartRollupOriginate', () => {
    it('Should have correct returned values with origination being estimated', async () => {
      const estimate = new Estimate(1230000, 10000, 100, 100);
      mockEstimate.smartRollupOriginate.mockResolvedValue(estimate);
      const smartRollupOriginate = await rpcContractProvider.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel:
          '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
        parametersType: {
          prim: 'bytes',
        },
      });

      expect(smartRollupOriginate.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              pvm_kind: PvmKind.WASM2,
              kernel:
                '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
              parameters_ty: {
                prim: 'bytes',
              },
              counter: '2',
              fee: '343',
              gas_limit: '1230',
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '10000',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('Should have correct returned values with origination with reveal with specified values for estimate', async () => {
      const estimate = new Estimate(1230000, 10000, 100, 100);
      mockEstimate.smartRollupOriginate.mockResolvedValue(estimate);
      const smartRollupOriginate = await rpcContractProvider.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel:
          '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
        parametersType: {
          prim: 'bytes',
        },
        fee: 9999,
        storageLimit: 54321,
        gasLimit: 12345,
      });

      expect(smartRollupOriginate.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              pvm_kind: PvmKind.WASM2,
              kernel:
                '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
              parameters_ty: {
                prim: 'bytes',
              },
              counter: '2',
              fee: '9999',
              gas_limit: '12345',
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '54321',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('Should have correct returned values with origination without reveal', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('test_pub_key');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(1230000, 10000, 100, 100);
      mockEstimate.smartRollupOriginate.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const smartRollupOriginate = await rpcContractProvider.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel:
          '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
        parametersType: {
          prim: 'bytes',
        },
      });

      expect(smartRollupOriginate.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              pvm_kind: PvmKind.WASM2,
              kernel:
                '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
              parameters_ty: {
                prim: 'bytes',
              },
              counter: '1',
              fee: '343',
              gas_limit: '1230',
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '10000',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('smartRollupExecuteOutboxMessage', () => {
    it('should produce a smartRollupExecuteOutboxMessage op without reveal', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(6385000, 36, 769, 250);
      mockEstimate.smartRollupExecuteOutboxMessage.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const op = await rpcContractProvider.smartRollupExecuteOutboxMessage({
        rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
        cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
        outputProof:
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      });

      expect(op.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '1528',
              gas_limit: '6385',
              storage_limit: '36',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a smartRollupExecuteOutboxMessage op with reveal', async () => {
      const estimate = new Estimate(6385000, 36, 769, 250);
      mockEstimate.smartRollupExecuteOutboxMessage.mockResolvedValue(estimate);

      const op = await rpcContractProvider.smartRollupExecuteOutboxMessage({
        rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
        cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
        outputProof:
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      });

      expect(op.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            revealOp('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'),
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '1528',
              gas_limit: '6385',
              storage_limit: '36',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a smartRollupExecuteOutboxMessage op with overridden estimate values', async () => {
      mockRpcClient.getManagerKey.mockReturnValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      mockEstimate.reveal.mockResolvedValue(undefined);
      const estimate = new Estimate(6385000, 36, 769, 250);
      mockEstimate.smartRollupExecuteOutboxMessage.mockResolvedValue(estimate);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const op = await rpcContractProvider.smartRollupExecuteOutboxMessage({
        rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
        cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
        outputProof:
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
        fee: 2000,
        gasLimit: 10000,
        storageLimit: 100,
      });

      expect(op.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '2000',
              gas_limit: '10000',
              storage_limit: '100',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });
});
