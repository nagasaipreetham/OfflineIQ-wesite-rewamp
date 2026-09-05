/** Greek numerals (alphabetic) with keraia — index 0 unused as em dash. */
export const GREEK_NUMERALS = [
  '—',
  'αʹ',
  'βʹ',
  'γʹ',
  'δʹ',
  'εʹ',
  'ϛʹ',
  'ζʹ',
  'ηʹ',
  'θʹ',
]

export function greekNumeral(n) {
  return GREEK_NUMERALS[n] ?? String(n)
}
