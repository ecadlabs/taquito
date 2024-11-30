import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { tacoContractTzip16 } from "../integration-tests/data/modified-taco-contract"
import { stringToBytes } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com';
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  const tezos = new TezosToolkit(provider);
  tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Tzip16SHA256 contract...');
    // location of the contract metadata
    const urlPercentEncoded = encodeURIComponent('//storage.googleapis.com/tzip-16/taco-shop-metadata.json');
    const metadataSha256 = '0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
    const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
    const bytesUrl = stringToBytes(url);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set("", bytesUrl);

    // Ligo Taco shop contract modified to include metadata in storage
    // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

    const tacoShopStorageMap = new MichelsonMap();
    tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap
      },
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip16SHA256 Contract address', contract.address)
    console.log('Gas Used', op.consumedGas);
    console.log('Storage Paid', op.storageDiff);
    console.log('Storage Size', op.storageSize);
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

example();
