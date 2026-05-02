# Monitor Changelog

This changelog tracks the detection lifecycle as versioned project work. The
dates are tied to the preserved lab artifacts, not to an active Datadog tenant.

## 2026-05-02 - Evidence Preservation

- Captured sanitized Datadog screenshots for Logs Explorer, monitor inventory,
  identity monitor detail, and metrics overview.
- Added `docs/real-datadog-evidence.md` to explain what each screenshot proves.
- Added a naming note for screenshots that still show original lab labels while
  the public repo standardizes on `Datadog Lab Replay`.
- Verified the repository with the public-safety scan before committing.

## 2026-05-02 - Paired Detection Test Cases

- Added `data/test-cases.json` with positive, negative, and edge-case coverage
  for every monitor.
- Added `data/test-cases.md` and expanded `data/schema.md` to document the test
  case shape.
- Made benign lookalikes explicit so reviewers can see what each detection is
  designed not to alert on.

## 2026-05-02 - Local Validation Harness

- Added `npm run validate:cases`.
- Added `tools/validate-detection-cases.mjs` to evaluate the lab query shape
  against the paired test cases.
- Generated `evidence/validation-results.json` with 21 passing cases across 7
  monitors.
- Updated `npm run verify:all` so detection schema, test-case validation, and
  dashboard verification run together.

## 2026-05-02 - Harness Trust And Coverage Review

- Added a shared local harness evaluator used by the case validator and control
  self-test.
- Added `npm run validate:harness-controls` with five intentional failure
  controls: malformed query, missing event field, expected-outcome mismatch,
  threshold inversion, and monitor identity mismatch.
- Updated `npm run verify:all` so the harness control self-test runs with the
  normal validation suite.
- Reworked coverage analysis to include ATT&CK claim boundaries, telemetry
  tradeoffs, cost/noise reasoning, and what the lab deliberately does not
  collect or overclaim.

## 2026-05-02 - Modeled Tuning Iteration Pass

These records are lab-modeled design iterations, not production deployment
history.

| Monitor | Version | Decision |
| --- | --- | --- |
| Identity Account Takeover | v1 | Considered independent MFA reset, new geography, or new device signals. |
| Identity Account Takeover | v2 | Moved to chained account-takeover behavior to reduce single-signal noise. |
| Identity Account Takeover | v2a abandoned | Rejected blanket helpdesk-ticket suppression because it could hide support-assisted compromise. |
| Identity Account Takeover | v3 current | Kept public monitor scenario-scoped and documented production correlation requirements. |
| AWS Credential Misuse | v1 | Considered raw IAM API burst detection. |
| AWS Credential Misuse | v2 | Required suspicious key-use context and sensitive IAM pressure. |
| AWS Credential Misuse | v2a abandoned | Rejected `aws-cli/*` suppression because it would blind both attacker and legitimate CLI use. |
| AWS Credential Misuse | v3 current | Kept enumeration edge case visible and documented lower-severity production handling. |
| S3 Data Access Exfiltration | v1 | Considered any unusual sensitive-bucket access. |
| S3 Data Access Exfiltration | v2 | Added backup-window and approved-role false-positive pressure. |
| S3 Data Access Exfiltration | v2a abandoned | Rejected blanket list-only suppression because bucket listing can be reconnaissance. |
| S3 Data Access Exfiltration | v3 current | Kept the lab edge case conservative while separating access review from confirmed exfiltration. |

## 2026-05-02 - Final Consistency Hardening

- Removed future-looking ATT&CK coverage from the dashboard and kept T1041 and
  T1562 as explicit not-claimed boundaries in the gap analysis.
- Added `evidence/harness-control-results.json` so harness controls are
  cataloged as first-class evidence.
- Added one non-active AWS field-correlation example and validation report to
  show the production-maturation path without changing the 7 active monitors.
- Added evidence catalog, release manifest, and Terraform parity checks to
  `npm run verify:all`.
- Added the missing source-health Terraform-style monitor example.

## Current Monitor Set

| Monitor | Current Purpose | Tuning Status |
| --- | --- | --- |
| Datadog Lab Replay - Pipeline Health | Prove replay events are arriving. | Scoped to validation harness. |
| Datadog Lab Replay - Identity Account Takeover | Model chained identity risk. | Needs live identity risk and helpdesk context before production. |
| Datadog Lab Replay - AWS Credential Misuse | Model suspicious cloud access-key behavior. | Needs automation allowlists and API-sequence tuning before production. |
| Datadog Lab Replay - EKS Secret Access Chain | Model workload secret access and decrypt behavior. | Needs namespace, workload owner, and deployment-window enrichment. |
| Datadog Lab Replay - Endpoint To MongoDB Pivot | Model endpoint process to database access correlation. | Needs host role, process lineage, and collection sensitivity enrichment. |
| Datadog Lab Replay - S3 Data Access Exfiltration | Model sensitive object-store access risk. | Needs bucket sensitivity, byte volume, and job-window tuning. |
| Datadog Source Health - Pipeline Health Pattern | Model missing source heartbeat detection. | Needs source-specific maintenance windows and ownership mapping. |

## Release Guardrail

The current repo should not be expanded with more monitors until the existing
seven remain internally consistent across README, dashboard, validation results,
coverage notes, tuning history, and the final red-team review.
