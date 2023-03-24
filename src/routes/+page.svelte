<script lang="ts">
  import { onMount } from "svelte";
  import AudioStarter from "./AudioStarter.svelte";
</script>
<main>
  <AudioStarter>
    <div class="root">
      <a href="/prosodie/GOUR_009_002/">GOUR_009_002</a>
    </div>
  </AudioStarter>
</main>
<style>
  main {
    width: 50rem;
    height: 31rem;
    margin: 2rem auto;
    display: flex;
  }
  .root {
    display: flex;
    width: 100%;
    height: 100%;
  }
  :global(#grille path) {
    stroke: #F96806;
    stroke-width: 3px;
  }
  :global(#fragments path) {
    cursor: pointer;
    opacity: .8;
    fill: #44C17A;
  }
  :global(#fragments path:hover) {
    opacity: 1;
  }
</style>