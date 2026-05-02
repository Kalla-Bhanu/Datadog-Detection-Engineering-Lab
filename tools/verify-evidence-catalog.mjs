import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "evidence", "catalog.json");
const monitorsDir = path.join(root, "detections", "monitors");
const examplesDir = path.join(root, "detections", "field-correlation-examples");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function fail(message) {
  console.error(`CATALOG FAILED: ${message}`);
  process.exitCode = 1;
}

function checkEvidenceRefs(sourceFile, refs, catalogIds) {
  for (const ref of refs || []) {
    if (!catalogIds.has(ref)) {
      fail(`${sourceFile} references missing evidence catalog id ${ref}.`);
    }
  }
}

const catalog = readJson(catalogPath);
if (!Array.isArray(catalog)) {
  fail("evidence/catalog.json must be an array.");
}

const ids = new Set();
for (const entry of catalog) {
  if (!entry.id) {
    fail("catalog entry missing id.");
    continue;
  }
  if (ids.has(entry.id)) {
    fail(`duplicate catalog id ${entry.id}.`);
  }
  ids.add(entry.id);

  if (entry.path && !fs.existsSync(path.join(root, entry.path))) {
    fail(`${entry.id} points to missing path ${entry.path}.`);
  }
  if (!Array.isArray(entry.scenario_ids) || entry.scenario_ids.length === 0) {
    fail(`${entry.id} must include scenario_ids.`);
  }
}

const requiredIds = [
  "local-validation-results",
  "harness-control-self-tests",
  "aws-field-correlation-example",
  "field-correlation-example-results",
  "release-manifest"
];

for (const id of requiredIds) {
  if (!ids.has(id)) {
    fail(`catalog missing required id ${id}.`);
  }
}

for (const file of fs.readdirSync(monitorsDir).filter((item) => item.endsWith(".json"))) {
  const monitor = readJson(path.join(monitorsDir, file));
  checkEvidenceRefs(file, monitor.evidence_refs, ids);
}

for (const file of fs.readdirSync(examplesDir).filter((item) => item.endsWith(".json"))) {
  const example = readJson(path.join(examplesDir, file));
  checkEvidenceRefs(file, example.evidence_refs, ids);
}

if (process.exitCode) {
  process.exit(1);
}

console.log(`Evidence catalog verification passed for ${catalog.length} entries.`);
