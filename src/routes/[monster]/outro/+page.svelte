<script lang="ts">
  import type { PageData } from "./$types";
  import BottomNavigation from "@/BottomNavigation.svelte";
  import MonsterPicker from "@/MonsterPicker.svelte";
  export let data: PageData;
  const navigation = data.navigation || {};
  const monsters = navigation?.monsters || [];
</script>

<main>
  <div class="u-RootScreen u-FullScreen">
    <h1>
      {@html data.texts?.title}
    </h1>
    <MonsterPicker {monsters} />
    <BottomNavigation {navigation} />
  </div>
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  h1 {
    font-size: 2rem;
  }
</style>
