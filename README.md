# Datadog Detection Engineering Lab

[![Project: Portfolio](https://img.shields.io/badge/project-portfolio-2f6f5e)](#)
[![Validation: Public Safe](https://img.shields.io/badge/validation-public--safe-3b7f72)](#privacy-and-safety)
[![Dashboard: GitHub Pages](https://img.shields.io/badge/dashboard-GitHub%20Pages-1f6feb)](#run-the-dashboard-locally)

Public-safe Datadog detection engineering project focused on monitor design,
synthetic log validation, alert triage, and a professional SOC-style dashboard
for evidence review.

This project preserves the useful Datadog work from a temporary lab account
without requiring the Datadog trial to remain active. It uses synthetic events,
sanitized monitor definitions, generated evidence panels, and local validation
checks so it can be reviewed from GitHub alone.

## What This Project Shows

- Datadog log monitor patterns for security validation events.
- Detection-as-code examples in JSON and Terraform-style form.
- A static command-center dashboard for coverage, detections, scenarios,
  telemetry, and retirement readiness.
- Synthetic Datadog-style log events with scenario IDs and expected outcomes.
- Public-safe evidence handling before a paid Datadog trial is retired.
- Runbooks that explain how an analyst would validate, triage, and escalate.

## Dashboard Experience

The dashboard is built as a static GitHub Pages-ready workbench with:

- KPI strip, ATT&CK coverage matrix, active scenario queue, and signal stream.
- Detection lifecycle cards with query focus, tuning rationale, validation, and
  sanitized detection-as-code context.
- Source health, synthetic replay timeline, evidence meters, and readiness
  gates.
- Engineer and Recruiter modes for deep technical review or fast screening.

## Detection Scenarios

1. Pipeline health for synthetic replay and live-source feeds.
2. Identity account takeover validation.
3. AWS credential misuse validation.
4. EKS secret access chain validation.
5. Endpoint-to-MongoDB pivot validation.
6. S3 data access and exfiltration validation.

## Repository Structure

```text
dashboard/              Static reviewer dashboard
data/                   Synthetic Datadog-style events
detections/             Public-safe monitor JSON and Terraform examples
docs/                   Runbooks, preservation notes, and Claude review prompts
evidence/               Evidence catalog metadata and local dashboard captures
tools/                  Validation and public-safe scanners
```

## Run The Dashboard Locally

```powershell
cd .\dashboard
powershell -ExecutionPolicy Bypass -File .\run-dashboard.ps1
```

Then open the local URL printed by the script.

## Validate The Package

```powershell
npm run validate
npm run verify:dashboard
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

## Resume Positioning

Suggested resume bullet:

> Built a public-safe Datadog detection engineering lab with synthetic log
> replay, monitor-as-code examples, triage runbooks, and a static dashboard to
> demonstrate alert validation, evidence handling, and SOC workflow design.

## Privacy And Safety

This repository does not include Datadog API keys, application keys, session
tokens, private tenant screenshots, real user data, real account IDs, or private
resource names. All data and screenshots are synthetic, generated, or sanitized.
