import fs from 'fs';
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const production = !process.env.ROLLUP_WATCH;

function generateComment(manifest) {
  const largestKey = Object.keys(manifest).reduce((a, b) => (a.length > b.length ? a : b)).length;
  const generateLine = (key, value) => `// @${key.padEnd(largestKey, ' ')} ${value}`;
  const lines = Object.entries(manifest).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((subVal) => generateLine(key, subVal)).join('\n');
    }
    return generateLine(key, value);
  }).join('\n');
  return [
    '// ==UserScript==',
    lines,
    '// ==/UserScript==',
    '',
  ].join('\n');
}

export default function userScriptMetadataBlock() {
  const pkg = loadJSON('../package.json');

  const metadata = {
    name: 'Advanced Twins for University of Tsukuba',
    namespace: 'https://github.com/refiaa',
    version: process.env.VERSION,
    description: 'Advanced Twins for UT with kdb and various functions in it.',
    author: pkg.author,
    match: ['https://twins.tsukuba.ac.jp/campusweb/*'],
    grant: 'none',
    license: 'MIT',
  };
  return generateComment(metadata); 
}
