# Release QA

This note records the final review gates for the public version of
the lab.

## Required Checks

```powershell
npm run verify:all
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

Expected result:

- Monitor and sample-event validation passes.
- Local detection case validation reports 21 passing cases and 0 failures.
- Harness control self-test reports all intentional failures were caught.
- AWS field-correlation example validation reports 3 passing cases and 0
  failures.
- Evidence catalog and release manifest verification pass.
- Dashboard static verification passes.
- Public-safe verification passes.
- Final red-team review is completed in
  [docs/final-red-team-review.md](final-red-team-review.md).

## Browser QA

The dashboard should be opened locally and checked in two sizes:

- Desktop evidence view: validation summary and evidence artifact trail are
  visible.
- Mobile evidence view: cards stack cleanly, file paths wrap, and there is no
  horizontal overflow.

Retained browser QA screenshots:

- `evidence/dashboard-evidence-upgraded-local.png`
- `evidence/dashboard-mobile-evidence-upgraded-local.png`

## Release Boundary

The repo is ready to publish when the checks above pass and the README still
describes the project as a completed lab with retained evidence, not as an
active Datadog tenant or video-dependent material.
