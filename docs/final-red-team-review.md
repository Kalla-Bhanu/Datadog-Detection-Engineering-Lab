# Final Red-Team Review

This checklist is the last public-release gate for the Datadog Detection
Engineering Lab. It is intentionally stricter than a normal README review
because the project is a security release artifact: small contradictions,
privacy leaks, or unsupported claims can weaken the whole project.

## Privacy And Public-Safety Checks

| Check | Pass Criteria | Status |
| --- | --- | --- |
| Private identities | No real emails, personal usernames, organization names, or user records. | Pass |
| Cloud identifiers | No real account IDs, private ARNs, tenant URLs, or resource names. | Pass |
| Secrets | No Datadog keys, cloud keys, session tokens, cookies, or headers. | Pass |
| Screenshots | Retained images are sanitized and referenced by purpose. | Pass |
| Evidence catalog | Screenshot and validation references match files that exist. | Pass |

## Claim Consistency Checks

| Check | Pass Criteria | Status |
| --- | --- | --- |
| Monitor count | README, dashboard, validation output, and docs all say 7 monitors. | Pass |
| Validation count | README, dashboard, validation report, and docs all say 21 cases. | Pass |
| Harness controls | `verify:all` includes the negative-control self-test. | Pass |
| Field example | The AWS field-correlation example is validated but not counted as an active monitor. | Pass |
| Release manifest | Counts and no-video/no-live-service boundaries are locally verified. | Pass |
| Datadog status | Repo describes the tenant as retired or evidence-retained, not active. | Pass |
| Video status | README does not claim a video unless a real link exists. | Pass |
| Production claims | No document says detections were tuned or operated in production. | Pass |

## ATT&CK Mapping Review

Each mapping must include both the reason it applies and the boundary it does
not cover.

| Mapping | Justification | Boundary |
| --- | --- | --- |
| T1078.004 Cloud Accounts | Identity account-takeover monitor models suspicious cloud identity use after MFA and device-risk pressure. | Does not cover every cloud account abuse path or prove live impossible-travel baselines. |
| T1552.007 Cloud/metadata credential exposure | AWS credential misuse monitor models a key used from a new context for sensitive IAM activity. | Does not prove where the credential was originally exposed. |
| T1098 Account Manipulation | Partial only: AWS credential misuse test data includes IAM policy pressure as one account-manipulation path. | Does not cover trust-policy changes, group membership changes, account creation, or every account-manipulation variant. |
| T1613 Container and Resource Discovery | EKS monitor models workload identity touching protected Kubernetes secret paths. | Does not cover every discovery command, admission bypass, or cluster enumeration path. |
| T1021 Remote Services | Partial only: endpoint-to-MongoDB monitor models endpoint process activity followed by remote data service access. | Does not prove SMB/RDP/SSH coverage, credential replay, database compromise, or broad lateral movement protocol coverage. |
| T1530 Data from Cloud Storage | S3 monitor models unusual object access against sensitive cloud storage. | Does not prove transfer destination, DLP classification, or completed exfiltration. |
| T1041 Exfiltration Over C2 Channel | Not claimed; storage reads can precede exfiltration, but the repo lacks egress proof. | Kept out of dashboard coverage. |
| T1562 Impair Defenses | Not claimed; source health models telemetry silence only. | Kept out of dashboard coverage because it does not prove attacker-caused impairment. |

## Required Commands

```powershell
npm run verify:all
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\tools\verify-public-safe.ps1
```

Expected command result:

- 7 monitors and 9 synthetic events validate.
- 21 detection cases pass with 0 failures.
- 5 harness control cases pass by failing for the intended reasons.
- 3 AWS field-correlation example cases pass with 0 failures.
- Evidence catalog and release manifest verification pass.
- Dashboard static verification passes.
- Public-safe scan passes.

## Browser QA

Review the dashboard locally before release:

- Desktop evidence/readiness views show validation, evidence trail, and source
  health without overlap.
- Mobile evidence/readiness views stack cleanly and file paths wrap.
- Console is clean of errors.
- No horizontal overflow appears on mobile.

## Final Execution Log

| Date | Owner | Result | Notes |
| --- | --- | --- | --- |
| 2026-05-02 | Local release review | Pass | `npm run verify:all` passed; public-safe scan passed across 66 files; evidence catalog and release manifest checks passed; desktop and mobile dashboard QA passed with no console warnings or horizontal overflow; no project video is required or claimed. |
