# Reproducibility

The supported review path is local and public-safe.

## Requirements

- Node.js 18 or newer.
- PowerShell.
- Python for the optional local dashboard server.

## Commands

```powershell
npm run validate
npm run verify:dashboard
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

## Local Dashboard

```powershell
cd .\dashboard
powershell -ExecutionPolicy Bypass -File .\run-dashboard.ps1
```

The project does not require a live Datadog account to review.

