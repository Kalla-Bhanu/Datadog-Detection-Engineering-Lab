# Datadog Detection Engineering Lab

[![deploy-dashboard](https://github.com/Kalla-Bhanu/Datadog-Detection-Engineering-Lab/actions/workflows/deploy-dashboard.yml/badge.svg)](https://github.com/Kalla-Bhanu/Datadog-Detection-Engineering-Lab/actions/workflows/deploy-dashboard.yml)

Live dashboard: https://kalla-bhanu.github.io/Datadog-Detection-Engineering-Lab/

This is a public-safe Datadog detection engineering lab. It preserves the work
that matters after a temporary Datadog tenant is shut down: monitor logic,
sample events, validation cases, tuning decisions, runbooks, screenshots, and a
portfolio dashboard.

The project is built to show detection engineering judgment, not just alert
screenshots. A reviewer can see what each detection is supposed to catch, what
it should ignore, how it was tested, what evidence exists, and what gaps would
need production telemetry.

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
- A polished dashboard that presents the project for recruiters and technical
  interviewers.

## Five-Minute Review Path

1. Open the live dashboard and start with the Evidence section.
2. Review [evidence/validation-results.json](evidence/validation-results.json)
   for the 21/21 local validation result.
3. Read [docs/validation-harness.md](docs/validation-harness.md) to see how
   the harness proves passing behavior, intentional failure controls, and the
   AWS field-correlation example.
4. Read [docs/tuning-history.md](docs/tuning-history.md) to see the false
   positive and production-readiness thinking.
5. Read [docs/coverage-and-gaps.md](docs/coverage-and-gaps.md) to see what is
   validated, partial, and not claimed.
6. Inspect [detections/monitors](detections/monitors) for the monitor logic.

No walkthrough video is included by design. The project is meant to be reviewed
through the live dashboard, local dashboard fallback, preserved screenshots,
checked-in evidence files, and runnable verification commands.

## How This Is Different From CloudSec SOC Detection Lab

CloudSec SOC Detection Lab is the broader SOC analyst case file: investigation
flow, AWS-first evidence, and a leadership-ready incident readout.

This repository is the detection engineer's workshop. The center of gravity is
the Datadog monitor lifecycle: threat hypothesis, source assumptions, query
logic, validation pressure, tuning decisions, and analyst handoff.

The scenarios support the detection design. They do not retell the same
investigation story.

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
- Engineer and Recruiter modes for different review styles.

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
dashboard/              Portfolio dashboard
data/                   Sample events and paired detection test cases
detections/             Monitor JSON and Terraform-style examples
docs/                   Design notes, tuning history, runbooks, coverage, QA
evidence/               Evidence catalog, screenshots, validation result
tools/                  Local checks for detections, dashboard, cases, privacy
```

## Resume Positioning

Suggested resume bullet:

> Built a Datadog detection engineering lab with monitor-as-code artifacts,
> positive/negative/edge-case validation, harness failure controls, sanitized
> Datadog evidence, tuning history, and a portfolio dashboard demonstrating
> alert logic, false-positive handling, ATT&CK coverage, and detection
> lifecycle ownership.

Short interview framing:

```text
I built this as a temporary Datadog detection engineering lab, preserved the monitor logic and real sanitized evidence, then added local validation so the project stays reviewable without keeping paid services running.
```

## Privacy And Closure Boundary

This repository does not include Datadog keys, session tokens, private tenant
URLs, real user data, real account IDs, or private resource names. Screenshots
are sanitized, and sample events use public-safe placeholders.

The live Datadog tenant should not be described as active after closure. The
project should be presented as a completed lab with preserved evidence and
responsible cost control.
