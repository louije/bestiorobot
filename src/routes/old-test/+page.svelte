<script lang="ts">
  import AudioStarter from "../AudioStarter.svelte";
  import { fragmentPaths } from "../../lib/base";
  const paths = fragmentPaths("GOUR", 8, 2, 6)
  
  
  function loaded(e: Event) {
    if (!e.target || !(e.target instanceof Element)) {
      return;
    }
    const target: Element = e.target;
    console.log("loaded", target.id);
  }
  
  function enter(e: Event) {
    if (!e.target || !(e.target instanceof HTMLElement)) {
      return;
    }
    const target: HTMLElement = e.target;
    const audioId = target.dataset.audioFragment;
    if (!audioId) {
      return;
    }
    const audio = document.querySelector(audioId);
    if (audio && audio instanceof HTMLAudioElement) {
      audio.play();
    }
  }
</script>

<AudioStarter>
  <div class="grid">
    {#each paths as p, idx}
      <audio src="{p}.aif" id="audio_{idx}" on:canplaythrough={loaded} />
      <div class="frag" data-audio-fragment="#audio_{idx}" on:mouseenter={enter}>{idx + 1}</div>
    {/each}
  </div>
</AudioStarter>

<style>
.grid {
  display: flex;
}
.frag {
  width: 4rem;
  height: 4rem;
  background-color: lightCyan;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: .25rem;
}
</style>