export default class Circulator {
  animating: Boolean = false;
  center: { x: number, y: number };
  group: SVGElement;
  elements: Array<SVGElement>;
  elementsMap: Map<number, SVGElement>;
  currentPath: SVGElement;
  currentAngle: number = 0;
  
  constructor(elementsGroup: SVGElement, axis: SVGElement) {
    this.center = this.pathCenter(axis);
    this.group = elementsGroup;
    this.elements = [...elementsGroup.children];
    
    this.prepareAnimation();
    this.computeAngles();
    console.log(0, this.closest(0));
    console.log(20, this.closest(20));
    console.log(350, this.closest(350));
    console.log(270, this.closest(270));
  }
  
  prepareAnimation() {
    this.group.classList.add("rotor");
    this.group.style.setProperty("--origin", `${this.center.x}px ${this.center.y}px`);
  }
  computeAngles() {
    const map = new Map();
    this.elements.forEach(el => {
      const { x, y } = this.pathCenter(el);
      const angle = this.calculateAngle(this.center.x, this.center.y, x, y);
      map.set(angle, el);
    });
    
    this.elementsMap = new Map<number, SVGElement>(
      Array.from(map.entries()).sort((a, b) => a[0] - b[0])
    );

  }
  pathCenter(path: SVGElement): { x: number, y: number } {
    const rect = path.getBBox();
    const x = rect.x + (rect.width / 2);
    const y = rect.y + (rect.height / 2);
    return { x, y };
  }
  calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radians = Math.atan2(dy, dx) + Math.PI / 2; // have 0 be "north"
    const degrees = radians * (180 / Math.PI);
    return (degrees + 360) % 360;
  }
  
  closest(targetAngle: number): Element {
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
}
