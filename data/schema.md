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
