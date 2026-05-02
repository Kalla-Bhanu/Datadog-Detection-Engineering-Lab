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

## Source Pipeline Health

Signal intent: detect missing expected heartbeat events from modeled source
feeds.

False-positive pressure: quiet sources, planned maintenance, source retirement,
pipeline filter changes, and delayed ingestion can all look like missing data.

Lab guardrail: the public monitor searches for generic lab heartbeat markers
instead of private source IDs.

Test pressure: `source_pipeline_health_positive` fires when no heartbeat events
exist. A valid heartbeat suppresses. An inventory-only event without the
pipeline marker still fires.

Production next step: maintain source-specific heartbeat expectations and
maintenance windows. Missing data should create an ingestion-health review
before it becomes a security incident.

