export enum Network {
  Alphanet = 'alphanet',
  Mainnet = 'mainnet',
}

export namespace Network {
  export function valueOf(value: string): Network {
    return Network[value.charAt(0).toUpperCase() + value.slice(1)];
  }

  export function getUrl(network: Network): string {
    return {
      [Network.Alphanet]: 'https://tezos-dev.cryptonomic-infra.tech',
      [Network.Mainnet]: 'https://rpc.tezrpc.me',
    }[network];
  }
}
