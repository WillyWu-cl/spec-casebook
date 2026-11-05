// Loose text matching for spec words read in different ways (PDF OCR, Figma text, OCR of a Figma screenshot):
// spaces, punctuation, symbols and full-width forms do not count; OCR noise is tolerated through 3-grams.
export const norm = (s: string) => s.normalize('NFKC').toLowerCase().replace(/\(\?\)\s*$/, '').replace(/[\s\p{P}\p{S}]/gu, '');
export const grams = (s: string) => { const g = new Set<string>(); for (let i = 0; i + 3 <= s.length; i++) g.add(s.slice(i, i + 3)); return g; };
// how much of `line` (normalized) `all` holds: 1 when it is a substring, else the share of its 3-grams found
export const cover = (line: string, all: string, allGrams: Set<string> = grams(all)) => {
  if (all.includes(line)) return 1;
  const g = grams(line); if (!g.size) return 0;
  let n = 0; for (const x of g) if (allGrams.has(x)) n++;
  return n / g.size;
};
