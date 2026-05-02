# Claude Review Log

Claude review is used for UI/UX and presentation feedback only. All prompts and
shared artifacts must be public-safe.

## Review Protocol

- Share sanitized dashboard screenshots or snippets only.
- Do not share tenant IDs, emails, private screenshots, API keys, session data,
  raw exports, or account-specific URLs.
- Record the prompt, feedback summary, accepted changes, and rejected changes.

## Initial Design Review

Status: completed with sanitized dashboard context only.

Prompt summary:

- Asked for a stronger UI/UX than the first simple card-grid dashboard.
- Framed the dashboard as a public-safe Datadog detection engineering project.
- Specified recruiter and security-interviewer audiences.
- Prohibited private tenant details, account IDs, emails, keys, screenshots, raw
  exports, and account-specific URLs.

Feedback summary:

- Make the first viewport feel like an operational command center, not a
  marketing hero.
- Lead with measurable KPIs, public-safe scope, ATT&CK coverage, and active
  scenarios.
- Add detection lifecycle depth: hypothesis, query focus, tuning rationale,
  false-positive notes, validation method, and routing.
- Add telemetry details: source health, synthetic replay timing, and evidence
  traceability.
- Keep claims honest. Use lab-validated and synthetic data language instead of
  production or enterprise claims.

Accepted changes:

- Reworked the dashboard into a dark SOC-style workbench.
- Added KPI strip, ATT&CK coverage matrix, scenario queue, signal stream, and
  validation path on the overview.
- Rebuilt the monitor view as detection lifecycle cards plus a sanitized
  detection-as-code panel.
- Added source health, replay timeline, evidence meters, tuning log, changelog,
  and readiness gates.
- Added Engineer and Recruiter modes so the project can be scanned quickly or
  reviewed deeply.

Rejected or deferred:

- No real Datadog screenshots or raw tenant exports.
- No customer-style marketing copy.
- No claims of production deployment or complete ATT&CK coverage.
