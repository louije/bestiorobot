/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getSVGCoordinates } from "$lib/util";

export default class Circulator {
  center: { x: number; y: number };
  parent: SVGSVGElement;
  elements: Array<SVGPathElement>;
  elementsMap!: Map<number, SVGPathElement>;
  animation!: Animation;
  currentPathId = "";
  currentAngle = 0;
  scratching = false;
  wasAnimating = false;
  lastXY: { x: number; y: number };
  keyframes = { begin: 0, end: -360 };

  constructor(
    public group: SVGGraphicsElement,
    public axis: SVGCircleElement,
    public player: (fragment: string, command?: string) => void,
    public audioLength: number
  ) {
    this.center = this.pathCenter(axis);
    this.elements = <SVGPathElement[]>[...group.children];
    this.parent = this.group.closest("svg")!;

    this.prepareElements();
    this.setupScratchEvents();
    this.computeAngles();

    this.lastXY = { x: this.center.x, y: this.center.y };
  }

  prepareElements() {
    this.group.classList.add("rotor");
    this.group.style.setProperty("--origin", `${this.center.x}px ${this.center.y}px`);
  }

  // Scratching rotation

  setupScratchEvents() {
    const parent = this.group.parentElement!;
    const radius = this.group.getBBox().width / 2;
    const rotationTarget = <SVGCircleElement>this.axis.cloneNode();
    rotationTarget.setAttribute("r", String(radius));
    rotationTarget.setAttribute("fill", "transparent");
    parent.prepend(rotationTarget);

    document.addEventListener("pointerdown", this.startScratching.bind(this));
    document.addEventListener("pointermove", this.scratch.bind(this));
    document.addEventListener("pointerup", this.stopScratching.bind(this));
  }
  startScratching(e: PointerEvent) {
    this.scratching = true;
    if (this.animating) {
      this.animation.effect = null;
      this.wasAnimating = true;
    }
    this.lastXY = getSVGCoordinates(e.offsetX, e.offsetY, this.parent);
    
    this.group.style.transform = `rotate(${0 - this.currentAngle}deg)`;
  }
  scratch(e: PointerEvent) {
    if (!this.scratching) {
      return;
    }
    const { x, y } = getSVGCoordinates(e.offsetX, e.offsetY, this.parent);
    const delta = { x: x - this.lastXY.x, y: y - this.lastXY.y };
    const diameter = this.group.getBBox().width;

    let rotation;
    let direction;

    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      direction = y > diameter / 2.0 ? -1.0 : 1.0;
      rotation = (delta.x / diameter) * 180.0 * direction;
    } else {
      direction = x > diameter / 2.0 ? 1.0 : -0.5;
      rotation = (delta.y / diameter) * 180.0 * direction;
    }
    this.currentAngle += 0 - rotation;
    this.currentAngle %= 360;

    this.lastXY = { x, y };
    this.rotate();
  }

  rotate() {
    this.group.style.transform = `rotate(${0 - this.currentAngle}deg)`;
    this.tick();
  }
  stopScratching() {
    this.scratching = false;
    if (this.wasAnimating) {
      this.wasAnimating = false;
      this.animate();
    }
  }

  // Automatic animation

  get animating(): boolean {
    if (this.animation) {
      return this.animation.playState === "running";
    }
    return false;
  }
  prepareAnimation() {
    this.keyframes.begin = this.currentAngle || 0;
    this.keyframes.end = this.keyframes.begin + 360;
    const keyframes = [
      { transform: `rotate(${0 - this.keyframes.begin}deg)` },
      { transform: `rotate(${0 - this.keyframes.end}deg)` }
    ];
    const animationOptions = {
      duration: this.audioLength * 1000,
      iterations: 1,
      easing: "linear"
    };
    const effect = new KeyframeEffect(this.group, keyframes, animationOptions);
    this.animation = new Animation(effect);
  }
  animate() {
    if (!this.animation || !this.animation.effect) {
      this.prepareAnimation();
    }
    this.animation.play();
    this.tick();
  }
  pause() {
    this.animation.pause();
    this.player(this.currentPathId, "pause");
  }

  tick() {
    let angle;
    if (this.scratching) {
      angle = this.currentAngle;
    } else if (this.animating) {
      const progress = this.animation.effect!.getComputedTiming().progress || 0;
      angle = (progress * 360 + this.keyframes.begin) % 360;
      this.currentAngle = angle;
    } else {
      return;
    }

    const target = this.closest(angle);
    if (!target) {
      return;
    }
    const pathId = target.id;

    if (pathId !== this.currentPathId) {
      this.currentPathId = pathId;
      this.play();
    }

    if (this.animating || this.scratching) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }
  play() {
    this.player(this.currentPathId);
  }

  // angles to fragments

  computeAngles() {
    const map = new Map();
    this.elements.forEach((el) => {
      const { x, y } = this.pathCenter(el);
      const angle = this.calculateAngle(this.center.x, this.center.y, x, y);
      map.set(angle, el);
    });

    this.elementsMap = new Map<number, SVGPathElement>(
      Array.from(map.entries()).sort((a, b) => a[0] - b[0])
    );
  }

  calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radians = Math.atan2(dy, dx) + Math.PI / 2; // have 0 be "north"
    const degrees = radians * (180 / Math.PI);
    return (degrees + 360) % 360;
  }

  closest(targetAngle: number): Element | null {
    const angles = Array.from(this.elementsMap.keys());
    let left = 0;
    let right = angles.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (angles[mid] === targetAngle) return this.elementsMap.get(angles[mid])!;

      if (angles[mid] < targetAngle) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (targetAngle > angles[angles.length - 1]) {
      return null;
    }

    // Check which angle is closer (left or left-1) and return corresponding element
    const leftDist = Math.abs(angles[left] - targetAngle);
    const leftMinusOneDist = left > 0 ? Math.abs(angles[left - 1] - targetAngle) : Infinity;
    const firstAngleDist = Math.abs(angles[0] - targetAngle);
    const lastAngleDist = Math.abs(angles[right] - targetAngle);

    const minDist = Math.min(leftDist, leftMinusOneDist, firstAngleDist, lastAngleDist);

    if (minDist === leftDist) {
      return this.elementsMap.get(angles[left])!;
    } else if (minDist === leftMinusOneDist) {
      return this.elementsMap.get(angles[left - 1])!;
    } else if (minDist === firstAngleDist) {
      return this.elementsMap.get(angles[0])!;
    } else {
      return this.elementsMap.get(angles[right])!;
    }
  }

  pathCenter(path: SVGGraphicsElement): { x: number; y: number } {
    const rect = path.getBBox();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    return { x, y };
  }
}
