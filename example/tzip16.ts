import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { bin2String, bytesToHex, hexToBytes, string2Bin, toJSON } from "./utils";
import { metadataJSON } from "./metadata"
import { tacoContractTzip16 } from "./modified-taco-contract";
import { InMemorySigner } from "@taquito/signer";

const example = async () => {
    const provider = 'https://testnet-tezos.giganode.io';
    const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider( signer );

    try {
        // Conversion of metadata values to bytes
        // We will need to provide util functions to make conversion between string and bytes as values of the metadata bigmap are in bytes
        const metadataLocationInByte = bytesToHex(string2Bin('tezos-storage:here'));
        const metadataInByte = bytesToHex(string2Bin(metadataJSON));

        const metadataBigMAp = new MichelsonMap();
        metadataBigMAp.set("", metadataLocationInByte)
        metadataBigMAp.set("here", metadataInByte)

        // Ligo Taco shop contract modified to include metadata in storage
        // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

        const tacoShopStorageMap = new MichelsonMap();
        tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" })
        tacoShopStorageMap.set("2", { current_stock: "120", max_price: "20" })
        tacoShopStorageMap.set("3", { current_stock: "50", max_price: "60" })

/*          const originationOp = await tezos.contract.originate({
            code: tacoContractTzip16,
            storage: {
                metadata: metadataBigMAp,
                taco_shop_storage: tacoShopStorageMap
            },
        })
        console.log(`Waiting for ${originationOp.hash} to be confirmed...`);
        const contract = await originationOp.contract();
        console.log('Address :', contract.address)  */

        // Fetch the newly originated smart contract
        const contract = await tezos.contract.at('KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo');

        const myStorage: Storage = await contract.storage();

        // Fetch the value stored in key "" (empty!) from the Big Map named %metadata

        // We need to validate that the contract is compliant with tzip16.
        // To do so, we check if there is a bigmap called "metadata" in the storage
        // and if the bigmap contains an empty key
        let metadataInStorage;
        if(myStorage.metadata){
            metadataInStorage = myStorage.metadata;
        } else {
            throw new Error("The contract is not compliant with tzip16 standard, no metadata found in storage.");
        }

        // Add validation to see if there is an empty key
        const uri = await metadataInStorage.get('');
        console.log(uri)
        console.log('typeof(uri)', typeof(uri))
        const uri2string = bin2String(hexToBytes(uri));
        console.log('URI:' , uri2string);

        // We need to check if the metadata are stored on-chain, or http/https or ipfs
        const firstPartOfUri = uri2string.split(/:(.+)/)[0];

        if (firstPartOfUri === 'tezos-storage'){
            console.log('Metadata are stored on-chain.')
        } else if (firstPartOfUri === 'ipfs') {
            // something
        } 
        else if (firstPartOfUri === ('http' || 'https')) {
            // something
        }

        // We are in the case that firstPartOfUri === 'tezos-storage'
        // We need to verify if metadata are stored in the current contract or in another contract
        const secondPartOfUri= uri2string.split(/:(.+)/)[1]

        if(!(secondPartOfUri.includes('//'))){
            // curent contract
            console.log('Metadata are in the current contract.')
        } else {
            // Some manipulation around '/' character ... split('/');
            // to find contract address and network
        }

        const metadataValueBytes = await metadataInStorage.get(secondPartOfUri);
        const metadataValue = bin2String(hexToBytes(metadataValueBytes));
        console.log(metadataValue)

    } catch (ex) {
        console.log(ex)
    }
}

// tslint:disable-next-line: no-floating-promises
example();