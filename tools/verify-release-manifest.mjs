import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function fail(message) {
  console.error(`MANIFEST FAILED: ${message}`);
  process.exitCode = 1;
}

function countDetectionCases(groups) {
  return groups.reduce((sum, group) => sum + group.cases.length, 0);
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

const manifest = readJson("release_manifest.json");
const packageJson = readJson("package.json");
const monitorCount = fs.readdirSync(path.join(root, "detections", "monitors"))
  .filter((file) => file.endsWith(".json")).length;
const detectionCaseCount = countDetectionCases(readJson("data/test-cases.json"));
const controlCount = readJson("data/harness-control-cases.json").length;
const fieldExampleCount = fs.readdirSync(path.join(root, "detections", "field-correlation-examples"))
  .filter((file) => file.endsWith(".json")).length;
const fieldExampleCaseCount = countDetectionCases(readJson("data/field-correlation-example-cases.json"));
const catalogCount = readJson("evidence/catalog.json").length;
const dashboardData = fs.readFileSync(path.join(root, "dashboard", "dashboard-data.js"), "utf8");
const validatedAttackCount = countMatches(dashboardData, /status:\s*"validated"/g);
const partialAttackCount = countMatches(dashboardData, /status:\s*"partial"/g);

const expected = {
  version: packageJson.version,
  active_monitor_count: monitorCount,
  detection_case_count: detectionCaseCount,
  harness_control_count: controlCount,
  field_correlation_example_count: fieldExampleCount,
  field_correlation_example_case_count: fieldExampleCaseCount,
  catalog_entry_count: catalogCount
};

for (const [field, value] of Object.entries(expected)) {
  if (manifest[field] !== value) {
    fail(`${field} expected ${value}, got ${manifest[field]}.`);
  }
}

if (manifest.video_included !== false) {
  fail("video_included must remain false.");
}
if (manifest.live_services_required !== false) {
  fail("live_services_required must remain false.");
}
if (manifest.attack_coverage.validated_count !== validatedAttackCount) {
  fail(`validated attack coverage expected ${validatedAttackCount}, got ${manifest.attack_coverage.validated_count}.`);
}
if (manifest.attack_coverage.partial_count !== partialAttackCount) {
  fail(`partial attack coverage expected ${partialAttackCount}, got ${manifest.attack_coverage.partial_count}.`);
}
if (!manifest.attack_coverage.not_claimed.includes("T1041") || !manifest.attack_coverage.not_claimed.includes("T1562")) {
  fail("T1041 and T1562 must remain explicit not-claimed boundaries.");
}
if (!Array.isArray(manifest.attack_coverage.partial_boundaries) || manifest.attack_coverage.partial_boundaries.length !== partialAttackCount) {
  fail(`partial_boundaries must explain all ${partialAttackCount} partial ATT&CK entries.`);
}
for (const technique of ["T1098", "T1021"]) {
  const boundary = manifest.attack_coverage.partial_boundaries.find((entry) => entry.technique === technique);
  if (!boundary || !boundary.covered_behavior || !boundary.not_claimed) {
    fail(`${technique} partial boundary must include covered_behavior and not_claimed.`);
  }
}
if (!manifest.lab_modeling_disclosure) {
  fail("lab_modeling_disclosure is required.");
}
for (const field of ["real_preserved_evidence", "real_local_execution", "lab_modeled_artifacts", "not_claimed"]) {
  if (!Array.isArray(manifest.lab_modeling_disclosure[field]) || manifest.lab_modeling_disclosure[field].length === 0) {
    fail(`lab_modeling_disclosure.${field} must be a non-empty array.`);
  }
}

if (process.exitCode) {
  process.exit(1);
}

console.log("Release manifest verification passed.");
