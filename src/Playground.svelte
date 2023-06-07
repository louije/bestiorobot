<script lang="ts">
  import Board from "@/Board.svelte";
  import Buttons from "@/Buttons.svelte";

  export let phrase: string;
  export let file: () => Promise<any>;
  export let level: number | undefined;
  
  let board;
</script>

<main class="u-FullScreen">
  <div class="BoardContainer u-FullScreen">
    <Board phrase={phrase} file={file} level={level} bind:this={board} />
  </div>
  <nav class="MonsterPicker">
    Monster picker
  </nav>
  <nav class="Navigation">
    Bottom navigation
  </nav>
  <div class="ButtonsContainer">
    <Buttons level={level} on:clearDrawing={board.clearDrawing} on:playpauseLevelThree={board.playpauseLevelThree} />
  </div>
</main>

<style>
main {
  display: grid;
  grid-template-areas: "picker .     ."
                       "work   work  work"
                       ".      nav   buttons";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr 1fr 1fr;
}
.BoardContainer {
  grid-row: 1/-1;
  grid-column: 1/-1; 
}
.MonsterPicker {
  grid-area: picker;
  padding: 1rem;
  padding: 3rem;
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
}
.ButtonsContainer {
  grid-area: buttons;
}
</style>