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

