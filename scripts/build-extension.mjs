import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const dist = 'dist';
console.log('Building extension...');

// Clean and create dist directory
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

// Copy essential files
const filesToCopy = ['manifest.json'];
for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(dist, file));
    console.log(`Copied ${file}`);
  }
}

// Copy directories
const dirsToCopy = ['src', 'icons'];
for (const dir of dirsToCopy) {
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, path.join(dist, dir), { recursive: true });
    console.log(`Copied ${dir}/`);
  }
}

// Create simple PNG icons if they don't exist
const iconSizes = [16, 48, 128];
for (const size of iconSizes) {
  const iconPath = path.join(dist, 'icons', `icon${size}.png`);
  if (!fs.existsSync(iconPath)) {
    // Create a simple colored square as PNG (base64 encoded 1x1 pixel)
    const pngData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(iconPath, pngData);
    console.log(`Created icon${size}.png`);
  }
}

// Generate ZIP
const output = fs.createWriteStream(path.join(dist, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Archive created: ${archive.pointer()} bytes`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(dist, false);
await archive.finalize();

console.log('Build completed successfully!');
console.log('Extension files in dist/');
console.log('Extension ZIP in dist/extension.zip');
