<script lang="ts">
  export let currentMonster: string;
  export let currentLevel: number;
  export let currentBoard: string | undefined;
  import { monsterColors } from "@/lib/finder";

  let levelAndBoard = "";
  if (currentLevel && currentBoard) {
    levelAndBoard = `${currentLevel}/a`;
  } else if (currentLevel) {
    levelAndBoard = `${currentLevel}`;
  }
</script>

<div class="MonsterIndicator">
  {#each Object.entries(monsterColors) as [monster, colors]}
    <a
      href={`/${monster}/${levelAndBoard}`}
      data-sveltekit-reload
      class="MonsterIndicator__item" style="background-color: {colors.indicator}" class:MonsterIndicator--current={monster === currentMonster ? true : false}
    >
      <span class="MonsterIndicator__name">Monstre {monster}</span>
    </a>
  {/each}
</div>

<style>
.MonsterIndicator {
  display: flex;
  gap: .75rem;
  position: relative;
  align-items: center;
  width: fit-content;
}
.MonsterIndicator__item {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
.MonsterIndicator--current {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 -.25rem;
}
.MonsterIndicator__name {
  display: none;
}
.MonsterIndicator__item:hover .MonsterIndicator__name,
.MonsterIndicator__item:focus .MonsterIndicator__name {
  display: block;
  position: absolute;
  white-space: nowrap;
  text-align: right;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 1rem 0 0;
  color: black;
}

</style>

