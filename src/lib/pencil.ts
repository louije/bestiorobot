export class Pencil {
  svg: SVGSVGElement;
  drawing: Boolean = true;
  stateSetter: Function;
  root?: SVGGElement;
  path?: SVGElement;
  prevX?: number;
  prevY?: number;

  constructor(svg: SVGSVGElement, stateSetter: Function) {
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
  
  getSVGCoordinates(e: MouseEvent) {
    const point = this.svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(this.svg.getScreenCTM()!.inverse());
    return svgPoint;
  }
  
  startDrawing(e: MouseEvent) {
    this.drawing = true;
    this.stateSetter(this.drawing);
    
    const point = this.getSVGCoordinates(e);
    this.prevX = point.x;
    this.prevY = point.y;
    
    this.path = this.createPath(this.prevX, this.prevY);
    this.root!.appendChild(this.path);
  }
  
  stopDrawing() {
    this.prevX = undefined;
    this.prevY = undefined;
    this.path = undefined;
    this.drawing = false;
    this.stateSetter(this.drawing);
  }
  
  mousemove(e: MouseEvent) {
    if (!this.drawing) { return; }
    if (!this.path || !this.prevX || !this.prevY) {
      this.startDrawing(e);
    }
    const d = this.path!.getAttribute("d");
    console.log(e);
    const point = this.getSVGCoordinates(e);
    const newX = point.x;
    const newY = point.y;

    const midX = (this.prevX! + newX) / 2;
    const midY = (this.prevY! + newY) / 2;
    this.path!.setAttribute("d", `${d} Q${this.prevX},${this.prevY} ${midX},${midY}`);
    this.prevX = newX;
    this.prevY = newY;
  }
}