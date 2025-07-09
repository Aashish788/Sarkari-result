const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create high-quality PNG icons from SVG
async function createPNGIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  console.log('Converting SVG icons to PNG...');
  
  for (const size of sizes) {
    try {
      const svgPath = path.join(__dirname, `icon-${size}x${size}.svg`);
      const pngPath = path.join(__dirname, `icon-${size}x${size}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(size, size)
          .png({ quality: 90, compressionLevel: 9 })
          .toFile(pngPath);
          
        console.log(`✓ Created icon-${size}x${size}.png`);
      }
    } catch (error) {
      console.error(`Error creating ${size}x${size} icon:`, error.message);
    }
  }
  
  // Create favicon.png
  try {
    const faviconSvgPath = path.join(__dirname, 'favicon.svg');
    const faviconPngPath = path.join(__dirname, 'favicon.png');
    
    if (fs.existsSync(faviconSvgPath)) {
      await sharp(faviconSvgPath)
        .resize(32, 32)
        .png({ quality: 90 })
        .toFile(faviconPngPath);
        
      console.log('✓ Created favicon.png');
    }
  } catch (error) {
    console.error('Error creating favicon:', error.message);
  }
  
  // Create Apple Touch Icon
  try {
    const appleTouchIconPath = path.join(__dirname, 'apple-touch-icon.png');
    const sourceIcon = path.join(__dirname, 'icon-192x192.svg');
    
    if (fs.existsSync(sourceIcon)) {
      await sharp(sourceIcon)
        .resize(180, 180)
        .png({ quality: 90 })
        .toFile(appleTouchIconPath);
        
      console.log('✓ Created apple-touch-icon.png');
    }
  } catch (error) {
    console.error('Error creating Apple touch icon:', error.message);
  }
  
  console.log('PNG icon generation complete!');
}

// Run the conversion
createPNGIcons().catch(console.error); 