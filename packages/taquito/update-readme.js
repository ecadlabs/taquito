import fs from 'fs'

const readmePath = './README.md';

const manifest = require('./manifest.json')
const package = require('./package.json')

const integrityRegex = /integrity=\"(.*)\"/;
const versionRegex = /@taquito\/taquito@(.+)\/dist/

if (fs.existsSync(readmePath)) {
  let readme = fs.readFileSync(readmePath).toString('utf8');

  readme = readme.replace(integrityRegex, `integrity="${manifest['main.js'].integrity}"`)
  readme = readme.replace(versionRegex, `@taquito/taquito@${package.version}/dist`)

  fs.writeFileSync(readmePath, readme);
}
