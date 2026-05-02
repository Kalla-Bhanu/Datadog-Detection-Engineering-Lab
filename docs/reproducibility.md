# Reproducibility

The project can be reviewed locally without a live Datadog account.

## Requirements

- Node.js 18 or newer.
- PowerShell.
- Python for the optional local dashboard server.

## Project Checks

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

The script prints a local URL that opens the dashboard in a browser.
