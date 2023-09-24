<script lang="ts">
  import type { PageData } from "./$types";
  import Arrow from "@/Arrow.svelte";
  import BottomNavigation from "$/src/BottomNavigation.svelte";
  export let data: PageData;
  const navigation = data.navigation || {};
  const monsters = navigation?.monsters || [];
</script>

<main>
  <div class="root">
    <h1>
      {@html data.texts?.title}
    </h1>
    <div class="Picker">
      <Arrow direction="down" />
      <ul class="DNAList">
        {#each monsters as monster, index}
          <li>
            <a class="MonsterDNA MonsterDNA--{monster}" href="/{monster}">
              <img src="/adn-{index + 1}.svg" alt="ADN du monstre {monster}" />
            </a>
          </li>
        {/each}
      </ul>
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
  .root {
    max-height: 100vh;
    max-width: 33em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  h1 {
    font-size: 2rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  a:any-link {
    color: inherit;
    text-decoration: none;
  }
  .Picker {
    margin-right: 3rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .DNAList {
    display: flex;
    justify-content: center;
  }
  .MonsterDNA {
    display: block;
    padding: 0 .5rem .75rem;
    margin: 0 1rem;
    border-bottom: 3px solid transparent;
    &:hover, &:focus {
      border-bottom: 3px solid black;
    }
  }
  .MonsterDNA img {
    display: block;
    height: 5rem;
    width: 2rem;
    pointer-events: none;
  }
</style>
