---
title: Taquito Utils
author: Davis Sawali
---

## Description
The `@taquito/utils` package provides developers with utility functions in Taquito.

You can find a full list of available utility functions in Taquito [here](https://tezostaquito.io/typedoc/modules/_taquito_utils.html)

## Usage Example
To use the functions, simply import the function you need as such:

```js
import { getPkhfromPk, b58cencode, b58cdecode } from '@taquito/utils';

const publicKeyHash = getPkhfromPk('replace_with_publickey');
const encoded = b58cencode('replace_with_publickey');
```

