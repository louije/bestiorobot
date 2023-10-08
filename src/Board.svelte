<script lang="ts">
  import { onMount } from "svelte";
  import { soundFileFor } from "@/lib/base";
  import { percentile } from "@/lib/util";
  import Pencil from "@/lib/pencil";
  import Circulator from "@/lib/circulator";
  import cachedTimes from "@/data/times.json";

  export let boardName: string;
  export let file: () => Promise<any>;
  export let level: number;

  let loadingIteration = 0;

  let root: HTMLElement;
  let boardComponent: any;
  let svg: SVGSVGElement | null;
  let elements: Array<SVGElement>;
  let sounds: Array<HTMLAudioElement>;

  let times: Record<string, number> = cachedTimes;
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
    
    if (level !== 1) {
      pencil = new Pencil(svg, setDrawing);
    }
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
    let soundPaths: Array<string> = [];

    sounds = elements.map((e) => {
      const path = soundFileFor(e.id);
      const audio = document.createElement("audio") as HTMLAudioElement;
      audio.src = path;
      audio.id = `audio_${e.id}`;
      // audio.addEventListener("canplaythrough", (e) => {
      // console.log("loaded", e.target, e);
      // });
      audio.hidden = true;
      root.append(audio);
      return audio;
    });
  }

  async function soundsLoaded() {
    const canPlayThroughPromises = sounds.map(
      (audio) =>
        new Promise((resolve, reject) => {
          let i = 0;
          const checkReadyState = () => {
            if (audio.readyState >= 4) {
              resolve(audio);
            } else {
              i++;
              if (i > 20) {
                reject(`loading ${audio.src} took too long.`);
              } else {
                setTimeout(checkReadyState, 100);
              }
            }
          };
          checkReadyState();
        })
    );

    return Promise.allSettled(canPlayThroughPromises)
      .then((loadedAudioElements) =>
        console.log(`All ${loadedAudioElements.length} audio elements can play through`)
      )
      .catch((error) => console.error("Audio loading error:", error));
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

    await soundsLoaded();
    const durations = sounds.map((s) => s.duration).filter((d) => !isNaN(d));
    
    if (durations.length) {
      playTime = percentile(durations, 0.5) * sounds.length; // median
      // playTime = durations.reduce((total, val) => { return total + val }, 0); // average
      // playTime = percentile(durations, 0.75) * sounds.length; // 75% of frags
    } else {
      playTime = times[boardName] || (level === 1) ? 8 : 50;
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
    const maxDuration = Math.max(...sounds.map((s) => s.duration));
    root.style.setProperty("--duration", `${maxDuration}s`);
    if (isPlaying()) {
      svg?.classList.remove("is-playing");
      sounds.forEach((s) => {
        s.pause();
        s.currentTime = 0;
      });
    } else {
      svg?.classList.add("is-playing");
      sounds.forEach((s) => s.play());
    }
  }
  function playpauseCirculator() {
    if (circulator && circulator.animating) {
      circulator.pause();
    } else {
      animateLevelThree();
    }
  }

  function isPlaying(): boolean {
    return sounds.map((s) => s.paused).some((p) => p === false);
  }

  function remotePlayer(fragment: string, command: string = "play") {
    const sound = document.querySelector<HTMLAudioElement>(`#audio_${fragment}`);
    if (!sound) {
      return;
    }
    if (command === "play") {
      sound.play();
    }
    if (command === "pause") {
      sound.pause();
    }
  }

  function toggleAllOnClick() {
    svg?.addEventListener("click", () => {
      playpauseAllSounds();
    });

    sounds.forEach((s) => {
      s.addEventListener("ended", () => {
        if (!isPlaying()) {
          svg?.classList.remove("is-playing");
        }
      });
    });
  }
  function startOnHoverAndClick() {
    elements.forEach((e, i) => {
      // e.addEventListener("click", () => {
      //   sounds[i].play();
      // });
      e.addEventListener("mouseenter", (e: MouseEvent) => {
        if (e.buttons > 0) {
          sounds[i].play();
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
    cursor: url("/pencil.svg") 1 31, url("/pencil.png") 1 31, auto;
  }
</style>
