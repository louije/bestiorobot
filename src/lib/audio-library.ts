import { percentile } from "@/lib/util";

export default class AudioLibrary {
  private sounds: { [key: string]: AudioBuffer };
  private context: AudioContext;
  private playingSources: { [key: string]: AudioBufferSourceNode } = {};

  stoppedPlayingCallback?: () => void;

  constructor(context: AudioContext) {
    this.sounds = {};
    this.context = context;
  }

  addSound(name: string, buffer: AudioBuffer): void {
    this.sounds[name] = buffer;
  }

  getSound(name: string): AudioBuffer | undefined {
    return this.sounds[name];
  }

  getLoadedSounds(): number {
    return Object.keys(this.sounds).length;
  }

  getMedianPlayTime(): number {
    const durations = Object.values(this.sounds).map(buffer => buffer.duration);

    // median play time (50th percentile)
    return percentile(durations, 0.5) * durations.length;

    // averaged play time
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  getMaxPlayTime(): number {
    return Math.max(...Object.values(this.sounds).map(buffer => buffer.duration));
  }

  play(name: string): void {
    const source = this.context.createBufferSource();
    const buffer = this.getSound(name);
    if (buffer) {
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);

      // keep track of playing sources so we can query if a sound is playing
      this.playingSources[name] = source;
      source.onended = () => {
        delete this.playingSources[name];
        if (!this.isPlaying()) {
          this.stoppedPlaying();
        }
      }
    }
  }

  playAll(): void {
    Object.keys(this.sounds).forEach(name => this.play(name));
  }

  isPlaying(): boolean {
    return Object.keys(this.playingSources).length > 0;
  }

  stoppedPlaying(): void {
    if (this.stoppedPlayingCallback) {
      this.stoppedPlayingCallback();
    }
  }

  stopAll(): void {
    Object.keys(this.playingSources).forEach(name => {
      this.playingSources[name].stop(0);
    });
    this.playingSources = {};
  }
}
