<script lang="ts">
  import type { PageData } from "./$types";
  // import { onMount } from "svelte";
  // import AudioStarter from "./AudioStarter.svelte";

  export let data: PageData;
  
  const levels = Object.keys(data.phrasesPerLevel);
</script>

<main>
  <!-- <AudioStarter> -->
    <div class="root">
      <h1>Tableaux</h1>
      {#each levels as level}
        <h2>Niveau {level}</h2>
        <ul>
          {#each data.phrasesPerLevel[level] as phrase}
            <li><a href="/prosodie/{phrase}">{phrase}</a></li>
          {/each}
        </ul>
      {/each}
    </div>
  <!-- </AudioStarter> -->
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
  margin-bottom: .5rem;
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
