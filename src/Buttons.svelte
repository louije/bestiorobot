<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let level: number;

  const dispatch = createEventDispatcher();

  function clearDrawing() {
    dispatch("clearDrawing");
  }
  function playpauseLevelThree() {
    dispatch("playpauseLevelThree");
  }
  function showInfo() {
    dispatch("showInfo");
  }
</script>

<div class="buttons-group">
  {#if level !== 3}
    <button on:click={clearDrawing} class="button clear">
      <img src="/reset.svg" alt="Effacer les gribouillis" />
    </button>
  {:else}
    <button on:click={playpauseLevelThree} class="button play">
      <img src="/playpause.svg" alt="Jouer / mettre en pause" />
    </button>
  {/if}
  <button on:click={showInfo} class="button info">
    <img src="/info.svg" alt="Afficher les informations" />
  </button>
</div>

<style>
  .buttons-group {
    display: flex;
    justify-content: flex-end;
  }
  .button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    width: 3.5rem;
    z-index: 1;

    background: white;
    border-radius: 50%;
    border: 2.5px solid white;
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.25);
    color: white;
    cursor: pointer;

    transition: box-shadow .25s ease;
  }
  button:hover {
    box-shadow: 4px 8px 10px rgba(0, 0, 0, 0.33);
  }
  .button + .button {
    margin-left: 1rem;
  }
  .button img {
    width: 100%;
    display: block;
  }
</style>
