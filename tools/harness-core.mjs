import fs from "node:fs";

export const validCaseTypes = new Set(["positive", "negative", "edge_case"]);
export const validOutcomes = new Set(["fire", "suppress"]);

export const requiredCaseEventFields = [
  "event_id",
  "timestamp",
  "scenario_id",
  "service",
  "source",
  "status",
  "severity",
  "message",
  "tags"
];

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function fail(message) {
  throw new Error(message);
}

function normalize(value) {
  return String(value ?? "").toLowerCase();
}

function eventTags(event) {
  return Array.isArray(event.tags) ? event.tags.map((tag) => String(tag)) : [];
}

function hasTag(event, tag) {
  const wanted = normalize(tag);
  return eventTags(event).some((candidate) => normalize(candidate) === wanted);
}

function valuesAtPath(source, fieldPath) {
  const parts = fieldPath.split(".");
  let current = source;

  for (const part of parts) {
    if (current == null || typeof current !== "object" || !(part in current)) {
      return [];
    }
    current = current[part];
  }

  return Array.isArray(current) ? current : [current];
}

function splitFieldToken(token) {
  const normalized = token.startsWith("@") ? token.slice(1) : token;
  const index = normalized.indexOf(":");
  if (index === -1) {
    return null;
  }
  return {
    field: normalized.slice(0, index),
    value: normalized.slice(index + 1),
    tag: normalized
  };
}

function fieldValueMatches(event, field, value) {
  const expected = normalize(value);
  const candidateValues = [];

  if (field === "scenario") {
    candidateValues.push(event.scenario_id, event.scenario);
  } else if (field === "source") {
    candidateValues.push(event.source);
  } else if (field === "service") {
    candidateValues.push(event.service);
  } else if (field === "synthetic") {
    candidateValues.push(event.synthetic);
  } else if (field === "purpose") {
    candidateValues.push(event.purpose);
  } else if (field in event) {
    candidateValues.push(event[field]);
  }

  candidateValues.push(...valuesAtPath(event, field));

  return candidateValues.some((candidate) => normalize(candidate) === expected);
}

function tokenMatches(event, rawToken) {
  const token = rawToken.trim();
  if (!token) {
    return true;
  }

  const fieldToken = splitFieldToken(token);
  if (fieldToken) {
    return hasTag(event, fieldToken.tag) || fieldValueMatches(event, fieldToken.field, fieldToken.value);
  }

  const wanted = normalize(token);
  const haystack = [
    event.event_id,
    event.service,
    event.source,
    event.status,
    event.severity,
    event.message,
    event.scenario_id,
    ...eventTags(event)
  ];

  return haystack.some((candidate) => normalize(candidate).includes(wanted));
}

export function parseSearch(query) {
  const match = query.match(/logs\("([^"]*)"\)/);
  if (!match) {
    fail(`Unsupported monitor query shape: ${query}`);
  }
  return match[1].split(/\s+/).filter(Boolean);
}

export function parseThreshold(query) {
  const match = query.match(/(>=|<=|>|<)\s*(\d+(?:\.\d+)?)\s*$/);
  if (!match) {
    fail(`Unsupported threshold expression: ${query}`);
  }
  return { operator: match[1], value: Number(match[2]) };
}

function evaluateThreshold(count, threshold) {
  if (threshold.operator === ">=") {
    return count >= threshold.value;
  }
  if (threshold.operator === "<=") {
    return count <= threshold.value;
  }
  if (threshold.operator === ">") {
    return count > threshold.value;
  }
  return count < threshold.value;
}

function matchesMonitor(event, monitor) {
  return monitor.searchTokens.every((token) => tokenMatches(event, token));
}

export function buildMonitorEvaluator(monitor) {
  return {
    ...monitor,
    searchTokens: parseSearch(monitor.query),
    threshold: parseThreshold(monitor.query)
  };
}

export function validateCaseShape(testCase) {
  if (!validCaseTypes.has(testCase.case_type)) {
    fail(`${testCase.case_id} has unsupported case_type ${testCase.case_type}.`);
  }
  if (!validOutcomes.has(testCase.expected_outcome)) {
    fail(`${testCase.case_id} has unsupported expected_outcome ${testCase.expected_outcome}.`);
  }
  if (!Array.isArray(testCase.events)) {
    fail(`${testCase.case_id} must include an events array.`);
  }

  for (const event of testCase.events) {
    for (const field of requiredCaseEventFields) {
      if (!(field in event)) {
        fail(`${event.event_id || testCase.case_id} is missing ${field}.`);
      }
    }
    if (!Array.isArray(event.tags)) {
      fail(`${event.event_id} must include a tags array.`);
    }
  }
}

export function validateGroupShape(group, monitor, { requireFullCoverage = true } = {}) {
  if (group.monitor_id !== monitor.id) {
    fail(`${group.monitor_id} does not match monitor id ${monitor.id}.`);
  }
  if (group.monitor_name !== monitor.name) {
    fail(`${group.monitor_id} monitor_name does not match the monitor definition.`);
  }
  if (!Array.isArray(group.cases)) {
    fail(`${group.monitor_id} must include a cases array.`);
  }
  if (requireFullCoverage && group.cases.length < 3) {
    fail(`${group.monitor_id} must include positive, negative, and edge-case coverage.`);
  }

  if (requireFullCoverage) {
    const caseTypes = new Set(group.cases.map((testCase) => testCase.case_type));
    for (const requiredType of validCaseTypes) {
      if (!caseTypes.has(requiredType)) {
        fail(`${group.monitor_id} is missing ${requiredType} coverage.`);
      }
    }
  }

  for (const testCase of group.cases) {
    validateCaseShape(testCase);
  }
}

export function evaluateCase(testCase, monitor) {
  const matchedEvents = testCase.events.filter((event) => matchesMonitor(event, monitor));
  const shouldFire = evaluateThreshold(matchedEvents.length, monitor.threshold);

  return {
    actual_outcome: shouldFire ? "fire" : "suppress",
    matched_event_ids: matchedEvents.map((event) => event.event_id),
    matched_event_count: matchedEvents.length,
    threshold: `${monitor.threshold.operator} ${monitor.threshold.value}`,
    query_terms: monitor.searchTokens
  };
}
