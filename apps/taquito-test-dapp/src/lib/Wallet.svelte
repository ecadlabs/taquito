<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { fly } from "svelte/transition";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  // import { BeaconEvent, defaultEventCallbacks } from "@airgap/beacon-sdk";
  import { NetworkType } from "@airgap/beacon-sdk";
  import store from "../store";
  import { formatTokenAmount, shortenHash } from "../utils";
  import { defaultMatrixNode, rpcUrl, defaultNetworkType } from "../config";
  import type { TezosAccountAddress } from "../types";

  let showDialog = false;
  let connectedWallet = "";

  const createNewWallet = () => {
    return new BeaconWallet(
      $store.disableDefaultEvents
        ? {
            name: "Taquito Test Dapp",
            matrixNodes: [defaultMatrixNode] as any,
            preferredNetwork: $store.networkType
            // disableDefaultEvents: true // Disable all events / UI. This also disables the pairing alert.
            // eventHandlers: {
            //   // To keep the pairing alert, we have to add the following default event handlers back
            //   [BeaconEvent.PAIR_INIT]: {
            //     handler: defaultEventCallbacks.PAIR_INIT
            //   },
            //   [BeaconEvent.PAIR_SUCCESS]: {
            //     handler: defaultEventCallbacks.PAIR_SUCCESS
            //   }
            // }
          }
        : {
            name: "Taquito Test Dapp",
            matrixNodes: [defaultMatrixNode] as any,
            preferredNetwork: $store.networkType
          }
    );
  };

  const connectWallet = async () => {
    const wallet = (() => {
      if (!$store.wallet) {
        return createNewWallet();
      } else {
        return $store.wallet;
      }
    })();

    try {
      await wallet.requestPermissions({
        network: {
          type: $store.networkType,
          rpcUrl: rpcUrl[$store.networkType]
        }
      });

      const userAddress = (await wallet.getPKH()) as TezosAccountAddress;
      store.updateUserAddress(userAddress);

      const Tezos = new TezosToolkit(rpcUrl[$store.networkType]);
      Tezos.setWalletProvider(wallet);
      store.updateTezos(Tezos);

      const balance = await Tezos.tz.getBalance(userAddress);
      if (balance) {
        store.updateUserBalance(balance.toNumber());
      }

      store.updateWallet(wallet);

      const peers = await wallet.client.getPeers();
      connectedWallet = peers[0].name;
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    await $store.wallet.clearActiveAccount();
    store.updateUserAddress(undefined);
    store.updateUserBalance(undefined);
    store.updateWallet(undefined);
  };

  onMount(async () => {
    store.updateNetworkType(defaultNetworkType);

    const wallet = createNewWallet();
    store.updateWallet(wallet);
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      const userAddress = (await wallet.getPKH()) as TezosAccountAddress;
      store.updateUserAddress(userAddress);

      const Tezos = new TezosToolkit(rpcUrl[$store.networkType]);
      Tezos.setWalletProvider(wallet);
      store.updateTezos(Tezos);

      const balance = await Tezos.tz.getBalance(userAddress);
      if (balance) {
        store.updateUserBalance(balance.toNumber());
      }
    }
  });

  afterUpdate(async () => {
    if ($store.wallet) {
      const activeAccount = await $store.wallet.client.getActiveAccount();
      if (activeAccount) {
        const peers = await $store.wallet.client.getPeers();
        connectedWallet = peers[0].name;
      }
    }
  });
</script>

<style lang="scss">
  #wallet-button {
    background: rgba(80, 227, 194, 0.25);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    justify-content: space-between;

    padding: 10px;
    margin: 10px 0px;

    &:hover {
      color: white;
    }

    @supports not (backdrop-filter: blur(4px)) {
      background: rgba(80, 227, 194, 0.9);
    }
  }

  .wallet-container {
    position: relative;

    .wallet-dialog {
      position: absolute;
      top: 100%;
      left: 40%;
      background-color: rgba(5, 130, 204, 0.9);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: white;
      padding: 20px 30px;
      z-index: 300;
      min-width: 400px;

      .wallet-dialog__title {
        margin-bottom: 20px;
        text-transform: uppercase;
        font-weight: bold;
      }

      .wallet-menu__info {
        & > div {
          margin: 10px 0px;
        }
      }

      .wallet-menu__actions {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: solid 2px white;
      }
    }
  }
</style>

<svelte:window
  on:click={() => {
    if (showDialog === true) {
      showDialog = false;
    }
  }}
/>

{#if $store.userAddress}
  <div class="wallet-container">
    <button
      class="wallet"
      id="wallet-button"
      on:click={() => {
        // this is required to delay the window click that closes the popup
        setTimeout(() => (showDialog = !showDialog), 100);
      }}
    >
      <span>
        <span class="material-icons-outlined"> person_outline </span>
        {shortenHash($store.userAddress)}
      </span>
      <span>
        {#if $store.userBalance}
          {formatTokenAmount($store.userBalance / 10 ** 6)} ꜩ
        {:else}
          0 ꜩ
        {/if}
      </span>
    </button>
    {#if showDialog}
      <div class="wallet-dialog" transition:fly={{ duration: 500, x: -500 }}>
        <div class="wallet-dialog__title">My wallet</div>
        <div class="wallet-menu__info">
          <div>Address: {shortenHash($store.userAddress)}</div>
          <div>
            {#if $store.userBalance}
              Balance: {formatTokenAmount($store.userBalance / 10 ** 6)} ꜩ
            {/if}
          </div>
          <div>
            Connected to: {$store.networkType}
          </div>
          <div>
            Matrix node: {$store.matrixNode}
          </div>
          <div>
            Wallet: {connectedWallet}
          </div>
        </div>
        <div class="wallet-menu__actions">
          <button class="transparent full" on:click={disconnectWallet}>
            <span class="material-icons-outlined">
              account_balance_wallet
            </span>
            &nbsp; Disconnect
          </button>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <button id="wallet-button" on:click={connectWallet}>
    <span class="material-icons-outlined"> person_off </span>
    No wallet connected
  </button>
{/if}
