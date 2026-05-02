# Evidence Retention And Datadog Closure

This lab was built in a temporary Datadog account, but the useful work should
not depend on that account staying open. The repository keeps the parts that are
safe and useful after closure: monitor logic, sample events, triage notes, and
dashboard screenshots.

## Durable Artifacts

- Public monitor definitions.
- Terraform-style monitor examples.
- Sample Datadog-style events.
- Positive, negative, and edge-case test cases.
- Local validation results.
- A local dashboard for technical inspection.
- Sanitized Datadog screenshots and catalog notes.
- Runbooks for each detection scenario.
- Local checks for detection files, validation cases, dashboard files, and
  privacy boundaries.

## Closure Boundary

After the Datadog trial is closed, the live tenant should not be described as
active. The public claim is the completed lab package: retained monitor logic,
sample events, triage flow, validation results, sanitized screenshots, and a
dashboard that can be run without a paid Datadog tenant.
