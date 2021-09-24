import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const provider = 'https://granadanet.api.tez.ie';
const faucet = {
    "mnemonic": [
      "certain",
      "core",
      "stone",
      "dinner",
      "range",
      "nuclear",
      "twenty",
      "wrong",
      "cricket",
      "improve",
      "flame",
      "insane",
      "ball",
      "false",
      "unaware"
    ],
    "secret": "843d3a866a01def0cc504395adcd22805a02a741",
    "amount": "2334438610",
    "pkh": "tz1TjTcxPYajehTMiGKG6WLz5hhcJDefdHQw",
    "password": "xMcOCMhTdL",
    "email": "cdxlaonu.mekkukst@tezos.example.org"
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
