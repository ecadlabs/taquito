<script lang="ts">
  import { afterUpdate } from "svelte";
  import store from "../store";
  import type { TestSettings, TestResult } from "../types";
  import { shortenHash } from "../utils";
  import { NetworkType } from "@airgap/beacon-types";
  import { getTzKtUrl } from "../config";
  import { BeaconWallet } from "@taquito/beacon-wallet";

  let test: TestSettings | undefined;
  let executionTime = 0;
  let loading = false;
  let success: boolean | undefined;
  let opHash = "";
  let input = {
    text: "",
    fee: 400,
    storageLimit: 400,
    gasLimit: 1320,
    amount: 0,
    address: "",
    delegate: "",
    stake: 0,
    unstake: 0,
  };
  let testResult: { id: string; title: string; body: any };
  let error: Error | undefined;

  const run = async () => {
    success = undefined;
    loading = true;
    executionTime = 0;
    opHash = "";
    testResult = undefined;
    const t1 = performance.now();
    try {
      let result: TestResult;
      if (
        test.id === "sign-payload" ||
        test.id === "sign-payload-and-send" ||
        test.id === "sign-failingNoop" ||
        test.id === "verify-signature" ||
        test.id === "set-delegate" ||
        test.id === "stake" ||
        test.id === "unstake" ||
        test.id === "send-tez-to-etherlink" ||
        test.id === "set-transaction-limits"
      ) {
        result = await test.run(input);
      } else {
        result = await test.run();
      }
      console.log(result);
      if (result && result.success === true) {
        const t2 = performance.now();
        executionTime = (t2 - t1) / 1_000;
        success = true;
        opHash = result.opHash;
        store.updateTestResult(test.id, true);
        // special output for sign-payload
        if (
          test.id === "sign-payload" ||
          test.id === "sign-payload-and-send" ||
          test.id === "sign-failingNoop" ||
          test.id === "verify-signature"
        ) {
          testResult = {
            id: test.id,
            title: "Signing Result",
            body: {
              input: result.sigDetails.input,
              "formatted input": result.sigDetails.formattedInput,
              bytes: result.sigDetails.bytes,
              output: result.output,
            },
          };
        } else if (test.id === "confirmation-observable") {
          testResult = {
            id: test.id,
            title: "Confirmations through observable",
            body: result.confirmationObsOutput,
          };
        } else if (test.id === "show-public-key") {
          testResult = {
            id: test.id,
            title: "Public Key",
            body: {
              output: result.output
            }
          }
        }
      } else {
        error = result.error;
        throw result.error;
      }
    } catch (error) {
      console.log(error);
      success = false;
      store.updateTestResult(test.id, false);
    } finally {
      loading = false;
    }
  };

  const switchAccount = async () => {
    if ($store.wallet instanceof BeaconWallet) {
      await $store.wallet.clearActiveAccount();
    }
    store.updateUserAddress(undefined);
    store.updateUserBalance(undefined);
    store.updateWallet(undefined);
    store.updateSelectedTest(undefined);
    setTimeout(() => {
      const walletButton = document.getElementById("wallet-button");
      walletButton.click();
    }, 200);
  };

  afterUpdate(() => {
    if ($store.selectedTest && (test === undefined || test.id !== $store.selectedTest)) {
      test = $store.tests.find((test) => test.id === $store.selectedTest);
      success = undefined;
      loading = false;
      executionTime = 0;
      opHash = "";
    }
  });
</script>

<style lang="scss">
  .test-container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    position: relative;

    .testbox {
      background: rgba(255, 255, 255, 0.25);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: white;
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      max-width: 50%;
      max-height: 60%;
      text-align: center;
      overflow: auto;

      .test-title {
        padding: 20px;
        margin: 0px;
      }

      .test-description {
        padding: 20px;
        margin: 0px;
      }

      .test-run {
        padding: 20px;
        margin: 0px;

        #running-icon {
          -webkit-animation: shake-horizontal 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite
            both;
          animation: shake-horizontal 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
        }
      }

      .learn-more {
        font-style: italic;
      }

      .test-result {
        padding: 20px;

        & > div {
          padding: 5px 0px;
        }
      }

      .test-input {
        &.test-limits {
          display: flex;

          input[type="number"] {
            margin-top: 5px;
            transition: 0.5s;

            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
              opacity: 0;
            }

            &:focus {
              border-color: rgba(2, 83, 185, 1);
            }
          }
        }
      }

      @supports not (backdrop-filter: blur(4px)) {
        background: rgba(4, 189, 228, 0.8);
      }
    }
  }

  /* ----------------------------------------------
 * Generated by Animista on 2022-4-21 9:31:8
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

  /**
 * ----------------------------------------
 * animation shake-horizontal
 * ----------------------------------------
 */
  @-webkit-keyframes shake-horizontal {
    0%,
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70% {
      -webkit-transform: translateX(-5px);
      transform: translateX(-5px);
    }
    20%,
    40%,
    60% {
      -webkit-transform: translateX(5px);
      transform: translateX(5px);
    }
    80% {
      -webkit-transform: translateX(5px);
      transform: translateX(5px);
    }
    90% {
      -webkit-transform: translateX(-5px);
      transform: translateX(-5px);
    }
  }
  @keyframes shake-horizontal {
    0%,
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70% {
      -webkit-transform: translateX(-5px);
      transform: translateX(-5px);
    }
    20%,
    40%,
    60% {
      -webkit-transform: translateX(5px);
      transform: translateX(5px);
    }
    80% {
      -webkit-transform: translateX(5px);
      transform: translateX(5px);
    }
    90% {
      -webkit-transform: translateX(-5px);
      transform: translateX(-5px);
    }
  }
</style>

<div class="test-container">
  <div class="testbox">
    {#if !$store.selectedTest}
      Please select a test to run in the left sidebar to start
    {:else if test && test.inputType === "sapling"}
      <h3 class="test-title">{test.name}</h3>
      {#await $store.wallet.getPKH() then pkh}
        {#if pkh === "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"}
          <div class="test-description">{test.description}</div>
          <div class="input-sapling">
            <div class="test-run">
              <button on:click={run} disabled={loading}>
                {#if loading}
                  Running
                  <span class="material-icons-outlined" id="running-icon"> directions_run </span>
                {:else}
                  Run test
                {/if}
              </button>
            </div>
            {#if test.documentation}
              <div class="learn-more">
                <a href={test.documentation} target="_blank" rel="noopener noreferrer"
                  >Learn more about <b>{test.keyword}</b> with Taquito</a
                >
              </div>
            {/if}
          </div>
        {:else}
          <div style="margin-bottom:20px">
            <span>You must be connected with Alice's account to run Sapling tests</span>
            <button on:click={switchAccount}>Switch account</button>
          </div>
        {/if}
      {/await}
    {:else if test && test.inputType !== "sapling"}
      <h3 class="test-title">{test.name}</h3>
      <div class="test-description">{test.description}</div>
      {#if test.inputRequired && test.inputType === "string"}
        <div class="test-input">
          <textarea
            cols="30"
            rows="3"
            placeholder="Enters the payload here"
            bind:value={input.text}
          />
        </div>
      {:else if test.inputRequired && test.inputType === "delegate"}
        <div class="test-input set-delegate">
          <label for="delegate-address">
            <span>Delegate address</span>
            <input type="delegate" id="delegate-address" bind:value={input.delegate} />
          </label>
        </div>
      {:else if test.inputRequired && test.inputType === "stake"}
        <div class="test-input stake">
          <label for="stake-amount">
            <span>Stake amount</span>
            <input type="stake" id="stake-amount" bind:value={input.stake} />
          </label>
        </div>
      {:else if test.inputRequired && test.inputType === "unstake"}
        <div class="test-input unstake">
          <label for="unstake-amount">
            <span>Unstake amount</span>
            <input type="unstake" id="unstake-amount" bind:value={input.unstake} />
          </label>
        </div>
      {:else if test.inputRequired && test.inputType === "etherlink"}
        <div class="test-input test-send-tez-to-etherlink">
          <label for="etherlink-address">
            <span>Etherlink address</span>
            <input type="string" id="etherlink-address" bind:value={input.address} />
          </label>
          <br />
          <br />
          <label for="send-amount">
            <span>amount</span>
            <input type="number" id="send-amount" bind:value={input.amount} />
          </label>
        </div>
      {:else if test.inputRequired && test.inputType === "set-limits"}
        <div class="test-input test-limits">
          <label for="set-limit-fee">
            <span>Fee</span>
            <input type="number" id="set-limit-fee" bind:value={input.fee} />
          </label>
          <label for="set-limit-storage">
            <span>Storage</span>
            <input type="number" id="set-limit-storage" bind:value={input.storageLimit} />
          </label>
          <label for="set-limit-gas">
            <span>Gas</span>
            <input type="number" id="set-limit-gas" bind:value={input.gasLimit} />
          </label>
        </div>
      {/if}
      {#if success}
        <div class="test-result">
          <h4>
            Test successful! <span class="material-icons-outlined"> sentiment_satisfied </span>
          </h4>
          <div>Test run in {executionTime.toLocaleString("en-US")} s</div>
          {#if testResult}
            <div style="word-break:break-word;">
              <p>{testResult.title}</p>
              {#each Object.entries(testResult.body) as [name, res]}
                <p>{name}: {JSON.stringify(res)}</p>
              {/each}
            </div>
          {/if}
          {#if opHash}
            <div style="word-break:break-word;">
              Operation hash:
              {#if $store.networkType === NetworkType.CUSTOM}
                {shortenHash(opHash)}
              {:else}
                <a
                  href={`${getTzKtUrl($store.networkType)}/${opHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenHash(opHash)}
                </a>
              {/if}
            </div>
          {/if}
        </div>
      {:else if success === false}
        <div class="test-result">
          <h4>
            Test failed <span class="material-icons-outlined"> sentiment_very_dissatisfied </span>
          </h4>
          {#if error}
            <div style="word-break:break-word; color:#b92a2a">
              {#if error instanceof Error}
                {error}
              {:else}
                {JSON.stringify(error)}
              {/if}
            </div>
          {/if}
        </div>
      {/if}
      <div class="test-run">
        <button on:click={run} disabled={loading}>
          {#if loading}
            Running
            <span class="material-icons-outlined" id="running-icon"> directions_run </span>
          {:else}
            Run test
          {/if}
        </button>
      </div>
      {#if test.documentation}
        <div class="learn-more">
          <a href={test.documentation} target="_blank" rel="noopener noreferrer"
            >Learn more about <b>{test.keyword}</b> with Taquito</a
          >
        </div>
      {/if}
    {/if}
  </div>
</div>
