import fs from "node:fs";
import path from "node:path";
import {
  buildMonitorEvaluator,
  evaluateCase,
  readJson,
  validateGroupShape
} from "./harness-core.mjs";

const root = process.cwd();
const controlCasesPath = path.join(root, "data", "harness-control-cases.json");
const reportPath = path.join(root, "evidence", "harness-control-results.json");

function runControl(control) {
  const monitor = buildMonitorEvaluator(control.monitor);
  validateGroupShape(control.group, monitor, { requireFullCoverage: false });

  for (const testCase of control.group.cases) {
    const evaluation = evaluateCase(testCase, monitor);
    if (evaluation.actual_outcome !== testCase.expected_outcome) {
      throw new Error(
        `${testCase.case_id} expected ${testCase.expected_outcome}, got ${evaluation.actual_outcome}`
      );
    }
  }
}

const controls = readJson(controlCasesPath);
if (!Array.isArray(controls) || controls.length < 5) {
  throw new Error("data/harness-control-cases.json must include at least five control cases.");
}

let failed = false;
let passedCount = 0;
const results = [];

console.log("Harness control self-test");

for (const control of controls) {
  try {
    runControl(control);
    console.error(`FAIL ${control.control_id}: control did not fail as expected.`);
    results.push({
      control_id: control.control_id,
      failure_category: control.failure_category,
      expected_failure_contains: control.expected_failure_contains,
      passed: false,
      observed_failure: null
    });
    failed = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes(control.expected_failure_contains)) {
      console.error(`FAIL ${control.control_id}: expected "${control.expected_failure_contains}", got "${message}"`);
      results.push({
        control_id: control.control_id,
        failure_category: control.failure_category,
        expected_failure_contains: control.expected_failure_contains,
        passed: false,
        observed_failure: message
      });
      failed = true;
      continue;
    }
    passedCount += 1;
    results.push({
      control_id: control.control_id,
      failure_category: control.failure_category,
      expected_failure_contains: control.expected_failure_contains,
      passed: true,
      observed_failure: message
    });
    console.log(`PASS ${control.control_id}: ${control.failure_category}`);
  }
}

const report = {
  report_type: "harness_control_self_test",
  scope: "Intentional negative controls that prove the local evaluator fails safely on malformed or inconsistent inputs.",
  summary: {
    control_count: controls.length,
    passed_count: passedCount,
    failed_count: controls.length - passedCount,
    pass_rate: Number((passedCount / controls.length).toFixed(4))
  },
  results
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Controls: ${controls.length}`);
console.log(`Passed: ${passedCount}`);
console.log(`Failed: ${controls.length - passedCount}`);

if (failed) {
  process.exit(1);
}
