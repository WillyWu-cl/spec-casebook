// The one shared Appium server per port. Run segments (R1-a, R1-b, …) and their subagents call ensureAppium at every
// `start` / `restart`; it starts a server only when none exists, so a run never piles up servers:
//   1. a server that answers /status (patiently: a busy one can take seconds) is reused;
//   2. a port that is already listening is never given a second server: wait for it, else stop with the holder's pid;
//   3. a lock file (~/.casebook/appium-<port>.lock) lets only one caller start it when two segments start at once;
//   4. the server is spawned detached (on Windows through cmd, since `appium` is appium.cmd there), with its pid in
//      ~/.casebook/appium-<port>.pid and its log in the given file.
// Never start Appium by hand in a run: a hand-started server dies with the agent shell that started it, or binds the
// same port on another address (0.0.0.0 beside 127.0.0.1) and runs next to the first one.
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { connect } from 'node:net';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { sleep } from './device-common.ts';

const WIN = process.platform === 'win32';
const STATE = join(homedir(), '.casebook');

export type AppiumProc = { pid: number; port: string; command: string };

/** Appium server processes on this computer (not its drivers' helpers), with the port each was started on. */
export function appiumServers(): AppiumProc[] {
  let lines: string[] = [];
  try {
    if (WIN) {
      const ps = "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | ForEach-Object { \"$($_.ProcessId) $($_.CommandLine)\" }";
      lines = execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { encoding: 'utf8', windowsHide: true }).split(/\r?\n/);
    } else {
      lines = execFileSync('ps', ['-axo', 'pid=,command='], { encoding: 'utf8' }).split('\n');
    }
  } catch { return []; }
  const out: AppiumProc[] = [];
  for (const l of lines) {
    const m = /^\s*(\d+)\s+(.*)$/.exec(l);
    if (!m) continue;
    const cmd = m[2];
    // node …/bin/appium …, node …\appium\index.js …, appium.cmd …; not WDA, uiautomator2 or adb children.
    if (!/node(\.exe)?["']?\s.*[\\/]appium(\.js|[\\/](index|build[\\/]lib[\\/]main)\.js)?["']?(\s|$)|(^|[\\/\s])appium(\.cmd)?(\s|$)/i.test(cmd)) continue;
    if (/ps -axo|Get-CimInstance/.test(cmd)) continue;
    const port = /(?:--port|-p)[ =](\d+)/.exec(cmd)?.[1] ?? '4723';
    out.push({ pid: +m[1], port, command: cmd.slice(0, 200) });
  }
  return out;
}

/** One line for `status`: the servers running, and a warning when a port has more than one. */
export function appiumServersLine(): string {
  const all = appiumServers();
  if (!all.length) return 'Appium servers: none running';
  const byPort = new Map<string, number[]>();
  for (const p of all) byPort.set(p.port, [...(byPort.get(p.port) ?? []), p.pid]);
  const parts = [...byPort].map(([port, pids]) => `${port} (pid ${pids.join(', ')})`);
  const dup = [...byPort].filter(([, pids]) => pids.length > 1);
  return `Appium servers: ${all.length} — ${parts.join('; ')}` +
    (dup.length ? `\nWARNING: more than one Appium server on port ${dup.map(d => d[0]).join(', ')}; keep the one answering /status and stop the others (ask the user first)` : '');
}

const listening = (host: string, port: number) => new Promise<boolean>(res => {
  const s = connect({ host, port });
  s.setTimeout(2000);
  s.once('connect', () => { s.destroy(); res(true); });
  s.once('timeout', () => { s.destroy(); res(false); });
  s.once('error', () => res(false));
});

async function waitFor(ping: (ms: number) => Promise<boolean>, seconds: number) {
  for (const end = Date.now() + seconds * 1000; Date.now() < end; await sleep(2)) if (await ping(5000)) return true;
  return false;
}

/**
 * Make sure the Appium server at `base` answers, starting it only when no server exists on that port.
 * `ping(ms)` is GET /status with that timeout, true when it answers. Returns 'running' or 'started'.
 */
export async function ensureAppium(base: string, opts: { ping: (ms: number) => Promise<boolean>; log: string; env?: NodeJS.ProcessEnv; label?: string }): Promise<'running' | 'started'> {
  const { ping, log } = opts;
  const label = opts.label ?? 'Appium';
  if (await ping(15_000)) return 'running';
  const url = new URL(base);
  const port = url.port || '4723', host = url.hostname === 'localhost' ? '127.0.0.1' : url.hostname;

  // Something already holds the port (a busy or still-loading server): never start a second one.
  if (await listening(host, +port)) {
    if (await waitFor(ping, 90)) return 'running';
    const holders = appiumServers().filter(p => p.port === port).map(p => p.pid);
    throw new Error(`${label}: port ${port} is in use but /status does not answer after 90 s` +
      (holders.length ? ` (Appium pid ${holders.join(', ')})` : '') + '; not starting another server. Ask the user to stop the stuck one.');
  }
  // A server started on this port but bound to another address (e.g. a hand-started `appium` on 0.0.0.0).
  const same = appiumServers().filter(p => p.port === port);
  if (same.length) {
    if (await waitFor(ping, 60)) return 'running';
    throw new Error(`${label}: Appium already runs for port ${port} (pid ${same.map(p => p.pid).join(', ')}) but does not answer on ${base}; not starting another. Ask the user to stop it.`);
  }

  mkdirSync(STATE, { recursive: true });
  const lock = join(STATE, `appium-${port}.lock`);
  let fd: number;
  try { fd = openSync(lock, 'wx'); }
  catch {
    // Another segment is starting it right now: wait for that one instead.
    const age = existsSync(lock) ? Date.now() - statSync(lock).mtimeMs : Infinity;
    if (age < 120_000) { if (await waitFor(ping, 120)) return 'running'; throw new Error(`${label}: another start of Appium on ${base} did not come up; see ${log}`); }
    try { unlinkSync(lock); } catch {}
    fd = openSync(lock, 'wx');
  }
  try {
    writeFileSync(fd, String(process.pid)); closeSync(fd);
    mkdirSync(join(log, '..'), { recursive: true });
    const out = openSync(log, 'a');
    const args = ['--address', host, '--port', port, '--log-timestamp', '--local-timezone'];
    const bin = WIN ? (process.env.ComSpec ?? 'cmd.exe') : (['/opt/homebrew/bin/appium', '/usr/local/bin/appium'].find(existsSync) ?? 'appium');
    const child = spawn(bin, WIN ? ['/d', '/s', '/c', 'appium', ...args] : args,
      { detached: true, windowsHide: true, stdio: ['ignore', out, out], env: opts.env ?? process.env });
    child.on('error', () => {});
    child.unref(); closeSync(out);
    if (child.pid) writeFileSync(join(STATE, `appium-${port}.pid`), String(child.pid));
    if (await waitFor(ping, 80)) { console.log(`${label} started on ${base} (pid ${child.pid}), log ${log}`); return 'started'; }
    throw new Error(`${label} did not answer on ${base}; see ${log}`);
  } finally { try { unlinkSync(lock); } catch {} }
}

/** The pid this computer last started for `port`, if any (for messages). */
export const startedPid = (port: string) => { try { return readFileSync(join(STATE, `appium-${port}.pid`), 'utf8').trim(); } catch { return undefined; } };
