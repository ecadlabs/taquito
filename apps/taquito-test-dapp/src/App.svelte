<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import { NetworkType } from "@airgap/beacon-sdk";
  import { rpcUrl } from "./config";
  import store from "./store";
  import Layout from "./Layout.svelte";
  import TestContainer from "./lib/TestContainer.svelte";

  // https://ide.ligolang.org/p/RL93C86hftTTCNGU0ykLMw | https://ide.ligolang.org/p/61ENTorA4PSfQg-jhpu0jA
  // https://better-call.dev/florencenet/KT1PzUGbdKaN332Smfd1ExpdKQ7BSzzJRqJ4/operations
  // https://better-call.dev/granadanet/KT1T836HqhBu9waqmknStVDCXu2WogZtzsNz/operations
  // https://better-call.dev/hangzhounet/KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg/operations
  // https://better-call.dev/ithacanet/KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5/operations
  // https://better-call.dev/kathmandunet/KT1BQuSVXWz23iGeXQCrAGR6GcVcqKeE1F7T/operations

  let browser = "";

  const changeNetwork = event => {
    switch (event.target.value) {
      case "mainnet":
        store.updateTezos(new TezosToolkit(rpcUrl.mainnet));
        store.updateNetworkType(NetworkType.MAINNET);
        break;
      case "hangzhounet":
        store.updateTezos(new TezosToolkit(rpcUrl.hangzhounet));
        store.updateNetworkType(NetworkType.HANGZHOUNET);
        break;
      case "ithacanet":
        store.updateTezos(new TezosToolkit(rpcUrl.ithacanet));
        store.updateNetworkType(NetworkType.ITHACANET);
        break;
      case "ghostnet":
        store.updateTezos(new TezosToolkit(rpcUrl.ghostnet));
        store.updateNetworkType(NetworkType.GHOSTNET);
        break;
      case "kathmandunet":
        store.updateTezos(new TezosToolkit(rpcUrl.kathmandunet));
        store.updateNetworkType(NetworkType.KATHMANDUNET);
        break;
      case "custom":
        //TODO: input custom RPC URL
        store.updateNetworkType(NetworkType.CUSTOM);
        break;
    }
  };

  const changeMatrixNode = event => {
    switch (event.target.value) {
      case "default":
        store.updateMatrixNode("beacon-node-1.sky.papers.tech");
        break;
      case "taquito":
        store.updateMatrixNode("matrix.tez.ie");
        break;
      case "custom":
        store.updateMatrixNode("beacon-node-1.sky.papers.tech");
        if (!rpcUrl.custom) {
          // in case the user did not provide any custom network URL
          store.updateTezos(new TezosToolkit(rpcUrl.ghostnet));
        }
        break;
    }
  };

  onMount(() => {
    // detects the browser
    let userAgent = navigator.userAgent;
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browser = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browser = "firefox";
    } else if (userAgent.match(/safari/i)) {
      browser = "safari";
    } else if (userAgent.match(/opr\//i)) {
      browser = "opera";
    } else if (userAgent.match(/edg/i)) {
      browser = "edge";
    } else {
      browser = "";
    }
  });
</script>

<style lang="scss">
  .connect-container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;

    .connect-options {
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
      justify-content: center;
      align-items: center;

      .options {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: center;
        width: 60%;

        & > * {
          margin: 10px 0px;
        }

        button {
          width: 100%;
          justify-content: center;
        }
      }

      @supports not (backdrop-filter: blur(4px)) {
        background: rgba(4, 189, 228, 0.8);
      }
    }
  }
</style>

<Layout>
  {#if $store.userAddress}
    <TestContainer />
  {:else}
    <div class="connect-container">
      <div class="connect-options">
        <h1>Welcome to the Taquito test dapp</h1>
        {#if browser !== "chrome" && browser !== "firefox"}
          <div>(use Chrome for a better experience)</div>
        {/if}
        <div class="options">
          <button
            on:click={() => {
              const wallet = document.getElementById("wallet-button");
              wallet.click();
            }}
          >
            <span class="material-icons-outlined">
              account_balance_wallet
            </span>
            &nbsp; Connect your wallet
          </button>
          <button>
            <span class="material-icons-outlined"> usb </span>
            &nbsp; Connect your Nano ledger
          </button>
          <label for="rpc-node-select">
            <span class="select-title">RPC node:</span>
            <select
              id="rpc-node-select"
              value={$store.networkType}
              on:change={changeNetwork}
              on:blur={changeNetwork}
            >
              {#each Object.keys(NetworkType) as network}
                <option
                  value={network.toLowerCase()}
                  selected={$store.networkType === network.toLowerCase()}
                >
                  {network[0].toUpperCase() + network.toLowerCase().slice(1)}
                </option>
              {/each}
            </select>
          </label>
          <label>
            <span class="select-title">Matrix node:</span>
            <select on:change={changeMatrixNode} on:blur={changeMatrixNode}>
              <option value="default">Default</option>
              <option value="taquito">Taquito</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label>
            <span class="select-title">Disable default events:</span>
            <input
              type="checkbox"
              checked={$store.disableDefaultEvents}
              on:change={() => store.updateDefaultEvents()}
            />
          </label>
        </div>
      </div>
    </div>
  {/if}
</Layout>
