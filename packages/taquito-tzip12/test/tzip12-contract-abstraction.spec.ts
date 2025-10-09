import { MichelsonMap, ViewSimulationError } from '@taquito/taquito';
import { stringToBytes, InvalidUriError } from '@taquito/tzip16';
import BigNumber from 'bignumber.js';
import { Tzip12ContractAbstraction } from '../src/tzip12-contract-abstraction';
import { InvalidTokenMetadata, TokenIdNotFound, TokenMetadataNotFound } from '../src/errors';

describe('Tzip12 contract abstraction test', () => {
  const mockContractAbstraction: any = {};
  const mockContext: any = {};
  let mockTzip16ContractAbstraction: any = {};
  let tzip12Abs: Tzip12ContractAbstraction;
  let mockMichelsonStorageView: any;
  let mockMetadataProvider: {
    provideMetadata: jest.Mock<any, any>;
  };
  let mockSchema: {
    FindFirstInTopLevelPair: jest.Mock<any, any>;
  };
  let mockRpcContractProvider: {
    getBigMapKeyByID: jest.Mock<any, any>;
  };
  let mockReadProvider: {
    getStorage: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockMetadataProvider = {
      provideMetadata: jest.fn(),
    };
    mockTzip16ContractAbstraction = {
      getMetadata: jest.fn(),
      metadataViews: jest.fn(),
    };
    mockMichelsonStorageView = {
      executeView: jest.fn(),
    };
    mockSchema = {
      FindFirstInTopLevelPair: jest.fn(),
    };
    mockRpcContractProvider = {
      getBigMapKeyByID: jest.fn(),
    };
    mockReadProvider = {
      getStorage: jest.fn(),
    };
    mockContractAbstraction.address = 'test';
    mockContractAbstraction['schema'] = mockSchema;
    mockReadProvider.getStorage.mockResolvedValue({
      prim: 'Pair',
      args: [
        {
          int: '20350',
        },
        [],
      ],
    });

    mockContext['metadataProvider'] = mockMetadataProvider;
    mockContext['readProvider'] = mockReadProvider;
    mockContext['contract'] = mockRpcContractProvider;
    tzip12Abs = new Tzip12ContractAbstraction(mockContractAbstraction, mockContext);
    tzip12Abs['_tzip16ContractAbstraction'] = mockTzip16ContractAbstraction;
  });

  it('Test 1 for getContractMetadata(): Should return the `Tzip-016` contract metadata', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: { name: 'Taquito test' },
    });

    expect(await tzip12Abs['getContractMetadata']()).toEqual({ name: 'Taquito test' });
  });

  it('Test 2 for getContractMetadata(): Should return undefined when the contract has no `Tzip-016` metadata', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockImplementation(() => {
      throw new Error();
    });

    expect(await tzip12Abs['getContractMetadata']()).toBeUndefined();
  });

  it('Test 1 for isTzip12Compliant(): Should return true', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: {
        name: 'Taquito test',
        interfaces: ['TZIP-012[-<version-info>]'],
      },
    });

    expect(await tzip12Abs.isTzip12Compliant()).toEqual(true);
  });

  it('Test 2 for isTzip12Compliant(): Should return true', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: {
        name: 'Taquito test',
        interfaces: ['TZIP-test', 'TZIP-012[-<version-info>]', 'TZIP-test2'],
      },
    });

    expect(await tzip12Abs.isTzip12Compliant()).toEqual(true);
  });

  it('Test 3 for isTzip12Compliant(): Should return false when no interfaces property', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: {
        name: 'Taquito test',
      },
    });

    expect(await tzip12Abs.isTzip12Compliant()).toEqual(false);
  });

  it('Test 4 for isTzip12Compliant(): Should return false when no TZIP-012 in interfaces property', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: {
        name: 'Taquito test',
        interfaces: ['TZIP-test'],
      },
    });

    expect(await tzip12Abs.isTzip12Compliant()).toEqual(false);
  });

  it('Test 1 for executeTokenMetadataView(): Should properly return the TokenMetadata', async () => {
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    tokenMap.set('decimals', stringToBytes('3'));

    // takes as parameter the nat token-id and returns the (pair nat (map string bytes)) value
    mockMichelsonStorageView.executeView.mockResolvedValue({
      '0': '0',
      '1': tokenMap,
    });

    const tokenMetadata = await tzip12Abs['executeTokenMetadataView'](mockMichelsonStorageView, BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito',
      symbol: 'XTZ',
      decimals: 3,
    });
  });

  it('Test 2 for executeTokenMetadataView(): Should throw ViewSimulationError', async () => {
    mockMichelsonStorageView.executeView.mockImplementation(() => {
      throw new ViewSimulationError('view simulation failed', 'test');
    });

    expect(tzip12Abs['executeTokenMetadataView'](mockMichelsonStorageView, BigNumber(0))).rejects.toEqual(
      new ViewSimulationError('view simulation failed', 'test')
    );
  });

  it('Test 3 for executeTokenMetadataView(): should throw TokenMetadataNotFound if the type of the view result is wrong (no map)', async () => {
    mockMichelsonStorageView.executeView.mockResolvedValue({
      '0': '0',
      '1': 'I am not a map',
    });

    expect(tzip12Abs['executeTokenMetadataView'](mockMichelsonStorageView, BigNumber(0))).rejects.toEqual(
      new TokenMetadataNotFound(mockContractAbstraction.address)
    );
  });

  it('Test 4 for executeTokenMetadataView(): should throw TokenMetadataNotFound if the type of the view result is wrong', async () => {
    mockMichelsonStorageView.executeView.mockResolvedValue('wrong type');

    expect(tzip12Abs['executeTokenMetadataView'](mockMichelsonStorageView, BigNumber(0))).rejects.toEqual(
      new TokenMetadataNotFound(mockContractAbstraction.address)
    );
  });

  it('Test 5 for executeTokenMetadataView(): Should properly return the TokenMetadata when the map contains a URI', async () => {
    mockMetadataProvider.provideMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: {
        name: 'Taquito test',
        decimals: 3,
        symbol: 'XTZ!',
        more: 'more data',
      },
    });
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('', stringToBytes('https://storage.googleapis.com/tzip-16/token-metadata.json'));

    mockMichelsonStorageView.executeView.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    const tokenMetadata = await tzip12Abs['executeTokenMetadataView'](mockMichelsonStorageView, BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito test',
      decimals: 3,
      symbol: 'XTZ!',
      more: 'more data',
    });
  });

  it('Test 1 for fetchTokenMetadataFromUri(): Should warn that the URI is invalid and return undefined', async () => {
    const tokenMap = new MichelsonMap();
    tokenMap.set('test', stringToBytes('test'));
    tokenMap.set('', stringToBytes('InvalidUriError'));
    tokenMap.set('testtest', stringToBytes('testtest'));

    mockMetadataProvider.provideMetadata.mockImplementation(() => {
      throw new InvalidUriError(stringToBytes('InvalidUriError'));
    });

    const tokenMetadata = await tzip12Abs['fetchTokenMetadataFromUri'](
      tokenMap as MichelsonMap<string, string>
    );
    expect(tokenMetadata).toBeUndefined();
  });

  it('Test 2 for fetchTokenMetadataFromUri(): Should return undefined when no URI', async () => {
    const tokenMap = new MichelsonMap();
    tokenMap.set('test', stringToBytes('test'));
    tokenMap.set('testtest', stringToBytes('testtest'));

    const tokenMetadata = await tzip12Abs['fetchTokenMetadataFromUri'](
      tokenMap as MichelsonMap<string, string>
    );
    expect(tokenMetadata).toBeUndefined();
  });

  it('Test 1 for retrieveTokenMetadataFromView(): Should properly return token metadata from token_metadata view', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: { name: 'Taquito test' },
    });

    mockTzip16ContractAbstraction.metadataViews.mockResolvedValue({
      token_metadata: () => mockMichelsonStorageView,
    });

    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    tokenMap.set('decimals', stringToBytes('3'));

    // takes as parameter the nat token-id and returns the (pair nat (map string bytes)) value
    mockMichelsonStorageView.executeView.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    const tokenMetadata = await tzip12Abs['retrieveTokenMetadataFromView'](BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito',
      symbol: 'XTZ',
      decimals: 3,
    });
  });

  it('Test 2 for retrieveTokenMetadataFromView(): Should return undefined when there is no contract metadata', async () => {
    const tokenMetadata = await tzip12Abs['retrieveTokenMetadataFromView'](BigNumber(0));
    expect(tokenMetadata).toBeUndefined();
  });

  it('Test 3 for retrieveTokenMetadataFromView(): Should return undefined when there is no token_metadata view', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: { name: 'Taquito test' },
    });

    mockTzip16ContractAbstraction.metadataViews.mockResolvedValue({});

    const tokenMetadata = await tzip12Abs['retrieveTokenMetadataFromView'](BigNumber(0));
    expect(tokenMetadata).toBeUndefined();
  });

  it('Test 1 for retrieveTokenMetadataFromBigMap(): Should succeed to return the token metadata', async () => {
    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    tokenMap.set('decimals', stringToBytes('3'));
    mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    const tokenMetadata = await tzip12Abs['retrieveTokenMetadataFromBigMap'](BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito',
      symbol: 'XTZ',
      decimals: 3,
    });
  });

  it('Test 2 for retrieveTokenMetadataFromBigMap(): Should throw TokenMetadataNotFound', async () => {
    mockSchema.FindFirstInTopLevelPair.mockReturnValue(undefined);
    try {
      await tzip12Abs['retrieveTokenMetadataFromBigMap'](BigNumber(0));
    } catch (err) {
      expect(err).toBeInstanceOf(TokenMetadataNotFound);
    }
  });

  it('Test 3 for retrieveTokenMetadataFromBigMap(): Should throw TokenIdNotFound', async () => {
    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    mockRpcContractProvider.getBigMapKeyByID.mockImplementation(() => {
      throw new Error();
    });

    expect(tzip12Abs['retrieveTokenMetadataFromBigMap'](BigNumber(0))).rejects.toEqual(new TokenIdNotFound(BigNumber(0)));
  });

  it('Test 4 for retrieveTokenMetadataFromBigMap(): Should throw TokenIdNotFound', async () => {
    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue('I am not a pair');

    expect(tzip12Abs['retrieveTokenMetadataFromBigMap'](BigNumber(0))).rejects.toEqual(new TokenIdNotFound(BigNumber(0)));
  });

  it('Test 1 for getTokenMetadata(): Should succeed to fetch the token metadata', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockImplementation(() => {
      throw new Error();
    });
    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    tokenMap.set('decimals', stringToBytes('3'));
    mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    const tokenMetadata = await tzip12Abs.getTokenMetadata(BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito',
      symbol: 'XTZ',
      decimals: 3,
    });
  });

  it('Test 2 for getTokenMetadata(): Should succeed to fetch the token metadata from URI and token_info map', async () => {
    mockMetadataProvider.provideMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: { name: 'Taquito test' },
    });

    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('', stringToBytes('https://test'));
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    tokenMap.set('decimals', stringToBytes('3'));
    mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    const tokenMetadata = await tzip12Abs.getTokenMetadata(BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito test',
      symbol: 'XTZ',
      decimals: 3,
    });
  });

  it('Test 3 for getTokenMetadata(): Should succeed to fetch the token metadata from URI and token_info map', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
      uri: 'https://contractMetadata',
      metadata: { name: 'Contract metadata' },
    });

    mockMetadataProvider.provideMetadata.mockResolvedValue({
      uri: 'https://test',
      metadata: { name: 'Taquito test' },
    });

    mockTzip16ContractAbstraction.metadataViews.mockResolvedValue({
      token_metadata: () => mockMichelsonStorageView,
    });

    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('', stringToBytes('https://test'));
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    tokenMap.set('decimals', stringToBytes('3'));

    // takes as parameter the nat token-id and returns the (pair nat (map string bytes)) value
    mockMichelsonStorageView.executeView.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    const tokenMetadata = await tzip12Abs.getTokenMetadata(BigNumber(0));
    expect(tokenMetadata).toEqual({
      token_id: BigNumber(0),
      name: 'Taquito test',
      symbol: 'XTZ',
      decimals: 3,
    });
  });

  it('Test 4 for getTokenMetadata(): Should throw InvalidTokenMetadata', async () => {
    mockTzip16ContractAbstraction.getMetadata.mockImplementation(() => {
      throw new Error();
    });
    mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
    const tokenMap = new MichelsonMap({
      prim: 'map',
      args: [{ prim: 'string' }, { prim: 'bytes' }],
    });
    tokenMap.set('name', stringToBytes('Taquito'));
    tokenMap.set('symbol', stringToBytes('XTZ'));
    mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue({
      token_id: '0',
      token_info: tokenMap,
    });

    try {
      await tzip12Abs.getTokenMetadata(BigNumber(0));
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidTokenMetadata);
    }
  });
});
