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
</script>

<div class="buttons">
  {#if level !== 3 }
    <div class="buttons-group buttons-drawing">
      <button on:click={clearDrawing} class="button clear">🧽</button>
    </div>
  {:else}
    <div class="buttons-group buttons-playpause">
      <button on:click={playpauseLevelThree} class="button play">⏯️</button>
    </div>
  {/if}
</div>

<style>
  
  .buttons {
  }
  .buttons-group {
    display: flex;
    justify-content: flex-end;
  }
  .button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    width: 3rem;
    z-index: 1;

    background: white;
    border-radius: 50%;
    border: 2.5px solid white;
    box-shadow: 0 0 10px rgba(0, 0, 0, .25);
    color: white;
    cursor: pointer;

    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }
  .button + .button {
    margin-left: 1rem;
  }
  .button {
  }
  
</style>