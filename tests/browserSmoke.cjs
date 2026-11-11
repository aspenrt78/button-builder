'use strict';

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const address = 'http://127.0.0.1:4173/button_builder/';
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
});
let logs = '';
server.stdout.on('data', chunk => { logs += chunk.toString(); });
server.stderr.on('data', chunk => { logs += chunk.toString(); });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function ready() {
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error('Vite exited early: ' + logs);
    try {
      const response = await fetch(address, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('Vite did not become ready: ' + logs);
}
(async () => {
  let browser;
  try {
    await ready();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(address, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Button Card Builder' }).waitFor({ timeout: 20000 });
    await page.getByText('Live Preview', { exact: true }).first().waitFor({ timeout: 15000 });
    assert.equal(errors.length, 0, 'Uncaught browser exceptions: ' + errors.join('; '));
    assert.equal(await page.getByText('Button Builder failed to load:', { exact: false }).count(), 0);
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    assert.equal(await page.locator('html.bb-light').count(), 1, 'Theme toggle must apply light mode');
    console.log('Browser smoke passed: editor, preview, no runtime crash, theme toggle.');
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
