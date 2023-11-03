<script lang="ts">
  import { onMount } from "svelte";
  import { soundFileFor } from "@/lib/base";
  import Pencil from "@/lib/pencil";
  import Circulator from "@/lib/circulator";
  import AudioPreloader from "@/lib/audio-preloader";
  import type AudioLibrary from "@/lib/audio-library";

  export let boardName: string;
  export let file: () => Promise<any>;
  export let level: number | undefined;

  let loadingIteration = 0;

  let root: HTMLElement;
  let boardComponent: any;
  let svg: SVGSVGElement | null;
  let elements: Array<SVGElement>;

  let preloader: AudioPreloader;
  let library: AudioLibrary;

  let isDrawing: boolean = false;
  let pencil: Pencil;
  $: {
    if (pencil) {
      pencil.drawing = isDrawing;
    }
  }

  let circulator: Circulator;

  let rootClass: string = "";
  $: {
    const levelTag = level ? `${level}` : "other";
    const drawingTag = isDrawing ? " is-drawing" : "";
    rootClass = `root level-${levelTag}${drawingTag}`;
  }

  onMount(async () => {
    const module = await file();
    boardComponent = module.default;
    requestAnimationFrame(waitForSVG);
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code !== "Space") {
      return;
    }
    isDrawing = !isDrawing;
  }

  function waitForSVG() {
    svg = root.querySelector("svg");
    if (!svg) {
      loadingIteration += 1;
      if (loadingIteration > 16) {
        console.error("Couldn’t load svg file", boardName, file, boardComponent);
        return;
      }
      return requestAnimationFrame(waitForSVG);
    }
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

  export function clearDrawing() {
    pencil.clearDrawing();
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
    return id
      .replaceAll("_x5F", "")
      .replaceAll("__", "_")
      .replace(/_\d{4,}_$/, "");
  }

  function getElements() {
    if (!svg) {
      return;
    }
    let query: string;
    switch (level) {
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
    let soundsAndPaths = elements.reduce((list, e) => {
      const path = soundFileFor(e.id);
      list[e.id] = path;
      return list;
    }, {} as { [key: string]: string });

    preloader = new AudioPreloader(soundsAndPaths);
    library = preloader.getLibrary();
    preloader.preload();
  }

  async function setupInteractions() {
    if (level === 1) {
      toggleAllOnClick();
    } else if (level === 3) {
      await setupLevelThree();
    } else {
      startOnHoverAndClick();
    }
  }

  async function setupLevelThree() {
    const axis = svg!.querySelector<SVGCircleElement>("#AXE circle");
    const fragments = svg!.querySelector<SVGGraphicsElement>("#FRAGMENTS");
    if (!axis || !fragments) {
      return;
    }

    await preloader.isLoaded();
    const playTime = library.getMedianPlayTime();
    circulator = new Circulator(fragments, axis, remotePlayer, playTime);
  }

  async function animateLevelThree() {
    if (!circulator) {
      await setupLevelThree();
    }
    circulator.animate();
  }

  export function playpauseLevelThree() {
    if (circulator && circulator.animating) {
      circulator.pause();
    } else {
      animateLevelThree();
    }
  }

  function remotePlayer(fragment: string, command: string = "play") {
    if (!library.getSound(fragment)) {
      return;
    }
    if (command === "play") {
      library.play(fragment);
    }
    if (command === "pause") {
      library.stopAll();
    }
  }

  function toggleAllOnClick() {
    svg?.addEventListener("click", () => {
      const maxDuration = library.getMaxPlayTime();
      root.style.setProperty("--duration", `${maxDuration}s`);

      if (library.isPlaying()) {
        svg?.classList.remove("is-playing");
        library.stopAll();
      } else {
        svg?.classList.add("is-playing");
        library.playAll();
      }
    });

    library.stoppedPlayingCallback = () => {
      svg?.classList.remove("is-playing");
    };
  }
  function startOnHoverAndClick() {
    elements.forEach((e) => {
      e.addEventListener("mouseenter", (event: MouseEvent) => {
        if (event.buttons > 0) {
          library.play(e.id);
        }
      });
    });
  }
</script>

<!-- <svelte:options accessors /> -->
<svelte:window on:keydown={handleKeyDown} />

<div class={rootClass} bind:this={root}>
  <svelte:component this={boardComponent} />
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
  .root.is-drawing {
    cursor: url("/marker.svg"), url("/marker.png"), auto;
  }
</style>
