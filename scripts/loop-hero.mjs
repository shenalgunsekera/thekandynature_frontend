// Build a seamless, FULL-LENGTH, forward-motion loop from a source clip.
// Technique: crossfade the last D seconds back into the first D seconds, so the
// final frame matches the first frame. No boomerang, no hard cut.
//
// usage: node scripts/loop-hero.mjs <input> <output> [crossfadeSeconds]

import ffmpeg from "ffmpeg-static";
import { execFileSync } from "node:child_process";

const input = process.argv[2] || "public/hero-src.mp4";
const output = process.argv[3] || "public/hero-video.mp4";
const D = parseFloat(process.argv[4] || "1.0"); // crossfade length (s)

// read duration from ffmpeg's stderr (ffmpeg -i exits non-zero with no output)
let stderr = "";
try {
  execFileSync(ffmpeg, ["-i", input], { stdio: ["ignore", "ignore", "pipe"] });
} catch (e) {
  stderr = e.stderr ? e.stderr.toString() : "";
}
const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
if (!m) {
  console.error("Could not read duration.\n", stderr.slice(0, 600));
  process.exit(1);
}
const T = +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]);
const offset = (T - 2 * D).toFixed(3); // xfade start on stream A's timeline
console.log(`duration ${T.toFixed(2)}s, crossfade ${D}s, offset ${offset}s`);

const filter = [
  "[0:v]scale=1920:-2,fps=30,setpts=PTS-STARTPTS[s]",
  "[s]split[s1][s2]",
  `[s1]trim=start=${D},setpts=PTS-STARTPTS[a]`,
  `[s2]trim=start=0:end=${D},setpts=PTS-STARTPTS[b]`,
  `[a][b]xfade=transition=fade:duration=${D}:offset=${offset}[v]`,
].join(";");

execFileSync(
  ffmpeg,
  [
    "-y", "-i", input,
    "-filter_complex", filter,
    "-map", "[v]", "-an",
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-crf", "23", "-preset", "slow",
    "-movflags", "+faststart",
    output,
  ],
  { stdio: "inherit" }
);
console.log("SEAMLESS LOOP DONE ->", output);
