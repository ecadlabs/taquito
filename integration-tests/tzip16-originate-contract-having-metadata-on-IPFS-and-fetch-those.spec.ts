import { CONFIGS } from './config';
import { tacoContractTzip16 } from './data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';
import {
  char2Bytes,
  tzip16,
  Tzip16Module,
  IpfsHttpHandler,
  Handler,
  MetadataProvider,
} from '@taquito/tzip16';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';
import { RpcClient } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  const customHandler = new Map<string, Handler>([
    ['ipfs', new IpfsHttpHandler('cloudflare-ipfs.com')],
  ]);

  const customMetadataProvider = new MetadataProvider(customHandler);

  Tezos.addExtension(new Tzip16Module(customMetadataProvider));

  let contractAddress: string;

  describe(`Originating contracts having metadata stored at HTTPS URL using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
      done();
    });

    it('Deploy a contract having metadata stored at on IPFS', async (done) => {
      // location of the contract metadata
      const uri = 'ipfs://QmcMUKkhXowQjCPtDVVXyFJd7W9LmC92Gs5kYH1KjEisdj';
      const bytesUrl = char2Bytes(uri);

      const metadataBigMap = new MichelsonMap();
      metadataBigMap.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();

      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMap,
          taco_shop_storage: tacoShopStorageMap,
        },
      });
      await op.confirmation();
      contractAddress = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
      // Count the Rpc calls
      let user = await Tezos.signer.publicKeyHash();
      let rpcCountingMapContents: Map<String, number> | undefined;
      rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
        'rpcCountingMap'
      ];
      if (rpcCountingMapContents === undefined) {
        console.log('RPC count is undefined');
      } else {
        console.log(rpcCountingMapContents);
        expect(rpcCountingMapContents.size).toEqual(14);
      }
    });
    it('Should fetch metadata of the contract on IPFS', async (done) => {
      const contract = await Tezos.contract.at(contractAddress, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      const contract2 = await Tezos.contract.at(contractAddress, tzip16);
      const metadata2 = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('ipfs://QmcMUKkhXowQjCPtDVVXyFJd7W9LmC92Gs5kYH1KjEisdj');
      expect(metadata2.uri).toEqual('ipfs://QmcMUKkhXowQjCPtDVVXyFJd7W9LmC92Gs5kYH1KjEisdj');
      
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        name: 'Taquito test with valid metadata',
        description:
          'This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage',
        version: '7.1.0-beta.0',
        license: {
          name: 'MIT',
          details: 'The MIT License',
        },
        homepage: 'https://github.com/ecadlabs/taquito',
        source: {
          tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
          location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout',
        },
      });

      done();
      // Count the Rpc calls
      let user = await Tezos.signer.publicKeyHash();
      let rpcCountingMapContents: Map<String, number> | undefined;
      rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
        'rpcCountingMap'
      ];
      if (rpcCountingMapContents === undefined) {
        console.log('RPC count is undefined');
      } else {
        console.log(rpcCountingMapContents);
        expect(rpcCountingMapContents.size).toEqual(5);
      }
    });
  });
});
