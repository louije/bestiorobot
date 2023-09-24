<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
</script>
{JSON.stringify(data)}
<h1>{@html data.texts?.title}</h1>
<h2>{@html data.texts?.sub}</h2>
