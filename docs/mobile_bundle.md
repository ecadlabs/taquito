---
title: Taquito in Native Mobile Environments
id: mobile_bundle
author: Davis Sawali
---
# Using Taquito in Mobile environments
Taquito works best in Node runtime applications, but some of our users working in native mobile development might not have access to such features. To accommodate for that, we decided to add a separate pure JS bundle that you can import into your native mobile applications.

Currently the only available bundle is for the `@taquito/local-forging` package.

The bundle wraps functions in the `@taquito/local-forging` package into a single variable called `taquito_local_forging`

## Instructions on using the bundle
To use the JS bundle for your project, download the zip file under `Assets` from your preferred Taquito [release](https://github.com/ecadlabs/taquito/releases).

After that, simply copy the `.js` file and the `.map.js` file into your project.

Example of how to use the `LocalForger` class in a simple HTML script tag:
```
<script type="text/javascript" src="/path/to/taquito_local_forging.js"></script>
<script type="text/javascript">
    var op = {...}
    var forger = new taquito_local_forging.LocalForger();
    var res = forger.forge(op);
</script>
```