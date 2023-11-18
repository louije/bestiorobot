<script lang="ts">
  import Arrow from "./Arrow.svelte";
  export let monsters: Array<string> = [];
  export let message: string | undefined = undefined;
</script>


<div class="Picker">
  {#if message}
    <p>{message}</p>
  {/if}
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

<style>
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
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .DNAList {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
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