// Clamp a string to a maximum length. If the string exceeds the limit it is truncated.
export function clampLen(s: string, max = 7000) {
  return s.length > max ? s.slice(0, max) : s;
}