<script lang="ts">
  import MonsterIndicator from "@/MonsterIndicator.svelte";
  import BackButton from "@/BackButton.svelte";
  export let monster: string;
  export let level: number;
  export let board: string | undefined = undefined;
</script>

<div>
  <BackButton />
  <MonsterIndicator currentMonster={monster} currentLevel={level} currentBoard={board} />
</div>

<style>
  div {
    padding: 2rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>