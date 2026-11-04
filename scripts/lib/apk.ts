// An installed release APK → the same build, debuggable (user, 2026-11-04, REQ-085), so the view dumper
// (scripts/android-viewdump.ts) can attach to it: `cmd activity attach-agent` and `run-as` are open on a user build only
// to a package whose manifest says android:debuggable="true". Ported from the rdqe-spec-contract-agent branch
// feat/figma-android-ui-conformance (skills/figma-phd-android-ui-conformance/scripts/lib/axml.mjs, zip-entries.mjs;
// copied with the user's approval as an exception to the repo's independence rule).
//   zip       read an APK's entries and swap one, every other entry copied byte for byte (resources.arsc must stay
//             STORED and uncompressed native libraries uncompressed, or the APK does not install); the APK Signing
//             Block is dropped, since the result is re-aligned and re-signed
//   axml      the binary AndroidManifest.xml: read it, set <application android:debuggable="true"> (a new
//             "debuggable" string inserted where it keeps the resource map sorted, every later string reference
//             shifted, the attribute placed at its resource-id position), and prove that is the only change, attribute
//             order included (the third-party ManifestEditor.jar also reordered <manifest>'s attributes)
// Code, resources and native libraries are untouched, so a dump sees the release build's UI; ART runs it debuggable,
// so no timing taken on it counts.
import { createHash } from 'node:crypto';
import zlib from 'node:zlib';

export const sha256 = (b: Buffer) => createHash('sha256').update(b).digest('hex');

// ---- zip ---------------------------------------------------------------------------------------------------------
const SIG_LOCAL = 0x04034b50, SIG_CENTRAL = 0x02014b50, SIG_EOCD = 0x06054b50;
const APK_SIG_MAGIC = Buffer.from('APK Sig Block 42', 'latin1');
export type ZipEntry = { name: string; flags: number; method: number; crc: number; compressedSize: number; uncompressedSize: number; localHeaderOffset: number; cdRecordOffset: number; cdRecordLength: number };
export type ZipDir = { entries: ZipEntry[]; eocd: number; cdOffset: number; recordsEnd: number };

function findEocd(buf: Buffer) {
  for (let i = buf.length - 22, min = Math.max(0, buf.length - 22 - 0xffff); i >= min; i--) if (buf.readUInt32LE(i) === SIG_EOCD) return i;
  throw new Error('not a zip archive (no end-of-central-directory record)');
}

export function readZipDirectory(buf: Buffer): ZipDir {
  const eocd = findEocd(buf), count = buf.readUInt16LE(eocd + 10), cdSize = buf.readUInt32LE(eocd + 12), cdOffset = buf.readUInt32LE(eocd + 16);
  if (count === 0xffff || cdOffset === 0xffffffff || cdSize === 0xffffffff) throw new Error('ZIP64 archive: not supported');
  const entries: ZipEntry[] = [];
  for (let i = 0, p = cdOffset; i < count; i++) {
    if (buf.readUInt32LE(p) !== SIG_CENTRAL) throw new Error(`corrupt central directory at ${p}`);
    const nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32);
    entries.push({ name: buf.toString('utf8', p + 46, p + 46 + nameLen), flags: buf.readUInt16LE(p + 8), method: buf.readUInt16LE(p + 10), crc: buf.readUInt32LE(p + 16),
      compressedSize: buf.readUInt32LE(p + 20), uncompressedSize: buf.readUInt32LE(p + 24), localHeaderOffset: buf.readUInt32LE(p + 42), cdRecordOffset: p, cdRecordLength: 46 + nameLen + extraLen + commentLen });
    p += 46 + nameLen + extraLen + commentLen;
  }
  // where the entries end: the APK Signing Block when there is one, else the central directory
  let recordsEnd = cdOffset;
  if (cdOffset >= 24 && buf.subarray(cdOffset - 16, cdOffset).equals(APK_SIG_MAGIC)) recordsEnd = cdOffset - Number(buf.readBigUInt64LE(cdOffset - 24)) - 8;
  return { entries, eocd, cdOffset, recordsEnd };
}

export function readZipEntry(buf: Buffer, e: ZipEntry) {
  const p = e.localHeaderOffset;
  if (buf.readUInt32LE(p) !== SIG_LOCAL) throw new Error(`corrupt local header for ${e.name}`);
  const start = p + 30 + buf.readUInt16LE(p + 26) + buf.readUInt16LE(p + 28), data = buf.subarray(start, start + e.compressedSize);
  if (e.method === 0) return Buffer.from(data);
  if (e.method === 8) return zlib.inflateRawSync(data);
  throw new Error(`${e.name}: compression method ${e.method} not supported`);
}

export const zipEntry = (buf: Buffer, name: string) => { const e = readZipDirectory(buf).entries.find(x => x.name === name); return e ? readZipEntry(buf, e) : null; };

export function replaceZipEntry(buf: Buffer, name: string, data: Buffer) {
  const dir = readZipDirectory(buf), target = dir.entries.find(e => e.name === name);
  if (!target) throw new Error(`${name} not in archive`);
  const byOffset = [...dir.entries].sort((a, b) => a.localHeaderOffset - b.localHeaderOffset);
  const deflated = zlib.deflateRawSync(data, { level: 9 }), crc = zlib.crc32(data) >>> 0;
  const parts: Buffer[] = [], newOffset = new Map<ZipEntry, number>();
  let written = 0;
  byOffset.forEach((e, i) => {
    const end = i + 1 < byOffset.length ? byOffset[i + 1].localHeaderOffset : dir.recordsEnd;
    newOffset.set(e, written);
    if (e !== target) { const raw = buf.subarray(e.localHeaderOffset, end); parts.push(raw); written += raw.length; return; }
    const nameBytes = Buffer.from(e.name, 'utf8'), h = Buffer.alloc(30);
    h.writeUInt32LE(SIG_LOCAL, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(e.flags & 0x0800, 6); h.writeUInt16LE(8, 8);
    h.writeUInt16LE(buf.readUInt16LE(e.cdRecordOffset + 12), 10); h.writeUInt16LE(buf.readUInt16LE(e.cdRecordOffset + 14), 12);
    h.writeUInt32LE(crc, 14); h.writeUInt32LE(deflated.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(nameBytes.length, 26);
    parts.push(h, nameBytes, deflated); written += h.length + nameBytes.length + deflated.length;
  });
  const cdStart = written;
  for (const e of dir.entries) {
    const rec = Buffer.from(buf.subarray(e.cdRecordOffset, e.cdRecordOffset + e.cdRecordLength));
    rec.writeUInt32LE(newOffset.get(e)!, 42);
    if (e === target) { rec.writeUInt16LE(e.flags & 0x0800, 8); rec.writeUInt16LE(8, 10); rec.writeUInt32LE(crc, 16); rec.writeUInt32LE(deflated.length, 20); rec.writeUInt32LE(data.length, 24); }
    parts.push(rec); written += rec.length;
  }
  const eocd = Buffer.from(buf.subarray(dir.eocd));
  eocd.writeUInt32LE(written - cdStart, 12); eocd.writeUInt32LE(cdStart, 16); parts.push(eocd);
  return Buffer.concat(parts);
}

// ---- axml --------------------------------------------------------------------------------------------------------
export const ATTR = { debuggable: 0x0101000f, versionCode: 0x0101021b, versionName: 0x0101021c };
const TYPE_STRING = 0x03, TYPE_INT_BOOLEAN = 0x12, ANDROID_NS = 'http://schemas.android.com/apk/res/android';
type Attr = { name: string | null; resId: number; type: number; data: string | number | null; ns: string | null };
type El = { name: string | null; attrs: Attr[] };

function readStringPool(buf: Buffer, pos: number, hsz: number) {
  const count = buf.readUInt32LE(pos + 8), utf8 = (buf.readUInt32LE(pos + 16) & 0x100) !== 0, base = pos + buf.readUInt32LE(pos + 20), strings: string[] = [];
  for (let i = 0; i < count; i++) {
    let p = base + buf.readUInt32LE(pos + hsz + i * 4);
    if (utf8) { p += buf[p] & 0x80 ? 2 : 1; let n = buf[p]; p += 1; if (n & 0x80) { n = ((n & 0x7f) << 8) | buf[p]; p += 1; } strings.push(buf.toString('utf8', p, p + n)); }
    else { let n = buf.readUInt16LE(p); p += 2; if (n & 0x8000) { n = ((n & 0x7fff) << 16) | buf.readUInt16LE(p); p += 2; } strings.push(buf.toString('utf16le', p, p + 2 * n)); }
  }
  return strings;
}

/** Start tags in document order with their attributes. */
export function parseAxml(buf: Buffer): El[] {
  if (buf.readUInt16LE(0) !== 0x0003) throw new Error('not a binary XML (AXML) buffer');
  let strings: string[] = [], resIds: number[] = [];
  const els: El[] = [];
  for (let pos = 8; pos + 8 <= buf.length;) {
    const type = buf.readUInt16LE(pos), hsz = buf.readUInt16LE(pos + 2), size = buf.readUInt32LE(pos + 4);
    if (size === 0) throw new Error(`zero-size AXML chunk at ${pos}`);
    if (type === 0x0001) strings = readStringPool(buf, pos, hsz);
    else if (type === 0x0180) { resIds = []; for (let p = pos + hsz; p < pos + size; p += 4) resIds.push(buf.readUInt32LE(p)); }
    else if (type === 0x0102) {
      const attrStart = buf.readUInt16LE(pos + 24), attrSize = buf.readUInt16LE(pos + 26), attrCount = buf.readUInt16LE(pos + 28), attrs: Attr[] = [];
      for (let i = 0; i < attrCount; i++) {
        const a = pos + 16 + attrStart + i * attrSize, ns = buf.readInt32LE(a), n = buf.readInt32LE(a + 4), vtype = buf.readUInt8(a + 15), vdata = buf.readUInt32LE(a + 16);
        attrs.push({ name: strings[n] ?? null, resId: n >= 0 && n < resIds.length ? resIds[n] : 0, type: vtype, data: vtype === TYPE_STRING ? strings[vdata] ?? null : vdata, ns: ns >= 0 ? strings[ns] ?? null : null });
      }
      els.push({ name: strings[buf.readInt32LE(pos + 20)] ?? null, attrs });
    }
    pos += size;
  }
  return els;
}

const findAttr = (el: El | undefined, resId: number, name: string) => el?.attrs.find(a => (resId && a.resId === resId) || (!a.resId && a.name === name)) ?? null;
export function manifestSummary(els: El[]) {
  const m = els.find(e => e.name === 'manifest'), app = els.find(e => e.name === 'application');
  const pkg = findAttr(m, 0, 'package'), vc = findAttr(m, ATTR.versionCode, 'versionCode'), vn = findAttr(m, ATTR.versionName, 'versionName'), dbg = findAttr(app, ATTR.debuggable, 'debuggable');
  return { package: pkg ? String(pkg.data) : null, version_code: vc ? Number(vc.data) : null, version_name: vn ? String(vn.data) : null,
    debuggable: !!dbg && dbg.type === TYPE_INT_BOOLEAN && dbg.data !== 0 };
}

const attrKey = (a: Attr) => a.resId ? `0x${a.resId.toString(16).padStart(8, '0')}` : `name:${a.name}`;
const attrValue = (a: Attr) => `${a.type}:${a.data}`;

/** The resign proof: the only difference is <application android:debuggable="true">, attribute order kept. */
export function debuggableOnlyDiff(before: El[], after: El[]) {
  const problems: string[] = [], diffs: { element: string | null; attr: string; name: string | null; before: string | null; after: string | null; afterType: number | null; afterData: unknown }[] = [];
  if (before.length !== after.length) problems.push(`element count changed: ${before.length} → ${after.length}`);
  for (let i = 0; i < Math.min(before.length, after.length); i++) {
    const a = before[i], b = after[i];
    if (a.name !== b.name) { problems.push(`element ${i} renamed: ${a.name} → ${b.name}`); continue; }
    const ma = new Map(a.attrs.map(x => [attrKey(x), x])), mb = new Map(b.attrs.map(x => [attrKey(x), x]));
    for (const key of new Set([...ma.keys(), ...mb.keys()])) {
      const va = ma.get(key), vb = mb.get(key);
      if (va && vb && attrValue(va) === attrValue(vb) && va.ns === vb.ns) continue;
      diffs.push({ element: a.name, attr: key, name: (vb ?? va)!.name, before: va ? attrValue(va) : null, after: vb ? attrValue(vb) : null, afterType: vb?.type ?? null, afterData: vb?.data ?? null });
    }
    const ids = b.attrs.map(x => x.resId).filter(Boolean);
    if (ids.some((id, k) => k > 0 && id < ids[k - 1])) problems.push(`<${b.name}> attributes are not sorted by resource id after the edit`);
    const orderA = a.attrs.map(attrKey);
    if (b.attrs.map(attrKey).filter(k => orderA.includes(k)).join('|') !== orderA.filter(k => mb.has(k)).join('|')) problems.push(`<${b.name}> attribute order changed`);
  }
  const d = diffs[0], key = `0x${ATTR.debuggable.toString(16).padStart(8, '0')}`;
  if (!(diffs.length === 1 && d.element === 'application' && d.attr === key && d.afterType === TYPE_INT_BOOLEAN && d.afterData !== 0 && (d.before === null || d.before === `${TYPE_INT_BOOLEAN}:0`)))
    problems.push(diffs.length === 0 ? 'the edited manifest equals the release manifest (debuggable was not set)'
      : `expected exactly one difference (<application android:debuggable="true">), found ${diffs.length}: ${diffs.slice(0, 5).map(x => `<${x.element}> ${x.name ?? x.attr} ${x.before ?? '∅'} → ${x.after ?? '∅'}`).join('; ')}`);
  return { ok: problems.length === 0, diffs, problems };
}

type Chunk = { type: number; hsz: number; size: number; bytes: Buffer };
function chunkList(buf: Buffer) {
  if (buf.readUInt16LE(0) !== 0x0003) throw new Error('not a binary XML (AXML) buffer');
  const chunks: Chunk[] = [];
  for (let pos = buf.readUInt16LE(2); pos + 8 <= buf.length;) {
    const size = buf.readUInt32LE(pos + 4);
    if (size < 8 || pos + size > buf.length) throw new Error(`corrupt AXML chunk at ${pos}`);
    chunks.push({ type: buf.readUInt16LE(pos), hsz: buf.readUInt16LE(pos + 2), size, bytes: Buffer.from(buf.subarray(pos, pos + size)) });
    pos += size;
  }
  return chunks;
}
// each pooled string's exact bytes (length prefixes, data, terminator) and its text
function poolStrings(c: Chunk) {
  const b = c.bytes, count = b.readUInt32LE(8), flags = b.readUInt32LE(16), stringsStart = b.readUInt32LE(20);
  if (b.readUInt32LE(12) !== 0) throw new Error('AXML string pool with styles is not supported');
  const utf8 = (flags & 0x100) !== 0, strings: { text: string; raw: Buffer }[] = [];
  for (let i = 0; i < count; i++) {
    const start = stringsStart + b.readUInt32LE(c.hsz + i * 4);
    let p = start, text: string;
    if (utf8) { p += b[p] & 0x80 ? 2 : 1; let n = b[p]; p += 1; if (n & 0x80) { n = ((n & 0x7f) << 8) | b[p]; p += 1; } text = b.toString('utf8', p, p + n); p += n + 1; }
    else { let n = b.readUInt16LE(p); p += 2; if (n & 0x8000) { n = ((n & 0x7fff) << 16) | b.readUInt16LE(p); p += 2; } text = b.toString('utf16le', p, p + 2 * n); p += 2 * n + 2; }
    strings.push({ text, raw: b.subarray(start, p) });
  }
  return { utf8, flags, strings };
}
function encodePoolString(text: string, utf8: boolean) {
  if (utf8) { const bytes = Buffer.from(text, 'utf8'), len = (n: number) => n > 0x7f ? Buffer.from([0x80 | (n >> 8), n & 0xff]) : Buffer.from([n]); return Buffer.concat([len(text.length), len(bytes.length), bytes, Buffer.from([0])]); }
  const chars = Buffer.from(text, 'utf16le'), head = Buffer.alloc(2); head.writeUInt16LE(chars.length / 2, 0);
  return Buffer.concat([head, chars, Buffer.alloc(2)]);
}
function buildPool(c: Chunk, raws: Buffer[], flags: number) {
  const offsets = Buffer.alloc(4 * raws.length);
  let off = 0; raws.forEach((s, i) => { offsets.writeUInt32LE(off, 4 * i); off += s.length; });
  let data = Buffer.concat(raws); if (data.length % 4) data = Buffer.concat([data, Buffer.alloc(4 - (data.length % 4))]);
  const h = Buffer.from(c.bytes.subarray(0, c.hsz));
  h.writeUInt32LE(c.hsz + offsets.length + data.length, 4); h.writeUInt32LE(raws.length, 8); h.writeUInt32LE(0, 12);
  h.writeUInt32LE(flags & ~0x1, 16); h.writeUInt32LE(c.hsz + offsets.length, 20); h.writeUInt32LE(0, 24);   // an insert breaks SORTED_FLAG
  return Buffer.concat([h, offsets, data]);
}

/** A new manifest whose <application> carries android:debuggable="true" (see the header). */
export function setApplicationDebuggable(buf: Buffer) {
  const chunks = chunkList(buf), poolIdx = chunks.findIndex(c => c.type === 0x0001), mapIdx = chunks.findIndex(c => c.type === 0x0180);
  if (poolIdx < 0 || mapIdx < 0) throw new Error('AXML without a string pool or a resource map');
  const pool = poolStrings(chunks[poolIdx]), texts = pool.strings.map(s => s.text), mapC = chunks[mapIdx], resIds: number[] = [];
  for (let p = mapC.hsz; p < mapC.size; p += 4) resIds.push(mapC.bytes.readUInt32LE(p));
  let insertAt = -1, nameIdx = resIds.indexOf(ATTR.debuggable);
  if (nameIdx < 0) { insertAt = resIds.findIndex(id => id > ATTR.debuggable); if (insertAt < 0) insertAt = resIds.length; nameIdx = insertAt; }
  const shift = (v: number) => insertAt >= 0 && v >= insertAt ? v + 1 : v, newIds = [...resIds];
  if (insertAt >= 0) newIds.splice(insertAt, 0, ATTR.debuggable);
  if (!texts.includes(ANDROID_NS)) throw new Error('AXML has no android namespace string');
  const nsIdx = shift(texts.indexOf(ANDROID_NS)), out: Buffer[] = [];
  let appDone = false;
  chunks.forEach((c, i) => {
    if (i === poolIdx) { if (insertAt < 0) { out.push(c.bytes); return; } const raws = pool.strings.map(s => s.raw); raws.splice(insertAt, 0, encodePoolString('debuggable', pool.utf8)); out.push(buildPool(c, raws, pool.flags)); return; }
    if (i === mapIdx) { const m = Buffer.alloc(c.hsz + 4 * newIds.length); c.bytes.copy(m, 0, 0, c.hsz); m.writeUInt32LE(m.length, 4); newIds.forEach((id, k) => m.writeUInt32LE(id, c.hsz + 4 * k)); out.push(m); return; }
    if (i < poolIdx) throw new Error(`unexpected AXML chunk 0x${c.type.toString(16)} before the string pool`);
    const b = Buffer.from(c.bytes), fix = (off: number) => { const v = b.readInt32LE(off); if (v >= 0) b.writeInt32LE(shift(v), off); };
    if (c.type === 0x0100 || c.type === 0x0101 || c.type === 0x0103) { fix(12); fix(16); fix(20); out.push(b); return; }
    if (c.type === 0x0104) { fix(12); fix(16); if (b.readUInt8(23) === TYPE_STRING) fix(24); out.push(b); return; }
    if (c.type !== 0x0102) throw new Error(`unexpected AXML chunk 0x${c.type.toString(16)}; refusing to edit a manifest this does not understand`);
    fix(12); fix(16); fix(20);
    const attrStart = b.readUInt16LE(24), attrSize = b.readUInt16LE(26), count = b.readUInt16LE(28), base = 16 + attrStart;
    for (let k = 0; k < count; k++) { const a = base + k * attrSize; fix(a); fix(a + 4); fix(a + 8); if (b.readUInt8(a + 15) === TYPE_STRING) fix(a + 16); }
    if (appDone || texts[c.bytes.readInt32LE(20)] !== 'application') { out.push(b); return; }
    appDone = true;
    const resIdAt = (k: number) => { const n = b.readInt32LE(base + k * attrSize + 4); return n >= 0 && n < newIds.length ? newIds[n] : 0; };
    for (let k = 0; k < count; k++) if (resIdAt(k) === ATTR.debuggable) { b.writeUInt8(TYPE_INT_BOOLEAN, base + k * attrSize + 15); b.writeUInt32LE(0xffffffff, base + k * attrSize + 16); out.push(b); return; }
    let at = count;
    for (let k = 0; k < count; k++) { const id = resIdAt(k); if (id === 0 || id > ATTR.debuggable) { at = k; break; } }
    const attr = Buffer.alloc(attrSize);
    attr.writeInt32LE(nsIdx, 0); attr.writeInt32LE(nameIdx, 4); attr.writeInt32LE(-1, 8); attr.writeUInt16LE(8, 12); attr.writeUInt8(TYPE_INT_BOOLEAN, 15); attr.writeUInt32LE(0xffffffff, 16);
    const cut = base + at * attrSize, el = Buffer.concat([b.subarray(0, cut), attr, b.subarray(cut)]);
    el.writeUInt32LE(el.length, 4); el.writeUInt16LE(count + 1, 28);
    for (const off of [30, 32, 34]) { const v = el.readUInt16LE(off); if (v > 0 && v - 1 >= at) el.writeUInt16LE(v + 1, off); }   // id / class / style indices move with it
    out.push(el);
  });
  if (!appDone) throw new Error('AXML has no <application> element');
  const body = Buffer.concat(out), h = Buffer.from(buf.subarray(0, buf.readUInt16LE(2)));
  h.writeUInt32LE(h.length + body.length, 4);
  return Buffer.concat([h, body]);
}

/** The dex files' sha256, in name order: the same build before and after the re-sign. */
export function dexDigest(apk: Buffer) {
  const dir = readZipDirectory(apk), dex = dir.entries.filter(e => /^classes\d*\.dex$/.test(e.name)).sort((a, b) => a.name.localeCompare(b.name));
  return sha256(Buffer.concat(dex.map(e => Buffer.from(`${e.name}:${sha256(readZipEntry(apk, e))}\n`))));
}
