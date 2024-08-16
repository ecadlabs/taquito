import type {Config} from '@docusaurus/types';
import 'dotenv/config';

const config: Config = {
  title: 'Taquito',
  tagline: 'A TypeScript library suite for development on the Tezos blockchain.',
  favicon: 'img/favicon.svg',
  url: 'https://taquito.io',
  baseUrl: '/',
  projectName: 'taquito',
  organizationName: 'ecadlabs',
  markdown: {
    mermaid: true,
  },
  scripts: [
    'https://buttons.github.io/buttons.js',
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js',
      async: true,
    }
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
  themes: [require.resolve('@docusaurus/theme-live-codeblock'), '@docusaurus/theme-mermaid'],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: 'Taquito Logo',
        src: 'img/taquito_header.svg',
      },
      items: [
        {
          type: 'search',
          position: 'right'
        },
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
          href: 'https://discord.gg/JgvVdWV7BN',
          position: 'right',
          className: 'header-link header-discord-link',
          'aria-label': 'Discord',
        },
        {
          href: 'https://twitter.com/tezostaquito',
          position: 'right',
          className: 'header-link header-twitter-link',
          'aria-label': 'Twitter',
        },
        {
          href: 'https://github.com/ecadlabs/taquito',
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
              to: 'https://github.com/ecadlabs/taquito/issues/new/choose',
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
              to: 'https://tezos.stackexchange.com/questions/tagged/taquito',
            },
            {
              label: 'Discord',
              to: 'https://discord.gg/JgvVdWV7BN',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/tezostaquito',
            },
            {
              label: 'Code of Conduct',
              to: 'https://github.com/ecadlabs/taquito/blob/master/code-of-conduct.md',
            },
            {
              label: 'GitHub',
              to: 'https://github.com/ecadlabs/taquito',
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
              to: 'https://taquito.io/typedoc',
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
									Developing On Tezos Can Be Delicious!
									</p>
								  `,
            },
            {
              html: `
									<a class='footerButton' href='https://github.com/ecadlabs/taquito'>
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
    algolia: {
      apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
      indexName: 'taquito',
      appId: process.env.ALGOLIA_APPLICATION_ID,
      contextualSearch: false,
    },
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
  plugins:
    [
      require.resolve('./plugins/webpack5plugin/index.js'),
      'docusaurus-plugin-sass',
      [
        'docusaurus-plugin-dotenv',
        {
          path: "./.env",
          systemvars: true
        }
      ]
    ],

};

export default config;
