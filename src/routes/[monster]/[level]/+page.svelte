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
    <div class="u-RootScreen">
      <div class="Question">
        <h1>
          {@html data.texts?.title}
        </h1>
        <p>{@html data.texts?.sub}</p>
      </div>
      <div class="BottomNavigation">
        <BottomNavigation {navigation} />
      </div>
    </div>
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
  .TopNavigation {
    position: absolute;
    width: 100%;
  }
  .BottomNavigation {
    padding-bottom: .75rem;
  }
  .Question {
    margin: auto 0;
    text-align: center;;
  }
  p {
    margin-top: 2rem;
    text-align: center;
  }
</style>
