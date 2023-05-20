<script lang="ts">
  import { onMount } from "svelte";
  import { soundFileFor } from "$lib/base";
  import { Pencil } from "$lib/pencil";

  export let phrase: string;
  export let file: () => Promise<any>;
  export let level: number | undefined;
  
  let loadingIteration = 0;

  let root: HTMLElement;
  let boardComponent: any;
  let svg: SVGSVGElement | null;
  let elements: Array<SVGElement>;
  let sounds: Array<HTMLAudioElement>;
  
  let isDrawing: boolean = (level !== 1 && level !== 3);
  let pencil: Pencil;
  $: { if (pencil) { pencil.drawing = isDrawing; }; console.log(isDrawing) }

  onMount(async () => {
    const module = await file();
    boardComponent = module.default;
    console.log("mounting", phrase);
    requestAnimationFrame(waitForSVG);
  });

  function waitForSVG() {
    svg = root.querySelector("svg");
    if (!svg) {
      loadingIteration += 1;
      if (loadingIteration > 16) {
        console.error("Couldn’t load svg file", phrase, file, boardComponent);
        return;
      }
      return requestAnimationFrame(waitForSVG);
    }
    console.log("mounted", phrase, svg);
    setup();
  }

  function setup() {
    if (!svg) return;
    cleanupSVG();
    getElements();
    loadSounds();
    setupInteractions();
    
    pencil = new Pencil(svg, setDrawing);
  }
  
  function setDrawing(newValue: boolean) {
    isDrawing = newValue;
  }

  function cleanupSVG() {
    // do stuff with viewBox, etc.
    const barre = svg?.querySelector("#BARRE");
    if (barre) {
      barre.setAttribute("x1", "0");
      barre.setAttribute("x2", "0");
    }
  }

  function cleanupID(id: string): string {
    return id.replaceAll("_x5F", "").replaceAll("__", "_").replace(/_\d{4,}_$/, "");
  }
  
  function getElements() {
    if (!svg) { return;}
    let query: string;
    switch(level) {
      case 1:
        query = "#FRAGMENTS > g[id]";
        break;
      default:
        query = "#FRAGMENTS path";
        break;
    }
    elements = [...svg.querySelectorAll<SVGGElement>(query)];
    elements.forEach((e) => {
      e.id = cleanupID(e.id);
    });
  }

  function loadSounds() {
    let soundPaths: Array<string> = [];

    soundPaths = elements.map((e) => {
      return soundFileFor(e.id);
    });

    sounds = soundPaths.map((p, idx) => {
      const audio = document.createElement("audio") as HTMLAudioElement;
      audio.src = p;
      audio.id = `audio_${idx}`;
      audio.addEventListener("canplaythrough", (e) => {
        // console.log("loaded", e.target, e);
      });
      audio.hidden = true;
      root.append(audio);
      return audio;
    });
  }

  function setupInteractions() {
    if (level === 1) {
      toggleAllOnClick();
    } else {
      startOnHoverAndClick();
    }
  }
  
  function isPlaying(): boolean {
    return sounds.map(s => s.paused).some(p => p === false);
  }

  function toggleAllOnClick() {  
    svg?.addEventListener("click", () => {
      const maxDuration = Math.max(...sounds.map(s => s.duration));
      root.style.setProperty("--duration", `${maxDuration}s`);
      
      if (isPlaying()) {
        svg?.classList.remove("is-playing");
        sounds.forEach((s) => {
          s.pause();
          s.currentTime = 0;
        });
      } else {
        svg?.classList.add("is-playing");
        sounds.forEach(s => s.play());
      }
    });
    
    sounds.forEach((s) => {
      s.addEventListener("ended", () => {
        if (!isPlaying()) {
          svg?.classList.remove("is-playing");
        }
      });
    })
  }
  function startOnHoverAndClick() {
    elements.forEach((e, i) => {
      e.addEventListener("click", () => {
        console.log(i);
        sounds[i].play();
      });
      e.addEventListener("mouseenter", () => {
        console.log(i);
        sounds[i].play();
      });
    });
  }

  function getPathX(path: Element): number {
    const shape = path.getAttribute("d");
    if (!shape) {
      return 0;
    }
    return parseInt(shape.split(",")[0].replace("M", ""));
  }
  
  function rootClass(): string {
    const levelTag = (level) ? `${level}` : "other";
    return `root level-${levelTag}`;
  }
</script>

<div class={rootClass()} bind:this={root}>
  <svelte:component this={boardComponent} />
  <div class="buttons">
    <div class="buttons-drawing">
      <input type="checkbox" id="is-drawing" bind:checked={isDrawing} hidden>
      <label for="is-drawing">✐</label>
    </div>
  </div>
</div>

<style>
  .root {
    position: relative;
    z-index: 0;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 4rem;
  }
  :global(.root svg) {
    width: 100%;
  }
  :global(#AXE path),
  :global(#BARRE),
  :global(#GRILLE path) {
    stroke-width: 3px;
    stroke-linecap: round;
  }
  :global(#FRAGMENTS path) {
    cursor: pointer;
    opacity: 0.8;
  }
  :global(#FRAGMENTS path:hover) {
    opacity: 1;
  }
  :global(#BARRE) {
    transition: transform .33s linear; 
  }
  :global(.is-playing #BARRE) {
    transform: translateX(100%);
    transition: transform var(--duration) linear;
  }
  :global(.pencil-mark) {
    stroke-width: .75px;
    stroke: #f86806;
    stroke-opacity: .88;
    stroke-linecap: round;
    fill: none;
  }
  
  .buttons {
    position: absolute;
    bottom: 3rem;
    right: 3rem;
    width: 10rem;
    height: 5rem;
  }
  .buttons-drawing label {
    cursor: pointer;
    position: relative;
    z-index: 1;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: 50%;
    background: white;
    border: 2.5px solid #f86806;
    transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    box-shadow: 0 0 10px rgba(0, 0, 0, .25);
  }
  .buttons-drawing :checked + label {
    background: #f86806;
    border: 2.5px solid white;
    color: white;
  }

</style>
