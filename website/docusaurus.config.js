require('dotenv').config();

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
      'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js',
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
        { to: 'docs/version', label: 'Release Notes', position: 'right',	className: 'header-link',},
        {
						type: 'doc',
						docId: 'quick_start',
						label: ' Get Started',
						position: 'right',
						className: 'header-link get-started',
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
              label: 'Telegram',
              href: 'https://t.me/tezostaquito',
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
    algolia: {
      apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
      indexName: 'taquito',
      appId: process.env.ALGOLIA_APPLICATION_ID,
    }
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
        	sidebarPath: require.resolve('./sidebars.js'),
          includeCurrentVersion: true
        }
      }
    ],
  ],
  plugins: [require.resolve('./plugins/webpack5plugin/index.js')],
};
