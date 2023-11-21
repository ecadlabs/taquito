---
title: Tezos Domains
id: tezos_domains
author: Claude Barde
---

A Tezos domain is a feature that allows users of the Tezos blockchain to use a human-readable and easy to remember address (for example, `alice.tez`) instead of a long string of letters and numbers (for example, `tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb`). The data about which address owns which domain is stored as a token inside a smart contract, so it's possible to find this piece of information when inspecting the storage of the contract.

Let's have a look at the Tezos domain contract on testnet to see how we can find a domain associated to an address and vice-versa.

> Note: the domains have a different extension on the various networks. All the domains on mainnet have the `.tez` extension while the domains on florencenet have a `.flo` extension. However, the contracts work exactly in the same way.

## Looking up an address

If you have an address and you want to find the domain tied to it, the storage of the Tezos domain contract holds a bigmap called `reverse_records` whose keys are addresses and whose values include the corresponding Tezos domain. Here is a little function to fetch it:

```typescript
import { TezosToolkit } from "@taquito/taquito";
import { bytes2Char } from "@taquito/utils";

const domainContractAddress = "KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS";

// the function returns the domain name if found or the provided address
const fetchTezosDomainFromAddress = async (address: string): Promise<string> => {
    const Tezos = new TezosToolkit("https://mainnet.ecadinfra.com");
    const contract = await Tezos.wallet.at(domainContractAddress);
    const storage: any = await contract.storage();
    const domain = await storage.store.reverse_records.get(address);
    if (domain) {
      return bytes2Char(domain.name);
    } else {
      return address;
    }
};

```

2 things to remember when you are looking for a Tezos domain in the storage of the contract:
- the `reverse_records` bigmap is nested inside the `store` property
- the domain name is stored as bytes, so you can use the `bytes2Char` function from `@taquito/utils` to decode it as a string.

If we call the `fetchTezosDomainFromAddress` function with `tz1aauXT4uM8ZB3ouu5JrAenEMQdqfvDUSNH`, it will return `taquito.tez`.

## Looking up a Tezos domain

It is also possible to look up a domain name to find the address it references. In this case, you will use the `records` bigmap that you can also find under the `store` property of the storage:

```typescript
import { TezosToolkit } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";

const contractAddress = "KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS";

// the function returns the address if found or the provided domain name
const fetchAddressFromTezosDomain = async (domainName: string): Promise<string> => {
    const Tezos = new TezosToolkit("https://mainnet.ecadinfra.com");
    const contract = await Tezos.wallet.at(contractAddress);
    const storage: any = await contract.storage();
    const domain = await storage.store.records.get(char2Bytes(domainName));
    if (domain) {
      return domain.address; // address that the domain points to 
      // return domain.owner; // address that owns the domainName
    } else {
      return domainName;
    }
};

```

This function works in the same manner as the previous one, but the owner's address is a simple address and doesn't need to be decoded.

## Looking up the expiry date of a domain

The Tezos domains have an expiry date after which they must be renewed or they will be available again.
To find the expiry date, you can check the `expiry_map` bigmap under the `store` property of the storage where the keys are the domain names encoded into bytes:

```typescript
import { TezosToolkit } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";

const contractAddress = "KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS";

// this function return the expiry date of a domain name
const fetchExpiryDate = async (domainName: string): Promise<string> => {
    const Tezos = new TezosToolkit("https://mainnet.ecadinfra.com");
    const contract = await Tezos.wallet.at(contractAddress);
    const storage: any = await contract.storage();
    const expiryDate = await storage.store.expiry_map.get(char2Bytes(domainName));
    if (expiryDate) {
      return expiryDate;
    } else {
      return "not a valid domain name";
    }
}
```

If you provide `taquito.tez` as a parameter, the function will return `2023-04-30T00:00:00Z`, meaning that the domain name expires in April 9th, 2023.
