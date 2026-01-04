const sharp = require("sharp");
const path = require("path");

async function generateFavicon() {
  const publicDir = path.join(__dirname, "..", "public");

  // Create SVG with "J" letter
  // Using palm-leaf background (#90955e) with white text
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#90955e"/>
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="22"
        font-weight="bold"
        fill="#f5f1e8"
      >J</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, "favicon-32.png"));

  // Generate 16x16 version
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, "favicon-16.png"));

  // For the app directory favicon, we need to replace the existing one
  // Next.js uses app/favicon.ico
  const appDir = path.join(__dirname, "..", "app");

  // Create a proper multi-size ICO file by creating a 32x32 PNG
  // and saving it as favicon.ico (browsers will accept PNG data in .ico)
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(appDir, "favicon.ico"));

  console.log("Created favicon.ico in app/");

  // Also create apple-touch-icon (180x180)
  const appleSvg = `
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" rx="36" fill="#90955e"/>
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="120"
        font-weight="bold"
        fill="#f5f1e8"
      >J</text>
    </svg>
  `;

  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, "apple-icon.png"));

  console.log("Created apple-icon.png in app/");

  // Update the PWA icons to match
  const pwa192Svg = `
    <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="192" rx="38" fill="#90955e"/>
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="128"
        font-weight="bold"
        fill="#f5f1e8"
      >J</text>
    </svg>
  `;

  await sharp(Buffer.from(pwa192Svg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));

  console.log("Updated icon-192.png");

  const pwa512Svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="102" fill="#90955e"/>
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="340"
        font-weight="bold"
        fill="#f5f1e8"
      >J</text>
    </svg>
  `;

  await sharp(Buffer.from(pwa512Svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));

  console.log("Updated icon-512.png");
}

generateFavicon().catch(console.error);
