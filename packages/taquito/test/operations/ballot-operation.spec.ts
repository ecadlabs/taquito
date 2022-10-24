import { BallotOperation } from '../../src/operations/ballot-operation';
import { OperationContentsAndResult } from '@taquito/rpc';
import { ForgedBytes } from '../../src/operations/types';
import { defaultConfigConfirmation } from '../../src/context';

describe('Ballot operation', () => {
  let fakeContext: any;

  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'ballot',
      source: 'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      period: 1,
      proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
      ballot: 'yay',
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

  it('should return ballot of Ballot operation', () => {
    const op = new BallotOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.source).toEqual('tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU');
  });

  it('should return period of Ballot operation', () => {
    const op = new BallotOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { period: 1 } as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.period).toEqual(1);
  });

  it('should return proposal hash of Ballot operation', () => {
    const op = new BallotOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg' } as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.proposal).toEqual('PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg');
  });

  it('should return ballot of Ballot operation', () => {
    const op = new BallotOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { ballot: 'yay' } as any,
      'tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.ballot).toEqual('yay');
  });
});
