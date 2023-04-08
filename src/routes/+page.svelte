<script lang="ts">
  import type { PageData } from "./$types";
  // import { onMount } from "svelte";
  // import AudioStarter from "./AudioStarter.svelte";

  export let data: PageData;
</script>

<main>
  <!-- <AudioStarter> -->
    <div class="root">
      {#each data.phrases as phrase}
        <a href="/prosodie/{phrase}">{phrase}</a>
      {/each}
    </div>
  <!-- </AudioStarter> -->
</main>

<style>
  main {
    width: 50rem;
    height: 31rem;
    margin: 2rem auto;
    display: flex;
    font-family: sans-serif;
    font-size: 2rem;
  }
  .root {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  a {
    display: block;
  }
  :global(#GRILLE path),
  :global(#grille path) {
    stroke: #f96806;
    stroke-width: 3px;
  }
  :global(#FRAGMENTS path),
  :global(#fragments path) {
    cursor: pointer;
    opacity: 0.8;
    /* fill: #44C17A; */
  }
  :global(#FRAGMENTS path:hover),
  :global(#fragments path:hover) {
    opacity: 1;
  }
</style>
