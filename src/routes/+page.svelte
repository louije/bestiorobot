<script lang="ts">
  import type { PageData } from "./$types";
  import MonsterPicker from "@/MonsterPicker.svelte";

  export let data: PageData;
  const monsters = data.navigation?.monsters || [];
</script>

<main>
  <div class="u-RootScreen u-FullScreen">
    <h1>
      {@html data.texts?.title}
    </h1>
    <MonsterPicker {monsters} message={data.texts?.sub} />
  </div>
</main>

<style>
  main {
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
