<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  const tree = data.phrasesPerMonsterPerLevel;
  const monsters = Object.keys(tree);
</script>

<main>
  <div class="root">
    <h1>
      Dis Bestiorobot,<br>
      quand tu te regardes dans le miroir,
      qu’est-ce que tu vois ?
    </h1>
    <p>Choisis l’ADN du Bestiorobot</p>
    <i class="i-Arrow-Down"></i>
    <ul>
      {#each monsters as monster}
        <li>
          <a href="/{monster}">{monster}</a>
        </li>
      {/each}
  </div>
</main>

<style>
  main {
    padding: 3rem;
    font-family: sans-serif;
    color: #52b378;
    max-width: 30rem;
  }
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #f37516;
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
  li {
    line-height: 1.25rem;
  }
</style>
