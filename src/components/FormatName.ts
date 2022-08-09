export function FormatName(name: string) {
  const limiter = name
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  const res = limiter
    .split('')
    .filter((item, index) => index <= 14).join('')
    .concat(limiter.length >= 15 ? '...' : '');
  return res;
}
