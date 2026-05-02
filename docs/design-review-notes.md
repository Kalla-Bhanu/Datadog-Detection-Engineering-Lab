# Design Review Notes

These notes capture the design decisions behind the dashboard. They are written
for future reviewers who want to understand why the project is presented this
way.

## Goals

- Make the first screen useful without asking the reviewer to read a long
  explanation.
- Keep the visual style professional, calm, and security-focused.
- Show enough technical depth for an interview without exposing private account
  details.
- Keep every claim tied to monitor logic, sample events, runbooks, or evidence.
- Make the project feel like a Datadog detection engineering workshop, not a
  duplicate SOC investigation lab.

## Changes Made

- Reworked the dashboard into a portfolio-style security review page.
- Put the project snapshot, ATT&CK coverage, scenario queue, alert trail, and
  evidence path near the top.
- Replaced a flat monitor table with detection cards that explain hypothesis,
  query focus, tuning, expected noise, and analyst handoff.
- Added source health, replay timing, evidence confidence, and wrap-up checks.
- Added Engineer and Recruiter views so the same project can support both quick
  screening and deeper technical review.
- Added project positioning and detection design notes so reviewers can see the
  engineering lifecycle behind the monitors.

## Boundaries

- No unsanitized Datadog screenshots.
- No real tenant URLs, account IDs, user emails, keys, or session material.
- No production claims. This is a completed lab preserved for portfolio review.
- No marketing language that makes the project sound bigger than it is.
