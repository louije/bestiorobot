<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let text: string;
  const dispatch = createEventDispatcher();

  function closeInfo() {
    dispatch("closeInfo");
  }
</script>

<div class="InfoBox">
  <button class="close" on:click={closeInfo}>
    <img src="/close.svg" alt="Fermer le panneau d’information" />
  </button>
  <p>
    {text}
  </p>
  <button class="close" on:click={closeInfo}>
    <img src="/info.svg" alt="Icône d'information" />
  </button>
</div>

<style>
  .InfoBox {
    background: white;
    padding: 2rem 3.5rem 2.5rem 2rem;
    font-size: 2.5rem;
    font-family: Nunito, sans-serif;
    position: absolute;
    bottom: 0;
    right: 0;
    box-shadow: -5px -5px 10px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 40rem;
    max-height: 75vh;
    overflow: scroll;
    z-index: 10;
    display: flex;
    flex-direction: column;
  }
  p {
    margin: 1rem 0;
  }
  button {
    appearance: none;
    background: transparent;
    border: none;
    margin-left: auto;
    padding: 0;
    align-self: flex-end;
    cursor: pointer;
  }
  img {
    width: 2.5rem;
  }
</style>