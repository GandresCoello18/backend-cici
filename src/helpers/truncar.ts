export function truncarDecimal(x: number, posiciones = 0) {
  const s = x.toString();
  const decimalLength = s.indexOf('.') + 1;

  if (decimalLength) {
    const numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }

  return Number(x);
}
