import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

if (existsSync('android')) {
  console.error('Der Ordner android/ existiert bereits. Verwende npm run android:sync.');
  process.exit(1);
}
execFileSync('npx', ['cap', 'add', 'android'], { stdio: 'inherit', shell: process.platform === 'win32' });
execFileSync('node', ['scripts/configure-android.mjs'], { stdio: 'inherit' });
console.log('Android-Projekt wurde erstellt und konfiguriert.');
