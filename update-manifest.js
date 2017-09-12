const pkg = require('./package.json');
const manifest = require('./dist/manifest.json');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

const file = resolve(__dirname, './dist/manifest.json');

if (manifest.version !== pkg.version) {
  manifest.version = pkg.version;
  writeFileSync(file, JSON.stringify(manifest, null, 2));
  console.log(`updated to v${manifest.version}!`); // eslint-disable-line
}
