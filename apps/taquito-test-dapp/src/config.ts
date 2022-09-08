import { NetworkType } from "@airgap/beacon-sdk";

export const rpcUrl = {
  kathmandunet: "https://kathmandunet.ecadinfra.com/",
  hangzhounet: "https://hangzhounet.api.tez.ie", //"https://hangzhounet-tezos.giganode.io",
  ghostnet: "https://ghostnet.ecadinfra.com/",
  ithacanet: "https://ithacanet.ecadinfra.com/",
  mainnet: "https://mainnet.api.tez.ie", //"https://mainnet-tezos.giganode.io"
  custom: "https://hangzhounet.api.tez.ie"
};

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkType.GHOSTNET;

export const contractAddress = {
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  hangzhounet: "KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg",
  ithacanet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  ghostnet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  custom: "KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg",
  kathmandunet: "KT1BQuSVXWz23iGeXQCrAGR6GcVcqKeE1F7T"
};
