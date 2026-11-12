// Makes the Video Enhance test videos the tables' Preconditions name (lengths, frame rates, resolutions, containers)
// with ffmpeg, into ~/.casebook/video-enhance/videos/ (outside the repo: videos are never committed), then prints
// each file's ffprobe length, size and fps. Push them to the phone with --push <adb serial>.
//
//   node library/pdr/video-enhance/fixtures/make-videos.ts [--only <name,…>] [--push <serial>]
//
// Lengths are whole frames, so a 30 fps 「02:30.01」 is 4501 frames = 150.033 s (still over 150 s, which is what the
// rows test); the printed ffprobe length is the one to quote in a result. 1920 × 1081 cannot be encoded as 4:2:0
// H.264, so the 「1081p」 video is 1920 × 1082 (the row tests 「just above 1080p」).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, utimesSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

type V = { name: string; frames: number; w: number; h: number; fps: number; ext?: string; codec?: 'h264' | 'hevc'; album?: string; old?: boolean };
const v = (name: string, frames: number, w: number, h: number, fps: number, o: Partial<V> = {}): V => ({ name, frames, w, h, fps, ...o });
const P1080 = [1920, 1080] as const, P720 = [1280, 720] as const;

const VIDEOS: V[] = [
  // long sources (trim, Mode limit, Standard default)
  v('ve-1230-1080p60', 750 * 60, ...P1080, 60),
  v('ve-1230-1080p30', 750 * 30, ...P1080, 30),
  v('ve-1000-1080p30', 600 * 30, ...P1080, 30),
  v('ve-0801-1080p30', 481 * 30, ...P1080, 30),
  v('ve-0800-1080p30', 480 * 30, ...P1080, 30),
  v('ve-0500-1080p30', 300 * 30, ...P1080, 30),
  v('ve-0300-720p30', 5400, ...P720, 30),
  v('ve-025999-720p30', 5399, ...P720, 30),
  v('ve-025901-720p30', 5371, ...P720, 30),
  v('ve-023040-1080p30', 4512, ...P1080, 30),
  v('ve-023001-1080p30', 4501, ...P1080, 30),
  v('ve-023000-1080p30', 4500, ...P1080, 30),
  v('ve-022999-1080p30', 4499, ...P1080, 30),
  v('ve-0130-1080p30', 90 * 30, ...P1080, 30),
  v('ve-0130-1080p60', 90 * 60, ...P1080, 60),
  v('ve-0030-720p30', 900, ...P720, 30),
  // short sources (price rounding, timing)
  v('ve-000396-1080p30', 119, ...P1080, 30),
  v('ve-000399-720p30', 119, ...P720, 30),
  v('ve-000320-720p30', 96, ...P720, 30),
  v('ve-000300-720p30', 90, ...P720, 30),
  v('ve-000299-720p30', 89, ...P720, 30),
  v('ve-000101-720p30', 31, ...P720, 30),
  v('ve-000100-720p30', 30, ...P720, 30),
  v('ve-000090-720p30', 27, ...P720, 30),
  // frame rates (10 s, 1080p)
  ...[1, 24, 30, 31, 50, 60, 61, 120, 240].map(f => v(`ve-fps${f}-1080p`, 10 * f, ...P1080, f)),
  // resolutions (10 s, 30 fps)
  v('ve-res480p', 300, 854, 480, 30),
  v('ve-res720p', 300, ...P720, 30),
  v('ve-res900p', 300, 1600, 900, 30),
  v('ve-res1082p', 300, 1920, 1082, 30),
  v('ve-res1200p', 300, 1920, 1200, 30),
  v('ve-portrait1080x1920', 300, 1080, 1920, 30),
  v('ve-res1440p', 150, 2560, 1440, 30),
  v('ve-res4k', 150, 3840, 2160, 30),
  v('ve-res8k', 60, 7680, 4320, 30, { codec: 'hevc' }),
  // not supported: under 1 s, not MP4 / MOV
  v('ve-000050-720p30', 15, ...P720, 30),
  v('ve-mkv-720p30', 300, ...P720, 30, { ext: 'mkv' }),
  // only in a named album, older than the Recents (TC-258)
  v('ve-album-only-720p30', 300, ...P720, 30, { album: 'VE test', old: true }),
];

// Real footage (user, 2026-11-10): cuts and copies of the team's test clips, for the rows that judge how a result
// looks (「Result」 over 「Original」) and for real 2K+ / non-MP4 sources. Made only with --real <clip folder> (the
// 「v16.7.4 Test clip」 folder); paths are relative to it. cut = [start s, frames, w, h, fps] re-encodes; else a copy.
type Real = { name: string; src: string; cut?: [number, number, number, number, number]; ext?: string };
const REAL: Real[] = [
  { name: 've-real-000320-720p30', src: 'Test Clip/1920x1080 30FPS (2).mp4', cut: [20, 96, 1280, 720, 30] },
  { name: 've-real-0130-1080p30', src: 'Format/264_MP4_1920x1080.MP4', cut: [30, 2700, 1920, 1080, 30] },
  { name: 've-real-1500-360p', src: 'Format/15 mins Timer.mp4' },
  { name: 've-real-gopro-1080p50', src: 'Test Clip/GX010790_1778405463062.mp4' },
  { name: 've-real-portrait-1080x1920', src: 'Format/1_min_Full HD 1080p_MEDIUM_FR30.mp4' },
  { name: 've-real-1440x2560', src: 'Test Clip/1440x2560_30FPS.mp4' },
  { name: 've-real-4k60', src: 'Test Clip/3840x2160 60FPS.mp4' },
  { name: 've-real-8k30', src: 'AT clip/20261019_150627.mp4' },
  { name: 've-real-avi-480p', src: 'Format/Paribre.DAVC.avi', ext: 'avi' },
];

const OUT = join(homedir(), '.casebook', 'video-enhance', 'videos');
const args = process.argv.slice(2);
const realDir = args.includes('--real') ? args[args.indexOf('--real') + 1] : null;
if (realDir) for (const x of REAL) {
  const f = join(OUT, 'real', `${x.name}.${x.ext ?? 'mp4'}`);
  mkdirSync(join(OUT, 'real'), { recursive: true });
  if (!existsSync(f)) {
    const src = join(realDir, x.src);
    if (!x.cut) execFileSync('cp', ['-c', src, f]);
    else { const [ss, frames, w, h, fps] = x.cut;
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(ss), '-i', src, '-frames:v', String(frames),
        '-vf', `scale=${w}:${h},fps=${fps}`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '128k', '-t', ((frames + 0.5) / fps).toFixed(6), f], { stdio: 'inherit' }); }
  }
  const p = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=width,height,r_frame_rate,nb_frames:format=duration', '-of', 'csv=p=0:s=,', f]).toString().trim().split('\n');
  console.log(`${x.name.padEnd(26)} ${p.join(' | ')}`);
}
const only = args.includes('--only') ? new Set(args[args.indexOf('--only') + 1].split(',')) : null;
const serial = args.includes('--push') ? args[args.indexOf('--push') + 1] : null;
mkdirSync(OUT, { recursive: true });

const fileOf = (x: V) => join(OUT, x.album ? x.album : '', `${x.name}.${x.ext ?? 'mp4'}`);
for (const x of VIDEOS) {
  if (only && !only.has(x.name)) continue;
  const f = fileOf(x);
  mkdirSync(join(f, '..'), { recursive: true });
  if (!existsSync(f)) {
    const secs = x.frames / x.fps;
    const venc = x.codec === 'hevc' ? ['-c:v', 'libx265', '-tag:v', 'hvc1', '-preset', 'ultrafast', '-crf', '32']
      : ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-pix_fmt', 'yuv420p'];
    execFileSync('ffmpeg', ['-v', 'error', '-y',
      '-f', 'lavfi', '-i', `testsrc2=size=${x.w}x${x.h}:rate=${x.fps}`,
      // only the audio is cut by time: an output -t drops the last video frame of a fractional length
      '-f', 'lavfi', '-t', secs.toFixed(6), '-i', 'sine=frequency=440:sample_rate=48000',
      '-frames:v', String(x.frames), ...venc, '-r', String(x.fps),
      '-c:a', x.ext === 'mkv' ? 'libopus' : 'aac', '-b:a', '64k', '-shortest', f], { stdio: 'inherit' });
    if (x.old) { const t = new Date('2025-01-01T12:00:00Z'); utimesSync(f, t, t); }
  }
  const p = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=width,height,r_frame_rate,nb_frames:format=duration', '-of', 'csv=p=0:s=,', f]).toString().trim().split('\n');
  console.log(`${x.name.padEnd(24)} ${p.join(' | ')}`);
}

if (serial) {
  const adb = (...a: string[]) => execFileSync('adb', ['-s', serial, ...a]).toString();
  // adb shell joins its arguments into one remote command line: paths with spaces are quoted for the phone's shell
  adb('shell', 'mkdir', '-p', '/sdcard/Movies/casebook-ve', "'/sdcard/Movies/VE test'");
  for (const x of VIDEOS) {
    if (only && !only.has(x.name)) continue;
    const dest = x.album ? `/sdcard/Movies/${x.album}/` : '/sdcard/Movies/casebook-ve/';
    adb('push', fileOf(x), dest);
    const remote = `${dest}${x.name}.${x.ext ?? 'mp4'}`;
    if (x.old) adb('shell', 'touch', '-t', '202501011200', `'${remote}'`);
    adb('shell', 'am', 'broadcast', '-a', 'android.intent.action.MEDIA_SCANNER_SCAN_FILE', '-d', `'file://${remote}'`);
  }
  console.log(`pushed to ${serial}: /sdcard/Movies/casebook-ve/ and /sdcard/Movies/VE test/`);
}
