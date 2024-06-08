
const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build');

if (fs.existsSync(buildPath)) {
  fs.rmSync(buildPath, { recursive: true, force: true });
  console.log('Build directory cleaned');
} else {
  console.log('Build directory does not exist');
}
