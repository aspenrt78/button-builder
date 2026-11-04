'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Transpile the real service under test. No mocked copy of the implementation.
const source = fs.readFileSync(path.join(__dirname, '../src/services/dashboardService.ts'), 'utf8');
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: 'dashboardService.ts',
  reportDiagnostics: true,
});
const errors = (javascript.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
assert.equal(errors.length, 0, ts.formatDiagnosticsWithColorAndContext(errors, {
  getCanonicalFileName: f => f,
  getCurrentDirectory: () => process.cwd(),
  getNewLine: () => '\n',
}));

function loadService(hassRef) {
  const module = { exports: {} };
  const parent = { location: { href: 'https://ha.example/local/button_builder' }, document: { querySelector: () => null } };
  Object.defineProperty(parent, 'hass', { get: () => hassRef.current });
  const context = {
    module,
    exports: module.exports,
    window: { location: { pathname: '/button-builder' }, parent },
    console: { info() {}, debug() {}, error() {} },
    setTimeout,
    clearTimeout,
  };
  vm.runInNewContext(javascript.outputText, context, { filename: 'dashboardService.js' });
  return module.exports;
}

function createHass({ dashboards = [], configs = {}, mode = 'storage', failSave = null } = {}) {
  const messages = [];
  const hass = {
    panels: { lovelace: { config: { mode } } },
    async callWS(payload) {
      messages.push(payload);
      if (payload.type === 'lovelace/dashboards/list') return dashboards;
      if (payload.type === 'lovelace/config') return configs[String(payload.url_path)] ?? null;
      if (payload.type === 'lovelace/config/save') {
        if (failSave) throw new Error(failSave);
        return {};
      }
      return null;
    },
  };
  return { hass, messages };
}

test('discovers migrated default dashboard and saves to its named lovelace path', async () => {
  const { hass, messages } = createHass({
    dashboards: [{ id: 'dash-1', url_path: 'lovelace', title: 'Overview', mode: 'storage' }],
    configs: { lovelace: { title: 'Overview', views: [{ title: 'Home', cards: [{ type: 'markdown', content: 'Existing' }] }] } },
  });
  const service = loadService({ current: hass });
  const targets = await service.fetchStorageDashboardTargets();
  assert.equal(targets.length, 1);
  assert.equal(targets[0].dashboardId, 'lovelace');
  await service.addCardToDashboard({
    dashboardId: targets[0].dashboardId, viewIndex: 0,
    cardConfig: { type: 'custom:button-card', entity: 'light.kitchen' },
  });
  const save = messages.find(m => m.type === 'lovelace/config/save');
  assert.equal(save.url_path, 'lovelace');
  assert.equal(save.config.views[0].cards.length, 2);
  assert.equal(save.config.views[0].cards[0].type, 'markdown');
  assert.equal(save.config.views[0].cards[1].entity, 'light.kitchen');
});

test('uses null only for legacy default dashboard fallback', async () => {
  const { hass, messages } = createHass({
    configs: { null: { views: [{ cards: [] }] } },
  });
  const service = loadService({ current: hass });
  const targets = await service.fetchStorageDashboardTargets();
  assert.equal(targets.length, 1);
  assert.equal(targets[0].dashboardId, '__default__');
  await service.addCardToDashboard({
    dashboardId: '__default__', viewIndex: 0,
    cardConfig: { type: 'custom:button-card' },
  });
  assert.equal(messages.find(m => m.type === 'lovelace/config/save').url_path, null);
});

test('skips YAML-managed dashboards rather than trying to write them', async () => {
  const { hass } = createHass({
    dashboards: [{ id: 'yaml-1', url_path: 'energy', title: 'Energy', mode: 'yaml' }],
  });
  const service = loadService({ current: hass });
  assert.equal((await service.fetchStorageDashboardTargets()).length, 0);
});

test('appends into the requested sections-view section without changing another section', async () => {
  const { hass, messages } = createHass({
    dashboards: [{ id: 'dash-2', url_path: 'my-dashboard', title: 'My dashboard', mode: 'storage' }],
    configs: {
      'my-dashboard': { views: [{ type: 'sections', sections: [
        { title: 'First', cards: [{ type: 'markdown' }] },
        { title: 'Second', cards: [] },
      ] }] },
    },
  });
  const service = loadService({ current: hass });
  await service.addCardsToDashboard({
    dashboardId: 'my-dashboard', viewIndex: 0, sectionIndex: 1,
    cardConfigs: [{ type: 'custom:button-card', entity: 'switch.office' }],
  });
  const save = messages.find(m => m.type === 'lovelace/config/save');
  assert.equal(save.config.views[0].sections[0].cards.length, 1);
  assert.equal(save.config.views[0].sections[1].cards[0].entity, 'switch.office');
});

test('retries Home Assistant detection after an early unavailable check', async () => {
  const ref = { current: null };
  const service = loadService(ref);
  assert.equal((await service.fetchStorageDashboardTargets()).length, 0);
  ref.current = createHass({
    dashboards: [{ id: 'dash', url_path: 'office-ui', mode: 'storage' }],
    configs: { 'office-ui': { views: [{}] } },
  }).hass;
  const targets = await service.fetchStorageDashboardTargets();
  assert.equal(targets.length, 1);
  assert.equal(targets[0].dashboardId, 'office-ui');
});

test('preserves the Home Assistant error when dashboard saving fails', async () => {
  const { hass } = createHass({
    configs: { 'my-dashboard': { views: [{}] } },
    failSave: 'Unauthorized',
  });
  const service = loadService({ current: hass });
  await assert.rejects(
    service.addCardToDashboard({
      dashboardId: 'my-dashboard', viewIndex: 0,
      cardConfig: { type: 'custom:button-card' },
    }),
    /Failed to save the dashboard configuration: Unauthorized/,
  );
});

test('rejects a missing view without sending a save request', async () => {
  const { hass, messages } = createHass({
    configs: { 'my-dashboard': { views: [{}] } },
  });
  const service = loadService({ current: hass });
  await assert.rejects(
    service.addCardToDashboard({
      dashboardId: 'my-dashboard', viewIndex: 10,
      cardConfig: { type: 'custom:button-card' },
    }),
    /view no longer exists/,
  );
  assert.equal(messages.filter(m => m.type === 'lovelace/config/save').length, 0);
});
