<script lang="ts">
  export let direction: "left" | "down" | "right" = "down";
</script>

<div class="Arrow Arrow--{direction}">
  {#if direction === "down"}
    <img src="/arrow-{direction}.svg" role="presentation" alt="Flèche vers le bas" />
  {:else if direction === "left"}
    <img src="/arrow-{direction}.svg" role="presentation" alt="Flèche vers la gauche" />
  {:else if direction === "right"}
    <img src="/arrow-{direction}.svg" role="presentation" alt="Flèche vers la droite" />
  {/if}
</div>

<style>
  .Arrow {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
  }
  img {
    width: 100%;
    height: auto;
  }
  .Arrow--down {
    width: 1.25rem;
  }
</style>