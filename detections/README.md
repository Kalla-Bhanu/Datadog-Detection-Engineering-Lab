# Detection Pack

This directory contains public-safe Datadog monitor examples. The definitions
are rebuilt from the lab design and do not contain private monitor IDs, tenant
URLs, API keys, notification channels, or user emails.

## Files

- `monitors/*.json`: portable monitor definitions for review.
- `terraform/datadog_monitors.tf`: Terraform-style examples for the same logic.

## Query Pattern

The test-harness monitors intentionally scope to synthetic validation events:

```text
source:test-harness @synthetic:true @purpose:detection-rule-validation
```

That boundary keeps replay validation separate from vendor-native production
telemetry.

