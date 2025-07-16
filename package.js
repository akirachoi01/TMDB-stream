const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Usage: node package.js input.mp4 550
const [,, inputFile, id] = process.argv;

if (!inputFile || !id) {
  console.error("Usage: node package.js <input.mp4> <tmdb_id>");
  process.exit(1);
}

const outputDir = path.join(__dirname, "public", "streams");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const videoOut = path.join(outputDir, `${id}_video.mp4`);
const audioOut = path.join(outputDir, `${id}_audio.mp4`);
const mpdOut = path.join(outputDir, `${id}.mpd`);

const cmd = [
  `packager`,
  `input="${inputFile}",stream=video,output="${videoOut}"`,
  `input="${inputFile}",stream=audio,output="${audioOut}"`,
  `--mpd_output="${mpdOut}"`
].join(" ");

console.log(`📦 Packaging "${inputFile}" -> TMDB ID ${id}...`);

try {
  execSync(cmd, { stdio: "inherit" });
  console.log(`✅ Done! DASH files created in: public/streams/`);
} catch (e) {
  console.error("❌ Packaging failed.");
}
