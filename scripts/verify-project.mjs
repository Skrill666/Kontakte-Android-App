import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ignored = new Set(['node_modules', 'dist', 'android', '.git']);
const findings = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await scan(path);
    else if (/\.(ts|vue|md|json|mjs|css|html)$/u.test(entry.name)) {
      const content = await readFile(path, 'utf8');
      if (/ca_[0-9a-f-]{20,}/iu.test(content)) findings.push(`${path}: möglicher Lizenzschlüssel`);
      const markerPattern = new RegExp('\\b(?:FIX' + 'ME|X' + 'XX)\\b', 'u');
      if (markerPattern.test(content)) findings.push(`${path}: offener Platzhalter`);
    }
  }
}
await scan('.');
if (findings.length) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log('Projektprüfung erfolgreich: kein eingebetteter Lizenzschlüssel und keine offenen Fehlerplatzhalter gefunden.');
