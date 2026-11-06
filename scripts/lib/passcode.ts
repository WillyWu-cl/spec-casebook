// The passcode that guards `pages.ts --lan` (user, 2026-11-06): made at each start and printed for copying, or set with
// --passcode. Other computers enter it once; a cookie then keeps them in, so a set passcode survives a restart and a
// made one does not. This computer never needs it. The pages travel over plain http: it keeps people on the network
// out, it is not encryption.
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

const LETTERS = 'abcdefghjkmnpqrstuvwxyz23456789';   // none that read alike (l, 1, o, 0, i)
export const COOKIE = 'casebook_session';

export function makePasscode(): string {
  const part = () => Array.from({ length: 4 }, () => LETTERS[randomInt(LETTERS.length)]).join('');
  return `${part()}-${part()}`;
}

const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
export const passcodeMatches = (given: string, passcode: string) => same(given.trim().toLowerCase(), passcode.trim().toLowerCase());
export const sessionOf = (passcode: string) => createHmac('sha256', passcode.trim().toLowerCase()).update('casebook-pages').digest('hex');

export function hasSession(cookies: string | undefined, session: string): boolean {
  for (const c of (cookies ?? '').split(';')) { const [k, v] = c.trim().split('='); if (k === COOKIE && v && same(v, session)) return true; }
  return false;
}

// where to go after signing in: a path on this server only
export const safeNext = (next: string | null | undefined) => next && /^\/(?![/\\])/.test(next) ? next : '/';

// a wrong try is counted per address; the fifth in a row closes it for a minute
export function attempts(limit = 5, lockMs = 60_000) {
  const seen = new Map<string, { n: number; until: number }>();
  return {
    locked: (who: string, now = Date.now()) => (seen.get(who)?.until ?? 0) > now,
    failed(who: string, now = Date.now()) { const s = seen.get(who) ?? { n: 0, until: 0 }; s.n++; if (s.n >= limit) { s.n = 0; s.until = now + lockMs; } seen.set(who, s); },
    passed(who: string) { seen.delete(who); },
  };
}
