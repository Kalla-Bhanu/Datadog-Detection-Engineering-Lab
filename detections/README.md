# Detection Pack

This directory contains Datadog monitor examples that are safe to share. The
definitions are rebuilt from the lab design and do not contain private monitor
IDs, tenant URLs, keys, notification channels, or user emails.

## Files

- `monitors/*.json`: portable monitor definitions for review.
- `field-correlation-examples/*.json`: non-active examples that show how a
  scenario-scoped lab monitor can mature toward field-level production logic.
- `terraform/datadog_monitors.tf`: Terraform-style examples for the same logic.

## Query Pattern

The test-harness monitors are intentionally scoped to sample lab events:

```text
source:test-harness @synthetic:true @purpose:detection-rule-validation
```

That boundary keeps lab replay separate from any production claim.
