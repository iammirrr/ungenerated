#!/usr/bin/env node
// encode.mjs - the App Store preview file from a Remotion master, or from blurred frames plus the master's audio.
//
//   node encode.mjs <master.mp4> <out.mp4>                       re-encode a master to Apple's spec
//   node encode.mjs <master.mp4> <out.mp4> --frames <dir>        frames f00000.png... (tools/mb) with the master's audio
//
// Apple's App Preview spec (iPhone 6.9"/6.5"): 886 x 1920, 15 to 30 s, 30 fps, H.264 High <= 4.0, ~11 Mbps, AAC stereo
// 48 kHz with an audio track. FFMPEG=/path/to/ffmpeg when it isn't on PATH. Run from node, not a bash script: on macOS
// bash drops DYLD_LIBRARY_PATH, and a bundled ffmpeg (Remotion's) then can't load its libraries.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";

const [master, out] = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--frames");
const fi = process.argv.indexOf("--frames");
const frames = fi > 0 ? process.argv[fi + 1] : null;
if (!master || !out) { console.error("usage: node encode.mjs <master.mp4> <out.mp4> [--frames <dir>]"); process.exit(2); }
const FF = process.env.FFMPEG || "ffmpeg";
const env = { ...process.env, ...(process.env.FFMPEG ? { DYLD_LIBRARY_PATH: dirname(process.env.FFMPEG) } : {}) };
const run = (args) => { const r = spawnSync(FF, ["-v", "error", "-y", ...args], { stdio: "inherit", env }); if (r.status) process.exit(r.status || 1); };

let input = master;
if (frames) {
  const list = readdirSync(frames).filter((f) => /^f\d{5}\.png$/.test(f)).sort();
  const first = +list[0].slice(1, 6), last = +list.at(-1).slice(1, 6);
  if (list.length !== last - first + 1) { console.error(`${frames}: ${list.length} frames between ${first} and ${last}: some are missing`); process.exit(1); }
  input = out.replace(/\.mp4$/, ".mb.mp4");
  run(["-framerate", "30", "-start_number", String(first), "-i", join(frames, "f%05d.png"), "-i", master, "-map", "0:v", "-map", "1:a", "-c:a", "copy",
    "-vf", "scale=in_range=pc:out_range=tv:out_color_matrix=bt709:flags=accurate_rnd+full_chroma_int+lanczos,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-profile:v", "high", "-movflags", "+faststart", input]);
}
run(["-i", input, "-map", "0:v", "-map", "0:a", "-r", "30", "-c:v", "libx264", "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
  "-b:v", "11M", "-maxrate", "12M", "-bufsize", "24M", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", out]);
const probe = spawnSync(FF, ["-i", out], { encoding: "utf8", env }).stderr;
const secs = (([, h, m, s]) => +h * 3600 + +m * 60 + +s)(probe.match(/Duration: (\d+):(\d+):([\d.]+)/) || [0, 0, 0, 0]);
const size = (probe.match(/, (\d+)x(\d+)/) || []).slice(1).join(" x ");
console.log(`${out}: ${secs.toFixed(2)} s, ${size}${secs < 15 || secs > 30 ? "  NOT ACCEPTED: Apple takes 15 to 30 s" : ""}${existsSync(out) ? "" : " (missing)"}`);
