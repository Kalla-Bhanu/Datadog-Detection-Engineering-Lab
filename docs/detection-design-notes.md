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

Tuning decision: deployment runners and approved automation can look like API
bursts. The monitor keeps the signal useful by requiring context review rather
than pretending every burst is malicious.

Validation: sample replay includes new source, API sequence, and expected access
key context. The expected outcome is a cloud security queue review with key
disablement and rotation as possible response actions.

Known gap: the public lab does not prove live allowlists, organization baseline
learning, or IAM change approval context.

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

