<script lang="ts">
  import type { Data } from "@/lib/finder";
  import Board from "@/Board.svelte";
  import Buttons from "@/Buttons.svelte";
  import BottomNavigation from "@/BottomNavigation.svelte";
  import TopNavigation from "@/TopNavigation.svelte";
  import Info from "@/Info.svelte";
  export let data: Data;

  const phraseData = data.phrase!;
  const boardName = phraseData.boardName!;
  const file = phraseData.file!;
  const monster = phraseData.monster;
  const level = phraseData.level;
  const board = phraseData.board;

  const navigation = data.navigation;
  const helpText = data.texts?.help;

  let infoVisible = false;;
  let boardComponent;
  let dirty = false;
  let pencilIsOn: boolean;

  function showInfo() {
    infoVisible = true;
  }
  function closeInfo() {
    infoVisible = false;;
  }
  function dirtyStateChange(e: CustomEvent<boolean>) {
    dirty = e.detail;
  }
  function pencilStateChange(e: CustomEvent<boolean>) {
    pencilIsOn = e.detail;
  }
</script>

<main class="u-FullScreen">
  <div class="BoardContainer u-FullScreen">
    <Board
      {boardName} {file} {level}
      bind:this={boardComponent}
      on:dirtyStateChange={dirtyStateChange}
      on:pencilStateChange={pencilStateChange}
    />
  </div>
  <nav class="TopNavigation">
    <TopNavigation {monster} {level} {board} />
  </nav>
  <nav class="Navigation">
    {#if navigation}
      <BottomNavigation {navigation} />
    {/if}
  </nav>
  {#if helpText}
    <div class="Info" class:Info--visible={infoVisible}>
      <Info text={helpText} on:closeInfo={closeInfo} />
    </div>
  {/if}
  <div class="ButtonsContainer">
    <Buttons
      {level}
      {dirty}
      {pencilIsOn}
      on:clearDrawing={boardComponent.clearDrawing}
      on:playpause={boardComponent.playpause}
      on:showInfo={showInfo}
      on:togglePencil={boardComponent.togglePencil}
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
  .Info {
    display: none;
  }
  .Info--visible {
    display: block;
  }
</style>
