import { RpcClient } from '@taquito/rpc';
import { Protocols } from '../src/constants';
import { Context } from '../src/context';

describe('Configurations for the confirmation methods and streamer', () => {
  let mockRpcClient: any;
  let context: Context;

  beforeAll(() => {
    mockRpcClient = {
      getConstants: jest.fn(),
    };
    context = new Context(mockRpcClient);
  });

  it('Context clone copies all known properties', () => {
    const cloned = context.clone();

    // Known properties
    expect(cloned.rpc === context.rpc).toBeTruthy();
    expect(cloned.signer === context.signer).toBeTruthy();
    expect(cloned.proto === context.proto).toBeTruthy();
    expect(cloned.config === context.config).toBeTruthy();
    expect(cloned.forger === context.forger).toBeTruthy();
    expect(cloned.injector === context.injector).toBeTruthy();
    expect(cloned.packer === context.packer).toBeTruthy();
    expect(cloned.walletProvider === context.walletProvider).toBeTruthy();
    expect(cloned.parser === context.parser).toBeTruthy();
    expect(cloned.globalConstantsProvider === context.globalConstantsProvider).toBeTruthy();
  });

  it('Context clone copies all getter properties', () => {
    const cloned = context.clone();

    // Check all getter properties (to catch missing properties that might be added in the future)
    const getterKeys = Object.entries(
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(cloned))
    )
      .filter((x) => !!x[1].get)
      .map((x) => x[0]);

    for (const key of getterKeys) {
      const keyTyped = key as keyof typeof context;
      try {
        expect(cloned[keyTyped] === context[keyTyped]).toBeTruthy();
      } catch {
        throw new Error(`context.clone did not clone '${key}'`);
      }
    }
  });

  it('Context is initialized with default config values', () => {
    expect(context.config.confirmationPollingTimeoutSecond).toEqual(180);
    expect(context.config.defaultConfirmationCount).toEqual(1);
  });

  it('Configurations for the confirmation methods and streamer are customizable via the config setter', () => {
    context.config = {
      confirmationPollingTimeoutSecond: 300,
      defaultConfirmationCount: 2,
    };

    expect(context.config.confirmationPollingTimeoutSecond).toEqual(300);
    expect(context.config.defaultConfirmationCount).toEqual(2);
  });

  it('Configurations for the confirmation methods and streamer can be partially customized using the setPartialConfig method', () => {
    context.setPartialConfig({
      defaultConfirmationCount: 3,
    });
    expect(context.config.confirmationPollingTimeoutSecond).toEqual(300);
    expect(context.config.defaultConfirmationCount).toEqual(3);
  });
});

describe('registerProviderDecorator', () => {
  let rpcClient: RpcClient;
  let context: Context;

  beforeAll(() => {
    rpcClient = new RpcClient('url1');
    context = new Context(rpcClient);
  });

  it('Add a decorator to the context that replace the RpcClient', () => {
    // The decorator is a function that receives a context as parameter, replaces the RpcClient on it and returns the context
    const setNewRpcClient = (context: Context) => {
      context.rpc = new RpcClient('url2');
      return context;
    };
    // save the decorator on the context
    context.registerProviderDecorator(setNewRpcClient);

    // call the withExtensions method to access a cloned context with the applied decorator
    expect(context.rpc.getRpcUrl()).toEqual('url1');
    expect(context.withExtensions().rpc.getRpcUrl()).toEqual('url2');
  });

  it('Add multiple decorators on the context', () => {
    // The decorator 1 is a function that receives a context as parameter, replaces the RpcClient on it and returns the context
    const setNewRpcClient = (context: Context) => {
      context.rpc = new RpcClient('url2');
      return context;
    };
    context.registerProviderDecorator(setNewRpcClient);

    // The decorator 2 is a function that receives a context as parameter, replaces the proto on it and returns the context
    const setNewProto = (context: Context) => {
      context.proto = Protocols.PtGRANADs;
      return context;
    };
    context.registerProviderDecorator(setNewProto);

    // call the withExtensions method to access a cloned context with the applied decorator
    expect(context.rpc.getRpcUrl()).toEqual('url1');
    expect(context.withExtensions().rpc.getRpcUrl()).toEqual('url2');
    expect(context.proto).toBeUndefined();
    expect(context.withExtensions().proto).toEqual(Protocols.PtGRANADs);
  });
});
