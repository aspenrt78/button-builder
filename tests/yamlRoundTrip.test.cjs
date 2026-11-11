'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const YAML = require('yaml');

// Run the actual TypeScript importer and generator without duplicating their logic.
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  module._compile(compiled.outputText, filename);
};

const { parseButtonCardYaml, validateImportedConfig } = require('../src/utils/yamlImporter.ts');
const { generateYaml } = require('../src/utils/yamlGenerator.ts');
const { DEFAULT_CONFIG } = require('../src/types.ts');

function roundTrip(source) {
  const imported = validateImportedConfig(parseButtonCardYaml(YAML.stringify(source)));
  const generated = generateYaml({ ...DEFAULT_CONFIG, ...imported });
  return { imported, generated, parsed: YAML.parse(generated) };
}

test('retains entity, icon, name, and essential show flags', () => {
  const { parsed } = roundTrip({
    type: 'custom:button-card',
    entity: 'light.kitchen',
    name: 'Kitchen',
    icon: 'mdi:lightbulb',
    show_name: false,
    show_icon: false,
  });
  assert.equal(parsed.entity, 'light.kitchen');
  assert.equal(parsed.name, 'Kitchen');
  assert.equal(parsed.icon, 'mdi:lightbulb');
  assert.equal(parsed.show_name, false);
  assert.equal(parsed.show_icon, false);
});

test('preserves nested variable objects and arrays without object-string coercion', () => {
  const vars = {
    values: { thresholds: [20, 50, 75], colors: { low: '#123456', high: '#abcdef' } },
    options: ['one', 'two'],
  };
  const { imported, parsed, generated } = roundTrip({
    type: 'custom:button-card',
    entity: 'sensor.temperature',
    variables: vars,
  });
  assert.deepEqual(JSON.parse(imported.variables.find(v => v.name === 'values').value), vars.values);
  assert.deepEqual(parsed.variables, vars);
  assert.equal(generated.includes('[object Object]'), false);
});

test('preserves action targets and service data', () => {
  const { parsed } = roundTrip({
    type: 'custom:button-card',
    entity: 'switch.fan',
    tap_action: {
      action: 'perform-action',
      perform_action: 'light.turn_on',
      target: { entity_id: ['light.kitchen', 'light.table'] },
      data: { brightness_pct: 45 },
    },
  });
  assert.equal(parsed.tap_action.perform_action, 'light.turn_on');
  assert.deepEqual(parsed.tap_action.target, { entity_id: ['light.kitchen', 'light.table'] });
  assert.equal(parsed.tap_action.data.brightness_pct, 45);
});

test('retains JavaScript action templates', () => {
  const code = '[[[ return entity.state === "on"; ]]]';
  const { parsed } = roundTrip({
    type: 'custom:button-card', entity: 'switch.lamp',
    tap_action: { action: 'javascript', javascript: code },
  });
  assert.equal(parsed.tap_action.action, 'javascript');
  assert.equal(parsed.tap_action.javascript.trim(), code);
});

test('rejects invalid YAML instead of fabricating an empty configuration', () => {
  assert.throws(() => parseButtonCardYaml('entity: [unterminated'), /./);
});

test('preserves template custom fields and their style declarations', () => {
  const value = '[[[ return entity.state === "on" ? "Active" : "Idle"; ]]]';
  const { imported, parsed } = roundTrip({
    type: 'custom:button-card',
    entity: 'switch.desk',
    custom_fields: { status: value },
    styles: { custom_fields: { status: ['color: #33cc66', 'font-weight: bold'] } },
  });
  assert.equal(imported.customFields[0].type, 'template');
  assert.equal(parsed.custom_fields.status.trim(), value);
  assert.deepEqual(parsed.styles.custom_fields.status, [{ color: '#33cc66' }, { 'font-weight': 'bold' }]);
});

test('retains a regex state override with its icon and label', () => {
  const { imported, parsed } = roundTrip({
    type: 'custom:button-card',
    entity: 'sensor.machine',
    state: [{ operator: 'regex', value: '^error', icon: 'mdi:alert', label: 'Needs attention' }],
  });
  assert.equal(imported.stateStyles.length, 1);
  const state = parsed.state.find(x => x.operator === 'regex');
  assert.ok(state);
  assert.equal(state.value, '^error');
  assert.equal(state.icon, 'mdi:alert');
  assert.equal(state.label, 'Needs attention');
});

test('preserves the default-state fallback after import and export', () => {
  const { parsed } = roundTrip({
    type: 'custom:button-card',
    entity: 'sensor.machine',
    state: [{ operator: 'default', name: 'Normal operation', icon: 'mdi:check' }],
  });
  const fallback = parsed.state.find(x => x.operator === 'default');
  assert.ok(fallback);
  assert.equal(fallback.name, 'Normal operation');
  assert.equal(fallback.icon, 'mdi:check');
});

test('preserves custom-field text with YAML-special characters', () => {
  const value = 'Floor 2: "Office" #1';
  const { parsed } = roundTrip({
    type: 'custom:button-card',
    entity: 'switch.office',
    custom_fields: { location: value },
  });
  assert.equal(parsed.custom_fields.location, value);
});
