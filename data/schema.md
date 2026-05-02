# Sample Event Schema

Every event in `events.json` is safe to share and uses Datadog-style fields.

| Field | Purpose |
| --- | --- |
| `event_id` | Stable sample event identifier. |
| `timestamp` | ISO timestamp for replay ordering. |
| `scenario_id` | Detection scenario or support scenario. |
| `service` | Datadog service facet. |
| `source` | Datadog source facet. |
| `status` | Review status such as `info`, `warning`, or `ok`. |
| `severity` | Triage priority. |
| `message` | Analyst-readable sample event summary. |
| `tags` | Datadog-style tags used by monitor queries and dashboard filters. |
| `expected_detection` | Monitor expected to match the event. |

## Test Case Schema

`test-cases.json` groups positive, negative, and edge-case event sets by
monitor. These cases are used to prove that each detection has a clear expected
outcome, not only a sample event that looks suspicious.

| Field | Purpose |
| --- | --- |
| `monitor_id` | Monitor definition ID under `detections/monitors`. |
| `monitor_name` | Human-readable monitor name. |
| `cases` | Test cases for that monitor. |
| `case_id` | Stable case identifier. |
| `case_type` | `positive`, `negative`, or `edge_case`. |
| `expected_outcome` | `fire` or `suppress`. |
| `rationale` | Why this outcome is expected. |
| `events` | One or more modeled Datadog-style events. Missing-data monitors may use an empty array for a positive case. |

## Harness Control Case Schema

`harness-control-cases.json` holds intentionally broken controls used by
`npm run validate:harness-controls`. These controls prove that the local
harness fails safely instead of only proving the happy path.

| Field | Purpose |
| --- | --- |
| `control_id` | Stable identifier for the control self-test. |
| `failure_category` | The class of failure being proven. |
| `expected_failure_contains` | Error text the harness must emit for the control to pass. |
| `monitor` | Minimal monitor object used by the control. |
| `group` | Minimal case group used to trigger the intended failure. |

The controls cover malformed monitor queries, missing event fields, expected
outcome mismatches, threshold inversions, and monitor identity drift.

## Field-Correlation Example Case Schema

`field-correlation-example-cases.json` uses the same group and case shape as
`test-cases.json`, but it targets non-active examples under
`detections/field-correlation-examples`. The current release includes one AWS
credential misuse example that validates nested CloudTrail-style fields without
changing the seven active lab monitors.

The field example is intentionally small:

- One positive IAM policy-write case.
- One approved automation lookalike.
- One read-only enumeration edge case.

The validation report is written to
`evidence/field-correlation-example-results.json`.
