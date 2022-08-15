---
title: InMemoryViewingKey
author: Roxane Letourneau
---

The `InMemoryViewingKey` class can be instantiated from a viewing or spending key.

### Instantiation from a viewing key:

```js 
import { InMemoryViewingKey } from '@taquito/sapling';
const inMemoryViewingKey = new InMemoryViewingKey(
    '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a'
);
```

### Instantiation from an unencrypted spending key:

```js
import { InMemoryViewingKey } from '@taquito/sapling';

const inMemoryViewingKey = await InMemoryViewingKey.fromSpendingKey(
    'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
)

const viewingKey = inMemoryViewingKey.getFullViewingKey()
```

### Instantiation from an encrypted spending key:

```js
import { InMemoryViewingKey } from '@taquito/sapling';

const inMemoryViewingKey = await InMemoryViewingKey.fromSpendingKey(
    'MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14',
    'test' // password
)

const viewingKey = inMemoryViewingKey.getFullViewingKey()
```

## How to retrieve payment addresses from the viewing key

The `InMemoryViewingKey` class has a method named `getAddress`, allowing to derive addresses (zet) from the viewing key. An index can be specified as a parameter, or the default value `0` will be used.

```js 
import { InMemoryViewingKey } from '@taquito/sapling';
const inMemoryViewingKey = new InMemoryViewingKey(
    '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a'
);

const addressIndex0 = await viewingKeyProvider.getAddress();

/* response is:
{
    address: 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y',
    addressIndex: 0,
} */
```