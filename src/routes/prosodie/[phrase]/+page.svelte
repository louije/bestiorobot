<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from './$types';
  import { fragmentPath, soundFileFor } from "$lib/base";

  export let data: PageData;
  const phrase = data.phrase;
  const board = data.file;
  let loadingIteration = 0;
  
  // const board = () => import(`../../../phrases/${phrase}.svg`);

  let root: HTMLElement
  let boardComponent: any;
  let svg: SVGSVGElement | null;
  let fragments: Array<SVGPathElement>;
  let sounds: Array<HTMLAudioElement>;
  
  onMount(async () => {
    const module = await board();
    boardComponent = module.default;
    requestAnimationFrame(waitForSVG);
  });
  
  function waitForSVG() {
    svg = root.querySelector("svg");
    if (!svg) {
      loadingIteration += 1;
      if (loadingIteration > 16) { return; }
      return requestAnimationFrame(waitForSVG);
    }
    prosodize();
  }
  
  function prosodize() {
    getFragments();
    loadSounds();
    addEvents();
  }

  function getFragments() {
    if (!svg) { return; }
    const fragmentElements = [...svg.querySelectorAll<SVGPathElement>("#fragments path")];
    fragmentElements.forEach(f => {
      f.id = f.id.replaceAll("_x5F", "");
    });
    fragments = fragmentElements.sort((a: SVGPathElement, b: SVGPathElement) => {
      return getPathX(a) - getPathX(b);
    });
  }
  
  function loadSounds() {
    const [monster, phraseNum, child] = phrase.split("_");
    const useIDs = isNaN(parseInt(child));
    let soundPaths: Array<string> = [];
    
    if (useIDs) {
      soundPaths = fragments.map(f => {
        const id = f.id.replaceAll("_x5F", "");
        return soundFileFor(id);
      });
    } else {
      soundPaths = fragments.map((f, i) => { return fragmentPath(monster, phraseNum, child, i + 1) });
    }
    
    sounds = soundPaths.map((p, idx) => {
      const audio = document.createElement("audio") as HTMLAudioElement;
      audio.src = p;
      audio.id = `audio_${idx}`;
      audio.addEventListener("canplaythrough", (e) => { console.log("loaded", e.target, e); })
      audio.hidden = true;
      root.append(audio);
      return audio;
    });
  }
  
  function addEvents() {
    fragments.forEach((f, i) => {
      f.addEventListener("click", () => {
        console.log(i);
        sounds[i].play();
      });
      f.addEventListener("mouseenter", () => {
        console.log(i);
        sounds[i].play();
      });
    });
  }

  function getPathX(path: Element): number {
    const shape = path.getAttribute("d");
    if (!shape) { return 0; }
    return parseInt(shape.split(",")[0].replace("M", ""));
  }
  
</script>
<main>
  <div class="root" bind:this={root}>
    <svelte:component this={boardComponent} />
  </div>
</main>
<style>
  main {
    width: 50rem;
    height: 31rem;
    margin: 2rem auto;
    display: flex;
  }
  .root {
    display: flex;
    width: 100%;
    height: 100%;
  }
  :global(#grille path) {
    stroke: #F96806;
    stroke-width: 3px;
  }
  :global(#fragments path) {
    cursor: pointer;
    opacity: .8;
  }
  :global(#fragments path:hover) {
    opacity: 1;
  }
</style>