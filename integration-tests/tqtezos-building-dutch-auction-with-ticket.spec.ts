import { CONFIGS } from "./config";
import { BigMapAbstraction, MichelsonMap, Protocols } from "@taquito/taquito";
import { nftWallet } from "./data/nft_wallet_tq";
import { char2Bytes } from "@taquito/tzip16";

CONFIGS().forEach(({ lib, rpc, protocol, setup }) => {
    const Tezos = lib;
    const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;

    describe(`Tutorial from TQ Tezos: Dutch Auction with Ticket based NFTs: ${rpc}`, () => {
        // https://assets.tqtezos.com/docs/experimental/ticket-auction/

        beforeEach(async (done) => {
            await setup();
            done()
        })

        edonet('Originates NFT Wallet and mint NFT ', async (done) => {

            const alicePkh = await Tezos.signer.publicKeyHash();
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

            expect(opNftWallet.hash).toBeDefined();
            expect(opNftWallet.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

            const aliceWalletContract = opNftWallet.contractAddress;
            const contractAliceWallet = await Tezos.contract.at(aliceWalletContract!);
            const tokenMetadata = new MichelsonMap();
            tokenMetadata.set('decimals', char2Bytes('0'));
            tokenMetadata.set('ipfs_cid', char2Bytes('Qmb1s5K234gpBcmFFDnZBcufJpAWb8AtAhjf1fUH4z5f72'));
            tokenMetadata.set('name', char2Bytes('Demo'));
            const opMint = await contractAliceWallet.methods.mint(tokenMetadata).send();
            await opMint.confirmation();

            const storage: any = await contractAliceWallet.storage();
            const ticketBigMapInStorage: BigMapAbstraction = storage.tickets;
            const ticketValue = await ticketBigMapInStorage.get('0');

            expect(JSON.stringify(ticketValue)).toEqual(JSON.stringify({
                ticketer: aliceWalletContract,
                value: '0',
                amount: '1'
            }))
            
            done()
        });
    });
});