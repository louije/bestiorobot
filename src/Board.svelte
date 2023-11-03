<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { soundFileFor } from "@/lib/base";
  import { percentile } from "@/lib/util";
  import Pencil from "@/lib/pencil";
  import Circulator from "@/lib/circulator";
  import cachedTimes from "@/data/times.json";

  import AudioPreloader from "@/lib/audio-preloader";
  import type AudioLibrary from "@/lib/audio-library";

  export let boardName: string;
  export let file: () => Promise<any>;
  export let level: number;

  let dispatch = createEventDispatcher();
  let loadingIteration = 0;

  let root: HTMLElement;
  let boardComponent: any;
  let svg: SVGSVGElement | null;
  let elements: Array<SVGElement>;

  let preloader: AudioPreloader;
  let library: AudioLibrary;

  let times: Record<string, number> = cachedTimes;
  let isDrawing = false;
  let pencilIsOn = true;
  let isDirty = false;
  let pencil: Pencil;
  $: {
    if (pencil) {
      pencil.drawing = isDrawing;
    }
  }
  $: {
    if (pencil) {
      pencil.isOn = pencilIsOn;
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
    
    if (level === 3) {
      pencil = new Pencil(svg, pencilStateSetter, false);
    } else if (level !== 1) {
      pencil = new Pencil(svg, pencilStateSetter);
    }
  }

  function pencilStateSetter(drawing: boolean, on: boolean, dirty: boolean) {
    isDrawing = drawing;
    if (on !== pencilIsOn) {
      pencilIsOn = on;
      dispatch("pencilStateChange", on);
    }
    if (dirty !== isDirty) {
      isDirty = dirty;
      dispatch("dirtyStateChange", dirty);
    }
  }

  export function clearDrawing() {
    pencil.clearDrawing();
  }

  export function togglePencil() {
    pencil.toggle();
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
    let playTime: number;
    const axis = svg!.querySelector<SVGCircleElement>("#AXE circle");
    const fragments = svg!.querySelector<SVGGraphicsElement>("#FRAGMENTS");
    if (!axis || !fragments) {
      return;
    }

    await preloader.isLoaded();
    playTime = library.getMedianPlayTime();
    if (playTime === 0) {
      playTime = times[boardName] || 50;
    }

    circulator = new Circulator(fragments, axis, remotePlayer, playTime);
  }

  async function animateLevelThree() {
    if (!circulator) {
      await setupLevelThree();
    }
    circulator.animate();
  }

  export function playpause() {
    switch(level) {
      case 1:
        playpauseAllSounds();
        break;
      case 3:
        playpauseCirculator();
        break;
      default:
    }
  }
  function playpauseAllSounds() {
    let maxDuration = library.getMaxPlayTime();
    if (isNaN(maxDuration) || maxDuration === 0) {
      maxDuration = times[boardName] || 8;
    }

    root.style.setProperty("--duration", `${maxDuration}s`);

    if (library.isPlaying()) {
      svg?.classList.remove("is-playing");
      library.stopAll();
    } else {
      svg?.classList.add("is-playing");
      library.playAll();
    }
  }
  
  function playpauseCirculator() {
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
      playpauseAllSounds();
    });

    library.stoppedPlayingCallback = () => {
      svg?.classList.remove("is-playing");
    };
  }
  function startOnHoverAndClick() {
    elements.forEach((e) => {
      e.addEventListener("pointerenter", (event: PointerEvent) => {
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
