param(
    [string]$LicenseKey
)

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

if ([string]::IsNullOrWhiteSpace($LicenseKey)) {
    $secureKey = Read-Host 'Privaten Capawesome-Lizenzschlüssel eingeben' -AsSecureString
    $LicenseKey = [System.Net.NetworkCredential]::new('', $secureKey).Password
}

if ([string]::IsNullOrWhiteSpace($LicenseKey)) {
    throw 'Es wurde kein Lizenzschlüssel angegeben.'
}

try {
    $env:CAPAWESOME_LICENSE_KEY = $LicenseKey
    node scripts/configure-private-registry.mjs
    npm install
    npm run verify

    if (-not (Test-Path 'android')) {
        npm run android:create
    }

    npm run android:sync
    npm run android:open
}
finally {
    Remove-Item Env:CAPAWESOME_LICENSE_KEY -ErrorAction SilentlyContinue
    $LicenseKey = $null
}
