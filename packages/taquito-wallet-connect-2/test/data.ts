export const sessionExample = {
  topic: '272d3c5cfa9f5713bf837803200105c81394249f402fe0927f9ce7c1b319e0f8',
  relay: {
    protocol: 'irn',
  },
  expiry: 1668023668,
  namespaces: {
    tezos: {
      accounts: [
        'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
        'tezos:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G',
        'tezos:ghostnet:tz2JobFgDoJ5HZ1jAoMgZCyNdbBEdAstkytV',
      ],
      methods: ['tezos_signExpression'],
      events: [],
    },
  },
  acknowledged: true,
  controller: 'ae8a8b81b2832bd4e3f38f848652d540172f15ff8eeafd4e3d90a00ed623af47',
  self: {
    publicKey: '01b5630403234ba9745073c9ad081c7b812786b2bcfa8cfe1ff28d800b989f29',
    metadata: {
      description: '',
      url: 'http://localhost:3000',
      icons: [],
      name: '',
    },
  },
  peer: {
    publicKey: 'ae8a8b81b2832bd4e3f38f848652d540172f15ff8eeafd4e3d90a00ed623af47',
    metadata: {
      name: 'React Wallet',
      description: 'React Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  },
  requiredNamespaces: {
    tezos: {
      methods: ['tezos_signExpression'],
      chains: ['tezos:ghostnet'],
      events: [],
    },
  },
};
