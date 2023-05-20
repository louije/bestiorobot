export class Pencil {
  svg: SVGSVGElement;
  root: SVGGElement;
  drawing: Boolean = true;
  path: SVGElement;
  prevX: number;
  prevY: number;

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
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
  
  getSVGCoordinates(e: Event) {
    const point = this.svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(this.svg.getScreenCTM().inverse());
    return svgPoint;
  }
  
  startDrawing(e: Event) {
    this.drawing = true;
    const point = this.getSVGCoordinates(e);
    this.prevX = point.x;
    this.prevY = point.y;
    
    this.path = this.createPath(this.prevX, this.prevY);
    this.root.appendChild(this.path);
  }
  
  stopDrawing() {
    this.prevX = null;
    this.prevY = null;
    this.path = null;
    this.drawing = false;
  }
  
  mousemove(e: Event) {
    if (!this.drawing) { return; }
    if (!this.path || !this.prevX || !this.prevY) {
      this.startDrawing(e);
    }
    const d = this.path.getAttribute("d");
    console.log(e);
    const point = this.getSVGCoordinates(e);
    const newX = point.x;
    const newY = point.y;

    const midX = (this.prevX + newX) / 2;
    const midY = (this.prevY + newY) / 2;
    this.path.setAttribute("d", `${d} Q${this.prevX},${this.prevY} ${midX},${midY}`);
    this.prevX = newX;
    this.prevY = newY;
  }
}