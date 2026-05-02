# Coverage And Gap Analysis

This lab is a focused Datadog detection engineering project. It shows monitor
design, sample-event validation, harness self-tests, tuning decisions,
source-health thinking, and evidence preservation. It does not claim full
enterprise SOC coverage.

The coverage below should be read as portfolio coverage: what the lab proves
with public-safe artifacts, what is only partially represented, and what would
need production telemetry before I would call it complete in a real environment.

## Coverage Summary

| Area | Status | What The Repo Proves | Main Limitation |
| --- | --- | --- | --- |
| Detection lifecycle | Strong | Monitor definitions, test cases, validation harness, control self-tests, tuning notes, runbooks. | Live Datadog tenant is retired after evidence capture. |
| Identity detection | Strong lab coverage | Account-takeover pattern, benign MFA reset, edge travel case. | No real user baseline, device trust, identity-risk score, or HR/owner context. |
| Cloud credential misuse | Strong lab coverage | Suspicious API behavior, approved runner suppression, enumeration edge case. | No live automation inventory, access-key baseline, or approval feed. |
| Runtime secret access | Strong lab coverage | Secret access and decrypt behavior with controller false-positive pressure. | No real cluster owner map, namespace criticality feed, or admission context. |
| Endpoint-to-data pivot | Partial coverage | Endpoint process plus MongoDB access chain. | No real EDR process tree or MongoDB audit integration. |
| S3 data access | Strong lab coverage | Sensitive bucket access, backup suppression, list-only edge case. | No DLP labels, byte-count baseline, object sensitivity inventory, or egress proof. |
| Source health | Strong lab pattern | Missing-heartbeat monitor and heartbeat suppress case. | Source-specific ownership and maintenance windows are modeled. |
| Alert routing | Partial coverage | Severity and runbook route are documented. | No live on-call, Jira, Slack, or case-management workflow. |

## ATT&CK Mapping

The ATT&CK mapping is deliberately conservative. Each mapping explains what the
lab covers and what it does not cover inside the broader technique.

Dashboard coverage contains 4 validated entries and 2 partial entries. Partial
means the lab models one defensible behavior inside the technique, but does not
claim broad technique coverage.

| Scenario | Candidate Mapping | Why The Mapping Applies | What It Does Not Claim |
| --- | --- | --- | --- |
| Identity account takeover | T1078.004 Cloud Accounts | The monitor models suspicious cloud identity use after MFA and device-risk pressure. | It does not cover every cloud account abuse path or prove live impossible-travel baselines. |
| AWS credential misuse | T1552.007 Cloud/metadata credential exposure and T1098 account manipulation pressure | T1552.007 is validated as a credential-use scenario: the test cases model a key used from a new context for sensitive IAM activity. T1098 is partial because the fixture includes IAM policy pressure, but only as one account-manipulation path. | It does not prove the original credential exposure source, role trust changes, group membership changes, account creation, or all account-manipulation variants. |
| EKS secret access chain | T1613 Container and Resource Discovery | The monitor models workload identity touching protected Kubernetes secret paths. | It does not cover every discovery command, admission bypass, or cluster enumeration path. |
| Endpoint to MongoDB pivot | T1021 Remote Services | T1021 is partial because the monitor models a workstation process reaching a remote MongoDB service, which is enough to show remote-service access pressure. | It does not prove broad lateral movement protocol coverage, remote authentication abuse, SMB/RDP/SSH behavior, credential replay, or database compromise. |
| S3 data access exfiltration | T1530 Data from Cloud Storage | The monitor models unusual object access against sensitive cloud storage. | It does not prove transfer destination, DLP classification, or completed exfiltration. |
| S3 exfiltration over network | T1041 Exfiltration Over C2 Channel | Not claimed; storage reads can be a precursor to exfiltration, but they are not destination or egress proof. | The repo does not include network egress proof and should not claim T1041 coverage. |
| Source or logging impairment | T1562 Impair Defenses | Not claimed; missing-data monitoring is relevant to impaired visibility, but source silence alone is not attribution. | The repo models telemetry loss but does not prove attacker-caused impairment. |

## Telemetry Tradeoff Matrix

| Telemetry Decision | Coverage Gained | Cost Or Noise Risk | Production Decision Rule |
| --- | --- | --- | --- |
| Enable CloudTrail management events across accounts | Better identity, IAM, role, and control-plane visibility. | High alert noise if automation inventory is weak. | Worth enabling broadly when role owners, CI runners, and expected regions are documented. |
| Add CloudTrail S3 data events for sensitive buckets | Proves object-level reads, writes, deletes, and list activity. | Event volume can climb quickly on busy buckets and create Datadog indexing cost. | Enable first on restricted buckets, crown-jewel paths, and short evaluation windows before expanding. |
| Add S3 object tags or DLP labels | Separates sensitive reads from ordinary storage activity. | Requires data inventory ownership and label quality. | Use when bucket names alone are too broad or when compliance reporting depends on object sensitivity. |
| Ingest identity risk and device trust fields | Makes account-takeover logic more precise. | Identity products can emit noisy context changes without clear owner review. | Use when MFA reset, new device, and geo signals can be tied to a user baseline and support workflow. |
| Expand Kubernetes audit logging | Improves secret, exec, role binding, and namespace visibility. | Full audit ingestion can be noisy and expensive in busy clusters. | Scope first to critical namespaces, sensitive verbs, and service-account ownership. |
| Add endpoint process telemetry | Strengthens endpoint-to-data pivot correlation. | Endpoint telemetry can be high-volume and requires host ownership context. | Keep only process, parent, command-line, host role, and user fields needed for the detection. |
| Add MongoDB audit logs | Proves database operation, collection, user, and source context. | Audit logs can be large and sensitive in high-traffic data stores. | Start with auth, admin actions, sensitive collections, and unusual client sources. |
| Increase Datadog log retention or indexing | Improves investigation lookback and replayability. | Retention and indexing costs can outgrow the lab value quickly. | Index only fields needed for detection, keep cold evidence separately, and avoid retaining raw private data. |

## What I Would Not Collect Or Overclaim

- I would not enable every possible data event by default just to make a
  coverage table look bigger.
- I would not ingest raw private payloads when tags, counts, object paths, or
  sensitivity labels answer the detection question.
- I would not claim exfiltration completion without destination, byte volume,
  and transfer evidence.
- I would not claim production tuning without production alert history.
- I would not claim full ATT&CK technique coverage when the lab covers only one
  sub-technique or one modeled behavior.
- I would not keep paid Datadog or AWS resources running solely to preserve a
  portfolio artifact after the evidence is captured.

## Evidence Confidence

| Evidence Type | Confidence | Why It Matters |
| --- | --- | --- |
| Monitor definitions | High | The detection logic is versioned as JSON and Terraform-style artifacts. |
| Test-case pairs | High | Every monitor has positive, negative, and edge-case pressure. |
| Harness control self-tests | High | The evaluator proves it catches malformed queries, missing fields, mismatches, threshold mistakes, and monitor identity drift. |
| Local validation report | High | The harness evaluates 21 cases across 7 monitors with expected outcomes met. |
| Field-correlation example | Medium | One AWS example proves nested field matching, but it is intentionally not counted as an active monitor. |
| Sanitized Datadog screenshots | High | They prove the lab existed in Datadog before account retirement. |
| Dashboard screenshots | Medium | They prove the portfolio experience renders locally. |
| Production behavior | Not claimed | The repo is a lab, not an active production deployment. |

## Red Flags Removed

- No active paid Datadog dependency is required for review.
- No private account IDs, user emails, tenant links, API keys, or session data
  are kept in the repo.
- Screenshots are sanitized and documented instead of left as unexplained proof.
- Detection names are normalized to `Datadog Lab Replay` for public review.
- False positives are documented as part of the engineering work, not hidden.
- The local harness makes expected outcomes reproducible without live billing.
- The harness control self-test proves the validation result is not a
  happy-path-only claim.

## Remaining Gaps

| Gap | Why It Matters | How I Would Close It |
| --- | --- | --- |
| Production baselines | Real detections need normal behavior ranges. | Add historical aggregates for users, roles, API volume, buckets, hosts, and maintenance windows. |
| Suppression governance | Allowlisting can hide real attacks if unmanaged. | Store suppressions as reviewed records with owner, reason, expiry, and regression cases. |
| Multi-event correlation | Scenario tags simplify the public lab. | Replace scenario-level triggers with field-level joins, sequence windows, and source-specific enrichments. |
| Alert quality metrics | A mature program tracks precision and fatigue. | Add alert volume, true-positive rate, false-positive reason, and time-to-triage metrics after real usage. |
| Live routing | Analysts need case workflow context. | Add ticket or notification routing examples with sanitized payloads only if they are actually exercised. |
| Response automation | Some actions can be safely automated. | Add guarded examples for disable key, expire session, isolate host, or block bucket access after approval rules exist. |
| Data exposure proof | Exfiltration needs more than storage reads. | Add byte volume, destination, DLP label, and network egress evidence before claiming exfiltration. |

## Interview Framing

The strongest way to present this project is:

1. I built the detection lifecycle, not just screenshots.
2. I kept the lab public-safe while preserving real Datadog evidence.
3. I tested each monitor with positive, negative, and edge cases.
4. I added harness controls so the validation loop proves it can fail safely.
5. I documented tuning decisions, telemetry tradeoffs, and known gaps like a
   detection engineer would.
6. I retired paid services after preserving the artifacts needed for review.

That framing is honest and useful. It shows judgment, cost awareness, and the
ability to turn a temporary lab into a durable portfolio project.
