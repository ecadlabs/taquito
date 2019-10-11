export enum Network {
  Alphanet = 'alphanet',
  Babylonnet = 'babylonnet',
  Mainnet = 'mainnet',
}

export namespace Network {
  export function values(): string[] {
    return Object.values(Network).filter(value => typeof value === 'string') as string[];
  }

  export function getUrl(network: Network): string {
    return {
      [Network.Alphanet]: 'https://tezos-dev.cryptonomic-infra.tech',
      [Network.Babylonnet]: 'https://babylonnet-node.tzscan.io',
      [Network.Mainnet]: 'https://rpc.tezrpc.me',
    }[network];
  }
}
