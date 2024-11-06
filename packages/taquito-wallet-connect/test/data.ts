export const sessionExample = {
  topic: '272d3c5cfa9f5713bf837803200105c81394249f402fe0927f9ce7c1b319e0f8',
  relay: {
    protocol: 'irn',
  },
  expiry: 1668023668,
  namespaces: {
    tezos: {
      accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
      methods: ['tezos_send'],
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
      methods: ['tezos_send'],
      chains: ['tezos:ghostnet'],
      events: [],
    },
  },
};

export const sessionMultipleChains = {
  topic: '5b7d09ec60b46ba32617549cfc62fcc7a79edff14212a0fbecaf38f6aefa09e2',
  relay: {
    protocol: 'irn',
  },
  expiry: 1668634369,
  namespaces: {
    tezos: {
      accounts: [
        'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
        'tezos:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G',
        'tezos:ghostnet:tz2JobFgDoJ5HZ1jAoMgZCyNdbBEdAstkytV',
        'tezos:parisnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
        'tezos:parisnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G',
        'tezos:parisnet:tz2JobFgDoJ5HZ1jAoMgZCyNdbBEdAstkytV',
      ],
      methods: ['tezos_sign'],
      events: [],
    },
  },
  acknowledged: true,
  controller: '9acfbaf43ca1e9a6e1e27d3841c7b71a68176b401f1f29670870e3ca35094d62',
  self: {
    publicKey: '72dfcd018c5a636c311a0214c19f24e1e52a0f38082e31e3971af9b0296f4767',
    metadata: {
      description: '',
      url: 'http://localhost:3000',
      icons: [],
      name: '',
    },
  },
  peer: {
    publicKey: '9acfbaf43ca1e9a6e1e27d3841c7b71a68176b401f1f29670870e3ca35094d62',
    metadata: {
      name: 'React Wallet',
      description: 'React Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  },
  requiredNamespaces: {
    tezos: {
      methods: ['tezos_sign'],
      chains: ['tezos:ghostnet', 'tezos:parisnet'],
      events: [],
    },
  },
};

export const existingPairings = [
  {
    topic: 'db507c396bed3286e281266aa4cb7804f52b4b0193fae9a4b0c8c10b21c29c6a',
    expiry: 1673202920,
    relay: {
      protocol: 'irn',
    },
    active: true,
    peerMetadata: {
      name: 'Kukai Wallet',
      description:
        'Manage your digital assets and seamlessly connect with experiences and apps on Tezos.',
      url: 'https://wallet.kukai.app',
      icons: [],
    },
  },
];

export const fakeCode = [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'nat',
      },
    ],
  },
  {
    prim: 'storage',
    args: [
      {
        prim: 'nat',
      },
    ],
  },
  {
    prim: 'code',
    args: [
      [
        {
          prim: 'AMOUNT',
        },
      ],
    ],
  },
];
