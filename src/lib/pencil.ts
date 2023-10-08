import { getSVGCoordinates } from "$lib/util";
type StateSetterFn = (newValue: boolean) => void;

export default class Pencil {
  svg: SVGSVGElement;
  _drawing = false;
  stateSetter: StateSetterFn;
  root!: SVGGElement;
  path?: SVGElement;
  prevX?: number;
  prevY?: number;

  get drawing(): boolean {
    return this._drawing;
  }
  set drawing(newValue: boolean) {
    this._drawing = newValue;
    this.stateSetter(this.drawing);
    if (!this._drawing) {
      this.stopDrawing();
    }
  }

  constructor(svg: SVGSVGElement, stateSetter: StateSetterFn) {
    this.svg = svg;
    this.stateSetter = stateSetter;
    this.createRoot();
    this.addEventListeners();
  }

  createRoot() {
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.root.id = "PENCIL";
    this.svg.appendChild(this.root);
  }

  addEventListeners() {
    document.addEventListener("mousedown", () => { this.drawing = true; });
    document.addEventListener("mouseup", () => { this.drawing = false; });
    this.svg.addEventListener("mousemove", this.mousemove.bind(this));
    this.svg.addEventListener("mouseleave", this.stopDrawing.bind(this));
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

  startDrawing(e: MouseEvent) {
    const point = getSVGCoordinates(e.clientX, e.clientY, this.svg);
    this.prevX = point.x;
    this.prevY = point.y;

    this.path = this.createPath(this.prevX, this.prevY);
    this.root.appendChild(this.path);
  }

  stopDrawing() {
    this.prevX = undefined;
    this.prevY = undefined;
    this.path = undefined;
  }

  clearDrawing() {
    this.root.replaceChildren();
    if (this.drawing) {
      this.stopDrawing();
    }
  }

  mousemove(e: MouseEvent) {
    if (!this.drawing) {
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
