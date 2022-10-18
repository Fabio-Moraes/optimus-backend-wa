export function FormatName(name = '') {
  const limiter = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  const res = limiter
    .split('')
    .filter((item, index) => index <= 14).join('')
    .concat(limiter.length >= 15 ? '...' : '');
  return res;
}
