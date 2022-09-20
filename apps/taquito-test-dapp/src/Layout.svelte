<script lang="ts">
  import Sidebar from "./lib/Sidebar.svelte";
  import TaquitoLogo from "./lib/TaquitoLogo.svelte";
  import store from "./store";
</script>

<style lang="scss">
  .dapp-title {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: white;
    padding: 20px 30px;
    position: absolute;
    top: 20px;
    right: 20px;

    @supports not (backdrop-filter: blur(4px)) {
      background: rgba(4, 189, 228, 0.8);
    }
  }
</style>

<main>
  <div class="dapp-title">
    Taquito Test Dapp {$store.Tezos
      ? `(v${$store.Tezos.getVersionInfo().version})`
      : ""}
  </div>
  <Sidebar />
  <slot />
</main>
<TaquitoLogo dir="normal" />
<TaquitoLogo dir="reverse" />
