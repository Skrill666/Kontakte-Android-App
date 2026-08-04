import { writeFile } from 'node:fs/promises';

const key = process.env.CAPAWESOME_LICENSE_KEY?.trim();
if (!key || key === 'YOUR_LICENSE_KEY') {
  console.error('CAPAWESOME_LICENSE_KEY fehlt. Setze die Umgebungsvariable und führe den Befehl erneut aus.');
  process.exit(1);
}
const content = [
  '@capawesome-team:registry=https://npm.registry.capawesome.io',
  `//npm.registry.capawesome.io/:_authToken=${key}`,
  '',
].join('\n');
await writeFile('.npmrc', content, { encoding: 'utf8', mode: 0o600 });
console.log('.npmrc wurde lokal erstellt. Die Datei ist durch .gitignore geschützt.');
