import { ProposalsOperation, ForgedBytes } from '@taquito/taquito';
import { OperationContentsAndResult } from '@taquito/rpc';
import { defaultConfigConfirmation } from '../../src/context';

describe('Proposals operation', () => {
  let fakeContext: any;

  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'proposals',
      source: 'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      period: 2,
      proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
    },
  ] as OperationContentsAndResult[];

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE' }], [], [], []],
      header: {
        level: 1,
      },
    });
  });

  it('should return source of Proposals operation', () => {
    const op = new ProposalsOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.source).toEqual('tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU');
  });

  it('should return period of Proposals operation', () => {
    const op = new ProposalsOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.period).toEqual(2);
  });

  it('should return proposal hash of Proposals operation', () => {
    const op = new ProposalsOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'] } as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.proposals).toEqual(['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg']);
  });
});
