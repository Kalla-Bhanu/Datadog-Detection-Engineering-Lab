# Evidence Preservation And Datadog Closure

This lab was built in a temporary Datadog account, but the useful work should
not depend on that account staying open. The repository keeps the parts that are
safe and useful for review: monitor logic, sample events, triage notes, and
dashboard screenshots.

## What Was Preserved

- Public monitor definitions.
- Terraform-style monitor examples.
- Sample Datadog-style events.
- Positive, negative, and edge-case test cases.
- Local validation results.
- A local dashboard for walkthroughs.
- Sanitized Datadog screenshots and catalog notes.
- Runbooks for each detection scenario.
- Local checks for detection files, validation cases, dashboard files, and
  privacy boundaries.

## Closure Boundary

After the Datadog trial is closed, the live tenant should not be described as
active. The project should be presented as a completed lab with preserved
evidence and responsible cost control.

## Reviewer Wording

```text
I built this as a temporary Datadog detection engineering lab, then preserved the monitor logic, sample events, triage flow, and dashboard in a public GitHub project before closing the paid trial.
```
