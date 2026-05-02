# Project Positioning

This project should be shown as a Datadog-native detection engineering lab, not
as a smaller version of the CloudSec SOC project.

## The Short Version

CloudSec SOC Detection Lab is the SOC analyst case file. It shows how suspicious
activity is investigated across AWS, identity, runtime, endpoint, and data
surfaces, then packaged for an analyst or leadership readout.

Datadog Detection Engineering Lab is the detection engineer's workshop. It shows
how detections are designed, written as monitor definitions, tested with sample
events, tuned for noise, and preserved after the lab tenant is retired.

## How To Showcase It

Lead with the detection lifecycle:

1. Threat hypothesis.
2. Datadog source and field assumptions.
3. Monitor query and evaluation window.
4. Sample events used for validation.
5. Tuning and false-positive notes.
6. Analyst handoff and response boundary.
7. Evidence that remains useful after account closure.

The threat scenarios still matter, but they are supporting evidence. The main
story is how the detection was built and kept reviewable.

## What To Emphasize

- Monitor-as-code examples in JSON and Terraform-style form.
- Side-by-side review of query logic, tags, severity, and routing assumptions.
- Tuning decisions, especially why a monitor avoids single-signal noise.
- Source health and missing-data awareness.
- Honest ATT&CK coverage with clear gaps.
- Public-safe evidence that does not depend on an active paid Datadog account.

## What This Is Not

This is not a second AWS incident walkthrough. It is not a claim that a
production Datadog tenant is still running. It is not a screenshot archive of a
trial account.

The project is useful because the engineering artifacts outlive the platform
instance: monitor definitions, sample events, validation notes, tuning choices,
runbooks, and dashboard evidence.

