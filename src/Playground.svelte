<script lang="ts">
  import type { Data } from "@/lib/finder";
  import Board from "@/Board.svelte";
  import Buttons from "@/Buttons.svelte";
  import MonsterIndicator from "@/MonsterIndicator.svelte";
  import BottomNavigation from "@/BottomNavigation.svelte";
  import BackButton from "@/BackButton.svelte";
  export let data: Data;

  const phraseData = data.phrase!;
  const boardName = phraseData.boardName;
  const file = phraseData.file;
  const level = phraseData.level;
  const monster = phraseData.monster;

  const navigation = data.navigation;

  let board;
</script>

<main class="u-FullScreen">
  <div class="BoardContainer u-FullScreen">
    <Board {boardName} {file} {level} bind:this={board} />
  </div>
  <nav class="TopNavigation">
    <BackButton />
    <MonsterIndicator currentMonster={monster} currentLevel={level} />
  </nav>
  <nav class="Navigation">
    {#if navigation}
      <BottomNavigation {navigation} />
    {/if}
  </nav>
  <div class="ButtonsContainer">
    <Buttons
      {level}
      on:clearDrawing={board.clearDrawing}
      on:playpauseLevelThree={board.playpauseLevelThree}
    />
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-areas:
      "topnav topnav topnav"
      "work   work   work"
      ".      nav    buttons";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .BoardContainer {
    grid-row: 1/-1;
    grid-column: 1/-1;
  }
  .TopNavigation {
    grid-area: topnav;
    padding: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .Navigation,
  .ButtonsContainer {
    padding: 0 3rem 2rem 3rem;
  }
  .Navigation {
    grid-area: nav;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .ButtonsContainer {
    grid-area: buttons;
  }
</style>
