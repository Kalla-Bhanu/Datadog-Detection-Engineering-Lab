import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const monitorsDir = path.join(root, "detections", "monitors");
const eventsPath = path.join(root, "data", "events.json");

const requiredMonitorFields = [
  "id",
  "name",
  "type",
  "scenario_id",
  "severity",
  "query",
  "message",
  "tags",
  "options",
  "triage",
  "evidence_refs"
];

const requiredEventFields = [
  "event_id",
  "timestamp",
  "scenario_id",
  "service",
  "source",
  "status",
  "severity",
  "message",
  "tags",
  "expected_detection"
];

function fail(message) {
  console.error(`VALIDATION FAILED: ${message}`);
  process.exitCode = 1;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const monitorFiles = fs.readdirSync(monitorsDir).filter((file) => file.endsWith(".json"));
if (monitorFiles.length < 6) {
  fail("Expected at least six monitor definitions.");
}

const monitors = monitorFiles.map((file) => {
  const fullPath = path.join(monitorsDir, file);
  const monitor = readJson(fullPath);
  for (const field of requiredMonitorFields) {
    if (!(field in monitor)) {
      fail(`${file} is missing ${field}.`);
    }
  }
  if (!Array.isArray(monitor.tags) || monitor.tags.length < 3) {
    fail(`${file} must include at least three tags.`);
  }
  if (!Array.isArray(monitor.evidence_refs) || monitor.evidence_refs.length === 0) {
    fail(`${file} must include evidence refs.`);
  }
  if (monitor.type !== "log alert") {
    fail(`${file} must be a log alert.`);
  }
  if (monitor.tags.includes("test-harness") && !monitor.query.includes("source:test-harness")) {
    fail(`${file} test-harness monitor is missing source:test-harness in query.`);
  }
  return monitor;
});

const scenarioIds = new Set(monitors.map((monitor) => monitor.scenario_id));
const events = readJson(eventsPath);
if (!Array.isArray(events) || events.length < 8) {
  fail("events.json must contain at least eight synthetic events.");
}

for (const event of events) {
  for (const field of requiredEventFields) {
    if (!(field in event)) {
      fail(`${event.event_id || "event"} is missing ${field}.`);
    }
  }
  if (!Array.isArray(event.tags) || event.tags.length < 3) {
    fail(`${event.event_id} must include at least three tags.`);
  }
  if (!scenarioIds.has(event.scenario_id) && event.scenario_id !== "source_pipeline_health") {
    fail(`${event.event_id} references an unmapped scenario ${event.scenario_id}.`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log(`Validated ${monitors.length} monitors and ${events.length} synthetic events.`);

