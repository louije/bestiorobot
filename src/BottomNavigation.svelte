<script lang="ts">
  import type { BoardNavigation } from "$lib/finder";
  import Arrow from "./Arrow.svelte";
  export let navigation: BoardNavigation;

  const { previous, next, max } = navigation;
  const bullets = (!max || max === 1) ? [] : Array.from(Array(navigation.max));
  const current = navigation.index;
</script>

<nav>
  {#if previous}
    <a class="NavArrow" href={previous} data-sveltekit-reload>
      <Arrow direction="left" />
    </a>
  {/if}
  <div class="Bullets">
    {#each bullets as _, index}
      <i class="Bullet" class:Bullet--current={index === current}></i>
    {/each}
  </div>
  {#if next}
    <a class="NavArrow" href={next} data-sveltekit-reload>
      <Arrow direction="right" />
    </a>
  {/if}
</nav>

<style>
nav {
  display: grid;
  justify-content: center;
  gap: .5rem;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);
}
.NavArrow {
  margin: 0 1rem;
}
.Bullets {
  display: flex;
  justify-content: space-around;
}
.Bullet {
  height: .5rem;
  width: .5rem;
  border-radius: 50%;
  border: 1px solid black;
  background-color: white;
}
.Bullet--current {
  background-color: black;
}
</style>