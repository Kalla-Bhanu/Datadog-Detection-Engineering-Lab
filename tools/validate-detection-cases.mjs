import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const monitorsDir = path.join(root, "detections", "monitors");
const testCasesPath = path.join(root, "data", "test-cases.json");
const reportPath = path.join(root, "evidence", "validation-results.json");

const validCaseTypes = new Set(["positive", "negative", "edge_case"]);
const validOutcomes = new Set(["fire", "suppress"]);

function readJson(file) {
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

function parseSearch(query) {
  const match = query.match(/logs\("([^"]*)"\)/);
  if (!match) {
    fail(`Unsupported monitor query shape: ${query}`);
  }
  return match[1].split(/\s+/).filter(Boolean);
}

function parseThreshold(query) {
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

function evaluateCase(testCase, monitor) {
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

function loadMonitors() {
  return fs.readdirSync(monitorsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const monitor = readJson(path.join(monitorsDir, file));
      return [
        monitor.id,
        {
          ...monitor,
          file,
          searchTokens: parseSearch(monitor.query),
          threshold: parseThreshold(monitor.query)
        }
      ];
    });
}

function latestTimestamp(groups) {
  const timestamps = groups.flatMap((group) =>
    group.cases.flatMap((testCase) =>
      testCase.events
        .map((event) => event.timestamp)
        .filter(Boolean)
    )
  );
  return timestamps.sort().at(-1) || "fixture-without-timestamps";
}

const monitorMap = new Map(loadMonitors());
const groups = readJson(testCasesPath);

if (!Array.isArray(groups)) {
  fail("data/test-cases.json must be an array.");
}

const results = [];

for (const group of groups) {
  const monitor = monitorMap.get(group.monitor_id);
  if (!monitor) {
    fail(`${group.monitor_id} does not map to a monitor definition.`);
  }
  if (group.monitor_name !== monitor.name) {
    fail(`${group.monitor_id} monitor_name does not match the monitor definition.`);
  }
  if (!Array.isArray(group.cases) || group.cases.length < 3) {
    fail(`${group.monitor_id} must include positive, negative, and edge-case coverage.`);
  }

  const caseTypes = new Set(group.cases.map((testCase) => testCase.case_type));
  for (const requiredType of validCaseTypes) {
    if (!caseTypes.has(requiredType)) {
      fail(`${group.monitor_id} is missing ${requiredType} coverage.`);
    }
  }

  for (const testCase of group.cases) {
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
      if (!event.event_id) {
        fail(`${testCase.case_id} includes an event without event_id.`);
      }
      if (!Array.isArray(event.tags)) {
        fail(`${event.event_id} must include a tags array.`);
      }
    }

    const evaluation = evaluateCase(testCase, monitor);
    const passed = evaluation.actual_outcome === testCase.expected_outcome;

    results.push({
      monitor_id: group.monitor_id,
      monitor_name: group.monitor_name,
      case_id: testCase.case_id,
      case_type: testCase.case_type,
      expected_outcome: testCase.expected_outcome,
      actual_outcome: evaluation.actual_outcome,
      passed,
      matched_event_count: evaluation.matched_event_count,
      matched_event_ids: evaluation.matched_event_ids,
      threshold: evaluation.threshold,
      query_terms: evaluation.query_terms,
      rationale: testCase.rationale
    });
  }
}

const passedCount = results.filter((result) => result.passed).length;
const failedCount = results.length - passedCount;

const report = {
  report_type: "local_detection_validation",
  validation_window_end: latestTimestamp(groups),
  scope: "Public-safe local replay approximation of the Datadog log monitor queries in detections/monitors.",
  summary: {
    monitor_count: groups.length,
    case_count: results.length,
    passed_count: passedCount,
    failed_count: failedCount,
    pass_rate: Number((passedCount / results.length).toFixed(4))
  },
  results
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("Local detection validation");
console.log(`Monitors: ${report.summary.monitor_count}`);
console.log(`Cases: ${report.summary.case_count}`);
console.log(`Passed: ${report.summary.passed_count}`);
console.log(`Failed: ${report.summary.failed_count}`);

for (const result of results) {
  const status = result.passed ? "PASS" : "FAIL";
  console.log(`${status} ${result.monitor_id} / ${result.case_id}: expected ${result.expected_outcome}, got ${result.actual_outcome}`);
}

if (failedCount > 0) {
  process.exitCode = 1;
}
