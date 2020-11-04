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
  }, {
    src:
      'https://www.tezbridge.com/plugin.js',
    async: true,
  }],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Baloo+Tammudu|Open+Sans:400,600,800&display=swap',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'
  ],
  customFields: {
    repoUrl: 'https://github.com/ecadlabs/taquito',
    description:
      'A TypeScript library suite made available as set of npm packages aiming to make building on top of Tezos easier and more enjoyable.',
  },
  themes: [require.resolve('@docusaurus/theme-live-codeblock')],
  themeConfig: {
    navbar: {
      title: 'Taquito',
      logo: {
        alt: 'Taquito Logo',
        src: 'img/a_taquito.png'
      },
      items: [
        { to: 'docs/version', label: '7.0.0-beta.0', position: 'right' },
        { to: 'docs/quick_start', label: 'Docs', position: 'right' },
        { href: "https://twitter.com/TezosTaquito", label: 'Twitter', position: 'right' },
        { href: "https://github.com/ecadlabs/taquito", label: 'GitHub', position: 'right' }
      ]
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Quick Start',
              to: 'docs/quick_start',
            },
            {
              label: 'TypeDoc Reference',
              href: 'https://tezostaquito.io/typedoc',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Exchange',
              href: 'https://tezos.stackexchange.com/questions/tagged/taquito',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/TezosTaquito',
            },
            {
              label: 'Code of Conduct',
              href: 'https://github.com/ecadlabs/taquito/blob/master/code-of-conduct.md',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ecadlabs/taquito',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Report issues',
              href: 'https://github.com/ecadlabs/taquito/issues',
            },
            {
              label: 'Contribute',
              href: 'https://github.com/ecadlabs/taquito/blob/master/CONTRIBUTING.md',
            },
          ],
        },
      ],
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
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.json'),
        }
      }
    ],
  ],
};
