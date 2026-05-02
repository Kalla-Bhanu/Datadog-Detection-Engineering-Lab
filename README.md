# Datadog Detection Engineering Lab

This project preserves a Datadog detection engineering lab in a form that is
safe to share publicly. The goal is simple: show the monitor logic, the sample
events used to test it, the tuning decisions, and the evidence that supports the
work without keeping a paid trial account open.

The dashboard is designed as a portfolio walkthrough. A recruiter can quickly
see the scope of the project, and a security interviewer can drill into the
detection logic, ATT&CK mapping, tuning notes, and response decisions.

## How This Is Different From CloudSec SOC Detection Lab

CloudSec SOC Detection Lab is the broad SOC analyst case file: AWS-first
scenarios, investigation flow, evidence preservation, and a leadership-ready
readout.

This repository is the detection engineer's workshop. It leads with the
Datadog monitor lifecycle: threat hypothesis, source assumptions, query logic,
validation events, tuning decisions, and handoff notes. The scenarios are here
to prove the monitor design, not to retell the same investigation story.

This is not a second investigation walkthrough. It is a public-safe record of
how I would design, review, tune, and preserve Datadog detections as versioned
artifacts.

## What I Built

- Datadog log monitor examples for identity, cloud, runtime, endpoint, and data
  access scenarios.
- Monitor definitions in JSON and Terraform-style form.
- Detection design notes that explain hypothesis, query rationale, validation,
  tuning, and known gaps.
- A polished dashboard for coverage, detections, scenarios, evidence, and final
  readiness checks.
- Sample Datadog-style log events with scenario IDs and expected outcomes.
- Triage runbooks that explain how each alert would move from signal to
  response decision.
- Evidence notes and screenshots that remain useful after the Datadog trial is
  closed.

## Dashboard

The dashboard includes:

- Project snapshot cards for monitor count, sample events, scenario coverage,
  and privacy checks.
- ATT&CK coverage mapped to the detections in the lab.
- Detection cards with query focus, tuning notes, noise considerations, and
  analyst handoff.
- Validation paths that connect trigger, expected monitor behavior, and outcome.
- Source health, replay timing, evidence confidence, and wrap-up checks.
- Engineer and Recruiter views for different review styles.

## Validation Scenarios

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
docs/                   Design notes, runbooks, positioning, and preservation guidance
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

> Built a Datadog detection engineering lab with monitor-as-code examples,
> sample log validation, tuning notes, and a portfolio dashboard to demonstrate
> alert logic, coverage mapping, and detection lifecycle ownership.

## Privacy

This repository does not include Datadog keys, session tokens, private tenant
screenshots, real user data, real account IDs, or private resource names. The
events and screenshots are either modeled for the lab or sanitized for public
review.
