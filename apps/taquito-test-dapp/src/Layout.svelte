<script lang="ts">
  import Sidebar from "./lib/Sidebar.svelte";
  import store from "./store";
  let side: Sidebar;

  export const getSideBar = () => side;
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
  .events-container {
    grid-column: 1 / 3;
    height: calc(25vh);
    ul {
      overflow-y: scroll;
      background-color: skyblue;
      height: 100%;
    }
    > span {
      color: white;
      font-weight: bold;
      font-size: larger;
    }
  }
</style>

<main>
  <div class="dapp-title">
    Taquito Test Dapp {$store.Tezos
      ? `(v${$store.Tezos.getVersionInfo().version})`
      : ""}
  </div>
  <Sidebar bind:this={side}/>
  <slot />
  <div class="events-container">
    <span>Events ({$store.eventLogs.length}):</span> <button on:click={store.clearEvents} style="display: inline;">clear</button>
    <ul>
      {#each $store.eventLogs as event}
        <li>
          <span class="material-icons-outlined"> event_note </span>
          <span>{event}</span>
        </li>
      {/each}
    </ul>
  </div>  
</main>
