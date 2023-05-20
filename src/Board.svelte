<script lang="ts">
  import { onMount } from "svelte";
  import { soundFileFor } from "$lib/base";

  export let phrase: string;
  export let file: () => Promise<any>;
  export let level: number;
  
  let loadingIteration = 0;

  let root: HTMLElement;
  let boardComponent: any;
  let svg: SVGSVGElement | null;
  let elements: Array<SVGElement>;
  let sounds: Array<HTMLAudioElement>;

  onMount(async () => {
    const module = await file();
    boardComponent = module.default;
    requestAnimationFrame(waitForSVG);
  });

  function waitForSVG() {
    svg = root.querySelector("svg");
    if (!svg) {
      loadingIteration += 1;
      if (loadingIteration > 16) {
        return;
      }
      return requestAnimationFrame(waitForSVG);
    }
    prosodize();
  }

  function prosodize() {
    cleanupSVG();
    getElements();
    loadSounds();
    addEvents();
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
    elements = [
      ...svg.querySelectorAll<SVGGElement>(query), // weird syntax because the highlighting is off otherwise.
    ];
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

  function addEvents() {
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
</div>

<style>
  .root {
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
  
</style>
