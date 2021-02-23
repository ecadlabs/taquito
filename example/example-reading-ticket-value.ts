import { BigMapAbstraction, MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey, InMemorySigner } from '@taquito/signer';
import { nftAuction, nftWallet } from "../integration-tests/data/nft_wallet_tq";
import { char2Bytes } from '../packages/taquito-tzip16/src/tzip16-utils'

const provider = 'https://api.tez.ie/rpc/edonet';

async function example() {
    try {

        const Tezos = new TezosToolkit(provider)
        const signerAlice: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
        Tezos.setSignerProvider(signerAlice);
        const alicePkh = await Tezos.signer.publicKeyHash();
 
        console.log('Deploying nftWallet contract with Alice address (NFT wallet that will create, destroy, send, and receive NFTs)')

      const opNftWallet = await Tezos.contract.originate({
            code: nftWallet,
            storage: {
                admin: alicePkh,
                tickets: new MichelsonMap(),
                current_id: 0,
                token_metadata: new MichelsonMap()
            }
        });

        await opNftWallet.confirmation();
        let nftWalletContract = await opNftWallet.contract(); //KT1BY6PqX47s64R6yyojfGXieEByibuQ9w5m
        console.log('nftWallet: ', nftWalletContract.address); 

        // Deploy BobWallet contract (NFT wallet that will create, destroy, send, and receive NFTs)
        const Tezos2 = new TezosToolkit(provider);
        await importKey(Tezos2, 'peqjckge.qkrrajzs@tezos.example.org', 'y4BX7qS1UE', ['skate', 'damp', 'faculty', 'morning', 'bring', 'ridge', 'traffic', 'initial', 'piece', 'annual', 'give', 'say', 'wrestle', 'rare', 'ability',].join(' '), '7d4c8c3796fdbf4869edb5703758f0e5831f5081');

        const bobPkh = await Tezos2.signer.publicKeyHash();

        const opBobWallet = await Tezos2.contract.originate({
            code: nftWallet,
            storage: {
                admin: bobPkh,
                tickets: new MichelsonMap(),
                current_id: 0,
                token_metadata: new MichelsonMap()
            }
        });

        await opBobWallet.confirmation();
        const bobWallet = await opBobWallet.contract(); //KT1StGEBi5aqynVfjKycpcKeYokJhXCHfohW
        console.log('bobWallet: ', bobWallet.address);

        // Alice originates nft-auction contract
        const opAuction = await Tezos.contract.originate({
            code: nftAuction,
            storage: {
                data: {
                    admin: alicePkh,
                    current_price: 0,
                    reserve_price: 0,
                    in_progress: false,
                    start_time: '0',
                    round_time: '0'
                },
                tickets: new MichelsonMap()
            }
        });
        await opAuction.confirmation();
        const auction = await opAuction.contract(); //KT1RPbxYz38JJN8saTTfjfhZe9mziCmTm5Qq
        console.log('auction: ', auction.address);

        // Mint NFT
        // First, Alice mints herself a ticket based NFT with metadata

        const tokenMetadata = new MichelsonMap();
        tokenMetadata.set('decimals', char2Bytes('0'));
        tokenMetadata.set('ipfs_cid', char2Bytes('Qmb1s5K234gpBcmFFDnZBcufJpAWb8AtAhjf1fUH4z5f72'));
        tokenMetadata.set('name', char2Bytes('Demo'));
        const opMint = await nftWalletContract.methods.mint(tokenMetadata).send();
        await opMint.confirmation();

        let storageNftWallet: any = await nftWalletContract.storage();
        let ticketBigMapInStorage: BigMapAbstraction = storageNftWallet['tickets'];
        console.log("Fetch the value of the key 0 in the big map %tickets in the storage of the Nft wallet: ", await ticketBigMapInStorage.get('0'));
 
        // Configure auction
        // Alice auctions off her ticket based NFT through her wallet, which sends her NFT to her auction contract and configures various auction settings. 
        // The starting price of the auction is 100 mutez.

        console.log(opAuction.contractAddress);
        const opConfigure = await nftWalletContract.methods.auction(
            `${opAuction.contractAddress}%configure`, //destination
            100, //opening_price
            10, //reserve_price
            '0', //start_time
            600, //round_time
            0//ticket_id?? 1??
        ).send();

        await opConfigure.confirmation();
 
        //The ticket is now in the bigmap of the auction contract
        let storageAuction: any = await auction.storage();
        let ticketBigMapInStorageAuction: BigMapAbstraction = storageAuction['tickets'];
        console.log("Fetch the value of the key 0 in the big map %tickets in the storage of the auction: ", await ticketBigMapInStorageAuction.get('0'));


        // Start auction
        const opStart = await auction.methods.start([['Unit']]).send();
        await opStart.confirmation();

        //const auction = await Tezos.contract.at('KT1RPbxYz38JJN8saTTfjfhZe9mziCmTm5Qq') 
        //Drop ask price
        console.log('Auction Storage, current price is 100', JSON.stringify(await auction.storage(), null, 2));
        const opDropPrice = await auction.methods['drop_price']('90').send();
        await opDropPrice.confirmation();
        console.log('Auction Storage, price droped to 90', JSON.stringify(await auction.storage(), null, 2));
 
        
        // Purchase NFT
        // Bob buys the NFT by sending 90 mutez to the auction contract, calling the buy entrypoint, 
        // and sending the address of his wallet contract. 
        // The NFT is sent to Bob’s wallet and Alice is sent the 90 mutez.
/* 
        const auctionContract = await Tezos2.contract.at(auction.address);
        const opBuy = await auctionContract.methods.buy(`${opBobWallet.contractAddress}%receive`).send();
        await opBuy.confirmation();

        let storageBobWallet: any = await bobWallet.storage();
        let ticketBigMapInStorageBobWallet: BigMapAbstraction = storageBobWallet['tickets'];
        console.log("Fetch the value of the key 0 in the big map %tickets in the storage of Bob wallet: ", await ticketBigMapInStorageBobWallet.get('0'));
 */

    } catch (ex) {
        console.error((ex));
    }
}

// tslint:disable-next-line: no-floating-promises
example();