/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Taquito', // Title for your website.
  tagline: 'A TypeScript library suite for development on the Tezos blockchain.',
  url: 'https://tezostaquito.io', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'taquito',
  organizationName: 'ecadlabs',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'version', label: '5.0.1-beta.2' },
    { doc: 'quick_start', label: 'Docs' },
    { href: "https://twitter.com/TezosTaquito", label: 'Twitter' },
    { href: "https://github.com/ecadlabs/taquito", label: 'Github' },
  ],

  users: [
    {
      caption: 'Ligo',
      image: '/img/ligo.svg',
      infoLink: 'https://ligolang.org/',
    }
  ],

  /* path to images for header/footer */
  // footerIcon: 'img/favicon.ico',
  favicon: 'img/favicon.png',
  headerIcon: 'img/a_taquito.png',

  /* Colors for website */
  colors: {
    // blue 218DA5 35636E
    // red C73D18
    // brown A56921
    // green 71A417
    // beige F9E3C2
    primaryColor: '#218DA5',
    secondaryColor: '#35636E',
  },

  /* Custom fonts for website */
  fonts: {
    titleFont: [
      "Baloo Tammudu",
    ],
    subTitleFont: [
      "Open Sans"
    ]
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} ECAD Labs - Open Source MIT License`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'dark',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js', {
    src:
      'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    async: true,
  }],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  // ogImage: 'img/undraw_online.svg',
  // twitterImage: 'img/undraw_tweetstorm.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,
  defaultVersionShown: 'master',
  // Show documentation's last update time.
  // enableUpdateTime: true,
  gaTrackingId: 'UA-148358030-1',
  scrollToTop: true,
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Baloo+Tammudu|Open+Sans:400,600,800&display=swap'
  ],
  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/ecadlabs/taquito',
};

module.exports = siteConfig;
