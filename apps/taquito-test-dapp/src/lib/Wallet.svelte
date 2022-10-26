<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { fly } from "svelte/transition";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import store, { SDK } from "../store";
  import { formatTokenAmount, shortenHash } from "../utils";
  import { defaultMatrixNode, rpcUrl, defaultNetworkType } from "../config";
  import type { TezosAccountAddress } from "../types";
  import { WalletConnect2 } from "@taquito/wallet-connect";

  let showDialog = false;
  let connectedWallet = "";

  const createNewBeaconWallet = () => {
    return new BeaconWallet(
      $store.disableDefaultEvents
        ? {
            name: "Taquito Test Dapp",
            matrixNodes: [defaultMatrixNode] as any,
            preferredNetwork: $store.networkType,
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
            preferredNetwork: $store.networkType,
          }
    );
  };

  const createNewWalletConnect2 = async () => {
    return WalletConnect2.init({
      logger: "debug",
      relayUrl: "wss://relay.walletconnect.com",
      projectId: "861613623da99d7285aaad8279a87ee9", // Your Project ID gives you access to WalletConnect Cloud.
      metadata: {
        name: "Taquito Test Dapp",
        description: "Test Taquito with WalletConnect2",
        icons: [],
        url: "",
      },
    });
  };

  const connectWallet = async () => {
    if (!$store.wallet) {
      if ($store.sdk === SDK.BEACON) {
        console.log("create BeaconWallet");
        const newWallet = createNewBeaconWallet();
        await newWallet.requestPermissions({
          network: {
            type: $store.networkType,
            rpcUrl: rpcUrl[$store.networkType],
          },
        });

        const peers = await newWallet.client.getPeers();
        connectedWallet = peers[0].name;
        await updateStore(newWallet);
        return newWallet;
      } else if ($store.sdk === SDK.WC2) {
        console.log("create walletConnect2");
        const newWallet = await createNewWalletConnect2();
        await newWallet.requestPermissions({
          requiredNamespaces: {
            tezos: {
              chains: [`tezos:${$store.networkType}`],
              events: [],
              methods: ["tezos_sendOperations"],
            },
          },
        });
        await updateStore(newWallet);
        return newWallet;
      }
    } else {
      return $store.wallet;
    }
  };

  const updateStore = async (wallet: BeaconWallet | WalletConnect2) => {
    try {
      store.updateWallet(wallet);
      const userAddress = (await wallet.getPKH()) as TezosAccountAddress;
      store.updateUserAddress(userAddress);

      const Tezos = new TezosToolkit(rpcUrl[$store.networkType]);
      Tezos.setWalletProvider(wallet);
      store.updateTezos(Tezos);

      const balance = await Tezos.tz.getBalance(userAddress);
      if (balance) {
        store.updateUserBalance(balance.toNumber());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    if ($store.wallet instanceof BeaconWallet) { 
      await $store.wallet.clearActiveAccount();
    }
    // TODO disconnect wc2
    store.updateUserAddress(undefined);
    store.updateUserBalance(undefined);
    store.updateWallet(undefined);
    store.updateSelectedTest(undefined);
  };

  onMount(async () => {
    await connectWallet();
  });

  afterUpdate(async () => {
    if ($store.wallet instanceof BeaconWallet) {
      const activeAccount = await $store.wallet.client.getActiveAccount();
      if (activeAccount) {
        const peers = await $store.wallet.client.getPeers();
        if (peers && Array.isArray(peers) && peers.length > 0) {
          connectedWallet = peers[0].name;
        }
      }
    } else if ($store.wallet instanceof WalletConnect2) {
      // TODO wc2
      connectedWallet = ''
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
          {#if $store.wallet instanceof BeaconWallet}
          <div>
            Matrix node: {$store.matrixNode}
          </div>
          {/if}
          <div>
            Wallet: {connectedWallet}
          </div>
        </div>
        <div class="wallet-menu__actions">
          <button class="transparent full" on:click={disconnectWallet}>
            <span class="material-icons-outlined"> account_balance_wallet </span>
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
