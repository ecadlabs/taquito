---
title: Liquidity Baking interactions
author: Claude Barde
---

# Liquidity Baking contract and Taquito

The goal of this document is to acquaint yourself with the different values in the storage of the contract as well as its entrypoints and the JavaScript code necessary to interact with them.

## Storage

The storage of the LB contract is made of 5 values:
- __tokenPool__: a value of type `nat` (i.e. a positive number) that represents the amount of tokens (in this case, tzBTC) held by the contract
- __xtzPool__: a value of type `mutez` (i.e. an amount of tez) that represents the amount of XTZ held by the contract
- __lqtTotal__: a value of type `nat` that represents the amount of liquidity tokens (or LB tokens) the contract holds. The LB token is an FA1.2 token that represents a pair consisting of XTZ and tzBTC provided to the contract as liquidity
- __tokenAddress__: a value of type `address` (i.e. the address of an implicit account or a contract) that holds the address to the tzBTC contract
- __lqtAddress__ : a value of type `address` that holds the address of the LB token

## Entrypoints

### Entrypoint parameters and purpose

- [__%default__](https://gitlab.com/dexter2tz/dexter2tz/-/blob/liquidity_baking/dexter.liquidity_baking.mligo#L329): update of the `xtzPool` value when the subsidy is sent to the contract after each block is baked
_Parameters_: no parameter, only the subsidy in tez is sent with the transaction
- [__%tokenToXtz__](https://gitlab.com/dexter2tz/dexter2tz/-/blob/liquidity_baking/dexter.liquidity_baking.mligo#L300): exchange tzBTC for XTZ
  _Parameters_:
    - __to__: the account address that will receive the XTZ amount
    - __tokensSold__: the amount of tzBTC to sell
    - __minXtzBought__: the minimum amount of XTZ expected to be received
    - __deadline__: the expiry time of the transaction
- [__%xtzToToken__](https://gitlab.com/dexter2tz/dexter2tz/-/blob/liquidity_baking/dexter.liquidity_baking.mligo#261): exchange XTZ for tzBTC
  _Parameters_:
    - __to__: the account address that will receive the tzBTC tokens
    - __minTokensBought__: the minimum amount of tzBTC expected to be received
    - __deadline__: the expiry time of the transaction
- [__%tokenToToken__](https://gitlab.com/dexter2tz/dexter2tz/-/blob/liquidity_baking/dexter.liquidity_baking.mligo#L334): used as an intermediary to faciliate the exchange of tzBTC and XTZ between 2 contracts
  _Parameters_:
    - __outputDexterContract__: the contract address to send the tokens to
    - __minTokensBought__: the minimum amount of tzBTC tokens expected to be received
    - __to__: the recipient of the tokens for the transaction sent to the `outputDexterContract` address
    - __tokensSold__: the amount of tokens to be sold
    - __deadline__: the expiry time of the transaction
- [__%addLiquidity__](https://gitlab.com/dexter2tz/dexter2tz/-/blob/liquidity_baking/dexter.liquidity_baking.mligo#L188): provision of XTZ and tzBTC to the contract and minting of LP tokens
  _Parameters_:
    - __owner__: the account address that will be credited with the LP tokens
    - __minLqtMinted__: the minimum amount of LP tokens expected to be minted
    - __maxTokensDeposited__: the maximum amount of tzBTC tokens expected to be withdrawn from the sender's balance
    - __deadline__: the expiry time of the transaction
- [__%removeLiquidity__](https://gitlab.com/dexter2tz/dexter2tz/-/blob/liquidity_baking/dexter.liquidity_baking.mligo#L220): burning of LP tokens and credit of XTZ and tzBTC
  _Parameters_:
    - __to__: the account address that will be credited with XTZ and tzBTC tokens
    - __lqtBurned__: the amount of LP tokens to burn
    - __minXtzWithdrawn__: the minimum amount of XTZ expected to be credited
    - __minTokensWithdrawn__: the minimum amount of tzBTC tokens expected to be credited
    - __deadline__: the expiry time of the transaction

### Interacting with the entrypoints with Taquito
The main friction point of interacting with the LB contract in JavaScript is about simulating the calculations of the expected token outputs Michelson does.

- __%tokenToXtz__:
```ts
import { TezosToolkit } from "@taquito/taquito"

// to take into account the subsidy added to the LB contract
// when the transaction will be baked
const creditSubsidy = (xtzPool: BigNumber | number): BigNumber => {
    const LIQUIDITY_BAKING_SUBSIDY = 2500000;
    if (BigNumber.isBigNumber(xtzPool)) {
      return xtzPool.plus(new BigNumber(LIQUIDITY_BAKING_SUBSIDY));
    } else {
      return new BigNumber(xtzPool).plus(new BigNumber(LIQUIDITY_BAKING_SUBSIDY));
    }
  };

const tokenToXtzXtzOutput = (p: {
    tokenIn: BigNumber | number;
    xtzPool: BigNumber | number;
    tokenPool: BigNumber | number;
  }): BigNumber | null => {
    const { tokenIn, xtzPool: _xtzPool, tokenPool } = p;
    let xtzPool = creditSubsidy(_xtzPool);
    let tokenIn_ = new BigNumber(0);
    let xtzPool_ = new BigNumber(0);
    let tokenPool_ = new BigNumber(0);
    try {
      tokenIn_ = new BigNumber(tokenIn);
      xtzPool_ = new BigNumber(xtzPool);
      tokenPool_ = new BigNumber(tokenPool);
    } catch (err) {
      return null;
    }
    if (
      tokenIn_.isGreaterThan(0) &&
      xtzPool_.isGreaterThan(0) &&
      tokenPool_.isGreaterThan(0)
    ) {
      // Includes 0.1% fee and 0.1% burn calculated separatedly:
      // 999/1000 * 999/1000 = 998001/1000000
      let numerator = new BigNumber(tokenIn)
        .times(new BigNumber(xtzPool))
        .times(new BigNumber(998001));
      let denominator = new BigNumber(tokenPool)
        .times(new BigNumber(1000000))
        .plus(new BigNumber(tokenIn).times(new BigNumber(999000)));
      return numerator.dividedBy(denominator);
    } else {
      return null;
    }
};

const Tezos = new TezosToolkit(RPC_URL);
const lbContract = await Tezos.wallet.at(LB_CONTRACT_ADDRESS);
// the deadline value is arbitrary and can be changed
const deadline = new Date(Date.now() + 60000).toISOString();
const tzBtcContract = await Tezos.wallet.at(TZBTC_ADDRESS);
const tokensSold = AMOUNT_IN_TZBTC;
const minXtzBought = tokenToXtzXtzOutput({
    tokenIn: tokensSold,
    xtzPool,
    tokenPool
  }).toNumber();

let batch =Tezos.wallet.batch()
    .withContractCall(tzBtcContract.methodsObject.approve({ spender: lbContractAddress, value: 0}))
    .withContractCall(
        tzBtcContract.methodsObject.approve({ spender: lbContractAddress, value: tokensSold })
    )
    .withContractCall(
        lbContract.methodsObject.tokenToXtz({
            to: USER_ADDRESS,
            tokensSold,
            minXtzBought,
            deadline
        })
    );
const batchOp = await batch.send();
await batchOp.confirmation();
```

This code sends a transaction to the `%tokenToXtz` entrypoint of the contract to exchange tzBTC tokens for XTZ. After the amount of tzBTC to exchange is provided in the `AMOUNT_IN_TZBTC` variable, the expected output in XTZ is calculated using the `tokenToXtzXtzOutput` function. This value is then stored in the `minXtzBought` variable before being used with the provided amount in tzBTC to forge a transaction and exchange tzBTC tokens for XTZ.

> Note: the different numeric values used for the XTZ and tzBTC amounts, as well as for the XTZ and tzBTC pools are raw values that are not formatted with their decimal point. Be careful not to use formatted values meant for display only that could throw off the results of the calculations.

- __%xtzToToken__:
```ts
import { TezosToolkit, OpKind } from "@taquito/taquito"

// outputs the amount of tzBTC tokens for a given amount of XTZ
const xtzToTokenTokenOutput = (p: {
    xtzIn: BigNumber | number;
    xtzPool: BigNumber | number;
    tokenPool: BigNumber | number;
}): BigNumber | null => {
    let { xtzIn, xtzPool: _xtzPool, tokenPool } = p;

    let xtzPool = creditSubsidy(_xtzPool);
    let xtzIn_ = new BigNumber(0);
    let xtzPool_ = new BigNumber(0);
    let tokenPool_ = new BigNumber(0);
    try {
      xtzIn_ = new BigNumber(xtzIn);
      xtzPool_ = new BigNumber(xtzPool);
      tokenPool_ = new BigNumber(tokenPool);
    } catch (err) {
      return null;
    }
    if (
      xtzIn_.isGreaterThan(0) &&
      xtzPool_.isGreaterThan(0) &&
      tokenPool_.isGreaterThan(0)
    ) {
      // Includes 0.1% fee and 0.1% burn calculated separatedly: 999/1000 * 999/1000 = 998100/1000000
      // (xtzIn_ * tokenPool_ * 999 * 999) / (tokenPool * 1000 - tokenOut * 999 * 999)
      const numerator = xtzIn_.times(tokenPool_).times(new BigNumber(998001));
      const denominator = xtzPool_
        .times(new BigNumber(1000000))
        .plus(xtzIn_.times(new BigNumber(998001)));
      return numerator.dividedBy(denominator);
    } else {
      return null;
    }
  };

const Tezos = new TezosToolkit(RPC_URL);
const lbContract = await Tezos.wallet.at(LB_CONTRACT_ADDRESS);
// the deadline value is arbitrary and can be changed
const deadline = new Date(Date.now() + 60000).toISOString();
const minTokensBought = xtzToTokenTokenOutput({
    xtzIn: xtzAmountInMutez,
    xtzPool,
    tokenPool
  }).toNumber();

const op = await lbContract.methodsObject.xtzToToken({
    to: USER_ADDRESS,
    minTokensBought,
    deadline
}).send();
await op.confirmation();
```

This code sends a transaction to the `%xtzToToken` entrypoint of the contract to exchange XTZ for tzBTC tokens. The `xtzToTokenTokenOutput` function is used to calculate the minimum amount of tzBTC tokens that can be expected when exchanging the given amount of XTZ.

> Note: the `xtzToTokenTokenOutput` uses the `creditSubsidy` function introduced in the previous piece of code.

- __%addLiquidity__:
```ts
import { TezosToolkit, OpKind } from "@taquito/taquito"

const Tezos = new TezosToolkit(RPC_URL);
const lbContract = await Tezos.wallet.at(LB_CONTRACT_ADDRESS);
const tzBtcContract = await Tezos.wallet.at(TZBTC_ADDRESS);
const maxTokensSold = Math.floor(
    AMOUNT_IN_TZBTC + (AMOUNT_IN_TZBTC * slippage) / 100
);
const minLqtMinted = Math.floor((AMOUNT_IN_XTZ * lqtTotal) / xtzPool);
// the deadline value is arbitrary and can be changed
const deadline = new Date(Date.now() + 60000).toISOString();

const batchOp = await Tezos.wallet
.batch([
    {
        kind: OpKind.TRANSACTION,
        ...tzBtcContract.methodsObject
          .approve({ spender: LB_CONTRACT_ADDRESS, value: 0 })
          .toTransferParams()
    },
    {
        kind: OpKind.TRANSACTION,
        ...tzBtcContract.methodsObject
          .approve({ spender: LB_CONTRACT_ADDRESS, value: maxTokensSold })
          .toTransferParams()
    },
    {
        kind: OpKind.TRANSACTION,
        ...lbContract.methodsObject
          .addLiquidity({
            owner: USER_ADDRESS,
            minLqtMinted: minLqtMinted - 3,
            maxTokensDeposited: maxTokensSold,
            deadline
          })
          .toTransferParams(),
        amount: AMOUNT_IN_XTZ,
        mutez: true
    },
    {
        kind: OpKind.TRANSACTION,
        ...tzBtcContract.methodsObject
          .approve({ spender: LB_CONTRACT_ADDRESS, value: 0 })
          .toTransferParams()
        }
])
.send();
await batchOp.confirmation();
```

The `%addLiquidity` entrypoint is probably the most complex one to interact with.
The maximum amount of tzBTC tokens to be sold is calculated using this formula: `AMOUNT_IN_TZBTC + (AMOUNT_IN_TZBTC * slippage) / 100`

- __%removeLiquidity__:
```ts
import { TezosToolkit } from "@taquito/taquito"

const calculateLqtOutput = ({
  lqTokens,
  xtzPool,
  tzbtcPool,
  lqtTotal
}: {
  lqTokens: number;
  xtzPool: number;
  tzbtcPool: number;
  lqtTotal: number;
}): { xtz: number; tzbtc: number } => {
    const xtzOut = (+lqTokens * (xtzPool)) / lqtTotal
    const tzbtcOut = (+lqTokens * (tzbtcPool)) / lqtTotal

    return {
        xtz: xtzOut,
        tzbtc: tzbtcOut
    };
};

const Tezos = new TezosToolkit(RPC_URL);
const lbContract = await Tezos.wallet.at(LB_CONTRACT_ADDRESS);
// the deadline value is arbitrary and can be changed
const deadline = new Date(Date.now() + 60000).toISOString();
const { xtzOut, tzbtcOut } = calculateLqtOutput(
    {
        lqTokens,
        xtzPool,
        tzbtcPool,
        lqtTotal
    }
);

const op = await lbContract.methodsObject
    .removeLiquidity({
        to: USER_ADDRESS,
        lqtBurned: amountInLqt,
        minXtzWithdrawn: xtzOut,
        minTokensWithdrawn: tzBtcOut,
        deadline
    })
    .send();
await op.confirmation();
```

- __%tokenToToken__:
The `%tokenToToken` entrypoint is meant to be used on-chain as an intermediary between 2 contracts. Although it's possible to send a transaction to the entrypoint, its use off-chain is redundant and the same effect can be obtained by calling `%tokenToXtz` followed by `%xtzToToken`.