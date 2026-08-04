# Installationsanleitung

## Voraussetzungen

- Node.js 22 oder neuer
- npm
- Android Studio 2025.2.1 oder neuer
- installiertes Android SDK
- Android-Emulator oder physisches Gerät ab Android 7 / API 24
- privater Lizenzschlüssel aus dem Aufgabenblatt für das Contacts-Plugin

## Automatisches Setup unter Windows

1. PowerShell im Projektordner öffnen.
2. Folgenden Befehl ausführen:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1
```

Das Skript fragt den Lizenzschlüssel verdeckt ab, richtet die private Registry lokal ein, installiert die Pakete, führt Tests und Build aus, erzeugt das Android-Projekt, ergänzt Manifest und Proguard-Regel und öffnet Android Studio.

## Sicherheit

Der Schlüssel wird ausschließlich in der lokalen Datei `.npmrc` gespeichert. `.npmrc` ist über `.gitignore` ausgeschlossen und darf weder committed noch weitergegeben werden. Der Schlüssel darf nicht in Screenshots, Präsentationen oder Protokollen sichtbar sein.

Nach `npm install` entsteht `package-lock.json`. Diese Datei soll für reproduzierbare Installationen in das Team-Repository übernommen werden.
