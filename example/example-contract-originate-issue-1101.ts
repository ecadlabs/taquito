import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { contractIssue1101 } from './data/contractIssue1101';
import { miStorage } from '../packages/taquito/test/contract/data';

const provider = 'https://ithacanet.ecadinfra.com/'

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
    console.log('Deploying Issue 1101 contract...');
    const op = await tezos.contract.originate({
      code: contractIssue1101,
      init: {
        // simple: 645208847471,
        // nat: 32260442355, 
        // string: "taquito",
        // or_1: 4,
        // or_2: "Tezos",
        // msg: '0554657a6f73205369676e6564204d6573736167653a20626561636f6e2d746573742d646170702e6e65746c6966792e6170702f20323032312d31312d31365431373a34313a34392e3631335a2073646464',
        // sender: "tz1WEecweNYXSbWRj2V3JsfCJhjWdvF5mGVV",
        // sig: 'sigdidQmALfvWt5d1155AiFA67At5fe9VJ36JCm4yuFsMEU7Zmb717evPMe9LFQRYCqf7WpAR95yNZr3NFbkpTzZWWpPZj3a'
      },


      // storage (pair (int %simple)
      // (pair (pair %complex nat string)
      //       (pair
      //         (pair %optional (or (int %int) (string %string))
      //                         (or (int %int) (string %string)))
      //         (option %last_checked_sig (pair (pair (bytes %msg) (address %sender))
      //                                        (signature %sig_))))));
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Ligo Vote Contract address',contract.address)
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
