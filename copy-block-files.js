/**
 * Script to copy block.json and frontend.js files to build directories
 */
const fs = require('fs');
const path = require('path');

// Blocks to process
const blocks = fs.readdirSync(path.join(__dirname, 'src')).filter(dir => fs.statSync(path.join(__dirname, 'src', dir)).isDirectory());

// Files to copy for each block
const filesToCopy = [
  'frontend.js'
];

// Process each block
blocks.forEach(block => {
  const srcDir = path.join(__dirname, 'src', block);
  const buildDir = path.join(__dirname, 'build', block);
  
  // Create build directory if it doesn't exist
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Copy each file if it exists
  filesToCopy.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const buildFile = path.join(buildDir, file);
    
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, buildFile);
      console.log(`Copied ${file} for ${block}`);
    } else {
      console.log(`File ${file} does not exist for ${block}`);
    }
  });
});

console.log('Block files copying completed!');
