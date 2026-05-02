# Coverage And Gap Analysis

This lab is a focused Datadog detection engineering project. It shows monitor
design, sample-event validation, tuning decisions, source-health thinking, and
evidence preservation. It does not claim full enterprise SOC coverage.

The coverage below should be read as portfolio coverage: what the lab proves
with public-safe artifacts, what is only partially represented, and what would
need production telemetry before I would call it complete in a real environment.

## Coverage Summary

| Area | Status | What The Repo Proves | Main Limitation |
| --- | --- | --- | --- |
| Detection lifecycle | Strong | Monitor definitions, test cases, validation harness, tuning notes, runbooks. | Live Datadog tenant is retired after evidence capture. |
| Identity detection | Strong lab coverage | Account-takeover pattern, benign MFA reset, edge travel case. | No real user baseline, device trust, or identity-risk score. |
| Cloud credential misuse | Strong lab coverage | Suspicious API behavior, approved runner suppression, enumeration edge case. | No live automation inventory or access-key baseline. |
| Runtime secret access | Strong lab coverage | Secret access and decrypt behavior with controller false-positive pressure. | No real cluster owner map or namespace criticality feed. |
| Endpoint-to-data pivot | Partial coverage | Endpoint process plus MongoDB access chain. | No real EDR process tree or database audit integration. |
| S3 data access | Strong lab coverage | Sensitive bucket access, backup suppression, list-only edge case. | No DLP, byte-count baseline, or network egress proof. |
| Source health | Strong lab pattern | Missing-heartbeat monitor and heartbeat suppress case. | Source-specific ownership and maintenance windows are modeled. |
| Alert routing | Partial coverage | Severity and runbook route are documented. | No live on-call, Jira, Slack, or case-management workflow. |

## ATT&CK Mapping

The ATT&CK mapping is deliberately conservative. Techniques are used to explain
the security behavior being modeled, not to claim full coverage of a technique.

| Scenario | Candidate Mapping | Lab Status | Evidence |
| --- | --- | --- | --- |
| Identity account takeover | T1078.004 Cloud Accounts | Validated | Monitor JSON, test cases, local validation results, identity runbook. |
| AWS credential misuse | T1552.007 Cloud/metadata credential exposure and T1098 account manipulation pressure | Partial | Monitor JSON, test cases, tuning notes. |
| EKS secret access chain | T1613 Container and Resource Discovery | Validated for lab pattern | Monitor JSON, runtime runbook, edge-case validation. |
| Endpoint to MongoDB pivot | T1021 Remote Services | Partial | Monitor JSON, scenario walkthrough, endpoint/data runbook. |
| S3 data access exfiltration | T1530 Data from Cloud Storage | Validated for lab pattern | Monitor JSON, S3 test cases, data response runbook. |
| S3 exfiltration over network | T1041 Exfiltration Over C2 Channel | Planned | The repo does not include network egress proof. |
| Source or logging impairment | T1562 Impair Defenses | Planned | The repo models missing data but does not prove attacker-caused impairment. |

## Evidence Confidence

| Evidence Type | Confidence | Why It Matters |
| --- | --- | --- |
| Monitor definitions | High | The detection logic is versioned as JSON and Terraform-style artifacts. |
| Test-case pairs | High | Every monitor has positive, negative, and edge-case pressure. |
| Local validation report | High | The harness evaluates 21 cases across 7 monitors with expected outcomes met. |
| Sanitized Datadog screenshots | High | They prove the lab existed in Datadog before account retirement. |
| Dashboard screenshots | Medium | They prove the portfolio experience renders locally. |
| Production behavior | Not claimed | The repo is a lab, not an active production deployment. |

## Red Flags I Removed

- No active paid Datadog dependency is required for review.
- No private account IDs, user emails, tenant links, API keys, or session data
  are kept in the repo.
- Screenshots are sanitized and documented instead of left as unexplained proof.
- Detection names are normalized to `Datadog Lab Replay` for public review.
- False positives are documented as part of the engineering work, not hidden.
- The local harness makes expected outcomes reproducible without live billing.

## Remaining Gaps

| Gap | Why It Matters | How I Would Close It |
| --- | --- | --- |
| Production baselines | Real detections need normal behavior ranges. | Add historical aggregates for users, roles, API volume, buckets, and hosts. |
| Suppression governance | Allowlisting can hide real attacks if unmanaged. | Store suppressions as reviewed records with owner, reason, expiry, and test cases. |
| Multi-event correlation | Scenario tags simplify the public lab. | Replace scenario-level triggers with field-level joins and event sequencing. |
| Alert quality metrics | A mature program tracks precision and fatigue. | Add alert volume, true-positive rate, false-positive reason, and time-to-triage metrics. |
| Live routing | Analysts need case workflow context. | Add ticket/notification routing examples with sanitized payloads. |
| Response automation | Some actions can be safely automated. | Add guarded examples for disable key, expire session, isolate host, or block bucket access. |
| Data exposure proof | Exfiltration needs more than storage reads. | Add byte volume, destination, DLP label, and network egress evidence. |

## Interview Framing

The strongest way to present this project is:

1. I built the detection lifecycle, not just screenshots.
2. I kept the lab public-safe while preserving real Datadog evidence.
3. I tested each monitor with positive, negative, and edge cases.
4. I documented tuning decisions and known gaps like a detection engineer would.
5. I retired paid services after preserving the artifacts needed for review.

That framing is honest and useful. It shows judgment, cost awareness, and the
ability to turn a temporary lab into a durable portfolio project.

