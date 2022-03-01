import { TaquitoLocalForger } from '../../src/forger/taquito-local-forger';
import { Context, Protocols } from '../../src/taquito';

describe('Taquito local forger', () => {
  const mockRpcClient = {
    getProtocols: jest.fn(),
  };

  beforeEach(() => {
    mockRpcClient.getProtocols.mockResolvedValue({
      next_protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
    });
  });

  it('is instantiable', () => {
    expect(new TaquitoLocalForger(new Context('url'))).toBeInstanceOf(TaquitoLocalForger);
  });

  it('should take the protocol hash from context.proto if it is defined', async (done) => {
    const context = new Context(mockRpcClient as any);
    context.proto = Protocols.PtHangz2;
    const forger = new TaquitoLocalForger(context);

    // When calling the forge method, an instance of LocalForger is created
    // which required the protocol hash in its constructor
    await forger.forge({
      branch: 'BMbqNeX9fZKsuKmu5B2gX7ayA9ZUNjbHEeHCgYd7VdTMsTCALFF',
      contents: [],
    });
    expect(mockRpcClient.getProtocols).toHaveBeenCalledTimes(0);

    done();
  });

  it('should fetch protocol hash from the Rpc', async (done) => {
    const forger = new TaquitoLocalForger(new Context(mockRpcClient as any));

    // When calling the forge method, an instance of LocalForger is created
    // which required the protocol hash in its constructor
    // fetch the protocol hash from the RPC if context.proto is undefined
    await forger.forge({
      branch: 'BMbqNeX9fZKsuKmu5B2gX7ayA9ZUNjbHEeHCgYd7VdTMsTCALFF',
      contents: [],
    });
    expect(mockRpcClient.getProtocols).toHaveBeenCalledTimes(1);

    done();
  });
});
