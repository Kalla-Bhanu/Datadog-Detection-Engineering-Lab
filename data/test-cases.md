# Detection Test Cases

`test-cases.json` holds the validation cases used by the local detection
engineering harness.

Each monitor has three case types:

- `positive`: a true-positive case that should fire.
- `negative`: a benign lookalike that should not fire.
- `edge_case`: a boundary case with a written decision.

The negative cases are intentionally important. They show what the detection is
designed not to alert on, which is where much of the real tuning work lives.

The events are modeled for public review. They use TEST-NET IP ranges,
placeholder account IDs, fake users, and synthetic resource names.

