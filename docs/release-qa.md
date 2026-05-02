# Release QA

This note records the final review gates for the public portfolio version of
the lab.

## Required Checks

```powershell
npm run verify:all
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

Expected result:

- Monitor and sample-event validation passes.
- Local detection case validation reports 21 passing cases and 0 failures.
- Dashboard static verification passes.
- Public-safe verification passes.

## Browser QA

The dashboard should be opened locally and checked in two sizes:

- Desktop evidence view: validation summary and evidence artifact trail are
  visible.
- Mobile evidence view: cards stack cleanly, file paths wrap, and there is no
  horizontal overflow.

Preserved browser QA screenshots:

- `evidence/dashboard-evidence-upgraded-local.png`
- `evidence/dashboard-mobile-evidence-upgraded-local.png`

## Release Boundary

The repo is ready to publish when the checks above pass and the README still
describes the project as a completed lab with preserved evidence, not as an
active Datadog tenant.
