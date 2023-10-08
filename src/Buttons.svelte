<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let level: number;
  export let dirty: boolean;
  export let pencilIsOn: boolean

  const dispatch = createEventDispatcher();

  function clearDrawing() {
    dispatch("clearDrawing");
  }
  function playpause() {
    dispatch("playpause");
  }
  function showInfo() {
    dispatch("showInfo");
  }
  function togglePencil() {
    dispatch("togglePencil");
  }
</script>

<div class="buttons-group">
  {#if dirty}
    <button on:click={clearDrawing} class="button clear">
      <img src="/reset.svg" alt="Effacer les gribouillis" />
    </button>
  {/if}
  {#if level === 3}
    <button on:click={togglePencil} class="button pencil" class:button--active={pencilIsOn}>
      <img src="/pencil.svg" alt="Dessiner" />
    </button>
  {/if}
  {#if level === 1 || level === 3}
    <button on:click={playpause} class="button play">
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
  }
  .button:hover {
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.33);
  }
  .button:active {
    top: 2px;
    left: 2px;
    box-shadow: 2px 4px 2.5px rgba(0, 0, 0, 0.25);
  }
  .button--active {
    border: 2px solid white;
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.25), 0 0 0 2px orange;
  }
  .button--active:hover {
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.33), 0 0 0 2px orange;
  }
  .button--active:active {
    box-shadow: 2px 4px 2.5px rgba(0, 0, 0, 0.25), 0 0 0 2px orange;
  }
  .button + .button {
    margin-left: 1rem;
  }
  .button img {
    width: 100%;
    display: block;
  }
</style>
