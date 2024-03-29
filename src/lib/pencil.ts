import { getSVGCoordinates } from "@/lib/util";
type StateSetterFn = (drawing: boolean, on: boolean, dirty: boolean) => void;

export default class Pencil {
  svg: SVGSVGElement;
  _drawing = false;
  stateSetter: StateSetterFn;
  root!: SVGGElement;
  path?: SVGElement;
  prevX?: number;
  prevY?: number;
  isOn = true;
  dirty = false;

  get drawing(): boolean {
    return this._drawing;
  }
  set drawing(newValue: boolean) {
    this._drawing = newValue;
    this.updateState();
    if (!this._drawing) {
      this.stopDrawing();
    }
  }

  constructor(svg: SVGSVGElement, stateSetter: StateSetterFn, on = true) {
    this.svg = svg;
    this.stateSetter = stateSetter;
    this.isOn = on;
    this.createRoot();
    this.addEventListeners();
  }

  createRoot() {
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.root.id = "PENCIL";
    this.svg.appendChild(this.root);
  }

  addEventListeners() {
    document.addEventListener("pointerdown", this.pointerdown.bind(this));

    document.addEventListener("pointerup", this.pointerup.bind(this));

    this.svg.addEventListener("pointermove", this.pointermove.bind(this));

    this.svg.addEventListener("pointerleave", this.stopDrawing.bind(this));
  }

  updateState() {
    this.stateSetter(this.drawing, this.isOn, this.dirty);
  }

  createPath(x: number, y: number) {
    const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    newPath.setAttribute("class", "pencil-mark");
    // newPath.setAttribute("stroke", "black");
    // newPath.setAttribute("stroke-width", "2");
    // newPath.setAttribute("fill", "none");
    newPath.setAttribute("d", `M${x},${y}`);
    return newPath;
  }

  startDrawing(e: PointerEvent) {
    const point = getSVGCoordinates(e.clientX, e.clientY, this.svg);
    this.prevX = point.x;
    this.prevY = point.y;

    this.path = this.createPath(this.prevX, this.prevY);
    this.root.appendChild(this.path);
    this.dirty = true;
    this.updateState
  }

  stopDrawing() {
    this.prevX = undefined;
    this.prevY = undefined;
    this.path = undefined;
  }

  toggle() {
    this.isOn = !this.isOn;
    this.updateState();
  }

  clearDrawing() {
    this.dirty = false;
    this.updateState();
    this.root.replaceChildren();
    if (this.drawing) {
      this.stopDrawing();
    }
  }

  pointerdown(e: PointerEvent) {
    if (!this.isOn) { return; }
    this.drawing = true;
    (e.target as Element).releasePointerCapture(e.pointerId)
  }
  
  pointerup() {
    this.drawing = false;
  }
  
  pointermove(e: PointerEvent) {
    (e.target as Element).releasePointerCapture(e.pointerId)

    if (!this.drawing || !this.isOn) {
      return;
    }
    if (!this.path || !this.prevX || !this.prevY) {
      this.startDrawing(e);
      return;
    }
    const d = this.path.getAttribute("d");
    const point = getSVGCoordinates(e.clientX, e.clientY, this.svg);
    const newX = point.x;
    const newY = point.y;

    const midX = (this.prevX + newX) / 2;
    const midY = (this.prevY + newY) / 2;
    this.path.setAttribute("d", `${d} Q${this.prevX},${this.prevY} ${midX},${midY}`);
    this.prevX = newX;
    this.prevY = newY;
  }
}
