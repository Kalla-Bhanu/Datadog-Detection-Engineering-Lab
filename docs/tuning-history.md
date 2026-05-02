# Detection Tuning History

This document records the tuning decisions behind the lab monitors. The point
is not to pretend these public-safe alerts are production-ready as written. The
point is to show the judgment I would bring to Datadog detection engineering:
what should fire, what should stay quiet, where the noise would come from, and
what would need to change before production use.

The lab monitors stay tightly scoped to `source:test-harness`,
`synthetic:true`, and validation scenario tags. That keeps the public project
honest. The tuning notes below explain how each signal would mature in a real
tenant with production telemetry, allowlists, asset context, and historical
baselines.

## Review Standard

| Review Area | What I Looked For |
| --- | --- |
| Signal intent | The risky behavior the monitor is meant to catch. |
| False-positive pressure | The normal activity that could look similar. |
| Lab guardrail | How the public-safe monitor avoids accidental production claims. |
| Test pressure | The positive, negative, and edge cases used to test the decision. |
| Production next step | What would make the monitor stronger in a live Datadog tenant. |

## Iteration Standard

The version notes below are lab-modeled design iterations, not claims of
production deployment history. I kept detailed v1/v2/v3 records only for the
monitors where the tradeoffs are specific enough to defend: identity account
takeover, AWS credential misuse, and S3 data access. The abandoned attempts are
included only where they explain a real detection tradeoff.

## Monitors Without Full Iteration Records

The remaining monitors still have tuning notes and test pressure, but they do
not carry detailed v1/v2/v3 history because the repo does not have enough live
alert data to make those revisions honest.

| Monitor | Why A Shorter Record Is Intentional |
| --- | --- |
| Pipeline Health | It proves replay availability, so the main decision is scoping, not threat-model tuning. |
| EKS Secret Access Chain | The public fixture shows the secret-access risk, but real tuning needs namespace ownership, controller inventory, and maintenance windows. |
| Endpoint To MongoDB Pivot | The lab models the cross-source idea, but real tuning needs EDR process history and MongoDB entitlement context. |
| Source Pipeline Health | It is an ingestion visibility pattern; source-specific thresholds belong in a live tenant with owner and maintenance data. |

## Pipeline Health

Signal intent: prove that the replay pipeline emitted recent validation logs.

False-positive pressure: normal Datadog Agent metrics, setup checks, or source
inventory events should not be treated as proof that detection replay worked.

Lab guardrail: the monitor requires `source:test-harness`, `synthetic:true`,
and `purpose:detection-rule-validation`.

Test pressure: `pipeline_health_positive` fires, while
`pipeline_health_negative` and `pipeline_health_edge` suppress.

Production next step: split replay health from source health. Replay health
should confirm the test harness. Source health should confirm live log ingestion
for identity, cloud, runtime, endpoint, and data feeds.

## Identity Account Takeover

Signal intent: catch an account takeover pattern where suspicious sign-in
activity is followed by MFA or privilege-sensitive behavior.

False-positive pressure: helpdesk-assisted MFA resets, user travel, device
replacement, and normal admin workflows can each look risky by themselves.

Lab guardrail: the lab monitor fires only on the account-takeover scenario tag
inside the validation harness. It does not claim to score real identity risk.

Test pressure: `identity_account_takeover_positive` fires. Helpdesk MFA reset
and single-signal travel cases suppress because they do not carry the full
chain.

Production next step: correlate new device, impossible travel, MFA reset,
session risk, and privileged follow-on action inside a bounded window. Add
allowlisted helpdesk ticket context and user-risk enrichment before paging.

Modeled iteration record:

| Version | Decision | Why It Changed |
| --- | --- | --- |
| v1 | Alert on MFA reset, new geography, or new device as independent signals. | Too broad. Helpdesk resets, travel, and device replacement would produce review noise without enough compromise context. |
| v2 | Require the account-takeover chain: risky sign-in pressure plus MFA or device change plus privileged follow-on behavior. | Better matches the threat hypothesis and explains why the positive case fires while the helpdesk reset and travel edge case suppress. |
| v2a abandoned | Suppress all events with helpdesk or support-ticket context. | Reverted as a production design idea because a compromised account can still pass through support workflows. Ticket context should reduce severity or guide triage, not blindly suppress. |
| v3 current | Keep the public monitor scoped to the validation scenario and document the production correlation requirements. | Preserves the portfolio proof loop without pretending the lab has live identity baselines. |

Accepted residual risk: the lab suppresses single-signal travel and helpdesk
MFA reset cases. That is acceptable here because the monitor is proving chained
account-takeover behavior, not every identity anomaly.

Production re-open triggers:

- A helpdesk reset is followed by privileged action or new admin group
  membership.
- A new device becomes trusted and then performs sensitive activity.
- A user-risk score or impossible-travel signal appears inside the same review
  window.
- Support-ticket context is missing an owner, approval, or expiration.

## AWS Credential Misuse

Signal intent: catch suspicious access-key activity from a new context when the
API sequence suggests privilege discovery or sensitive cloud action.

False-positive pressure: CI/CD runners, approved admin scripts, vulnerability
scanners, and break-glass workflows can produce bursts of AWS API activity.

Lab guardrail: the monitor keys on the public replay scenario instead of trying
to learn real AWS baselines from a retired lab tenant.

Test pressure: `aws_credential_misuse_positive` fires. The known deployment
runner case suppresses. The enumeration-only edge case currently fires because
the lab monitor is intentionally scenario-level.

Production next step: separate read-only enumeration from write actions. A
production monitor should combine first-seen source, access-key age, user agent,
sensitive API family, and change context, then suppress approved automation.

Modeled iteration record:

| Version | Decision | Why It Changed |
| --- | --- | --- |
| v1 | Alert on a burst of IAM read and write APIs from any access key. | Too noisy for production because CI runners, scanners, and inventory jobs can create API bursts. |
| v2 | Require a suspicious key-use scenario with source context and sensitive IAM pressure. | Keeps the lab focused on credential misuse instead of generic cloud activity. |
| v2a abandoned | Suppress `aws-cli/*` user agents to reduce developer and automation noise. | Reverted because attackers and legitimate operators both use AWS CLI. Suppressing by user agent would remove too much coverage. |
| v3 current | Keep the lab monitor scenario-level, but document that production should split enumeration-only behavior from write actions. | The edge case still fires in the lab so reviewers can see the conservative boundary decision. |

Accepted residual risk: the lab treats enumeration-only activity as a firing
edge case. In production I would likely route enumeration-only activity to a
lower severity unless it is paired with a new source, sensitive role, or policy
change.

Production re-open triggers:

- An access key appears from a new ASN, country, user agent family, or host
  class.
- Read-only IAM enumeration is followed by policy attachment, trust-policy
  change, key creation, or role assumption.
- A deployment runner changes role name, source range, schedule, or owner
  without an approved change record.
- A break-glass path fires outside its documented window.

## EKS Secret Access Chain

Signal intent: catch workload identity behavior that touches Kubernetes secrets
and cloud decrypt activity in the same suspicious chain.

False-positive pressure: service mesh rotation, controllers, backup jobs, and
deployment automation may read secrets for legitimate reasons.

Lab guardrail: the public monitor fires only on the replayed secret-access
chain. It does not expose real namespace names, workload identities, or secret
paths.

Test pressure: `eks_secret_access_chain_positive` fires. The controller cache
refresh suppresses. The KMS decrypt plus protected secret edge case fires
because it is worth escalation.

Production next step: enrich with namespace criticality, service account owner,
deployment window, secret classification, and expected controller behavior.

## Endpoint To MongoDB Pivot

Signal intent: catch an endpoint process chain that pivots into database access
against sensitive MongoDB collections.

False-positive pressure: developers, database administrators, health checks,
and support tooling can run legitimate MongoDB queries.

Lab guardrail: the monitor requires the replay scenario instead of alerting on
generic database client use.

Test pressure: `endpoint_to_mongodb_pivot_positive` fires. Backup access and a
developer query suppress because the endpoint process chain is missing.

Production next step: correlate process lineage, host role, database client,
collection sensitivity, source network, and user identity. Developer access
should route to review only when it violates expected host or role context.

## S3 Data Access Exfiltration

Signal intent: catch unusual access to sensitive object storage where the
behavior looks like collection or staged exfiltration.

False-positive pressure: analytics jobs, backup workflows, compliance exports,
and lifecycle tooling can read many objects in a short window.

Lab guardrail: the monitor uses the replay scenario and avoids claiming real
S3 baselines or DLP enrichment.

Test pressure: `s3_data_access_exfiltration_positive` fires. The scheduled
analytics job suppresses. The list-only edge case currently fires because the
lab monitor is scenario-level and conservative.

Production next step: separate list-only reconnaissance from bulk object read.
Use bucket sensitivity, object count, byte volume, actor role, client context,
job window, and egress evidence to tune severity.

Modeled iteration record:

| Version | Decision | Why It Changed |
| --- | --- | --- |
| v1 | Alert on any access to sensitive buckets from an unusual actor. | Too broad. List operations, inventory checks, analytics jobs, and backups can all touch sensitive buckets. |
| v2 | Add backup-window and approved-role context as false-positive pressure. | Makes the negative case meaningful and shows why scheduled jobs should not page by default. |
| v2a abandoned | Suppress list-only bucket activity to focus only on object downloads. | Reverted because list-only access can be reconnaissance before collection. It should not always page, but it should remain visible. |
| v3 current | Keep the lab edge case conservative while documenting that production severity needs object count, byte volume, sensitivity, and egress evidence. | Prevents overclaiming completed exfiltration while keeping the detection useful as a data-access signal. |

Accepted residual risk: the lab does not prove completed exfiltration. It proves
unusual sensitive-storage access that would start a data exposure review.

Production re-open triggers:

- A backup or analytics role touches buckets outside its owner, job window, or
  expected prefix.
- List-only activity is followed by object reads, archive creation, sharing, or
  network egress.
- Bucket sensitivity labels change, become missing, or conflict with object
  paths being accessed.
- Object volume or byte volume shifts materially from the established baseline.

## Source Pipeline Health

Signal intent: detect missing expected heartbeat events from modeled source
feeds.

False-positive pressure: quiet sources, maintenance windows, source retirement,
pipeline filter changes, and delayed ingestion can all look like missing data.

Lab guardrail: the public monitor searches for generic lab heartbeat markers
instead of private source IDs.

Test pressure: `source_pipeline_health_positive` fires when no heartbeat events
exist. A valid heartbeat suppresses. An inventory-only event without the
pipeline marker still fires.

Production next step: maintain source-specific heartbeat expectations and
maintenance windows. Missing data should create an ingestion-health review
before it becomes a security incident.
