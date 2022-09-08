<script lang="ts">
  import { afterUpdate } from "svelte";
  import { init, list } from "../tests";
  import store from "../store";
  import Wallet from "./Wallet.svelte";
  import { contractAddress } from "../config";

  afterUpdate(async () => {
    if ($store.Tezos && $store.wallet && $store.tests.length === 0) {
      const contract = await $store.Tezos.wallet.at(
        contractAddress[$store.networkType]
      );
      const tests = init($store.Tezos, contract, $store.wallet);
      store.updateTests(tests);
    }
  });
</script>

<style lang="scss">
  section {
    padding: 10px;
    height: calc(100vh - 20px);
    color: white;
    display: grid;
    grid-template-rows: 8% 5% 87%;
    position: relative;
    z-index: 100;

    .title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    h4 {
      text-align: center;
      padding: 0px;
      margin: 0px;
    }

    ul {
      height: 95%;
      list-style-image: url(description_white_24dp.svg);
      list-style-position: inside;
      overflow: auto;
      margin-left: 0px;
      margin-bottom: 50px;
      padding: 5px 5px;

      &::-webkit-scrollbar {
        display: none;
      }

      li {
        background: rgba(80, 227, 194, 0.25);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        list-style-image: url(description_white_24dp.svg);

        padding: 10px;
        margin: 10px 0px;

        span {
          line-height: 30px;
          height: 30px;
          vertical-align: top;
        }

        &.selected {
          list-style-image: url(description_blue_24dp.svg);
        }
        &.success {
          list-style-image: url(description_green_24dp.svg);
        }
        &.error {
          list-style-image: url(description_red_24dp.svg);
        }

        @supports not (backdrop-filter: blur(4px)) {
          background: rgba(80, 227, 194, 0.9);
        }
      }
    }
  }
</style>

<section>
  <Wallet />
  <div class="title">
    <h4>Available tests ({list.length})</h4>
  </div>
  <ul>
    {#if $store.tests.length === 0}
      {#each list as test}
        <li style="cursor:not-allowed">
          <span>{test}</span>
        </li>
      {/each}
    {:else}
      {#each $store.tests as test}
        <li
          id={test.id}
          style={$store.userAddress ? "cursor:pointer" : "cursor:not-allowed"}
          class:success={test.lastResult.option === "some" &&
            test.lastResult.val}
          class:error={test.lastResult.option === "some" &&
            !test.lastResult.val}
          class:selected={$store.selectedTest === test.id &&
            test.lastResult.option === "none"}
          on:click={() => store.updateSelectedTest(test.id)}
        >
          <span>{test.name}</span>
        </li>
      {/each}
    {/if}
  </ul>
</section>
