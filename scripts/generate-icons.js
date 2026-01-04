const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateIcons() {
  const publicDir = path.join(__dirname, "..", "public");
  const logoPath = path.join(publicDir, "logo.svg");

  // Read the SVG and extract the embedded PNG data
  const svgContent = fs.readFileSync(logoPath, "utf-8");
  const base64Match = svgContent.match(
    /data:image\/png;base64,([A-Za-z0-9+/=]+)/
  );

  if (!base64Match) {
    console.error("Could not find embedded PNG in logo.svg");
    process.exit(1);
  }

  const pngBuffer = Buffer.from(base64Match[1], "base64");

  // Generate 192x192 icon
  await sharp(pngBuffer)
    .resize(192, 192, {
      fit: "contain",
      background: { r: 245, g: 241, b: 232, alpha: 1 }, // soft-linen
    })
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));

  console.log("Created icon-192.png");

  // Generate 512x512 icon
  await sharp(pngBuffer)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 245, g: 241, b: 232, alpha: 1 }, // soft-linen
    })
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));

  console.log("Created icon-512.png");
}

generateIcons().catch(console.error);
