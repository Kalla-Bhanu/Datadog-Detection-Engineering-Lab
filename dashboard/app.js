const data = window.DD_LAB_DATA;
let activeFilter = "all";
let viewMode = "engineer";

const shell = document.querySelector(".app-shell");
const nav = document.querySelector("#stageNav");
const frame = document.querySelector("#stageFrame");
const modeButtons = document.querySelectorAll("[data-mode]");
const stageTitle = document.querySelector("#stageTitle");
const stageSummary = document.querySelector("#stageSummary");
const envLabel = document.querySelector("#environmentLabel");
const updateLabel = document.querySelector("#updateLabel");

function stageFromHash() {
  const hashStage = window.location.hash.replace("#", "");
  return data.stages.some((stage) => stage.id === hashStage) ? hashStage : data.stages[0].id;
}

let activeStage = stageFromHash();

function cssClass(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function setChromeText(stage) {
  if (stageTitle) {
    stageTitle.textContent = stage.title;
  }
  if (stageSummary) {
    stageSummary.textContent = stage.summary;
  }
  if (envLabel) {
    envLabel.textContent = data.meta.environment;
  }
  if (updateLabel) {
    updateLabel.textContent = data.meta.update;
  }
}

function renderNav() {
  nav.innerHTML = data.stages.map((stage) => `
    <button class="nav-item ${stage.id === activeStage ? "active" : ""}" data-stage="${stage.id}">
      <span>${stage.label}</span>
      <small>${stage.badge}</small>
    </button>
  `).join("");

  nav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      setStage(button.dataset.stage);
    });
  });
}

function sparkBars(values) {
  return `<div class="sparkline" aria-hidden="true">${values.map((value) => `<i style="height:${value}%"></i>`).join("")}</div>`;
}

function kpiStrip() {
  return `<section class="kpi-strip" aria-label="Project snapshot">${data.kpis.map((kpi) => `
    <article class="kpi-tile ${kpi.tone}">
      <span>${kpi.label}</span>
      <strong>${kpi.value}</strong>
      <p>${kpi.note}</p>
      ${sparkBars(kpi.spark)}
    </article>
  `).join("")}</section>`;
}

function coverageMatrix(compact = false) {
  const cells = data.coverage.map((item) => `
    <article class="coverage-cell ${item.status}" data-status="${item.status}">
      <span>${item.tactic}</span>
      <strong>${item.technique}</strong>
      <p>${item.name}</p>
      ${compact ? "" : `<small>${item.source} / ${item.scenario}</small>`}
    </article>
  `).join("");

  return `
    <section class="panel coverage-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Mapped coverage</span>
          <h3>Detection coverage matrix</h3>
        </div>
        <div class="legend">
          <span class="validated">Checked</span>
          <span class="partial">Partial</span>
        </div>
      </div>
      <div class="coverage-grid">${cells}</div>
    </section>
  `;
}

function scenarioQueue() {
  return `
    <section class="panel scenario-queue">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Scenario queue</span>
          <h3>Alert paths ready for review</h3>
        </div>
      </div>
      <div class="queue-list">
        ${data.scenarios.map((scenario) => `
          <button class="queue-item" data-stage="scenarios" data-scenario="${scenario.id}">
            <span class="severity-dot ${cssClass(scenario.severity)}"></span>
            <strong>${scenario.title}</strong>
            <small>${scenario.killChain} / ${scenario.surface}</small>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function signalStream() {
  return `
    <section class="panel signal-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Alert trail</span>
          <h3>Sample alert flow</h3>
        </div>
      </div>
      <div class="signal-list">
        ${data.signalStream.map((signal) => `
          <article class="signal-row">
            <code>${signal.time}</code>
            <span class="severity ${cssClass(signal.severity)}">${signal.severity}</span>
            <p>${signal.text}</p>
            <small>${signal.source}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function pipelineRail() {
  return `
    <section class="panel pipeline-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">How I checked it</span>
          <h3>From alert to evidence</h3>
        </div>
      </div>
      <ol class="pipeline-rail">
        ${data.pipeline.map((item) => `
          <li>
            <span></span>
            <strong>${item.step}</strong>
            <p>${item.detail}</p>
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function sourceHealth() {
  return `
    <section class="panel source-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Source health</span>
          <h3>Data sources used in the lab</h3>
        </div>
      </div>
      <div class="source-grid">
        ${data.sourceHealth.map((source) => `
          <article class="source-tile ${source.state}">
            <span>${source.source}</span>
            <strong>${source.lag}</strong>
            <p>${source.path}</p>
            <code>${source.schema}</code>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function overviewStage(stage) {
  return `
    <section class="stage-panel overview-stage">
      ${kpiStrip()}
      <div class="command-grid">
        ${coverageMatrix(true)}
        ${scenarioQueue()}
      </div>
      <div class="command-grid lower">
        ${signalStream()}
        ${pipelineRail()}
      </div>
    </section>
  `;
}

function monitorFilters() {
  const severities = ["all", "Critical", "High", "Medium", "Low"];
  return `
    <div class="filter-bar" role="group" aria-label="Detection severity filter">
      ${severities.map((item) => `
        <button class="${activeFilter === item ? "active" : ""}" data-filter="${item}">
          ${item === "all" ? "All" : item}
        </button>
      `).join("")}
    </div>
  `;
}

function detectionCard(monitor) {
  return `
    <article class="detection-card ${cssClass(monitor.severity)}">
      <header>
        <div>
          <span class="section-kicker">${monitor.source}</span>
          <h3>${monitor.name}</h3>
        </div>
        <span class="severity ${cssClass(monitor.severity)}">${monitor.severity}</span>
      </header>
      <div class="detection-meta">
        <span>${monitor.type}</span>
        <span>${monitor.window}</span>
        <span>${monitor.owner}</span>
        <span>${monitor.confidence}% confidence</span>
      </div>
      <div class="query-strip">
        <span>Query focus</span>
        <code>${monitor.query}</code>
      </div>
      <div class="lifecycle-grid">
        <section>
          <strong>Hypothesis</strong>
          <p>${monitor.hypothesis}</p>
        </section>
        <section>
          <strong>Why this logic</strong>
          <p>${monitor.rationale}</p>
        </section>
        <section>
          <strong>Noise and exceptions</strong>
          <p>${monitor.fp}</p>
        </section>
        <section>
          <strong>How it was checked</strong>
          <p>${monitor.validation}</p>
        </section>
      </div>
      <footer>
        <code>${monitor.scenario}</code>
        <span>${monitor.route}</span>
        <span>${monitor.mitre}</span>
      </footer>
    </article>
  `;
}

function codePreview() {
  return `
    <section class="panel code-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Monitor definition</span>
          <h3>Sanitized Terraform example</h3>
        </div>
      </div>
      <pre><code>${data.codePreview.join("\n")}</code></pre>
    </section>
  `;
}

function monitorsStage(stage) {
  const filtered = data.monitors.filter((monitor) => activeFilter === "all" || monitor.severity === activeFilter);
  return `
    <section class="stage-panel">
      ${monitorFilters()}
      <div class="detection-layout">
        <section class="detection-list">
          ${filtered.map(detectionCard).join("")}
        </section>
        ${codePreview()}
      </div>
    </section>
  `;
}

function scenarioCards() {
  return `<div class="scenario-grid">${data.scenarios.map((scenario) => `
    <article class="scenario-card ${cssClass(scenario.severity)}" id="${scenario.id}">
      <header>
        <div>
          <span class="section-kicker">${scenario.killChain}</span>
          <h3>${scenario.title}</h3>
        </div>
        <span class="severity ${cssClass(scenario.severity)}">${scenario.severity}</span>
      </header>
      <div class="scenario-path">
        ${scenario.pivots.map((pivot) => `<span>${pivot}</span>`).join("")}
      </div>
      <dl>
        <dt>Trigger</dt><dd>${scenario.trigger}</dd>
        <dt>Triage</dt><dd>${scenario.triage}</dd>
        <dt>Outcome</dt><dd>${scenario.outcome}</dd>
      </dl>
      <footer>
        <code>${scenario.id}</code>
        <span>${scenario.evidence}</span>
      </footer>
    </article>
  `).join("")}</div>`;
}

function scenariosStage(stage) {
  return `
    <section class="stage-panel">
      <section class="kill-chain-strip">
        ${["Initial Access", "Credential Access", "Discovery", "Lateral Movement", "Collection"].map((item) => `<span>${item}</span>`).join("")}
      </section>
      ${scenarioCards()}
    </section>
  `;
}

function replayTimeline() {
  return `
    <section class="panel replay-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Replay timing</span>
          <h3>One scenario from start to evidence</h3>
        </div>
      </div>
      <ol class="replay-line">
        ${data.replayTimeline.map((event) => `
          <li>
            <code>${event.time}</code>
            <strong>${event.label}</strong>
            <p>${event.detail}</p>
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function validationPanel() {
  const summary = data.validation;
  return `
    <section class="panel validation-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Local validation</span>
          <h3>Every monitor has test pressure</h3>
        </div>
        <code>${summary.report}</code>
      </div>
      <div class="validation-score">
        <strong>${summary.headline}</strong>
        <span>${summary.label}</span>
      </div>
      <p>${summary.summary}</p>
      <div class="validation-breakdown">
        ${summary.breakdown.map((item) => `
          <article>
            <strong>${item.count}</strong>
            <span>${item.label}</span>
            <small>${item.note}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function artifactTrail() {
  return `
    <section class="panel artifact-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Evidence artifacts</span>
          <h3>What a reviewer can inspect</h3>
        </div>
      </div>
      <div class="artifact-list">
        ${data.evidenceArtifacts.map((item) => `
          <article class="${cssClass(item.state)}">
            <div>
              <span class="artifact-type">${item.type}</span>
              <strong>${item.title}</strong>
              <p>${item.proves}</p>
            </div>
            <code>${item.path}</code>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function evidencePanels() {
  return `<div class="evidence-grid">${data.evidence.map((item) => `
    <article class="evidence-panel ${item.tone}">
      <div class="evidence-meter" style="--score:${item.score}%">
        <span></span>
      </div>
      <span class="section-kicker">${item.id}</span>
      <h3>${item.title}</h3>
      <p>${item.claim}</p>
      <strong>${item.score}% evidence confidence</strong>
    </article>
  `).join("")}</div>`;
}

function evidenceStage(stage) {
  return `
    <section class="stage-panel">
      <div class="evidence-hero">
        ${validationPanel()}
        ${artifactTrail()}
      </div>
      <div class="telemetry-layout">
        ${sourceHealth()}
        ${replayTimeline()}
      </div>
      ${evidencePanels()}
    </section>
  `;
}

function tuningTable() {
  return `
    <section class="panel tuning-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Tuning notes</span>
          <h3>Operational tradeoffs</h3>
        </div>
      </div>
      <div class="tuning-list">
        ${data.tuning.map((item) => `
          <article>
            <strong>${item.monitor}</strong>
            <p>${item.issue}</p>
            <span>${item.fix}</span>
            <small>${item.result}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function readinessList() {
  return `<div class="readiness-grid">${data.readiness.map((item) => `
    <article class="readiness-card ${item.state}">
      <span></span>
      <strong>${item.label}</strong>
      <p>${item.detail}</p>
      <code>${item.state}</code>
    </article>
  `).join("")}</div>`;
}

function changelog() {
  return `
    <section class="panel changelog-panel">
      <div class="panel-head">
        <div>
          <span class="section-kicker">Project notes</span>
          <h3>What changed</h3>
        </div>
      </div>
      <div class="change-list">
        ${data.changelog.map((item) => `
          <article>
            <code>${item.version}</code>
            <span>${item.change}</span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function readinessStage(stage) {
  return `
    <section class="stage-panel">
      ${readinessList()}
      <div class="operations-grid">
        ${tuningTable()}
        ${changelog()}
      </div>
    </section>
  `;
}

function renderStage(stage) {
  const sectionMap = {
    overview: overviewStage,
    monitors: monitorsStage,
    scenarios: scenariosStage,
    evidence: evidenceStage,
    readiness: readinessStage
  };

  return sectionMap[stage.id](stage);
}

function wireStageActions() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll(".queue-item").forEach((button) => {
    button.addEventListener("click", () => {
      setStage(button.dataset.stage);
      const target = document.getElementById(button.dataset.scenario);
      if (target) {
        target.scrollIntoView({ block: "start" });
      }
    });
  });
}

function setStage(stageId, { updateHash = true } = {}) {
  if (!data.stages.some((stage) => stage.id === stageId)) {
    return;
  }
  activeStage = stageId;
  if (updateHash && window.location.hash !== `#${stageId}`) {
    window.history.replaceState(null, "", `#${stageId}`);
  }
  render();
}

function render() {
  shell.dataset.mode = viewMode;
  renderNav();
  const stage = data.stages.find((item) => item.id === activeStage) || data.stages[0];
  setChromeText(stage);
  frame.innerHTML = renderStage(stage);
  wireStageActions();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewMode = button.dataset.mode;
    modeButtons.forEach((item) => item.classList.toggle("active", item.dataset.mode === viewMode));
    render();
  });
});

window.addEventListener("hashchange", () => {
  setStage(stageFromHash(), { updateHash: false });
});

render();
