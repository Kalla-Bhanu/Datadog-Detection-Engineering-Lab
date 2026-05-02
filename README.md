# Datadog Detection Engineering Lab

[![deploy-dashboard](https://github.com/Kalla-Bhanu/Datadog-Detection-Engineering-Lab/actions/workflows/deploy-dashboard.yml/badge.svg)](https://github.com/Kalla-Bhanu/Datadog-Detection-Engineering-Lab/actions/workflows/deploy-dashboard.yml)

Live dashboard: https://kalla-bhanu.github.io/Datadog-Detection-Engineering-Lab/

I built this as the detection engineer's workshop that sits next to my CloudSec
SOC case-file project. The focus is not a bigger pile of alerts; it is whether
each Datadog monitor has a threat idea, query logic, validation pressure,
tuning notes, and evidence that survives after the trial tenant is gone.

The repo keeps the useful parts of the temporary Datadog environment: monitor
logic, sample events, validation cases, tuning decisions, runbooks, sanitized
screenshots, and a dashboard that works without a paid tenant.

## What This Project Shows

- Datadog log monitors for identity, cloud, runtime, endpoint, data access, and
  source-health scenarios.
- Monitor-as-code artifacts in JSON and Terraform-style form.
- Positive, negative, and edge-case validation for every monitor.
- A local validation harness with 21 passing cases across 7 monitors and 5
  negative-control self-tests.
- One non-active AWS field-correlation example that shows how scenario replay
  would mature toward production-style CloudTrail field logic.
- Sanitized Datadog screenshots from Logs Explorer, monitor inventory, monitor
  detail, and metrics overview.
- Tuning history, monitor changelog, coverage analysis, and triage runbooks.
- Conservative ATT&CK mapping with 4 validated entries, 2 bounded partial
  entries, and T1041/T1562 explicitly not claimed.
- A polished dashboard with overview and technical views.

## Primary Artifacts

- Live dashboard with evidence, monitor logic, validation, and closure state.
- [evidence/validation-results.json](evidence/validation-results.json) for
  the 21/21 local validation result.
- [docs/validation-harness.md](docs/validation-harness.md) for passing
  behavior, intentional failure controls, and the AWS field-correlation example.
- [docs/tuning-history.md](docs/tuning-history.md) for false-positive and
  production-readiness thinking.
- [docs/coverage-and-gaps.md](docs/coverage-and-gaps.md) for validated,
  partial, and not-claimed coverage.
- [detections/monitors](detections/monitors) for the monitor logic.

No video is included by design. The project is meant to stand on the live
dashboard, local dashboard fallback, sanitized screenshots, checked-in evidence
files, and runnable verification commands.

## How This Is Different From CloudSec SOC Detection Lab

CloudSec SOC Detection Lab is the broader SOC analyst case file: investigation
flow, AWS-first evidence, and a leadership-ready incident readout.

This repository is the detection engineer's workshop. The center of gravity is
the Datadog monitor lifecycle: threat hypothesis, source assumptions, query
logic, validation pressure, tuning decisions, and analyst handoff.

The scenarios support the detection design. They do not retell the same
investigation story.

## Why It Is Framed This Way

I think detection projects can overvalue monitor count and undervalue the
boring parts that decide whether an alert is useful: validation pairs, noise
notes, source health, and what the rule should not claim. I kept the active
monitor set small so the engineering loop is visible instead of buried under
more scenarios.

## Dashboard

Live dashboard:

```text
https://kalla-bhanu.github.io/Datadog-Detection-Engineering-Lab/
```

Run the dashboard locally:

```powershell
cd .\dashboard
powershell -ExecutionPolicy Bypass -File .\run-dashboard.ps1
```

Then open the local URL printed by the script.

The dashboard includes:

- Project snapshot cards for monitors, validation cases, evidence, ATT&CK
  mapping, critical paths, and safety checks.
- Detection cards with query focus, tuning notes, expected noise, and analyst
  handoff.
- Scenario paths for identity, AWS credential misuse, EKS secret access,
  endpoint-to-MongoDB pivot, and S3 data access.
- Evidence cards for sanitized Datadog screenshots, local validation, tuning,
  coverage gaps, and closure-ready artifacts.
- Technical and Overview modes for different levels of detail.

## Validation

Run the local checks:

```powershell
npm run verify:all
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

`npm run verify:all` runs:

- Monitor and sample-event schema validation.
- Positive, negative, and edge-case detection validation.
- Harness control self-tests for intentional failure paths.
- One AWS field-correlation example with positive, negative, and edge cases.
- Evidence catalog and release manifest verification.
- Static dashboard verification.

The validation harness is documented in
[docs/validation-harness.md](docs/validation-harness.md).

## Repository Layout

```text
dashboard/              Static dashboard
data/                   Sample events and paired detection test cases
detections/             Monitor JSON and Terraform-style examples
docs/                   Design notes, tuning history, runbooks, coverage, QA
evidence/               Evidence catalog, screenshots, validation result
tools/                  Local checks for detections, dashboard, cases, privacy
```

## Privacy And Closure Boundary

This repository does not include Datadog keys, session tokens, private tenant
URLs, real user data, real account IDs, or private resource names. Screenshots
are sanitized, and sample events use public-safe placeholders.

The live Datadog tenant should not be described as active after closure. The
project remains a completed lab with durable evidence and responsible cost
control.
