---
title: Client-Side Environments
id: package_bundle
author: Davis Sawali
---
# Using Taquito in Client-Side Environments
While Taquito works best in Node runtime applications, some of our users working in client-side development might not have access to such features. To accommodate for that, we have decided to provide separate pure JavaScript bundles that you can import into your client-side environment.

Currently, the available bundles are `@taquito/local-forging` and `@taquito/beacon-wallet` packages.

The bundle wraps functions from the `@taquito/local-forging` package into a single variable called `taquito_local_forging`, and from the `@taquito/beacon-wallet` package into a single variable called `taquito_beacon_wallet`.

## Instructions for Using the Bundle

To use the JavaScript bundle for your project, download the zip file under `Assets` from your preferred Taquito [release](https://github.com/ecadlabs/taquito/releases).

After that, simply copy the `.js` file and the `.map.js` file into your project.

Example of how to use the `LocalForger` class in a simple HTML script tag:
```html
<script type="text/javascript" src="/path/to/taquito_local_forging.js"></script>
<script type="text/javascript">
    let op = {...}
    let forger = new taquito_local_forging.LocalForger();
    let res = forger.forge(op);
</script>
```
Example of how to use the `BeaconWallet` class in a simple HTML script tag:

```html
<script type="text/javascript" src="/path/to/taquito_beacon_wallet.js"></script>
<script type="text/javascript">
    let op = {...}
    let wallet = new taquito_beacon_wallet.BeaconWallet();
</script>
```