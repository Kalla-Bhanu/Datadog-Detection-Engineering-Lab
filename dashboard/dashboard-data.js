window.DD_LAB_DATA = {
  meta: {
    title: "Datadog Detection Engineering Lab",
    subtitle: "A Datadog-native detection engineering workshop with monitor logic, validation events, and clear evidence.",
    environment: "Safe to share",
    update: "Checked locally"
  },
  stages: [
    {
      id: "overview",
      label: "Overview",
      badge: "5",
      kicker: "Detection workshop",
      title: "Datadog Detection Engineering Lab.",
      summary: "This dashboard shows the work behind the lab: threat hypotheses, monitor patterns, validation events, ATT&CK coverage, tuning notes, and the evidence needed to discuss it after the trial tenant is closed."
    },
    {
      id: "monitors",
      label: "Detections",
      badge: "7",
      kicker: "Monitor lifecycle",
      title: "Threat hypothesis, source assumptions, query logic, validation, and tuning.",
      summary: "Each detection explains the idea behind the alert, the data it uses, how I tested it, and what should be checked before escalation."
    },
    {
      id: "scenarios",
      label: "Scenarios",
      badge: "5",
      kicker: "Validation paths",
      title: "Scenario paths prove the monitor behavior instead of retelling the same incident story.",
      summary: "The sample events are grouped into validation paths with trigger, expected alert behavior, response boundary, and evidence references."
    },
    {
      id: "evidence",
      label: "Evidence",
      badge: "10",
      kicker: "Evidence trail",
      title: "Real Datadog evidence, local validation, and a clean review trail.",
      summary: "This section keeps the strongest proof visible: sanitized Datadog screenshots, 21 passing validation cases, 5 harness controls, a field-correlation example, source health notes, and the preserved artifacts behind each claim."
    },
    {
      id: "readiness",
      label: "Wrap-up",
      badge: "6",
      kicker: "Before publishing",
      title: "The lab remains useful after the Datadog trial is closed.",
      summary: "These notes show what was checked, what was preserved, and how the project can be presented honestly without keeping paid services running."
    }
  ],
  kpis: [
    { label: "Monitor patterns", value: "7", note: "6 detections + source health", tone: "green", spark: [44, 55, 49, 68, 73, 88] },
    { label: "Validation cases", value: "21+5+3", note: "Cases, controls, example", tone: "violet", spark: [30, 42, 58, 70, 86, 100] },
    { label: "Real evidence", value: "4", note: "Sanitized Datadog captures", tone: "blue", spark: [20, 34, 45, 57, 73, 88] },
    { label: "ATT&CK entries", value: "6", note: "Validated and partial", tone: "amber", spark: [22, 26, 34, 41, 51, 58] },
    { label: "Critical paths", value: "2", note: "Runtime and data exposure", tone: "red", spark: [18, 32, 39, 56, 72, 86] },
    { label: "Safety scan", value: "Pass", note: "No private tenant material", tone: "slate", spark: [75, 76, 75, 78, 79, 80] }
  ],
  coverage: [
    { tactic: "Initial Access", technique: "T1078.004", name: "Cloud Accounts", status: "validated", scenario: "identity_account_takeover", source: "Okta" },
    { tactic: "Credential Access", technique: "T1552.007", name: "Cloud Instance Metadata", status: "validated", scenario: "aws_iam_key_misuse", source: "CloudTrail" },
    { tactic: "Privilege Escalation", technique: "T1098", name: "Account Manipulation", status: "partial", scenario: "aws_iam_key_misuse", source: "CloudTrail" },
    { tactic: "Discovery", technique: "T1613", name: "Container and Resource Discovery", status: "validated", scenario: "eks_secret_access_chain", source: "Kubernetes" },
    { tactic: "Lateral Movement", technique: "T1021", name: "Remote Services", status: "partial", scenario: "endpoint_to_mongodb_pivot", source: "Endpoint" },
    { tactic: "Collection", technique: "T1530", name: "Data from Cloud Storage", status: "validated", scenario: "s3_data_access_exfiltration", source: "S3" }
  ],
  sourceHealth: [
    { source: "CloudTrail", path: "AWS -> Datadog Logs", lag: "5m", schema: "datadog-lab.v1", state: "healthy" },
    { source: "Okta", path: "System Log -> Datadog", lag: "6m", schema: "identity.v1", state: "healthy" },
    { source: "Kubernetes", path: "Audit replay -> Logs", lag: "8m", schema: "runtime.v1", state: "watch" },
    { source: "Endpoint", path: "Modeled EDR -> Logs", lag: "9m", schema: "endpoint.v1", state: "healthy" },
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
    { step: "Threat idea", detail: "Scenario and risky behavior are written down first.", state: "complete" },
    { step: "Monitor logic", detail: "Query scope, threshold, tags, and route are versioned.", state: "complete" },
    { step: "Test pressure", detail: "Positive, negative, and edge cases are paired to each monitor.", state: "complete" },
    { step: "Validation result", detail: "The local harness reports 21 passing cases and 5 intentional failure controls.", state: "complete" },
    { step: "Evidence package", detail: "Screenshots, tuning notes, and gaps remain after trial shutdown.", state: "complete" }
  ],
  replayTimeline: [
    { time: "T+00s", label: "Replay starts", detail: "Sample scenario event enters the test harness." },
    { time: "T+12s", label: "Fields normalize", detail: "Scenario ID, source, actor, and object context are available." },
    { time: "T+38s", label: "Monitor evaluates", detail: "Windowed query matches the expected detection pattern." },
    { time: "T+45s", label: "Alert routes", detail: "Sanitized priority route maps to triage runbook." },
    { time: "T+02m", label: "Evidence preserved", detail: "Result is captured as a clear portfolio artifact." }
  ],
  monitors: [
    {
      name: "Datadog Lab Replay - Pipeline Health",
      severity: "Low",
      status: "Validation",
      scenario: "pipeline_health",
      source: "Datadog Logs",
      type: "threshold",
      window: "15 minutes",
      query: "source:test-harness synthetic:true",
      owner: "Detection Engineering",
      confidence: 92,
      hypothesis: "If test events stop arriving, the rest of the detection story needs to be treated carefully.",
      rationale: "The monitor protects the lab itself by alerting when test telemetry goes quiet.",
      fp: "Expected during deliberate account shutdown; documented as retirement-safe.",
      validation: "Checked with a health event and a missing-event test.",
      route: "P3 lab review queue",
      mitre: "N/A"
    },
    {
      name: "Datadog Lab Replay - Identity Account Takeover",
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
      name: "Datadog Lab Replay - AWS Credential Misuse",
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
      name: "Datadog Lab Replay - EKS Secret Access Chain",
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
      name: "Datadog Lab Replay - Endpoint To MongoDB Pivot",
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
      name: "Datadog Lab Replay - S3 Data Access Exfiltration",
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
      name: "Datadog Source Health - Pipeline Health Pattern",
      severity: "Medium",
      status: "Source health",
      scenario: "source_pipeline_health",
      source: "Live source heartbeat",
      type: "missing data",
      window: "15 minutes",
      query: "datadog-detection-lab pipeline-health",
      owner: "Platform",
      confidence: 84,
      hypothesis: "Source-level silence can hide real security signals and should be visible in the portfolio.",
      rationale: "Health monitoring demonstrates operational ownership beyond detection content.",
      fp: "Trial shutdown and intentional connector retirement are expected exceptions.",
      validation: "Checked against sanitized source health status events.",
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
      trigger: "Impossible travel and MFA reset behavior are replayed as sample events.",
      triage: "Review sign-in sequence, device change, MFA reset, privileged action, and containment decision.",
      outcome: "Escalate as account compromise if follow-on privileged action is confirmed.",
      pivots: ["MFA reset", "New device", "Privileged action"],
      evidence: "sample-log-replay"
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
      trigger: "Object access spike and archive download behavior are represented in sample logs.",
      triage: "Review object volume, actor, client, bucket sensitivity, and timing.",
      outcome: "Block access, preserve logs, and validate data exposure.",
      pivots: ["Object volume", "Actor", "Bucket sensitivity"],
      evidence: "account-closure-boundary"
    }
  ],
  validation: {
    headline: "21/21",
    label: "test cases passed",
    report: "evidence/validation-results.json",
    summary: "The harness checks every active monitor against a true-positive case, a benign lookalike, and an edge case. Separate control and field-correlation checks prove the evaluator catches bad assumptions and can inspect real CloudTrail-style fields.",
    breakdown: [
      { label: "Positive", count: 7, note: "Expected to fire" },
      { label: "Negative", count: 7, note: "Expected to suppress" },
      { label: "Edge", count: 7, note: "Boundary decision documented" },
      { label: "Controls", count: 5, note: "Intentional failures caught" },
      { label: "Field Example", count: 3, note: "AWS field cases checked" }
    ]
  },
  evidenceArtifacts: [
    { title: "Datadog Logs Explorer", type: "Real screenshot", path: "evidence/datadog-log-explorer-sanitized.png", proves: "Scenario-tagged lab logs appeared in Datadog with service and event context.", state: "preserved" },
    { title: "Monitor Inventory", type: "Real screenshot", path: "evidence/datadog-monitor-list-sanitized.png", proves: "The temporary Datadog tenant contained custom monitor inventory.", state: "preserved" },
    { title: "Identity Monitor Detail", type: "Real screenshot", path: "evidence/datadog-monitor-detail-identity-sanitized.png", proves: "The identity monitor existed with query, threshold, status, and message detail.", state: "preserved" },
    { title: "Metrics Overview", type: "Real screenshot", path: "evidence/datadog-metrics-overview-sanitized.png", proves: "The lab tenant had live telemetry available while evidence was captured.", state: "preserved" },
    { title: "Validation Results", type: "Local report", path: "evidence/validation-results.json", proves: "The repo can re-check monitor behavior without a paid Datadog account.", state: "repeatable" },
    { title: "Harness Controls", type: "Self-test report", path: "evidence/harness-control-results.json", proves: "The evaluator catches malformed queries, missing fields, mismatches, threshold errors, and monitor identity drift.", state: "repeatable" },
    { title: "AWS Field Correlation", type: "Example report", path: "evidence/field-correlation-example-results.json", proves: "A non-active AWS example validates nested CloudTrail-style fields without increasing the active monitor count.", state: "repeatable" },
    { title: "Coverage And Gaps", type: "Analysis note", path: "docs/coverage-and-gaps.md", proves: "Validated, partial, and not-claimed areas are separated clearly.", state: "reviewed" },
    { title: "Release Manifest", type: "Release artifact", path: "release_manifest.json", proves: "Counts, boundaries, and no-video/no-live-service assumptions are locally verifiable.", state: "reviewed" }
  ],
  evidence: [
    { id: "real-datadog", title: "Real Datadog Proof", claim: "Sanitized screenshots preserve logs, monitors, and metrics without private tenant details.", tone: "monitor", score: 97 },
    { id: "local-validation", title: "Validation Harness", claim: "All 21 public-safe cases passed and 5 control failures were caught by the harness.", tone: "log", score: 98 },
    { id: "test-pressure", title: "False-Positive Pressure", claim: "Each monitor includes a benign lookalike and an edge decision, not only a positive sample.", tone: "health", score: 95 },
    { id: "tuning-record", title: "Tuning Record", claim: "Noise, exceptions, and production next steps are written as detection engineering decisions.", tone: "runbook", score: 94 },
    { id: "coverage-gaps", title: "Coverage Honesty", claim: "The project separates validated lab coverage from partial coverage and explicit not-claimed ATT&CK boundaries.", tone: "code", score: 93 },
    { id: "retirement-ready", title: "Closure Ready", claim: "The work remains reviewable after paid lab services are shut down.", tone: "retire", score: 96 }
  ],
  tuning: [
    { monitor: "Identity takeover", issue: "Helpdesk MFA reset overlap", fix: "Require new device and privileged follow-on action", result: "Reduced noisy single-signal alerts" },
    { monitor: "AWS credential misuse", issue: "Deployment runner API bursts", fix: "Add known automation context to triage note", result: "Preserved sensitivity without pretending zero noise" },
    { monitor: "S3 data access", issue: "Backup job volume spikes", fix: "Document approved job window as allowlist input", result: "Clearer response decision" }
  ],
  readiness: [
    { label: "Monitor JSON checked", state: "passed", detail: "Required fields, tags, query scope, and evidence references are present." },
    { label: "Validation harness", state: "passed", detail: "21 positive, negative, and edge cases matched expectations; 5 controls failed safely." },
    { label: "Real evidence preserved", state: "passed", detail: "Datadog logs, monitors, and metrics screenshots are sanitized and documented." },
    { label: "Privacy check", state: "passed", detail: "Secrets, emails, account IDs, and token-like strings are blocked." },
    { label: "Coverage gaps written", state: "passed", detail: "The repo says what is validated, partial, and not claimed." },
    { label: "Release manifest", state: "passed", detail: "Final counts, evidence boundaries, and no-video review mode are checked by script." },
    { label: "Final browser QA", state: "passed", detail: "Desktop and mobile evidence views were checked locally." }
  ],
  codePreview: [
    "resource \"datadog_monitor\" \"aws_credential_misuse\" {",
    "  name    = \"Datadog Lab Replay - AWS Credential Misuse\"",
    "  type    = \"log alert\"",
    "  query   = \"logs(\\\"source:test-harness @synthetic:true @purpose:detection-rule-validation @scenario:aws_iam_key_misuse\\\").index(\\\"*\\\").rollup(\\\"count\\\").last(\\\"10m\\\") >= 1\"",
    "  message = \"Synthetic AWS credential misuse replay observed.\"",
    "  tags    = [\"datadog-detection-lab\", \"test-harness\", \"synthetic\"]",
    "}"
  ],
  changelog: [
    { version: "v1.5", change: "Added evidence catalog checks, release manifest verification, Terraform parity, and one AWS field-correlation example." },
    { version: "v1.4", change: "Added validation results, real evidence trail, and coverage gaps to the dashboard." },
    { version: "v1.3", change: "Added the local detection validation harness, 21 passing test cases, and control self-tests." },
    { version: "v1.2", change: "Preserved sanitized Datadog screenshots for logs, monitors, and metrics." },
    { version: "v1.1", change: "Added tuning history, monitor changelog, and coverage analysis." }
  ]
};
