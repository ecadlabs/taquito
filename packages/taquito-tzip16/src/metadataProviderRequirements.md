# Metadata provider requirements
> AKA fetcher provider 

## Requirement overview
1. Given an tzip16 URI (decoded) select the protocol (http/https/smart contract/ipfs)
2. Given a protocol retrieve the data stored at a given location 
3. Support adding new protocol in the future (ie. google bucket)

## Interfaces definition

``` ts
export interface MetadataEnvelope {
    uri: string;
    integrityCheckResult?: boolean;
    sha256Hash?: string;
    metadata: JSON
}

export interface MetadataProvider {
    /**
     *
     * @description Fetch the metadata. The uri parameter contains the required information to locate metadata contents (http/https, ipfs, tezos-storage).
     *
     * @returns An object representing the metadata
     *
     * @param contractAbstraction the contractAbstraction of the current contract (useful if metadata are located inside its own storage)
     * @param uri the decoded uri
     */
    provideMetadata(uri: String, contractAbstraction: ContractAbstraction<ContractProvider | Wallet>): Promise<MetadataEnvelope>;
}
```

# Milestone 1

## Protocol selection

Consider using a regex (https://regex101.com/r/HpLmDy/1) to parse the decoded URI to extract the protocol.

Then branch on the protocol and use a class specific to that protocol to retrieve the metadata.

*Tips:*
- Consider using `decodeURIComponent` (for example to transform 'https:%2F%2Fraw.githubusercontent.com%2Ftqtezos%2FTZComet%2F8d95f7b%2Fdata%2Fmetadata_example0.json' to 'https://raw.githubusercontent.com/tqtezos/TZComet/8d95f7b/data/metadata_example0.json')

## Integrity check using sha256

Consider using a regex to extract the sha256 hash from the URI.

If the hash is present. Compute the sha256 hash of the JSON string before returning to taquito clients.

*Notes:* Confirm on which form of the data the sha256 hash must be computed.

## Http/Https
> https://raw.githubusercontent.com/tqtezos/TZComet/8d95f7b/data/metadata_example0.json

For http uri retrieve the data at given location. Consider reusing the HttpBackend class that already exists for this purpose. It works in both browser and node by default.

Out of scope of this protocol type:
Consider adding a request interceptor in Taquito to allow user specify custom request authentication mecanism. In general this is an improvement that will benefit every component of Taquito that use http (RpcClient for example)

## Smart contract
> tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/foo

Reuse the smart contract abstraction to retrieve the data from the storage.

If the data are stored in another contract. Use TezosToolkit.contract.at to fetch it.

Consideration:
Data is encoded in byte in this protocol. Use the function `bytesToString` from `tzip16-utils.ts` to decode it to a string. Then use JSON.parse on the string to produce a javascript object useable by Taquito users.


# Milestone 2

## IPFS 
> ipfs://QmWDcp3BpBjvu8uJYxVqb7JLfr1pcyXsL97Cfkt3y1758o


IPFS expose an http api. Consider leveraging HttpBackend to fetch IPFS stored metadata. https://docs.ipfs.io/reference/http/api/#api-v0-get

The main difference from Http protocol here will be that the user can select their node (Http contains the server in the address)

