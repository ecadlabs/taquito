<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { fly } from "svelte/transition";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import store, { SDK } from "../store";
  import { formatTokenAmount, shortenHash } from "../utils";
  import { defaultMatrixNode, getRpcUrl } from "../config";
  import type { TezosAccountAddress } from "../types";
  import { WalletConnect2, PermissionScopeMethods, NetworkType as NetworkTypeWc2 } from "@taquito/wallet-connect-2";
  import { Modals, closeModal, openModal } from "svelte-modals";
  import ModalActivePairing from "./ModalActivePairing.svelte";
  import type { NetworkType as  NetworkTypeBeacon } from "@airgap/beacon-sdk";

  let showDialog = false;
  let connectedWallet = "";

  const selectExistingPairing = (wallet: WalletConnect2, existingPairing: any[]) => {
    openModal(
      ModalActivePairing,
      {
        title: "Select available pairing",
        options: existingPairing,
      },
      {
        on: {
          select: async (event) => {
            closeModal();
            const topic = event.detail === "new_pairing" ? undefined : event.detail.topic;
            await requestPermissionWc2(wallet, topic);
          },
        },
      }
    );
  };

  const createNewBeaconWallet = () => {
    return new BeaconWallet({
      name: "Taquito Test Dapp",
      matrixNodes: [defaultMatrixNode] as any,
      preferredNetwork: $store.networkType as NetworkTypeBeacon,
    });
  };

  const createNewWalletConnect2 = async () => {
    const wallet = await WalletConnect2.init({
      logger: "debug",
      projectId: "861613623da99d7285aaad8279a87ee9", // Your Project ID gives you access to WalletConnect Cloud.
      metadata: {
        name: "Taquito Test Dapp",
        description: "Test Taquito with WalletConnect2",
        icons: [],
        url: "",
      },
    });
    wallet.signClient.on("session_ping", ({ id, topic }) => {
      console.log("session_ping in test dapp", id, topic);
      store.addEvent("session_ping");
    });
    wallet.signClient.on("session_delete", ({ topic }) => {
      console.log("EVENT: session_delete", topic);
      store.addEvent("session_delete");
      if (!wallet.isActiveSession()) {
        resetApp();
      }
    });
    wallet.signClient.on("session_update", async ({ topic }) => {
      console.log("EVENT: session_update", topic);
      store.addEvent("session_update");
      const allAccounts = wallet.getAccounts();
      await updateStore(wallet, allAccounts);
    });
    return wallet;
  };

  const requestPermissionWc2 = async (wallet: WalletConnect2, pairingTopic?: string) => {
    await wallet.requestPermissions({
      permissionScope: {
        networks: [$store.networkType as NetworkTypeWc2],
        events: [],
        methods: [PermissionScopeMethods.TEZOS_SEND, PermissionScopeMethods.TEZOS_SIGN, PermissionScopeMethods.TEZOS_GET_ACCOUNTS],
      },
      pairingTopic,
      registryUrl: "https://www.tezos.help/wcdata/"
    });
    const allAccounts = wallet.getAccounts();
    await updateStore(wallet, allAccounts);
  };

  const connectWalletWithExistingSession = async (sessionId: string) => {
    const newWallet = await createNewWalletConnect2();
    newWallet.configureWithExistingSessionKey(sessionId);
    const allAccounts = newWallet.getAccounts();
    await updateStore(newWallet, allAccounts);
  };

  const connectWallet = async () => {
    if (!$store.wallet) {
      if ($store.sdk === SDK.BEACON) {
        const newWallet = createNewBeaconWallet();
        await newWallet.requestPermissions({
          network: {
            type: $store.networkType as NetworkTypeBeacon,
            rpcUrl: getRpcUrl($store.networkType),
          },
        });

        const peers = await newWallet.client.getPeers();
        connectedWallet = peers[0].name;
        await updateStore(newWallet);
      } else if ($store.sdk === SDK.WC2) {
        const newWallet = await createNewWalletConnect2();
        const existingPairing = newWallet.getAvailablePairing();
        if (existingPairing.length > 0) {
          selectExistingPairing(newWallet, existingPairing);
        } else {
          await requestPermissionWc2(newWallet);
        }
      }
    } else {
      return $store.wallet;
    }
  };

  const updateUserBalance = async (userAddress: string) => {
    const balance = await $store.Tezos!.tz.getBalance(userAddress);
    if (balance) {
      store.updateUserBalance(balance.toNumber());
    }
  };

  const updateStore = async (wallet: BeaconWallet | WalletConnect2, allAccounts?: string[]) => {
    try {
      store.updateWallet(wallet);
      let userAddress: TezosAccountAddress;
      if (allAccounts) {
        if (allAccounts.length > 1) {
          userAddress = allAccounts.shift() as TezosAccountAddress;
          store.updateAvailableAccounts(allAccounts);
        } else {
          store.updateAvailableAccounts([]);
          userAddress = allAccounts[0] as TezosAccountAddress;
        }
      } else {
        userAddress = (await wallet.getPKH()) as TezosAccountAddress;
      }
      store.updateUserAddress(userAddress);
      if (wallet instanceof WalletConnect2) {
        wallet.setActiveAccount(userAddress);
        wallet.setActiveNetwork($store.networkType as any);
      }

      const Tezos = new TezosToolkit(getRpcUrl($store.networkType));
      Tezos.setWalletProvider(wallet);
      store.updateTezos(Tezos);

      await updateUserBalance(userAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const resetApp = async () => {
    store.updateUserAddress(undefined);
    store.updateUserBalance(undefined);
    store.updateWallet(undefined);
    store.updateSelectedTest(undefined);
    store.updateTests([]);
    store.updateAvailableAccounts([]);
  };

  const disconnectWallet = async () => {
    if ($store.wallet instanceof BeaconWallet) {
      await $store.wallet.clearActiveAccount();
    } else if ($store.wallet instanceof WalletConnect2) {
      await $store.wallet.disconnect();
    }
    resetApp();
  };

  const switchActiveAccount = (newActiveAccount: string) => {
    const currentPkh = $store.userAddress;
    const availablePkh = $store.availableAccounts;
    const index = availablePkh!.indexOf(newActiveAccount, 0);
    if (index > -1) {
      availablePkh!.splice(index, 1);
    }
    availablePkh!.push(currentPkh!);
    store.updateAvailableAccounts(availablePkh!);
    store.updateUserAddress(newActiveAccount);
    if ($store.wallet instanceof WalletConnect2) {
      $store.wallet.setActiveAccount(newActiveAccount);
    }
    updateUserBalance(newActiveAccount);
  };

  onMount(async () => {
    console.log("onmount wallet", $store);
    if (
      window &&
      window.localStorage &&
      window.localStorage["wc@2:client:0.3//session"] &&
      window.localStorage["wc@2:client:0.3//session"] !== "[]"
    ) {
      const sessions = JSON.parse(window.localStorage["wc@2:client:0.3//session"]);
      const lastSession = sessions[sessions.length - 1].topic;
      store.updateSdk(SDK.WC2);
      await connectWalletWithExistingSession(lastSession);
    } else {
      await connectWallet();
    }
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
      connectedWallet = $store.wallet.getPeerMetadata().name;
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
        <div>
          {#if $store.availableAccounts}
            <br />
            <div class="wallet-dialog__title">Switch account</div>
            {#each $store.availableAccounts as pkh}
              <button
                on:click={() => {
                  switchActiveAccount(pkh);
                }}>{pkh}</button
              >
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <Modals />
  <button id="wallet-button" on:click={connectWallet}>
    <span class="material-icons-outlined"> person_off </span>
    No wallet connected
  </button>
{/if}