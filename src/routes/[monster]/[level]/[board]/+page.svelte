<script lang="ts">
  import Playground from "@/Playground.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<Playground {data} />
