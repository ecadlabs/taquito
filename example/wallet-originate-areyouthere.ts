import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com';
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  const tezos = new TezosToolkit(provider);
  tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Wallet Test contract...');
    const op = await tezos.wallet.originate({
      code: `parameter (or
        (or (or (pair %addName address string) (bool %areYouThere))
            (or (string %changeMessage) (int %decrement)))
        (int %increment));
storage (pair (pair (bool %areyouthere) (int %integer))
          (pair (string %message) (map %names address string)));
code { DUP ;
   CDR ;
   DIG 1 ;
   DUP ;
   DUG 2 ;
   CAR ;
   IF_LEFT
     { DUP ;
       IF_LEFT
         { DUP ;
           IF_LEFT
             { DUP ;
               DIG 4 ;
               DUP ;
               DUG 5 ;
               PAIR ;
               DUP ;
               CAR ;
               DIG 1 ;
               DUP ;
               DUG 2 ;
               CDR ;
               DIG 1 ;
               DUP ;
               DUG 2 ;
               CDR ;
               CDR ;
               DIG 1 ;
               DUP ;
               DUG 2 ;
               CAR ;
               GET ;
               IF_NONE
                 { DIG 1 ;
                   DUP ;
                   DUG 2 ;
                   DIG 2 ;
                   DUP ;
                   DUG 3 ;
                   CDR ;
                   CDR ;
                   DIG 2 ;
                   DUP ;
                   DUG 3 ;
                   CDR ;
                   DIG 3 ;
                   DUP ;
                   DUG 4 ;
                   CAR ;
                   SWAP ;
                   SOME ;
                   SWAP ;
                   UPDATE ;
                   DIP { DUP ; CAR ; SWAP ; CDR ; CAR } ;
                   SWAP ;
                   PAIR ;
                   SWAP ;
                   PAIR }
                 { DIG 2 ;
                   DUP ;
                   DUG 3 ;
                   DIG 3 ;
                   DUP ;
                   DUG 4 ;
                   CDR ;
                   CDR ;
                   DIG 3 ;
                   DUP ;
                   DUG 4 ;
                   CDR ;
                   SOME ;
                   DIG 4 ;
                   DUP ;
                   DUG 5 ;
                   CAR ;
                   UPDATE ;
                   DIP { DUP ; CAR ; SWAP ; CDR ; CAR } ;
                   SWAP ;
                   PAIR ;
                   SWAP ;
                   PAIR ;
                   DIP { DROP } } ;
               DIP { DROP 4 } }
             { DUP ;
               DIG 4 ;
               DUP ;
               DUG 5 ;
               PAIR ;
               DUP ;
               CAR ;
               DIG 1 ;
               DUP ;
               DUG 2 ;
               CDR ;
               DIP { DUP ; CDR ; SWAP ; CAR ; CDR } ;
               PAIR ;
               PAIR ;
               DIP { DROP 2 } } ;
           DIP { DROP } }
         { DUP ;
           IF_LEFT
             { DUP ;
               DIG 4 ;
               DUP ;
               DUG 5 ;
               PAIR ;
               DUP ;
               CAR ;
               DIG 1 ;
               DUP ;
               DUG 2 ;
               CDR ;
               DIP { DUP ; CAR ; SWAP ; CDR ; CDR } ;
               PAIR ;
               SWAP ;
               PAIR ;
               DIP { DROP 2 } }
             { DUP ;
               DIG 4 ;
               DUP ;
               DUG 5 ;
               PAIR ;
               DUP ;
               CAR ;
               DUP ;
               DIG 2 ;
               DUP ;
               DUG 3 ;
               CDR ;
               DIG 2 ;
               DUP ;
               DUG 3 ;
               CAR ;
               CDR ;
               SUB ;
               DIP { DUP ; CDR ; SWAP ; CAR ; CAR } ;
               SWAP ;
               PAIR ;
               PAIR ;
               DIP { DROP 3 } } ;
           DIP { DROP } } ;
       DIP { DROP } }
     { DUP ;
       DIG 2 ;
       DUP ;
       DUG 3 ;
       PAIR ;
       DUP ;
       CAR ;
       DUP ;
       DIG 2 ;
       DUP ;
       DUG 3 ;
       CDR ;
       DIG 2 ;
       DUP ;
       DUG 3 ;
       CAR ;
       CDR ;
       ADD ;
       DIP { DUP ; CDR ; SWAP ; CAR ; CAR } ;
       SWAP ;
       PAIR ;
       PAIR ;
       DIP { DROP 3 } } ;
   DUP ;
   NIL operation ;
   PAIR ;
   DIP { DROP 3 } }
            `,
      init: `(Pair (Pair True 0)
      (Pair ""
            { Elt 0x00006b82198cb179e8306c1bedd08f12dc863f328886 "Alice" ;
              Elt 0x0000b2e19a9e74440d86c59f13dab8a18ff873e889ea "HEllo!" }))`,
    }).send();

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    const contractAddress = (await op.contract()).address;
    console.log('contractAddress', contractAddress);
    console.log('Storage', await contract.storage());
  } catch (ex) {
    console.error(ex);
  }
}

example();