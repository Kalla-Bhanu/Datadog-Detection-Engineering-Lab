# Local Detection Validation Harness

The local harness gives this project a repeatable engineering loop:
monitor definitions, positive cases, benign lookalikes, and edge cases are all
checked together before the project is released.

Run it with:

```powershell
npm run validate:cases
npm run validate:harness-controls
npm run validate:field-examples
```

The command reads:

- `detections/monitors/*.json`
- `detections/field-correlation-examples/*.json`
- `data/test-cases.json`
- `data/harness-control-cases.json`
- `data/field-correlation-example-cases.json`

It writes:

- `evidence/validation-results.json`
- `evidence/harness-control-results.json`
- `evidence/field-correlation-example-results.json`

## What It Proves

The harness confirms that each monitor has:

- A matching positive case.
- A negative case that should stay quiet.
- An edge case with a documented decision.
- A query outcome that matches the expected result in the public-safe test data.

This makes the lab stronger than a screenshot-only project. It shows the
detection engineering habit: define intent, test true positives, test false
positive pressure, and keep a result artifact.

## What The Control Self-Test Proves

`npm run validate:harness-controls` checks that the harness can fail in
categorically different ways:

- Rejecting unsupported monitor query shapes.
- Rejecting events that are missing required fields.
- Detecting expected-outcome mismatches.
- Detecting threshold logic inversions.
- Rejecting monitor identity mismatches.

This is the guardrail behind the `21/21` claim. The project does not only prove
that the happy path passes; it proves the evaluator catches the kinds of
mistakes that would make a detection validation result untrustworthy.

## What The Field-Correlation Example Proves

`npm run validate:field-examples` checks one non-active AWS monitor example that
uses nested CloudTrail-style fields such as `@aws.eventName` and
`@aws.userIdentity.type`. This keeps the 7 active lab monitors deterministic for
public replay while showing how the AWS credential misuse idea would mature
toward field-level production logic.

The example has three cases:

- A policy-attachment event by an IAM user that should fire.
- An approved automation lookalike that should suppress.
- A read-only enumeration edge case that should suppress in this example.

## Boundary

This is not a full Datadog query engine. It is a local approximation for the
query shapes used in this lab:

- `logs("...").index("*").rollup("count").last("...") >= 1`
- `logs("...").index("*").rollup("count").last("...") < 1`

The live Datadog screenshots remain the evidence that these monitors and logs
were exercised in the Datadog UI. The local harness is the engineering guardrail
that keeps the public repo consistent and reviewable.
