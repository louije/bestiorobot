<script lang="ts">
  import { createEventDispatcher } from "svelte";
  let audioCapable = false;
  let dispatch = createEventDispatcher();

  function startAudio() {
    new AudioContext();
    audioCapable = true;
    dispatch("started");
  }
</script>

<div class="AudioStarter">
  {#if audioCapable}
    <slot />
  {:else}
    <div class="placeholder">
      <button on:click={startAudio} on:keydown={startAudio}>Démarrer !</button>
    </div>
  {/if}
</div>

<style>
  .AudioStarter {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .placeholder {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background-color: cornsilk;
  }
  button {
    background: coral;
    border: none;
    padding: 1.5rem;
    font-size: 3rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  button:active {
    background: darkorange;
  }
</style>
