# Local Detection Validation Harness

The local harness gives this portfolio project a repeatable engineering loop:
monitor definitions, positive cases, benign lookalikes, and edge cases are all
checked together before the project is presented.

Run it with:

```powershell
npm run validate:cases
```

The command reads:

- `detections/monitors/*.json`
- `data/test-cases.json`

It writes:

- `evidence/validation-results.json`

## What It Proves

The harness confirms that each monitor has:

- A matching positive case.
- A negative case that should stay quiet.
- An edge case with a documented decision.
- A query outcome that matches the expected result in the public-safe test data.

This makes the lab stronger than a screenshot-only project. It shows the
detection engineering habit: define intent, test true positives, test false
positive pressure, and keep a result artifact.

## Boundary

This is not a full Datadog query engine. It is a local approximation for the
query shape used in this lab:

- `logs("...").index("*").rollup("count").last("...") >= 1`
- `logs("...").index("*").rollup("count").last("...") < 1`

The live Datadog screenshots remain the evidence that these monitors and logs
were exercised in the Datadog UI. The local harness is the engineering guardrail
that keeps the public repo consistent and reviewable.
