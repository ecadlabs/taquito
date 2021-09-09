import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const provider = 'https://granadanet.api.tez.ie';
const faucet = {
  "mnemonic": [
    "paper",
    "course",
    "resist",
    "stock",
    "brass",
    "empty",
    "pull",
    "delay",
    "shoot",
    "develop",
    "ribbon",
    "divert",
    "point",
    "turn",
    "involve"
  ],
  "secret": "05a1b110aa7ad08b7d45db0ca573bd213cea53c7",
  "amount": "4001166802",
  "pkh": "tz1YD5XPdJ5xyD7zCLrdyJfykA6zBH7bsWx5",
  "password": "KhUq3Gtxye",
  "email": "zmaxblgx.clwdufwg@tezos.example.org"
}


async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    faucet.email,
    faucet.password,
    faucet.mnemonic.join(' '),
    faucet.secret
  );

  try {
    console.log('Sending tz...');
    const op = await tezos.contract
      .transfer({
        // tz1Rb18fBaZxkzDgFGAbcBZzxLCYdxyLryVX (local)
        // tz1bRt6Lo9KRNEUF9voCwkjR2pkMU9xJuYMB (keygen)
        to: 'tz1bRt6Lo9KRNEUF9voCwkjR2pkMU9xJuYMB',
        amount: (Number(faucet.amount)/1000000) - 1
      });

    console.log('Awaiting confirmation...');
    await  op.confirmation(1);
    console.log('Hash:', op.hash);
  } catch (ex) {
    console.error(ex);
  }
}

example();
