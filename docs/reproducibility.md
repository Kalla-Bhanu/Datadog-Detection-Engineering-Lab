# Reproducibility

The project can be reviewed locally without a live Datadog account.

## Requirements

- Node.js 18 or newer.
- PowerShell.
- Python for the optional local dashboard server.

## Project Checks

```powershell
npm run verify:all
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

`npm run verify:all` validates monitor files, runs the local detection case
harness, and verifies the dashboard files.

## Local Dashboard

```powershell
cd .\dashboard
powershell -ExecutionPolicy Bypass -File .\run-dashboard.ps1
```

The script prints a local URL that opens the dashboard in a browser.
