import { TezosToolkit } from '@taquito/taquito';
import { stringToBytes } from '@taquito/utils';
import { tacoContractTzip16 } from "../integration-tests/data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
import { InMemorySigner } from '@taquito/signer';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com';
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  const tezos = new TezosToolkit(provider);
  tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Tzip16 contract with hostile strings...');
    const metadataJSON = {
      "name": "test",
      "description": "1;DROP TABLE users \
        1'; DROP TABLE users-- 1 \
        ' OR 1=1 -- 1 \
        ' OR '1'='1 \
        -- \
        --version \
        --help \
        $USER \
        `touch /tmp/blns.fail` \
        $(touch /tmp/blns.fail)",
      "version": " <?xml version=\x221.0\x22 encoding=\x22ISO-8859-1\x22?><!DOCTYPE foo [ <!ELEMENT foo ANY ><!ENTITY xxe SYSTEM \x22file:///etc/passwd\x22 >]><foo>&xxe;</foo>",
      "license": "/dev/null; touch /tmp/blns.fail ; echo",
      "authors": [
        "        '; EXEC sp_MSForEachTable 'DROP TABLE ?'; -- "
      ],
      "homepage": "@{[system \x22touch /tmp/blns.fail\x22]}"
    };

    const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set("", stringToBytes('tezos-storage:here'));
    metadataBigMAp.set("here", stringToBytes(JSON.stringify(metadataJSON)))

    const tacoShopStorageMap = new MichelsonMap();

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMAp,
        taco_shop_storage: tacoShopStorageMap
      },
    });
    const contractAddress = (await op.contract()).address;

    console.log('Contract Address', contractAddress);
    console.log('Gas Used', op.consumedGas);
    console.log('Storage Paid', op.storageDiff);
    console.log('Storage Size', op.storageSize);
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

example();
