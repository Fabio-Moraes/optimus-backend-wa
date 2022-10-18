export function GenerateIdentifier(length: number) {
  const dateNow = Date.now();
  const first = Math.random().toString(36).slice(length * -1).toUpperCase();
  const last = String(dateNow).split('').slice(length * -1).join('');
  return `${first.replace(/.{2}/, '$&-')}-${last.replace(/.{2}/, '$&-')}`;
}
