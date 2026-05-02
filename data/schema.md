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
