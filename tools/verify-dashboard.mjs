import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "dashboard/index.html",
  "dashboard/styles.css",
  "dashboard/app.js",
  "dashboard/dashboard-data.js",
  "dashboard/assets/favicon.svg"
];

let failed = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`Missing dashboard file: ${file}`);
    failed = true;
  }
}

const html = fs.readFileSync(path.join(root, "dashboard", "index.html"), "utf8");
const data = fs.readFileSync(path.join(root, "dashboard", "dashboard-data.js"), "utf8");
const app = fs.readFileSync(path.join(root, "dashboard", "app.js"), "utf8");

for (const token of ["stageNav", "stageFrame", "dashboard-data.js", "app.js"]) {
  if (!html.includes(token)) {
    console.error(`index.html missing token ${token}`);
    failed = true;
  }
}

for (const token of ["overview", "monitors", "scenarios", "evidence", "readiness"]) {
  if (!data.includes(`id: "${token}"`)) {
    console.error(`dashboard-data.js missing stage ${token}`);
    failed = true;
  }
}

if (!app.includes("render()")) {
  console.error("app.js missing render entrypoint.");
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log("Dashboard static verification passed.");

