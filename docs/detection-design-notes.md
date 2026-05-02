# Detection Design Notes

These notes show the thinking behind the Datadog monitors. They are intentionally
written like design review notes, not like incident reports.

## Design Template

Use this shape when adding or reviewing a monitor:

1. Threat hypothesis: what risky behavior should this catch?
2. Source assumptions: which Datadog logs, tags, and fields are needed?
3. Query shape: what makes the signal specific enough to alert?
4. Evaluation window: why this window and threshold are reasonable.
5. Validation events: which sample events should fire the monitor?
6. Tuning notes: likely false positives and how to reduce noise.
7. Handoff boundary: what the analyst should confirm before escalation.
8. Known gaps: what the lab does not prove yet.

## Lab Replay Convention

The seven active monitors use scenario tags because this is a public-safe lab
that must remain deterministic after the Datadog tenant is retired. Scenario
tags let the repo prove monitor intent, positive cases, benign lookalikes, and
edge decisions without exposing private tenant data or requiring paid services.

That is not the production endpoint. In a live environment, the scenario tag
would be replaced by field-level correlation across source-specific fields,
baselines, allowlists, and ownership context. This repo includes one non-active
AWS field-correlation example to show that maturation path without changing the
active monitor count.

## Pipeline Health

Threat hypothesis: if replay events stop arriving, validation evidence should
not be trusted blindly.

Source assumptions: Datadog logs should include a test-harness source,
synthetic marker, validation purpose, and current heartbeat event.

Query shape: the lab monitor keys on `source:test-harness`,
`synthetic:true`, and `purpose:detection-rule-validation`.

Tuning decision: keep replay health separate from source health. Replay health
answers whether the validation loop ran; source health answers whether modeled
live feeds are silent.

Validation: the positive case includes a current replay heartbeat. The negative
and edge cases suppress ordinary agent metrics and setup-only synthetic events.

Known gap: this monitor does not prove live production ingestion health.

## Identity Account Takeover

Threat hypothesis: impossible travel followed by MFA reset and privileged action
is stronger than any one identity signal alone.

Source assumptions: Okta-style system logs should provide actor, device, MFA
event, source context, and privileged action fields.

Query shape: the lab monitor keys on the `identity_account_takeover` scenario
and treats the chained behavior as the detection unit. In a live tenant, this
would become a tighter correlation across travel anomaly, MFA reset, new device,
and privileged action.

Tuning decision: do not alert on MFA reset alone. Helpdesk activity and normal
device changes can be noisy. The alert is only worth escalating when identity
change and privileged follow-on activity appear together.

Validation: sample replay includes new device, MFA reset, and privileged action
fields. The expected outcome is a high-severity identity review, not immediate
incident declaration without confirmation.

Known gap: the public lab does not include real device trust, geo-risk scoring,
or historical baseline data.

## AWS Credential Misuse

Threat hypothesis: a known access key making a privileged API burst from a new
source deserves investigation, especially when the sequence touches sensitive
actions.

Source assumptions: CloudTrail-style logs should provide access key context,
actor, user agent, source location, API sequence, and timing.

Query shape: the lab monitor keys on the `aws_iam_key_misuse` scenario. In a
live tenant, the stronger version would combine new source, sensitive API
sequence, and actor context instead of alerting on raw API volume.

Field-correlation example: the non-active example in
`detections/field-correlation-examples/aws_credential_misuse_field_correlation.json`
checks nested fields such as `@aws.eventSource`, `@aws.eventName`, and
`@aws.userIdentity.type`. It intentionally suppresses read-only enumeration so
readers can see the difference between the deterministic lab replay monitor
and a more production-shaped field query.

Tuning decision: deployment runners and approved automation can look like API
bursts. The monitor keeps the signal useful by requiring context review rather
than pretending every burst is malicious.

Validation: sample replay includes new source, API sequence, and expected access
key context. The expected outcome is a cloud security queue review with key
disablement and rotation as possible response actions.

Known gap: the public lab does not prove live allowlists, organization baseline
learning, or IAM change approval context.

## EKS Secret Access Chain

Threat hypothesis: workload identity touching protected Kubernetes secret paths,
especially near decrypt behavior, can expose credentials or service tokens.

Source assumptions: Kubernetes audit logs and cloud audit context should provide
service account, namespace, verb, resource, secret name, and decrypt context.

Query shape: the active lab monitor keys on the `eks_secret_access_chain`
scenario. In production this would become a correlation between Kubernetes
secret access, namespace criticality, workload owner, deployment window, and KMS
decrypt behavior.

Tuning decision: do not treat every secret read as malicious. Controllers,
rotation jobs, and service mesh components can read secrets legitimately when
owner and namespace context match.

Validation: the positive case models protected secret access. The negative case
models approved maintenance access. The edge case escalates decrypt plus
protected secret behavior.

Known gap: the public lab does not include real namespace ownership, deployment
windows, or secret classification.

## Endpoint To MongoDB Pivot

Threat hypothesis: a workstation process chain that reaches MongoDB sensitive
collections is more meaningful than database access or process execution alone.

Source assumptions: endpoint telemetry should provide process lineage, host
role, user context, and command line. MongoDB audit logs should provide
operation, collection, source client, and account context.

Query shape: the active lab monitor keys on the `endpoint_to_mongodb_pivot`
scenario. In production this would correlate parent process, database client,
host role, collection sensitivity, and user entitlement.

Tuning decision: database administrators and developers need legitimate access.
The alert should escalate when the process chain and host role do not match the
expected database workflow.

Validation: the positive case pairs suspicious process lineage with collection
access. The negative and edge cases suppress approved admin access and developer
database access without the suspicious endpoint chain.

Known gap: the public lab does not include real EDR telemetry, MongoDB Atlas
audit integration, or entitlement data.

## S3 Data Access Exfiltration

Threat hypothesis: a spike in object reads against sensitive buckets can
indicate collection or staged exfiltration when actor and client context are
unusual.

Source assumptions: S3 data events should include actor, bucket sensitivity,
object count, client context, and timing.

Query shape: the lab monitor keys on the `s3_data_access_exfiltration` scenario.
In a live tenant, the monitor would combine object volume, sensitivity tags, job
window, actor role, and archive/download behavior.

Tuning decision: backups and analytics jobs can create high-volume reads. The
monitor should carry an allowlist input for approved job windows and service
roles instead of treating volume as a complete detection.

Validation: sample replay includes bucket sensitivity, object count, actor, and
client context. The expected outcome is a data response review with access block
and log preservation if exposure is confirmed.

Known gap: the public lab does not include real DLP enrichment, byte-count
baselines, or downstream network egress proof.

## Source Pipeline Health

Threat hypothesis: missing source heartbeat events can hide real security
signals and should be visible before a detection program trusts its alert
coverage.

Source assumptions: each important source should emit or be checked by a
heartbeat-like signal with expected freshness, owner, and maintenance context.

Query shape: the active lab monitor searches for generic
`datadog-detection-lab` and `pipeline-health` markers and fires when no matching
event exists in the window.

Tuning decision: source silence is an ingestion-health review first, not proof
of attacker-caused log tampering. Expected tenant closure and connector removal
are expected exceptions.

Validation: the positive case has no heartbeat events. The negative case
suppresses on a valid heartbeat. The edge case fires when an inventory event
lacks the pipeline-health marker.

Known gap: the public lab does not include source-specific maintenance windows,
data owner mapping, or production ingestion SLOs.
