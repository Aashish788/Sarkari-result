const fs = require('fs');
const path = require('path');

// Create a simple SVG icon for Sarkari Result
const createSVGIcon = (size) => {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad1)"/>
  
  <!-- Document icon -->
  <rect x="${size * 0.25}" y="${size * 0.2}" width="${size * 0.5}" height="${size * 0.6}" rx="${size * 0.05}" fill="white" opacity="0.9"/>
  
  <!-- Text lines -->
  <rect x="${size * 0.3}" y="${size * 0.35}" width="${size * 0.4}" height="${size * 0.03}" rx="${size * 0.015}" fill="#1e40af"/>
  <rect x="${size * 0.3}" y="${size * 0.45}" width="${size * 0.3}" height="${size * 0.03}" rx="${size * 0.015}" fill="#1e40af"/>
  <rect x="${size * 0.3}" y="${size * 0.55}" width="${size * 0.35}" height="${size * 0.03}" rx="${size * 0.015}" fill="#1e40af"/>
  
  <!-- Star (for government/official symbol) -->
  <polygon points="${size * 0.5},${size * 0.65} ${size * 0.52},${size * 0.7} ${size * 0.57},${size * 0.7} ${size * 0.53},${size * 0.73} ${size * 0.55},${size * 0.78} ${size * 0.5},${size * 0.75} ${size * 0.45},${size * 0.78} ${size * 0.47},${size * 0.73} ${size * 0.43},${size * 0.7} ${size * 0.48},${size * 0.7}" fill="#fbbf24"/>
</svg>`;
  
  return svg;
};

// Generate different sized icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Generating PWA icons...');

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  fs.writeFileSync(path.join(__dirname, `icon-${size}x${size}.svg`), svg);
  console.log(`Generated icon-${size}x${size}.svg`);
});

// Create favicon
const faviconSVG = createSVGIcon(32);
fs.writeFileSync(path.join(__dirname, 'favicon.svg'), faviconSVG);

// Create a simple PNG fallback using canvas (for compatibility)
const canvas2png = `
// This would be the PNG conversion logic
// For now, we'll create placeholder files
console.log('Note: Convert SVG files to PNG using online tools or ImageMagick');
console.log('Command: convert icon-{size}x{size}.svg icon-{size}x{size}.png');
`;

fs.writeFileSync(path.join(__dirname, 'convert-to-png.txt'), canvas2png);

console.log('Icon generation complete!');
console.log('Please convert SVG files to PNG format for better compatibility.'); 