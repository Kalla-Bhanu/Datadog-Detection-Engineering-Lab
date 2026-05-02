import fs from "node:fs";
import path from "node:path";
import {
  buildMonitorEvaluator,
  evaluateCase,
  readJson,
  validateGroupShape
} from "./harness-core.mjs";

const root = process.cwd();
const examplesDir = path.join(root, "detections", "field-correlation-examples");
const testCasesPath = path.join(root, "data", "field-correlation-example-cases.json");
const reportPath = path.join(root, "evidence", "field-correlation-example-results.json");

function fail(message) {
  throw new Error(message);
}

function loadExamples() {
  return fs.readdirSync(examplesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const monitor = readJson(path.join(examplesDir, file));
      return [
        monitor.id,
        { ...buildMonitorEvaluator(monitor), file }
      ];
    });
}

const examples = new Map(loadExamples());
const groups = readJson(testCasesPath);

if (!Array.isArray(groups)) {
  fail("data/field-correlation-example-cases.json must be an array.");
}
if (examples.size !== 1) {
  fail("Exactly one field-correlation example is expected for this release.");
}

const results = [];

for (const group of groups) {
  const monitor = examples.get(group.monitor_id);
  if (!monitor) {
    fail(`${group.monitor_id} does not map to a field-correlation example.`);
  }
  validateGroupShape(group, monitor);

  for (const testCase of group.cases) {
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
  report_type: "field_correlation_example_validation",
  scope: "One non-active AWS example that validates nested CloudTrail-style fields without changing the 7 active lab monitors.",
  summary: {
    example_count: examples.size,
    case_count: results.length,
    passed_count: passedCount,
    failed_count: failedCount,
    pass_rate: Number((passedCount / results.length).toFixed(4))
  },
  results
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("Field-correlation example validation");
console.log(`Examples: ${report.summary.example_count}`);
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
