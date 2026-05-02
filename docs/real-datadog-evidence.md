# Real Datadog Evidence

This folder includes a small set of sanitized screenshots from the temporary
Datadog lab. They are included to prove that the detection work was exercised in
the actual Datadog UI, while the repository keeps the reusable logic in public
JSON, Terraform-style monitor examples, sample events, and local checks.

## Evidence Set

| Evidence | File | What it proves |
| --- | --- | --- |
| Log Explorer replay | `evidence/datadog-log-explorer-sanitized.png` | Lab events were visible in Datadog Logs and mapped to scenario fields. |
| Monitor inventory | `evidence/datadog-monitor-list-sanitized.png` | Datadog held custom lab monitors with status and tags. |
| Monitor detail | `evidence/datadog-monitor-detail-identity-sanitized.png` | A real monitor had query logic, evaluation, tags, and message template. |
| Metrics overview | `evidence/datadog-metrics-overview-sanitized.png` | The Datadog trial had live metric telemetry available during the lab. |

## Privacy Review

Before publishing, each screenshot must be checked for:

- Account emails, usernames, avatar menus, and profile text.
- Tenant URLs, organization names, billing links, and account settings.
- Monitor IDs, account IDs, real ARNs, private hostnames, and real resource
  names.
- API keys, app keys, tokens, cookies, session material, and request headers.
- Raw logs that expose real user identities or private business data.

The screenshots in this repository were captured from views with account
navigation hidden and obvious personal fields masked. They should still be
treated as high-sensitivity evidence whenever the repo is reviewed.

## Naming Note

Some Datadog screenshots show the original challenge-era monitor prefix. The
public repository normalizes the project language to "Datadog Lab Replay" so the
portfolio reads as a Datadog detection engineering lab instead of a continuation
of the earlier CloudSec project.

