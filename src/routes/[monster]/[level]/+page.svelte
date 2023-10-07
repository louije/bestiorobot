<script lang="ts">
  import type { PageData } from "./$types";
  import BottomNavigation from "@/BottomNavigation.svelte";
  import TopNavigation from "@/TopNavigation.svelte";
  export let data: PageData;

  const monster = data.phrase!.monster;
  const level = data.phrase!.level;
  const navigation = data.navigation || {};
</script>

<main>
  <div class="u-FullScreen">
    <nav class="TopNavigation">
      <TopNavigation {monster} {level} />
    </nav>
  </div>
  <div class="u-RootScreen u-FullScreen">
    <div class="Question">
      <h1>
        {@html data.texts?.title}
      </h1>
      <p>{@html data.texts?.sub}</p>
    </div>
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
  .TopNavigation {
    position: absolute;
    width: 100%;
  }
  .Question {
    margin: auto 0;
  }
  p {
    margin-top: 2rem;
    text-align: center;
    width: 80%;
  }
</style>
