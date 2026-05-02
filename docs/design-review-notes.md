# Design Review Notes

These notes capture the design decisions behind the dashboard. They are written
for future maintenance and release checks.

## Goals

- Make the first screen useful without requiring a long
  explanation.
- Keep the visual style professional, calm, and security-focused.
- Show technical depth without exposing private account details.
- Keep every claim tied to monitor logic, sample events, runbooks, or evidence.
- Make the project feel like a Datadog detection engineering workshop, not a
  duplicate SOC investigation lab.

## Changes Made

- Reworked the dashboard into a security engineering review page.
- Put the project snapshot, ATT&CK coverage, scenario queue, alert trail, and
  evidence path near the top.
- Replaced a flat monitor table with detection cards that explain hypothesis,
  query focus, tuning, expected noise, and analyst handoff.
- Added source health, replay timing, evidence confidence, and wrap-up checks.
- Added Technical and Overview views so the same project can support both quick
  inspection and deeper technical review.
- Added project scope and detection design notes so the engineering lifecycle
  behind the monitors stays visible.

## Boundaries

- No unsanitized Datadog screenshots.
- No real tenant URLs, account IDs, user emails, keys, or session material.
- No production claims. This is a completed lab retained for public review.
- No marketing language that makes the project sound bigger than it is.
