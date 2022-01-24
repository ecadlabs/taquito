import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { char2Bytes } from '@taquito/utils';
import { tacoContractTzip16 } from "../integration-tests/data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
const provider = 'https://api.tez.ie/rpc/florencenet';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    'peqjckge.qkrrajzs@tezos.example.org',
    'y4BX7qS1UE',
    [
      'skate',
      'damp',
      'faculty',
      'morning',
      'bring',
      'ridge',
      'traffic',
      'initial',
      'piece',
      'annual',
      'give',
      'say',
      'wrestle',
      'rare',
      'ability',
    ].join(' '),
    '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
  );

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
    metadataBigMAp.set("", char2Bytes('tezos-storage:here'));
    metadataBigMAp.set("here", char2Bytes(JSON.stringify(metadataJSON)))

    const tacoShopStorageMap = new MichelsonMap();

    const op = await tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
            metadata: metadataBigMAp,
            taco_shop_storage: tacoShopStorageMap
        },
    });
    const contract = await op.confirmation();
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
