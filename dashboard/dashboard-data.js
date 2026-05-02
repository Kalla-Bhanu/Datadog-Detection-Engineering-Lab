window.DD_LAB_DATA = {
  meta: {
    title: "Datadog Detection Engineering Lab",
    subtitle: "Public-safe SOC workbench for detection design, validation, and retirement-ready evidence.",
    environment: "PUBLIC-SAFE LAB",
    update: "v1.0 local validation"
  },
  stages: [
    {
      id: "overview",
      label: "Overview",
      badge: "5",
      kicker: "Command center",
      title: "Detection engineering review surface for a Datadog lab.",
      summary: "A compact operator view that connects monitor patterns, ATT&CK coverage, synthetic replay, and public-safe evidence without depending on a live trial tenant."
    },
    {
      id: "monitors",
      label: "Detections",
      badge: "7",
      kicker: "Detection lifecycle",
      title: "Monitor logic with query scope, tuning rationale, validation, and analyst handoff.",
      summary: "Each public-safe detection can be reviewed as a lifecycle artifact instead of a flat monitor list."
    },
    {
      id: "scenarios",
      label: "Scenarios",
      badge: "5",
      kicker: "Threat walkthroughs",
      title: "Scenario paths show how a signal becomes an investigation decision.",
      summary: "Synthetic events are grouped into interview-ready stories with trigger, pivot, outcome, and evidence references."
    },
    {
      id: "evidence",
      label: "Telemetry",
      badge: "6",
      kicker: "Replay and evidence",
      title: "Generated proof panels replace private Datadog screenshots.",
      summary: "The telemetry view shows source health, replay timing, and artifact traceability using only sanitized project data."
    },
    {
      id: "readiness",
      label: "Operations",
      badge: "6",
      kicker: "Publication gates",
      title: "The lab remains reviewable after Datadog account closure.",
      summary: "Quality gates keep the repo safe to publish and preserve the project as resume evidence after paid services are retired."
    }
  ],
  kpis: [
    { label: "Monitor patterns", value: "7", note: "6 detections + source health", tone: "green", spark: [44, 55, 49, 68, 73, 88] },
    { label: "Threat scenarios", value: "5", note: "End-to-end walkthroughs", tone: "violet", spark: [28, 36, 58, 62, 75, 82] },
    { label: "Synthetic events", value: "9", note: "Mapped to expected alerts", tone: "blue", spark: [35, 42, 56, 52, 70, 76] },
    { label: "ATT&CK tactics", value: "5", note: "Honest partial coverage", tone: "amber", spark: [22, 26, 34, 41, 51, 58] },
    { label: "Critical paths", value: "2", note: "Runtime and data exposure", tone: "red", spark: [18, 32, 39, 56, 72, 86] },
    { label: "Public-safe scan", value: "Pass", note: "No private tenant material", tone: "slate", spark: [75, 76, 75, 78, 79, 80] }
  ],
  coverage: [
    { tactic: "Initial Access", technique: "T1078.004", name: "Cloud Accounts", status: "validated", scenario: "identity_account_takeover", source: "Okta" },
    { tactic: "Credential Access", technique: "T1552.007", name: "Cloud Instance Metadata", status: "validated", scenario: "aws_iam_key_misuse", source: "CloudTrail" },
    { tactic: "Privilege Escalation", technique: "T1098", name: "Account Manipulation", status: "partial", scenario: "aws_iam_key_misuse", source: "CloudTrail" },
    { tactic: "Discovery", technique: "T1613", name: "Container and Resource Discovery", status: "validated", scenario: "eks_secret_access_chain", source: "Kubernetes" },
    { tactic: "Lateral Movement", technique: "T1021", name: "Remote Services", status: "partial", scenario: "endpoint_to_mongodb_pivot", source: "Endpoint" },
    { tactic: "Collection", technique: "T1530", name: "Data from Cloud Storage", status: "validated", scenario: "s3_data_access_exfiltration", source: "S3" },
    { tactic: "Exfiltration", technique: "T1041", name: "Exfiltration Over C2 Channel", status: "planned", scenario: "s3_data_access_exfiltration", source: "Network" },
    { tactic: "Defense Evasion", technique: "T1562", name: "Impair Defenses", status: "planned", scenario: "source_pipeline_health", source: "Datadog" }
  ],
  sourceHealth: [
    { source: "CloudTrail", path: "AWS -> Datadog Logs", lag: "5m", schema: "cloudsec.v1", state: "healthy" },
    { source: "Okta", path: "System Log -> Datadog", lag: "6m", schema: "identity.v1", state: "healthy" },
    { source: "Kubernetes", path: "Audit replay -> Logs", lag: "8m", schema: "runtime.v1", state: "watch" },
    { source: "Endpoint", path: "Synthetic EDR -> Logs", lag: "9m", schema: "endpoint.v1", state: "healthy" },
    { source: "MongoDB Atlas", path: "Audit replay -> Logs", lag: "12m", schema: "data.v1", state: "watch" }
  ],
  signalStream: [
    { time: "13:05", severity: "High", source: "identity", text: "MFA reset follows impossible-travel pattern", scenario: "identity_account_takeover" },
    { time: "13:10", severity: "High", source: "cloud", text: "New-location API burst matches credential misuse logic", scenario: "aws_iam_key_misuse" },
    { time: "13:15", severity: "Critical", source: "runtime", text: "Workload identity reaches protected secret path", scenario: "eks_secret_access_chain" },
    { time: "13:20", severity: "High", source: "endpoint", text: "Database client appears in endpoint-to-data chain", scenario: "endpoint_to_mongodb_pivot" },
    { time: "13:25", severity: "Critical", source: "data", text: "Object access spike maps to S3 exfiltration model", scenario: "s3_data_access_exfiltration" }
  ],
  pipeline: [
    { step: "Synthetic event", detail: "Scenario payload generated", state: "complete" },
    { step: "Scoped query", detail: "source:test-harness", state: "complete" },
    { step: "Monitor alert", detail: "Severity and tags matched", state: "complete" },
    { step: "Triage runbook", detail: "Pivot path documented", state: "complete" },
    { step: "Portfolio proof", detail: "Evidence catalog updated", state: "complete" }
  ],
  replayTimeline: [
    { time: "T+00s", label: "Replay starts", detail: "Synthetic scenario event enters test harness." },
    { time: "T+12s", label: "Fields normalize", detail: "Scenario ID, source, actor, and object context are available." },
    { time: "T+38s", label: "Monitor evaluates", detail: "Windowed query matches the expected detection pattern." },
    { time: "T+45s", label: "Alert routes", detail: "Sanitized priority route maps to triage runbook." },
    { time: "T+02m", label: "Evidence preserved", detail: "Result is captured as a GitHub-reviewable artifact." }
  ],
  monitors: [
    {
      name: "CloudSec Test Harness - Pipeline Health",
      severity: "Low",
      status: "Validation",
      scenario: "pipeline_health",
      source: "Datadog Logs",
      type: "threshold",
      window: "15 minutes",
      query: "source:test-harness synthetic:true",
      owner: "Detection Engineering",
      confidence: 92,
      hypothesis: "If validation events stop arriving, downstream detection claims are no longer trustworthy.",
      rationale: "The monitor protects the lab itself by alerting on missing validation telemetry.",
      fp: "Expected during deliberate account shutdown; documented as retirement-safe.",
      validation: "Validated with a synthetic health event and a missing-event check.",
      route: "P3 lab review queue",
      mitre: "N/A"
    },
    {
      name: "CloudSec Test Harness - Identity Account Takeover",
      severity: "High",
      status: "Detection",
      scenario: "identity_account_takeover",
      source: "Okta System Log",
      type: "log correlation",
      window: "10 minutes",
      query: "@scenario:identity_account_takeover",
      owner: "Identity Response",
      confidence: 88,
      hypothesis: "Impossible travel followed by MFA reset and privileged action indicates likely account compromise.",
      rationale: "The chained behavior is more useful than a single failed login threshold.",
      fp: "Traveling users and helpdesk resets are expected exceptions; require device and privilege confirmation.",
      validation: "Replay includes new device, MFA reset, and privileged action fields.",
      route: "P2 identity investigation",
      mitre: "T1078.004"
    },
    {
      name: "CloudSec Test Harness - AWS Credential Misuse",
      severity: "High",
      status: "Detection",
      scenario: "aws_iam_key_misuse",
      source: "CloudTrail",
      type: "new-value",
      window: "10 minutes",
      query: "@scenario:aws_iam_key_misuse",
      owner: "Cloud Security",
      confidence: 90,
      hypothesis: "A known access key making a burst of privileged calls from a new source is high-risk.",
      rationale: "New source context plus sensitive API sequence reduces noisy API-volume alerts.",
      fp: "New deployment runners can look similar; validate actor, user agent, and change window.",
      validation: "Replay contains new source, API sequence, and expected access-key context.",
      route: "P2 cloud security queue",
      mitre: "T1552.007"
    },
    {
      name: "CloudSec Test Harness - EKS Secret Access Chain",
      severity: "Critical",
      status: "Detection",
      scenario: "eks_secret_access_chain",
      source: "Kubernetes Audit",
      type: "composite",
      window: "10 minutes",
      query: "@scenario:eks_secret_access_chain",
      owner: "Runtime Security",
      confidence: 94,
      hypothesis: "Workload identity touching protected secret paths can expose credentials or service tokens.",
      rationale: "Secret access is only escalated when paired with workload and role context.",
      fp: "Expected maintenance jobs must be tagged and matched against approved service accounts.",
      validation: "Replay includes service account, role, protected path, and decrypt context.",
      route: "P1 runtime response",
      mitre: "T1613"
    },
    {
      name: "CloudSec Test Harness - Endpoint To MongoDB Pivot",
      severity: "High",
      status: "Detection",
      scenario: "endpoint_to_mongodb_pivot",
      source: "Endpoint + MongoDB Atlas",
      type: "log correlation",
      window: "10 minutes",
      query: "@scenario:endpoint_to_mongodb_pivot",
      owner: "Endpoint Response",
      confidence: 86,
      hypothesis: "A workstation process launching database tooling and touching sensitive collections deserves rapid review.",
      rationale: "Process tree and data access together are stronger than either signal alone.",
      fp: "Admin tooling can be legitimate; require host role, user role, and ticket context.",
      validation: "Replay connects process, user, database client, and collection name.",
      route: "P2 endpoint response",
      mitre: "T1021"
    },
    {
      name: "CloudSec Test Harness - S3 Data Access Exfiltration",
      severity: "Critical",
      status: "Detection",
      scenario: "s3_data_access_exfiltration",
      source: "S3 Data Events",
      type: "threshold",
      window: "10 minutes",
      query: "@scenario:s3_data_access_exfiltration",
      owner: "Data Security",
      confidence: 91,
      hypothesis: "A spike in object reads against sensitive buckets can indicate staged exfiltration.",
      rationale: "Object volume, bucket sensitivity, and actor context keep the threshold explainable.",
      fp: "Backups and analytics jobs need allowlist context and known job windows.",
      validation: "Replay includes bucket sensitivity, object count, actor, and client context.",
      route: "P1 data response",
      mitre: "T1530"
    },
    {
      name: "CloudSec Live Source - Pipeline Health Pattern",
      severity: "Medium",
      status: "Telemetry Health",
      scenario: "source_pipeline_health",
      source: "Live source heartbeat",
      type: "missing data",
      window: "15 minutes",
      query: "cloudsec pipeline-health",
      owner: "Platform",
      confidence: 84,
      hypothesis: "Source-level silence can hide real security signals and should be visible in the portfolio.",
      rationale: "Health monitoring demonstrates operational ownership beyond detection content.",
      fp: "Trial shutdown and planned connector removal are expected exceptions.",
      validation: "Validated against sanitized source health status events.",
      route: "P3 platform review",
      mitre: "N/A"
    }
  ],
  scenarios: [
    {
      id: "identity_account_takeover",
      title: "Identity Account Takeover",
      severity: "High",
      surface: "Identity",
      killChain: "Initial Access",
      trigger: "Impossible travel and MFA reset behavior are replayed as synthetic validation events.",
      triage: "Review sign-in sequence, device change, MFA reset, privileged action, and containment decision.",
      outcome: "Escalate as account compromise if follow-on privileged action is confirmed.",
      pivots: ["MFA reset", "New device", "Privileged action"],
      evidence: "synthetic-log-replay"
    },
    {
      id: "aws_iam_key_misuse",
      title: "AWS Credential Misuse",
      severity: "High",
      surface: "Cloud",
      killChain: "Credential Access",
      trigger: "Unusual cloud API burst from a new source is replayed into Datadog logs.",
      triage: "Review access-key age, actor, API sequence, source location, and privilege changes.",
      outcome: "Disable key, rotate credentials, and preserve audit evidence.",
      pivots: ["API burst", "Source change", "Privilege delta"],
      evidence: "monitor-inventory"
    },
    {
      id: "eks_secret_access_chain",
      title: "EKS Secret Access Chain",
      severity: "Critical",
      surface: "Runtime",
      killChain: "Discovery",
      trigger: "Workload identity accesses a protected secret path in the runtime scenario.",
      triage: "Review service account, role assumption, secret path, decrypt context, and pod boundary.",
      outcome: "Contain workload, rotate secret, and review trust policy.",
      pivots: ["Service account", "Secret path", "Decrypt context"],
      evidence: "source-health"
    },
    {
      id: "endpoint_to_mongodb_pivot",
      title: "Endpoint To MongoDB Pivot",
      severity: "High",
      surface: "Endpoint + Data",
      killChain: "Lateral Movement",
      trigger: "Endpoint process launches database client and queries sensitive collection context.",
      triage: "Review process tree, database connection, user context, and host isolation criteria.",
      outcome: "Contain host and investigate collection access.",
      pivots: ["Process tree", "DB client", "Collection access"],
      evidence: "triage-runbooks"
    },
    {
      id: "s3_data_access_exfiltration",
      title: "S3 Data Access Exfiltration",
      severity: "Critical",
      surface: "Data",
      killChain: "Collection",
      trigger: "Object access spike and archive download behavior are represented in synthetic logs.",
      triage: "Review object volume, actor, client, bucket sensitivity, and timing.",
      outcome: "Block access, preserve logs, and validate data exposure.",
      pivots: ["Object volume", "Actor", "Bucket sensitivity"],
      evidence: "retirement-boundary"
    }
  ],
  evidence: [
    { id: "monitor-inventory", title: "Monitor Inventory", claim: "Custom monitors are mapped to scenario IDs, severity, query focus, ownership, and validation notes.", tone: "monitor", score: 96 },
    { id: "synthetic-log-replay", title: "Synthetic Log Replay", claim: "source:test-harness and synthetic:true keep lab validation separate from production claims.", tone: "log", score: 94 },
    { id: "source-health", title: "Source Health", claim: "Pipeline health monitors show observability around ingest freshness and missing data.", tone: "health", score: 88 },
    { id: "triage-runbooks", title: "Triage Runbooks", claim: "Each alert has a pivot path, response decision, and escalation boundary.", tone: "runbook", score: 91 },
    { id: "detection-as-code", title: "Detection As Code", claim: "Monitor JSON and Terraform-style definitions make the logic inspectable.", tone: "code", score: 93 },
    { id: "retirement-boundary", title: "Retirement Boundary", claim: "The paid trial can be closed without losing the reviewable project artifact.", tone: "retire", score: 90 }
  ],
  tuning: [
    { monitor: "Identity takeover", issue: "Helpdesk MFA reset overlap", fix: "Require new device and privileged follow-on action", result: "Reduced noisy single-signal alerts" },
    { monitor: "AWS credential misuse", issue: "Deployment runner API bursts", fix: "Add known automation context to triage note", result: "Preserved sensitivity without pretending zero noise" },
    { monitor: "S3 data access", issue: "Backup job volume spikes", fix: "Document approved job window as allowlist input", result: "Clearer response decision" }
  ],
  readiness: [
    { label: "Monitor JSON validates", state: "passed", detail: "Required fields, tags, query scope, and evidence refs are checked." },
    { label: "Dashboard smoke check", state: "passed", detail: "Static entrypoint, stage data, and app render path are verified." },
    { label: "Public-safe scan", state: "passed", detail: "Secrets, emails, account IDs, and token-like strings are blocked." },
    { label: "Claude UI/UX review", state: "passed", detail: "Sanitized feedback was applied to the command-center redesign." },
    { label: "GitHub Pages publish", state: "pending", detail: "Publish after final local and browser verification." },
    { label: "Datadog closure", state: "pending", detail: "Close only after evidence and repository are preserved." }
  ],
  codePreview: [
    "resource \"datadog_monitor\" \"aws_credential_misuse\" {",
    "  name    = \"CloudSec Test Harness - AWS Credential Misuse\"",
    "  type    = \"log alert\"",
    "  query   = \"logs(\\\"@scenario:aws_iam_key_misuse\\\").index(\\\"main\\\").rollup(\\\"count\\\").last(\\\"10m\\\") > 0\"",
    "  message = \"Synthetic validation alert. Follow docs/triage-runbooks.md.\"",
    "  tags    = [\"lab:datadog-detection\", \"public-safe:true\"]",
    "}"
  ],
  changelog: [
    { version: "v1.0", change: "Built static command-center dashboard and public-safe evidence catalog." },
    { version: "v0.9", change: "Mapped Datadog monitor patterns to synthetic scenario events." },
    { version: "v0.8", change: "Separated portfolio evidence from private tenant screenshots." }
  ]
};
