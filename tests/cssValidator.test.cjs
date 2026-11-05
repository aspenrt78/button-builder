'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/utils/cssValidator.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  fileName: 'cssValidator.ts',
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  reportDiagnostics: true,
});
const diagnostics = (compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
assert.equal(diagnostics.length, 0, 'CSS validator must transpile');
const module = { exports: {} };
vm.runInNewContext(compiled.outputText, { module, exports: module.exports }, { filename: 'cssValidator.js' });
const { validateCss, formatValidationResults, hasObviousErrors } = module.exports;

test('accepts a valid rgb() color without false typo warnings', () => {
  const result = validateCss('card {\n  background-color: rgb(255, 0, 128);\n}');
  assert.equal(result.isValid, true);
  assert.equal(result.warnings.length, 0);
  assert.equal(formatValidationResults(result), null);
});

test('accepts rgba() and CSS variables', () => {
  const result = validateCss('card {\n  color: rgba(255, 255, 255, 0.5);\n  background: var(--ha-card-background);\n}');
  assert.equal(result.isValid, true);
  assert.equal(result.warnings.length, 0);
});

test('warns about misspelled CSS functions', () => {
  const result = validateCss('card {\n  color: rgbs(255, 0, 0);\n}');
  assert.equal(result.isValid, true);
  assert.match(result.warnings.map(w => w.message).join(' '), /rgbs/);
});

test('reports an unbalanced function argument list', () => {
  const result = validateCss('card {\n  color: rgb(255, 0, 0;\n}');
  assert.equal(result.isValid, false);
  assert.match(result.errors.map(e => e.message).join(' '), /Unbalanced parentheses/);
});

test('reports missing closing brace', () => {
  const result = validateCss('card {\n  color: red;');
  assert.equal(result.isValid, false);
  assert.match(result.errors.map(e => e.message).join(' '), /closing brace/);
});

test('reports an unexpected closing brace', () => {
  const result = validateCss('card { color: red; }\n}');
  assert.equal(result.isValid, false);
  assert.match(result.errors.map(e => e.message).join(' '), /Unexpected closing brace/);
});

test('quick check detects unbalanced delimiters', () => {
  assert.equal(hasObviousErrors('card { color: red; }'), false);
  assert.equal(hasObviousErrors('card { color: red;'), true);
  assert.equal(hasObviousErrors('color: rgb(255, 0, 0'), true);
});
