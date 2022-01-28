This website was created with [Docusaurus](https://docusaurus.io/).

# What's In This Document

- [What's In This Document](#whats-in-this-document)
- [Get Started in 5 Minutes](#get-started-in-5-minutes)
  - [Directory Structure](#directory-structure)
- [Editing Content](#editing-content)
  - [Editing an existing docs page](#editing-an-existing-docs-page)
- [Adding Content](#adding-content)
  - [Adding a new docs page to an existing sidebar](#adding-a-new-docs-page-to-an-existing-sidebar)
  - [Adding items to your site's top navigation bar](#adding-items-to-your-sites-top-navigation-bar)
  - [Adding custom pages](#adding-custom-pages)
- [Documentation Versioning](#documentation-versioning)
  - [Making versioned copies of the current documentation](#making-versioned-copies-of-the-current-documentation)
  - [Updating `versions.json`](#updating-versionsjson)
  - [Editing specific versions](#editing-specific-versions)
- [Updating Docusaurus Configs](#updating-docusaurus-configs)
- [Full Documentation](#full-documentation)

# Get Started in 5 Minutes

1. Make sure all the dependencies for the website are installed:

```sh
$ npm install
```
2. Build the Docusaurus website
```sh
$ npm run build
```


3. Run the Docusaurus website locally

```sh
$ npm run serve
```

## Directory Structure

This project structure is a slightly modified version of Docusaurus' auto generated build

```
my-docusaurus/
  docs/
    doc-1.md
    doc-2.md
    doc-3.md
  website/
    node_modules/
    build/
    plugins/
    src/
      css/
      pages/
      theme/
    static/
      img/
    versioned_docs/
    versioned_sidebars/
    docusaurus.config.js
    package.json
    sidebars.json
    versions.json
```

# Editing Content

## Editing an existing docs page

Edit docs by navigating to `docs/` and editing the corresponding document:

`docs/doc-to-be-edited.md`

```markdown
---
id: page-needs-edit
title: This Doc Needs To Be Edited
---

Edit me...
```

For more information about docs, click [here](https://docusaurus.io/docs/en/navigation)

# Adding Content

## Adding a new docs page to an existing sidebar

1. Create the doc as a new markdown file in `/docs`, example `docs/newly-created-doc.md`:

```md
---
id: newly-created-doc
title: This Doc Needs To Be Edited
---

My new content here..
```

1. Refer to that doc's ID in an existing sidebar in `website/sidebar.json`:

```javascript
// Add newly-created-doc to the Getting Started category of docs
 "docs": [
    {
      "type": "category",
      "label": "General",
      "items": [
        "quick_start",
        "boilerplate",
        "making_transfers",
        "originate",
        "set_delegate",
        "smartcontracts"
      ]
    }
    ...
    {
      ...
    }
 ]
```

For more information about adding new docs, click [here](https://docusaurus.io/docs/en/navigation)

## Adding items to your site's top navigation bar

1. Add links to docs, custom pages or external links by editing the headerLinks field of `website/siteConfig.js`:

`website/siteConfig.js`

```javascript
{
  headerLinks: [
    ...
    /* you can add docs */
    { doc: 'my-examples', label: 'Examples' },
    /* you can add custom pages */
    { page: 'help', label: 'Help' },
    /* you can add external links */
    { href: 'https://github.com/facebook/Docusaurus', label: 'GitHub' },
    ...
  ],
  ...
}
```

For more information about the navigation bar, click [here](https://docusaurus.io/docs/en/navigation)

## Adding custom pages

1. Docusaurus uses React components to build pages. The components are saved as .js files in `website/pages/en`:
1. If you want your page to show up in your navigation header, you will need to update `website/siteConfig.js` to add to the `headerLinks` element:

`website/siteConfig.js`

```javascript
{
  headerLinks: [
    ...
    { page: 'my-new-custom-page', label: 'My New Custom Page' },
    ...
  ],
  ...
}
```
For more information about custom pages, click [here](https://docusaurus.io/docs/en/custom-pages).


# Documentation Versioning
## Making versioned copies of the current documentation
Everything under `docs/` is the latest version of our documentation. When writing docs for a release candidate, you can version documents under `docs/` by running:

```
# Generate versioned copy of docs/ under versioned_docs/
npm run docusaurus docs:version {version_number}
```

with `{version_number}` replaced by an actual version (e.g. `11.0.2`, `11.1.0`) 

## Updating `versions.json`

After generating the versioned copy, you will also need to update `versions.json` with the latest version number.

## Editing specific versions
To edit documentation for specific versions, simply only edit the version you want to change under `versioned_docs/`. 

Doing so will only update the version that you just edited and leave everything else as is.

For more information on versioning, click [here](https://docusaurus.io/docs/versioning)

# Updating Docusaurus Configs
`docusaurus.config.js` contains the main configurations needed for the website.

It contains various properties needed to create and customize your website.

API documentation for `docusaurus.config.js` [here](https://docusaurus.io/docs/api/docusaurus-config)

# Full Documentation

Full documentation can be found on the [website](https://docusaurus.io/).
