module.exports = {
  title: 'Taquito',
  tagline: 'A TypeScript library suite for development on the Tezos blockchain.',
  favicon: 'img/favicon.png',
  url: 'https://tezostaquito.io',
  baseUrl: '/',
  projectName: 'taquito',
  organizationName: 'ecadlabs',
  scripts: ['https://buttons.github.io/buttons.js', {
    src:
      'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    async: true,
  }],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Baloo+Tammudu|Open+Sans:400,600,800&display=swap',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'
  ],
  customFields: {
    description:
      'A TypeScript library suite made available as set of npm packages aiming to make building on top of Tezos easier and more enjoyable.',
  },
  themeConfig: {
    navbar: {
      title: 'Taquito',
      logo: {
        alt: 'Taquito Logo',
        src: 'img/a_taquito.png'
      },
      links: [
        { to: 'docs/version', label: '5.2.0-beta.1', position: 'right' },
        { to: 'docs/quick_start', label: 'Docs', position: 'right' },
        { href: "https://twitter.com/TezosTaquito", label: 'Twitter', position: 'right' },
        { href: "https://github.com/ecadlabs/taquito", label: 'Github', position: 'right' }
      ]
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} ECAD Labs - Open Source MIT License`
    },
    gtag: {
      trackingID: 'UA-148358030-1',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        docs: {
          // docs folder path relative to website dir.
          path: '../docs',
          // sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.json'),
        }
      }
    ],
  ],
};

const siteConfig = {
  users: [
    {
      caption: 'Tocqueville Group',
      image: '/img/tqtezos.svg',
      infoLink: 'https://tqtezos.com',
    },
    {
      caption: 'Ligo',
      image: '/img/ligo.svg',
      infoLink: 'https://ligolang.org/',
    },
    {
      caption: 'Truffle',
      image: '/img/truffle.png',
      infoLink: 'https://www.trufflesuite.com/',
    },
    {
      caption: 'Nomadic Labs',
      image: '/img/nomadic.png',
      infoLink: 'https://tqtezos.com',
    }
  ],
  repoUrl: 'https://github.com/ecadlabs/taquito',
};
