export function computeLength(data: string | Object) {
  if (typeof data === 'object') {
    return Object.keys(data).length;
  } else {
    return 1;
  }
}
