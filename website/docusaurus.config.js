require('dotenv').config();

module.exports = {
  title: 'Taquito',
  tagline: 'A TypeScript library suite for development on the Tezos blockchain.',
  favicon: 'img/favicon.png',
  url: 'https://tezostaquito.io',
  baseUrl: '/',
  projectName: 'taquito',
  organizationName: 'ecadlabs',
  scripts: [
    'https://buttons.github.io/buttons.js',
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js',
      async: true,
    },
    {
      src: 'https://www.tezbridge.com/plugin.js',
      async: true,
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Baloo+Tammudu|Open+Sans:400,600,800&display=swap',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css',
  ],
  customFields: {
    repoUrl: 'https://github.com/ecadlabs/taquito',
    description:
      'A TypeScript library suite made available as a set of npm packages aiming to make building on top of Tezos easier and more enjoyable.',
  },
  themes: [require.resolve('@docusaurus/theme-live-codeblock')],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
      // The following value has been deprecated and will need to be re-implemented when dark mode is implemented
      // switchConfig: {
      // 	darkIcon: '🌙',
      // 	darkIconStyle: {
      // 		marginLeft: '2px',
      // 	},
      // 	// Unicode icons such as '\u2600' will work
      // 	// Unicode with 5 chars require brackets: '\u{1F602}'
      // 	lightIcon: '\u{1F602}',
      // 	lightIconStyle: {
      // 		marginLeft: '1px',
      // 	},
      // },
    },
    navbar: {
      logo: {
        alt: 'Taquito Logo',
        src: 'img/taquito_header.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
          className: 'header-link',
        },
        { to: 'docs/version', label: 'Release Notes', position: 'right', className: 'header-link' },
        {
          type: 'doc',
          docId: 'quick_start',
          label: ' Get Started',
          position: 'right',
          className: 'header-link button_link',
        },
        {
          href: 'https://discord.gg/bujt7syVVT',
          position: 'right',
          className: 'header-link header-discord-link',
          'aria-label': 'Discord',
        },
        {
          href: 'https://twitter.com/tezostaqueria',
          position: 'right',
          className: 'header-link header-twitter-link',
          'aria-label': 'Twitter',
        },
        {
          href: 'https://github.com/ecadlabs/taqueria',
          position: 'right',
          className: 'header-link header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Contact',
          items: [
            {
              label: 'Report Issues',
              to: 'https://github.com/ecadlabs/taqueria/issues/new/choose',
            },
            {
              label: 'Contribute',
              to: 'https://github.com/ecadlabs/taquito/blob/master/CONTRIBUTING.md',
            },
          ],
        },

        {
          title: 'Community',
          items: [
            {
              label: 'Stack Exchange',
              to: 'https://tezos.stackexchange.com/questions/tagged/taqueria',
            },
            {
              label: 'Discord',
              to: 'https://discord.gg/bujt7syVVT',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/tezostaqueria',
            },
            {
              label: 'Code of Conduct',
              to: 'https://github.com/ecadlabs/taquito/blob/master/code-of-conduct.md',
            },
            {
              label: 'GitHub',
              to: 'https://github.com/ecadlabs/taqueria',
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Quick Start',
              to: '/docs/quick_start',
            },
            {
              label: 'TypeDoc Reference',
              to: 'https://tezostaquito.io/typedoc',
            },
          ],
        },
        {
          items: [
            {
              html: `image`,
            },
            {
              html: `
									<p class='footerDescription'>
										Faplaren krorar whataboutism. Krorat kroligen. 
									</p>
								  `,
            },
            {
              html: `
									<a class='footerButton' href='https://github.com/ecadlabs/taqueria'>
										GITHUB
									</a>
								  `,
            },
            {
              html: `form`,
            },
          ],
        },
      ],
    },

    // algolia: {
    //   apiKey: 'process.env.ALGOLIA_SEARCH_API_KEY',
    //   indexName: 'taquito',
    //   appId: 'process.env.ALGOLIA_APPLICATION_ID',
    // }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: [
            require.resolve('./src/css/custom.scss'),
            require.resolve('./src/css/tables.scss'),
            require.resolve('./src/css/admonitions.scss'),
            require.resolve('./src/css/codeBlock.scss'),
            require.resolve('./src/css/tabs.scss'),
          ],
        },
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // includeCurrentVersion: true,
        },
        gtag: {
          trackingID: 'UA-148358030-1',
        },
      },
    ],
  ],
  plugins: [require.resolve('./plugins/webpack5plugin/index.js'), 'docusaurus-plugin-sass'],
};
