<script lang="ts">
  import Board from "@/Board.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<main>
  <Board phrase={data.phrase} file={data.file} level={data.level} />
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
  }
</style>
