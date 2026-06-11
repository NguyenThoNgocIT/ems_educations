const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, 'out');

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function getDirsRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file.startsWith('__next.')) {
        results.push(filePath);
      } else {
        results = results.concat(getDirsRecursively(filePath));
      }
    }
  });
  return results;
}

if (!fs.existsSync(outDir)) {
  console.log(`Skipping: out directory not found at ${outDir}`);
  process.exit(0);
}

console.log(`Scanning for __next.* directories in ${outDir}...`);
const nextDirs = getDirsRecursively(outDir);
console.log(`Found ${nextDirs.length} directories to flatten.`);

nextDirs.forEach(dirPath => {
  const parentPath = path.dirname(dirPath);
  console.log(`Flattening directory: ${path.relative(outDir, dirPath)}`);
  
  const files = getFilesRecursively(dirPath);
  files.forEach(filePath => {
    const relativeFromParent = path.relative(parentPath, filePath);
    // Replace all path separators (backslash or forward slash) with dots
    const flattenedName = relativeFromParent.replace(/[\\/]/g, '.');
    const destPath = path.join(parentPath, flattenedName);
    
    // Ensure destination directory exists (it should be parentPath, which definitely exists)
    fs.renameSync(filePath, destPath);
    console.log(`  Moved & Renamed:\n    From: ${path.relative(outDir, filePath)}\n    To:   ${path.relative(outDir, destPath)}`);
  });
  
  // Recursively clean up the empty __next.* directory
  fs.rmSync(dirPath, { recursive: true, force: true });
  console.log(`  Removed directory: ${path.relative(outDir, dirPath)}`);
});

console.log('Flattening complete!');
