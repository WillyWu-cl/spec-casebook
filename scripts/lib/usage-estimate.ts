// Plan-usage figures shared by the Progress page (plan-page.ts) and the Design tab (design-page.ts), so both show the
// same numbers for the same messages: the price-ratio weight of a message, a run folder's active spans, the account
// snapshots of runs/usage.jsonl and their increments, and the token-rate estimate calibrated in
// runs/usage-calibration.json (plan-page.ts header has the method).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { activityPoints } from './run-ledger.ts';
import { addMsg, zero, type Msg, type U } from '../token-usage.ts';

export const IDLE = 15 * 60_000, H5 = 5 * 3_600_000, WEEK = 7 * 24 * 3_600_000;
export type Span = { a: number; b: number; phase: string; seg: string };
// Price-ratio weight of a message: the proxy for how much plan usage it cost.
export const W = { input: 1, cacheWrite: 1.25, cacheRead: 0.1, output: 5 };
export const weight = (m: Msg | U) => m.input * W.input + m.cacheWrite * W.cacheWrite + m.cacheRead * W.cacheRead + m.output * W.output;
// Messages sorted by time plus prefix sums of their weights.
export type Series = { msgs: Msg[]; pre: Float64Array };
export function series(list: Msg[]): Series {
  const msgs = [...list].sort((a, b) => a.t - b.t), pre = new Float64Array(msgs.length + 1);
  msgs.forEach((m, i) => { pre[i + 1] = pre[i] + weight(m); });
  return { msgs, pre };
}
export const upper = (s: Series, t: number) => { let lo = 0, hi = s.msgs.length; while (lo < hi) { const m = (lo + hi) >> 1; if (s.msgs[m].t <= t) lo = m + 1; else hi = m; } return lo; };
export const wsum = (s: Series, a: number, b: number) => b > a ? s.pre[upper(s, b)] - s.pre[upper(s, a)] : 0;   // weight of messages in (a, b]
// Activity points of a run folder, as `run-log.ts time` collects them; each gap of up to 15 min is an active span,
// labelled with the segment of the next recorded case (after the last one: "wrap-up").
export function activity(dir: string, rows: Record<string, string>[], phase: string) {
  const pts = activityPoints(dir);   // activity.log, with evidence file times stamped into it (lib/run-ledger.ts)
  for (const r of rows) { const t = Date.parse(r['Recorded At']); if (t) pts.push(t); }
  pts.sort((a, b) => a - b);
  const recs = rows.map(r => ({ t: Date.parse(r['Recorded At']), seg: r.Segment || '-' })).filter(r => r.t).sort((a, b) => a.t - b.t);
  const spans: Span[] = [], idle: { a: number; b: number; seg: string }[] = [];
  let ri = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]; if (b === a) continue;
    while (ri < recs.length && recs[ri].t < b) ri++;
    const seg = ri < recs.length ? recs[ri].seg : 'wrap-up';
    (b - a > IDLE ? idle : spans).push({ a, b, phase, seg } as Span);
  }
  return { first: pts[0], last: pts.at(-1), spans, idle };
}


// Plan-usage increments from the snapshots: positive steps of percentUsed within one window; a changed resetsAt,
// a drop, or (with no resetsAt) a reading after a 100% stop starts a new window from 0.
// A seat change between snapshots is an account switch: no window spans it, and an increment never reaches back past it.
// The first reading of the file, and the first after an account switch, is a baseline only: its value holds use from
// before the run (other work on a shared account), so it adds nothing (2026-10-27: the Android run's first reading,
// 14 % of a 6.25× seat, showed as 100 % of a Pro window).
export type Snap = { at: string; fiveHourPct: number | null; fiveHourResetsAt: string | null; weeklyPct: number | null; weeklyResetsAt: string | null; proMultiplier: number; note?: string };
export function increments(snaps: Snap[], key: 'fiveHour' | 'weekly', dur: number) {
  const out: { from: number; to: number; pct: number; mult: number; approx: boolean }[] = [];
  let prev: { t: number; pct: number; r?: number; mult: number } | undefined;
  let switchAt = -Infinity;
  for (let i = 0; i < snaps.length; i++) {
    const s = snaps[i];
    if (i && s.proMultiplier !== snaps[i - 1].proMultiplier) { switchAt = Date.parse(s.at); prev = undefined; }
    const pct = s[`${key}Pct`]; if (pct == null) continue;
    const t = Date.parse(s.at), r = s[`${key}ResetsAt`] ? Date.parse(s[`${key}ResetsAt`]!) : undefined;
    let same = false;
    if (prev) {
      if (r !== undefined && prev.r !== undefined) same = Math.abs(r - prev.r) < 120_000;
      else if (prev.r !== undefined) same = t < prev.r;
      else if (r !== undefined) same = prev.t > r - dur;
      else same = t - prev.t < dur && prev.pct < 100;
      if (pct < prev.pct) same = false;
    }
    const from = same ? prev!.t : Math.max(r !== undefined ? r - dur : t - dur, prev?.t ?? -Infinity, switchAt);
    const inc = same ? pct - prev!.pct : pct;
    if (inc > 0 && prev) out.push({ from, to: t, pct: inc, mult: s.proMultiplier, approx: /approx/i.test(s.note ?? '') || r === undefined });
    prev = { t, pct, r: r ?? (same ? prev!.r : undefined), mult: s.proMultiplier };
  }
  return out;
}


export type Calibration = { basis: string; fiveHourPct: number; seat?: number; source?: string; weekPerFiveHour?: number | null; basisWeightedTokens?: number };
export function readCalibration(runsDir: string): Calibration | null {
  const f = join(runsDir, 'usage-calibration.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
}

/** The account snapshots of runs/usage.jsonl by time; a row without a seat size inherits the previous one's. */
export function readSnaps(runsDir: string) {
  const f = join(runsDir, 'usage.jsonl');
  const snaps: Snap[] = existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).flatMap(l => { try { return [JSON.parse(l)]; } catch { return []; } }).sort((a, b) => Date.parse(a.at) - Date.parse(b.at)) : [];
  let seat = 1, seatAssumed = false;
  for (const s of snaps) if (s.proMultiplier > 0) seat = s.proMultiplier; else { s.proMultiplier = seat; seatAssumed = true; }
  return { snaps, seatAssumed, readings: snaps.filter(s => s.fiveHourPct != null || s.weeklyPct != null) };
}

// Weekly ratio: the calibration's weekPerFiveHour, else Σ Δweekly ÷ Σ Δ5-hour over consecutive readings of the latest
// seat that both carry a 5-hour and a weekly value in the same windows (no reset in between). Paired readings only: a
// reading's first value on a new account holds use from before it (10/22: 95% weekly from other work counted as a
// 1-second increment made the ratio 1.70 instead of 0.19). The seat factor cancels: both are plan-% of one account.
export function weeklyRatio(cal: Calibration | null, readings: Snap[]) {
  let weekRatio: number | null = cal?.weekPerFiveHour ?? null, weekBasis: { seat: number; weekly: number; fiveHour: number; from: string; to: string } | null = null;
  const paired = readings.filter(s => s.fiveHourPct != null && s.weeklyPct != null);
  const close = (x?: string | null, y?: string | null) => !x || !y || Math.abs(Date.parse(x) - Date.parse(y)) < 120_000;
  for (const wSeat of [...new Set(paired.map(s => s.proMultiplier))].reverse()) {
    if (weekRatio != null) break;
    const ps = paired.filter(s => s.proMultiplier === wSeat);
    let wk = 0, fh = 0, a = Infinity, b = -Infinity;
    for (let i = 1; i < ps.length; i++) {
      const p = ps[i - 1], q = ps[i];
      const dW = q.weeklyPct! - p.weeklyPct!, d5 = q.fiveHourPct! - p.fiveHourPct!;
      if (dW < 0 || d5 < 0 || !close(p.fiveHourResetsAt, q.fiveHourResetsAt) || !close(p.weeklyResetsAt, q.weeklyResetsAt)) continue;
      wk += dW; fh += d5; a = Math.min(a, Date.parse(p.at)); b = Math.max(b, Date.parse(q.at));
    }
    if (fh > 0) { weekRatio = wk / fh; weekBasis = { seat: wSeat, weekly: wk * wSeat, fiveHour: fh * wSeat, from: new Date(a).toISOString(), to: new Date(b).toISOString() }; }
  }
  return { weekRatio, weekBasis };
}

/** Pro-% of a 5-hour window and of a week for a weighted token count (rate = calibrated 5-hour Pro-% per weighted token). */
export const estimator = (rate: number | null, weekRatio: number | null) => (wt: number) =>
  ({ est5: rate != null ? wt * rate : null, estW: rate != null && weekRatio != null ? wt * rate * weekRatio : null });

// One table row per group of active spans, figured as the Progress page figures a phase (user, 2026-11-04: the Design
// tab shows the same table): wall (first to last point), test (spans), idle and gaps (gaps over 15 min), the Claude
// tokens of the group's messages inside its spans, the token-rate estimate, the seat size(s) in force, and the
// account's snapshot increments split between the groups' spans by their weighted tokens (active time if none). An
// increment no span overlaps is "outside".
export type Group = { key: string; spans: { a: number; b: number }[]; idle: { a: number; b: number }[]; msgs: Msg[] };
export function spanStats(groups: Group[], snaps: Snap[], readings: Snap[], est: (wt: number) => { est5: number | null; estW: number | null }) {
  const ser = new Map(groups.map(g => [g.key, series(g.msgs)]));
  const st = new Map(groups.map(g => {
    const pts = [...g.spans.flatMap(x => [x.a, x.b]), ...g.idle.flatMap(x => [x.a, x.b])];
    const s = { first: pts.length ? Math.min(...pts) : Infinity, last: pts.length ? Math.max(...pts) : -Infinity, test: 0, idle: 0, gaps: g.idle.length, tokens: zero(),
      models: {} as Record<string, number>, fiveHour: 0, weekly: 0, covered: false, approx: false };
    const m = ser.get(g.key)!;
    for (const sp of g.spans) { s.test += sp.b - sp.a;
      for (let i = upper(m, sp.a); i < m.msgs.length && m.msgs[i].t <= sp.b; i++) { addMsg(s.tokens, m.msgs[i]); if (!m.msgs[i].model.startsWith('<')) s.models[m.msgs[i].model] = (s.models[m.msgs[i].model] ?? 0) + 1; } }
    for (const x of g.idle) s.idle += x.b - x.a;
    return [g.key, s];
  }));
  const all = groups.flatMap(g => g.spans.map(sp => ({ ...sp, key: g.key })));
  const out = { outside5: 0, outsideW: 0, approx: false };
  for (const [key, dur] of [['fiveHour', H5], ['weekly', WEEK]] as const) for (const inc of increments(snaps, key, dur)) {
    const pro = inc.pct * inc.mult;
    out.approx ||= inc.approx;
    const ov = all.map(sp => Math.max(0, Math.min(sp.b, inc.to) - Math.max(sp.a, inc.from)));
    if (!ov.some(Boolean)) { out[key === 'fiveHour' ? 'outside5' : 'outsideW'] += pro; continue; }
    const tw = all.map((sp, i) => ov[i] ? wsum(ser.get(sp.key)!, Math.max(sp.a, inc.from), Math.min(sp.b, inc.to)) : 0);
    const by = tw.some(Boolean) ? tw : ov, sum = by.reduce((x, y) => x + y, 0);
    all.forEach((sp, i) => { if (!ov[i]) return; const s = st.get(sp.key)!; s[key] += pro * by[i] / sum; s.covered = true; s.approx ||= inc.approx; });
  }
  const rows = new Map(groups.map(g => {
    const s = st.get(g.key)!;
    if (!Number.isFinite(s.first)) return [g.key, null];
    if (readings.some(x => { const t = Date.parse(x.at); return t >= s.first && t <= s.last; })) s.covered = true;
    // seat size(s) in force: the latest snapshot at or before the start, plus any inside
    const seats = [...new Set(snaps.filter((x, i) => { const t = Date.parse(x.at); return (t > s.first && t <= s.last) || (t <= s.first && !(snaps[i + 1] && Date.parse(snaps[i + 1].at) <= s.first)); }).map(x => x.proMultiplier))];
    return [g.key, { wall: s.last - s.first, test: s.test, idle: s.idle, gaps: s.gaps, tokens: s.tokens, wt: weight(s.tokens), ...(s.tokens.messages ? est(weight(s.tokens)) : { est5: null, estW: null }),
      noTokens: !s.tokens.messages, models: s.models, fiveHour: s.covered ? s.fiveHour : null, weekly: s.covered ? s.weekly : null, seats, readings: s.covered, approx: s.approx,
      from: new Date(s.first).toISOString(), to: new Date(s.last).toISOString() }];
  }));
  return { rows, ...out };
}
