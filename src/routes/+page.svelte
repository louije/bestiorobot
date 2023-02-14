<script>
  import { setupTree, Journey } from "../lib/tree";
  
  const tree = setupTree(7, 6);
  let journey = new Journey(tree);
  
  $: coords = journey.path.coordinates.join(" -> ");
  $: children = journey.children;
  
  function up() {
    try {
      journey.up(1);
    } catch(e) {}
    react();
  }
  function left() {
    try {
      journey.left(1);
    } catch(e) {}
    react();
  }
  function right() {
    try {
      journey.right(1);
    } catch(e) {}
    react();
  }
  function down(idx = 0) {
    try {
      journey.down(idx);
    } catch(e) {}
    react();
  }
  function react() {
    journey = journey;
  }
</script>

<p>You are here:</p>

<div class="buttons">
  <button on:click={up}>up</button>
  <button on:click={left}>left</button>
  <button on:click={right}>right</button>
  {#each children as _, i}
    <button on:click={() => down(i)}>down {i}</button>
  {/each}
  <span>{coords}</span>
</div>

<style>
.buttons {
  display: grid;
  grid-template-columns: repeat(6, 7rem);
  grid-template-rows: repeat(3, 2rem);
}
.buttons span {
  grid-row: 2;
  grid-column: 2/-2;
  text-align: center;
  align-self: center;
}
button:nth-child(1) {
  grid-row: 1;
  grid-column: 1/-1;
}
button:nth-child(2) {
  grid-row: 2;
  grid-column: 1;
}
button:nth-child(3) {
  grid-row: 2;
  grid-column: -2;
}
button:nth-child(n + 4) {
  grid-row: 3;
}
</style>