import { NetworkType } from "@airgap/beacon-sdk";

export const rpcUrl = {
  kathmandunet: "https://kathmandunet.ecadinfra.com/",
  ghostnet: "https://ghostnet.ecadinfra.com/",
  ithacanet: "https://ithacanet.ecadinfra.com/",
  mainnet: "https://mainnet.api.tez.ie", //"https://mainnet-tezos.giganode.io"
  custom: "https://ghostnet.ecadinfra.com/"
};

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkType.GHOSTNET;

export const contractAddress = {
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  ithacanet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  ghostnet: "KT1Vt5eFxzBbD7k2AJZhuJzaG6bA4GEyvNqi", // contract without sapling: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  custom: "KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg",
  kathmandunet: "KT1BQuSVXWz23iGeXQCrAGR6GcVcqKeE1F7T"
};

export const alice = {
  sk: "edskRpm2mUhvoUjHjXgMoDRxMKhtKfww1ixmWiHCWhHuMEEbGzdnz8Ks4vgarKDtxok7HmrEo1JzkXkdkvyw7Rtw6BNtSd7MJ7",
  mnemonic: "upon magic quarter arrive chat royal gasp month switch hedgehog riot mention"
}
