import AudioLibrary from "@/lib/audio-library";
type PreloadPromise = Promise<PromiseSettledResult<undefined>[]>;

export default class AudioPreloader {

  private sounds: { [key: string]: string };
  private retryLimit: number;
  private context: AudioContext;
  private library: AudioLibrary;
  private preloadPromise?: PreloadPromise

  constructor(sounds: { [key: string]: string }, retryLimit = 3) {
    this.sounds = sounds;
    this.retryLimit = retryLimit;
    this.context = new window.AudioContext();
    this.library = new AudioLibrary(this.context);
  }

  private async loadSound(name: string, url: string, retryCount = 0): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.library.addSound(name, await this.context.decodeAudioData(arrayBuffer));
    } catch (error) {
      if (retryCount < this.retryLimit) {
        this.loadSound(name, url, retryCount + 1);
      } else {
        console.error(`Failed to load sound: ${name}`, error);
      }
    }
  }

  public preload(): void {
    const promises = Object.keys(this.sounds).map(name => this.loadSound(name, this.sounds[name]));
    this.preloadPromise = Promise.allSettled(promises) as PreloadPromise;
  }

  public isLoaded(): PreloadPromise {
    return this.preloadPromise || Promise.reject("Preload not started.");
  }

  public getProgress(): number {
    const totalSounds = Object.keys(this.sounds).length;
    const loadedSounds = this.library.getLoadedSounds();
    return loadedSounds / totalSounds;
  }

  public getLibrary(): AudioLibrary {
    return this.library;
  }
}
