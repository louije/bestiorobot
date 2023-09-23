<script lang="ts">
  import Playground from "@/Playground.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;
  const board = data.phrase!;
</script>

<Playground phrase={board.phrase} file={board.file} level={board.level} />
