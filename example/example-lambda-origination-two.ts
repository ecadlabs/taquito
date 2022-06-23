import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { fa2Contract } from '../integration-tests/data/fa2_contract';
import Faucet from './faucet-interface';

const {email, password, mnemonic, activation_code} = require("./faucet-default-values.json") as Faucet

const provider = 'https://jakartanet.ecadinfra.com/'

async function example() {
  const tezos = new TezosToolkit(provider)
  await importKey(
     tezos,
     email,
     password,
     mnemonic.join(' '),
     activation_code
   );

  try {
    console.log('Deploying LambdaTwo contract...');

    const bigMapLedger = new MichelsonMap();
    bigMapLedger.set('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', {
      allowances: ['tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'],
      balance: '50'
    });
    bigMapLedger.set('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq', {
      allowances: ['tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE'],
      balance: '50',
    });

    const tokenMetadataBigMap = new MichelsonMap();
    tokenMetadataBigMap.set('0', {
      token_id: '0',
      symbol: 'hello',
      name: 'test',
      decimals: '0',
      extras: new MichelsonMap()
    });
    tokenMetadataBigMap.set('1', {
      token_id: '1',
      symbol: 'world',
      name: 'test2',
      decimals: '0',
      extras: new MichelsonMap()
    });

    const op = await tezos.contract.originate({
      balance: "1",
      code: fa2Contract,
      storage: {
        ledger: bigMapLedger,
        token_metadata: tokenMetadataBigMap,
        total_supply: '100'
      },
    })

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('LambdaTwo Contract address',contract.address)
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
