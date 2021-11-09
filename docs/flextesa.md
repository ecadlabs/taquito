---
title: Using Flextesa with Taquito's Examples, Tests and for local development
author: Kunal Jaiswal
---

## Using Flextesa in a Development Workflow

Flextesa can be used locally with Taquito to run examples, integration tests and dapps. To setup flextesa locally use the following command - 

```
docker run --rm --name my-sandbox --detach -p 8732:20000  tqtezos/flextesa:20210602 flobox start
```

You will have a local tezos sandbox running in a docker container named `my-sandbox`r. The RPC interface is exposed on port `8732`. To view the logs from your sandbox, you can run `docker logs -f my-sandbox`.

To monitor new blocks as they are procduced, you can use the curl command `curl -v http://localhost:8732/monitor/heads/main`

## Setup up the tezos-client to work with your sandbox 

You will need to install `tezos-client` binary to interact with your local flextesa node.

Following command can be used to install this binary on ubuntu based systems:

```
sudo apt install ca-certificates && \
	sudo add-apt-repository -yu ppa:serokell/tezos && \
	sudo apt-get install -y tezos-client
```

The `tezos-client` command defaults to using the node URL `http://localhost:8732`. Before proceeding, check that `tezos-client` configuration is set accordingly by running:

```
tezos-client config show
```

You should see a warning (which you can ignore) and JSON output that looks similar to:

```json
{ "base_dir": "/home/your_username/.tezos-client", "endpoint": "http://localhost:8732",
  "web_port": 8080, "confirmations": 0 }
```

If the `endpoint` value is not set to `http://localhost:8732`, you must correct this.

Once you have your `tezos-client` installed, you need to import the well known Flextesa accounts named `alice` and `bob`. 

Once installed you would need to activate demo accounts in flextesa and fund some keys which are used in Taquito's integration and its companion software called keygen. Note this step is totally optional if developer do not wish to run integration tests or examples given in taquito source code. Following lines can be used to fund these addresses using in taquito examples - 

```sh
tezos-client  import secret key alice unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
```

```sh
tezos-client  import secret key bob unencrypted:edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt
```

You can list all accounts that your `tezos-client` is aware of by running the command:

```sh
tezos-client list known addresses
```

You can also query your sandbox for the balance of each account:

```sh
tezos-client get balance for alice
```

It may be helpful to create a new account for your testing or development workflow. The following set of commands will;

- Generate and add a new unique secret key to your `tezos-client` configuration with the account alias `charlie`
- Show the "Hash" (the Tezos address starting with `tz1`) and the "Public Key" value for your account
- Display the balance for the Charlie account (Should be 0)
- Transfer 1000 Tezos sandbox tokens from the well known Alice account to your new account named "Charlie"
- Display the balance for the Charlie account (Should now be 1000)

```sh
tezos-client gen keys charlie
tezos-client show address charlie
tezos-client get balance for charlie
tezos-client transfer 1000 from alice to charlie --burn-cap 0.06425
tezos-client get balance for charlie
```


## The Tezos key-gen Service

The Taquito integration-tests rely on a service called [tezos-key-gen-api][tezos-key-gen-api] which allows the integration tests to either fetch secrets for pre-funded accounts or to send operations to the key-gen service for signing with a pre-funded account. This service allows the Taquito integration tests to run in parrallel, and thus allowing the entire test-suite to complete faster.

### Running the key-gen service with your local Flextesa sandbox

:::tip
The following instructions assume you have docker-compose installed on your computer.
:::

Clone the tezos-key-gen-api source code to your computer, and change directory into the project folder

```sh
git clone git@github.com:ecadlabs/tezos-key-gen-api.git
cd tezos-key-gen-api
```



The companion software ``keygen`` can be obtained from [Github](https://github.com/ecadlabs/tezos-key-gen-api). Once installed 
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


---
[tezos-key-gen-api]: https://github.com/ecadlabs/tezos-key-gen-api
