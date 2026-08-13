import {
  appendFile,
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import {
  existsSync,
} from 'node:fs';

const manifestPath =
  'android/app/src/main/AndroidManifest.xml';

if (!existsSync(manifestPath)) {
  console.error(
    'AndroidManifest.xml wurde nicht gefunden. Führe zuerst npm run android:create aus.',
  );

  process.exit(1);
}

let manifest =
  await readFile(
    manifestPath,
    'utf8',
  );

const permissions = [
  '<uses-permission android:name="android.permission.READ_CONTACTS" />',
  '<uses-permission android:name="android.permission.WRITE_CONTACTS" />',
];

for (const permission of permissions) {

  if (!manifest.includes(permission)) {

    manifest =
      manifest.replace(
        /(<manifest[^>]*>)/u,
        `$1\n    ${permission}`,
      );
  }
}

if (!manifest.includes('android:scheme="tel"')) {

  const queries = `
    <queries>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="tel" />
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="mailto" />
        </intent>
    </queries>
`;

  manifest =
    manifest.replace(
      /\s*<application/u,
      `${queries}\n    <application`,
    );
}

await writeFile(
  manifestPath,
  manifest,
  'utf8',
);

const proguardPath =
  'android/app/proguard-rules.pro';

const rule =
  '-keep class io.capawesome.capacitorjs.plugins.** { *; }';

if (existsSync(proguardPath)) {

  const current =
    await readFile(
      proguardPath,
      'utf8',
    );

  if (!current.includes(rule)) {

    await appendFile(
      proguardPath,
      `\n${rule}\n`,
      'utf8',
    );
  }
}

const androidJavaDirectory =
  'android/app/src/main/java/de/dhbw/kontakteapp';

await mkdir(
  androidJavaDirectory,
  {
    recursive: true,
  },
);

await copyFile(
  'native/android/DefaultContactAccountPlugin.java',
  `${androidJavaDirectory}/DefaultContactAccountPlugin.java`,
);

await copyFile(
  'native/android/MainActivity.java',
  `${androidJavaDirectory}/MainActivity.java`,
);

console.log(
  'Android-Berechtigungen, URI-Abfragen, Proguard-Regel und Standardkonto-Plugin sind konfiguriert.',
);