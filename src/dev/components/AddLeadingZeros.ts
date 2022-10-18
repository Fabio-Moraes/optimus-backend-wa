export function AddLeadingZeros(str: string | number, targetLength: number) {
  return String(str).padStart(targetLength, '0');
}
