---
title: Flextesa Support
author: Kunal Jaiswal
---

## Using Flextesa in Development Workflow

Flextesa can be used locally with Taquito to run examples, integration tests and dapps. To setup flextesa locally use the following command - 

```
docker run --rm --name my-sandbox --detach -p 8732:20000  tqtezos/flextesa:20210602 flobox start
```

## Tezos client 

You will need ``tezos-client`` binary to interact with your local flextesa node. Following command can be used to install this binary on ubuntu based machines -

```
sudo apt install ca-certificates && sudo add-apt-repository -yu ppa:serokell/tezos && sudo apt-get install -y tezos-client
```

Once installed you would need to activate demo accounts in flextesa and fund some keys which are used in Taquito's integration and its companion software called keygen. Note this step is totally optional if developer do not wish to run integration tests or examples given in taquito source code. Following lines can be used to fund these addresses using in taquito examples - 

```
tezos-client -A flextesa_sandbox_${{ env.UUID }} -P ${{ env.FLEXTESA_PORT_TWO }} import secret key alice unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq --force
```
```
tezos-client -A flextesa_sandbox_${{ env.UUID }} -P ${{ env.FLEXTESA_PORT_TWO }} import secret key bob unencrypted:edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt --force    
```
```
tezos-client -A flextesa_sandbox_${{ env.UUID }} -P ${{ env.FLEXTESA_PORT_TWO }} transfer 1990000 from bob to tz1Rb18fBaZxkzDgFGAbcBZzxLCYdxyLryVX --burn-cap 0.06425
```
```
tezos-client -A flextesa_sandbox_${{ env.UUID }} -P ${{ env.FLEXTESA_PORT_TWO }} transfer 1700000 from alice to tz1Rb18fBaZxkzDgFGAbcBZzxLCYdxyLryVX --burn-cap 0.06425
```
```
tezos-client -A flextesa_sandbox_${{ env.UUID }} -P ${{ env.FLEXTESA_PORT_TWO }} transfer 100000 from alice to tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys --burn-cap 0.06425
```
```
tezos-client -A flextesa_sandbox_${{ env.UUID }} -P ${{ env.FLEXTESA_PORT_TWO }} transfer 100000 from alice to tz1ioFRium9QWhYeu49zoAw2Z4HYCHRgrF9f --burn-cap 0.06425  
```
## Keygen

The companion software ``keygen`` can obe obtained from [Github](https://github.com/ecadlabs/tezos-key-gen-api). Once installed 
``pools-config.json`` file need to be edited to accomodate developer's flextesa node name in ``rpcUrl`` section of the config. Once installed and built, keygen can be used to bring up docker images for redis and signatory.

```
docker-compose up
```

## Signatory and Redis

Signatory is used by keygen to sign transactions while generating keys used in integration tests and Redis is used as a in-memory database to hold those keys and query them later on.

## Integration tests and Example code for Decentralised applications

Taquito provides examples and integration tests for developers to use as starting point for their dapps. It is helpful to make state of keygen ready before executing integration tests in a dapp's workflow. To do this keygen needs to be queried for a new key in both its normal (holds new keys) and ephemeral pools (hold new keys but also re-uses those). This can be done using simple curl script.

```
curl --location --request POST 'http://${{ env.RUNNER_NAME }}:3000/flextesanet' --header 'Authorization: Bearer taquito-example'
curl --location --request POST 'http://${{ env.RUNNER_NAME }}:3000/flextesanet/ephemeral' --header 'Authorization: Bearer taquito-example'
```
Once queried keygen would now hold keys for your dapp in its redis database. This is helpful in running integration tests, but before doing that taquito's tests need sample contracts to be generated in flextesa node and their addresses set it in ``config.ts`` file of integration-tests package. Sample script in ``flextesa-setup`` package does that for you. It generates a ``known contract``, ``known big map contract``, ``lambda address`` and ``TZip12 address`` on flextesa and sets these along with ``protocol`` and ``baker`` from your local flextesa node.

Once this setup is done, integration tests can be run using -

```
npm run test:sandbox
```

in integration-tests package. We run a Github workflow with flextesa using the steps provided in this doc. The same worfflow file can be found at ``.github/workflows/main_flextesa.yml``.


