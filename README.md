# Datadog Detection Engineering Lab

This project preserves a Datadog detection engineering lab in a form that is
safe to share publicly. The goal is simple: show the monitor logic, the sample
events used to test it, the analyst triage paths, and the evidence that supports
the work without keeping a paid trial account open.

The dashboard is designed as a portfolio walkthrough. A recruiter can quickly
see the scope of the project, and a security interviewer can drill into the
detection logic, ATT&CK mapping, tuning notes, and response decisions.

## What I Built

- Datadog log monitor examples for identity, cloud, runtime, endpoint, and data
  access scenarios.
- Monitor definitions in JSON and Terraform-style form.
- A polished dashboard for coverage, detections, scenarios, evidence, and final
  readiness checks.
- Sample Datadog-style log events with scenario IDs and expected outcomes.
- Triage runbooks that explain how an analyst would investigate each alert.
- Evidence notes and screenshots that remain useful after the Datadog trial is
  closed.

## Dashboard

The dashboard includes:

- Project snapshot cards for monitor count, sample events, scenario coverage,
  and privacy checks.
- ATT&CK coverage mapped to the detections in the lab.
- Detection cards with query focus, tuning notes, noise considerations, and
  analyst handoff.
- Scenario walkthroughs that connect trigger, triage path, and outcome.
- Source health, replay timing, evidence confidence, and wrap-up checks.
- Engineer and Recruiter views for different review styles.

## Detection Scenarios

1. Pipeline health for the test harness and source feeds.
2. Identity account takeover.
3. AWS credential misuse.
4. EKS secret access chain.
5. Endpoint-to-MongoDB pivot.
6. S3 data access and exfiltration.

## Repository Layout

```text
dashboard/              Portfolio dashboard
data/                   Sample Datadog-style events
detections/             Monitor JSON and Terraform-style examples
docs/                   Runbooks, project notes, and preservation guidance
evidence/               Evidence catalog and local dashboard captures
tools/                  Local checks for detections, dashboard, and privacy
```

## Run The Dashboard Locally

```powershell
cd .\dashboard
powershell -ExecutionPolicy Bypass -File .\run-dashboard.ps1
```

Then open the local URL printed by the script.

## Check The Project

```powershell
npm run validate
npm run verify:dashboard
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

## Resume Positioning

Suggested resume bullet:

> Built a Datadog detection engineering lab with sample log replay, monitor
> definitions, triage runbooks, and a portfolio dashboard to demonstrate alert
> validation, evidence handling, and SOC workflow design.

## Privacy

This repository does not include Datadog keys, session tokens, private tenant
screenshots, real user data, real account IDs, or private resource names. The
events and screenshots are either modeled for the lab or sanitized for public
review.
