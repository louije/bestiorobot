export function getSVGCoordinates(x: number, y: number, svg: SVGSVGElement) {
  const point = new DOMPoint(x, y);
  const screenCTM = svg.getScreenCTM();
  const invertedMatrix = screenCTM!.inverse();
  const transformedPoint = point.matrixTransform(invertedMatrix);
  const truncatedPoint = new DOMPoint(decimals(transformedPoint.x, 2), decimals(transformedPoint.y, 2));
  return truncatedPoint;
}

function decimals(number: number, places: number): number {
  return Number(number.toFixed(places));
}

export function percentile(values: number[], p = 0.5) {
  const sorted = values.slice().sort((a, b) => a - b);
  const cutOffLow = sorted[Math.floor(sorted.length * p)];
  const cutOffHigh = sorted[Math.ceil(sorted.length * p)];
  if (cutOffLow && cutOffHigh) {
    return (cutOffLow + cutOffHigh) / 2;
  }
  return cutOffLow || cutOffHigh;
}