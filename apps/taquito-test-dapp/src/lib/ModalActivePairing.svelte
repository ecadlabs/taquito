<script>
  import { createModalEventDispatcher } from "svelte-modals";

  export let isOpen;
  export let title;
  export let options;

  const dispatch = createModalEventDispatcher();
</script>

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }
  .button {
    color: black;
    border-color: black;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }

  p {
    text-align: center;
    margin-top: 16px;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }
</style>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>{title}</h2>
      <div class="actions">
        {#each options as option}
          <button class="button" on:click={() => dispatch("select", option)}>
            {option.peerMetadata.logo ?? ""}
            {option.peerMetadata.name}
          </button>
        {/each}
        <p>or</p>
        <button class="button" on:click={() => dispatch("select", "new_pairing")}
          >New Pairing</button
        >
      </div>
    </div>
  </div>
{/if}