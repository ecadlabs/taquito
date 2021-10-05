import { CONFIGS } from './config';
import { compose, MichelsonMap } from '@taquito/taquito';
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { tzip12 } from '../packages/taquito-tzip12/src/composer';
import { Tzip12Module } from '../packages/taquito-tzip12/src/tzip12-extension';
import {
  TokenIdNotFound,
  InvalidTokenMetadata,
} from '../packages/taquito-tzip12/src/tzip12-errors';
import { fa2TokenFactory } from './data/fa2-token-factory';
import { fa2ForTokenMetadataView } from './data/fa2-for-token-metadata-view';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';
import { RpcClient, RpcClientCache } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  let contractAddress: string;
  let contractAddress2: string;

  describe(`Deploy a Fa2 contract and fetch metadata (token metadata are in the big map %token_metadata): ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
      done();
    });

    it('Should deploy a Fa2 contract having metadata on HTTPS and token metadata inside a bigmap %token_metadata', async (done) => {
      const LocalTez1 = await createAddress();
      const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
      const LocalTez2 = await createAddress();
      const localTez2Pkh = await LocalTez2.signer.publicKeyHash();

      const ledger = new MichelsonMap();
      ledger.set(
        {
          owner: localTez1Pkh,
          token_id: 1,
        },
        '18000000'
      );
      ledger.set(
        {
          owner: localTez2Pkh,
          token_id: 2,
        },
        '9990000'
      );

      const url = 'https://storage.googleapis.com/tzip-16/fa2-token-factory.json';
      const bytesUrl = char2Bytes(url);
      const metadata = new MichelsonMap();
      metadata.set('', bytesUrl);

      const operators = new MichelsonMap();

      const token_admins = new MichelsonMap();
      token_admins.set('1', {
        0: localTez1Pkh,
        1: true,
      });
      token_admins.set('2', {
        0: localTez2Pkh,
        1: true,
      });

      const token_metadata = new MichelsonMap();
      const token1 = new MichelsonMap();
      token1.set('name', char2Bytes('wToken'));
      token1.set('symbol', char2Bytes('wTK'));
      token1.set('decimals', '36');
      const token2 = new MichelsonMap();
      token2.set('name', char2Bytes('AliceToken'));
      token2.set('symbol', char2Bytes('ALC'));
      token2.set('decimals', '30');
      token_metadata.set('1', {
        token_id: '1',
        token_info: token1,
      });
      token_metadata.set('2', {
        token_id: '2',
        token_info: token2,
      });

      const token_total_supply = new MichelsonMap();
      token_total_supply.set('1', '54000000');
      token_total_supply.set('2', '10000000');

      const op = await Tezos.contract.originate({
        code: fa2TokenFactory,
        storage: {
          admin: await Tezos.signer.publicKeyHash(),
          exchange_address: 'KT1DGRPQUwLJyCZnM8WKtwDGiKDSMv4hftk4',
          last_token_id: '2',
          ledger,
          metadata,
          operators,
          token_admins,
          token_metadata,
          token_total_supply,
        },
      });
      await op.confirmation();

      // Set the variables for the following tests
      contractAddress = (await op.contract()).address;

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      // Count the Rpc calls
      const signer = await Tezos.signer.publicKeyHash();
      const countRpc = ((Tezos.rpc as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(14);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(4);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(7);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);

      done();
    });

    it('Should test contractAbstraction composition, fetch contract and token metadata of the Fa2 contract', async (done) => {
      Tezos.addExtension(new Tzip12Module());
      // Tezos.addExtension(new Tzip16Module())... one extension is sufficient as they use the same MetadataProvider
      //       // Use the compose function
      const contract = await Tezos.contract.at(contractAddress, compose(tzip16, tzip12));

      //       // Fetch contract metadata on HTTPs
      const metadata = await contract.tzip16().getMetadata();
      expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/fa2-token-factory.json');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        name: 'Test Taquito FA2 token Factory',
        description:
          'This is a test to retrieve tokens metadata when they are located in the storage of the contract in the big map %token_metadata',
        source: {
          tools: ['FA2 Token Factory'],
          location: 'https://www.github.com/claudebarde',
        },
        interfaces: ['TZIP-012'],
        license: {
          name: 'MIT',
        },
      });

      // Verify if the tag TZIP-012 is present in the interface field of contract metadata
      const isTzip12Contract = await contract.tzip12().isTzip12Compliant();
      expect(isTzip12Contract).toEqual(true);
      //       // Fetch token metadata
      const tokenMetadata1 = await contract.tzip12().getTokenMetadata(1);
      expect(tokenMetadata1).toEqual({
        token_id: 1,
        decimals: 6,
        name: 'wToken',
        symbol: 'wTK',
      });

      const tokenMetadata2 = await contract.tzip12().getTokenMetadata(2);
      expect(tokenMetadata2).toEqual({
        token_id: 2,
        name: 'AliceToken',
        decimals: 0,
        symbol: 'ALC',
      });

      try {
        await contract.tzip12().getTokenMetadata(3);
      } catch (err) {
        expect(err).toBeInstanceOf(TokenIdNotFound);
      }
      // Count the Rpc calls
      const countRpc = ((Tezos.rpc as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(8);
      const signer = await Tezos.signer.publicKeyHash();
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(5);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/135390/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/135393/expru2dKqDfZG8hu4wNGkiyunvq2hdSKuVYtcKta7BWP6Q18oNxKjS`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/135393/expruDuAZnFKqmLoisJqUGqrNzXTvw7PJM2rYk97JErM5FHCerQqgn`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/135393/exprujyHLX2vacVy6AcFmAt5K3Y93aMtccrbNtcsCRik6fjxR8wL6x`)).toEqual(1);
      done();
    });
  });

  describe(`Deploy a Fa2 contract and fetch metadata (token metadata are obtained from a view %token_metadata): ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
      done();
    });

    it('Should deploy a Fa2 contract having metadata on HTTPS and a view %token_metadata', async (done) => {
      const LocalTez1 = await createAddress();
      const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
      const LocalTez2 = await createAddress();
      const localTez2Pkh = await LocalTez2.signer.publicKeyHash();

      const ledger = new MichelsonMap();
      ledger.set(
        {
          0: localTez1Pkh,
          1: 0,
        },
        '20000'
      );
      ledger.set(
        {
          0: localTez2Pkh,
          1: 1,
        },
        '20000'
      );

      const url = 'https://storage.googleapis.com/tzip-16/fa2-views.json';
      const bytesUrl = char2Bytes(url);
      const metadata = new MichelsonMap();
      metadata.set('', bytesUrl);

      const operators = new MichelsonMap();

      const tokens = new MichelsonMap();
      const metadataMap0 = new MichelsonMap();
      metadataMap0.set(
        '',
        char2Bytes('https://storage.googleapis.com/tzip-16/token-metadata.json')
      );
      metadataMap0.set('name', char2Bytes('Name from URI is prioritized!'));
      const metadataMap1 = new MichelsonMap();
      metadataMap1.set('name', char2Bytes('AliceToken'));
      metadataMap1.set('symbol', char2Bytes('ALC'));
      metadataMap1.set('decimals', '30');
      metadataMap1.set('extra', char2Bytes('Add more data'));
      const metadataMap2 = new MichelsonMap();
      metadataMap2.set('name', char2Bytes('Invalid token metadata'));
      tokens.set('0', {
        metadata_map: metadataMap0,
        total_supply: '20000',
      });
      tokens.set('1', {
        metadata_map: metadataMap1,
        total_supply: '20000',
      });
      tokens.set('2', {
        metadata_map: metadataMap2,
        total_supply: '20000',
      });

      const op = await Tezos.contract.originate({
        code: fa2ForTokenMetadataView,
        storage: {
          administrator: await Tezos.signer.publicKeyHash(),
          all_tokens: '2',
          ledger,
          metadata,
          operators,
          paused: false,
          tokens,
        },
      });
      await op.confirmation();

      // Set the variables for the following tests
      contractAddress2 = (await op.contract()).address;

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      // Count the Rpc calls
      const countRpc = ((Tezos.rpc as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(4);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(6);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress2}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress2}/entrypoints`
        )
      ).toEqual(1);
      done();
    });

    it('Should test contractAbstraction composition, fetch contract and token metadata of the Fa2 contract', async (done) => {
      Tezos.addExtension(new Tzip16Module());

      // Use the compose function
      const contract = await Tezos.contract.at(contractAddress2, compose(tzip16, tzip12));

      // Fetch contract metadata on HTTPs
      const metadata = await contract.tzip16().getMetadata();
      expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/fa2-views.json');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toBeDefined();

      // Verify if the tag TZIP-012 is present in the interface field of contract metadata
      const isTzip12Contract = await contract.tzip12().isTzip12Compliant();
      expect(isTzip12Contract).toEqual(true);

      // Fetch token metadata (view result contains a URI for this token)
      const tokenMetadata0 = await contract.tzip12().getTokenMetadata(0);
      expect(tokenMetadata0).toEqual({
        token_id: 0,
        decimals: 3,
        name: 'Taquito test URI',
        symbol: 'XTZ2',
      });

      const tokenMetadata1 = await contract.tzip12().getTokenMetadata(1);
      expect(tokenMetadata1).toEqual({
        token_id: 1,
        name: 'AliceToken',
        decimals: 0,
        symbol: 'ALC',
        extra: 'Add more data',
      });

      try {
        await contract.tzip12().getTokenMetadata(2);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidTokenMetadata);
      }

      try {
        await contract.tzip12().getTokenMetadata(3);
      } catch (err) {
        expect(err).toBeInstanceOf(TokenIdNotFound);
      }
      // Count the Rpc calls
      const signer = await Tezos.signer.publicKeyHash();
      const countRpc = ((Tezos.rpc as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(9);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress2}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress2}/entrypoints`
        )
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/139848/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(4);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(24);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress2}/balance`)
      ).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_code`)).toEqual(4);
      done();
    });
  });
});
