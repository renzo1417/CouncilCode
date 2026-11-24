import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = mkdtempSync(join(tmpdir(), 'edge-rev-'));

const edge = spawn(EDGE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9223',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu=false',
  '--enable-webgl',
  '--no-first-run',
  '--no-default-browser-check',
  'http://localhost:3009'
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Connecting to Edge on 9223...');
  let version = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9223/json/version');
      if (res.ok) {
        version = await res.json();
        break;
      }
    } catch {
      await sleep(200);
    }
  }

  if (!version) {
    throw new Error('Could not connect to Edge');
  }

  const listRes = await fetch('http://127.0.0.1:9223/json/list');
  const pages = await listRes.json();
  const page = pages.find((p) => p.url.includes('3009')) || pages[0];
  console.log('Target page URL:', page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  const consoleLogs = [];
  const errors = [];

  let resolveCommand = null;
  let curId = 0;

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && resolveCommand && msg.id === curId) {
      resolveCommand(msg);
      resolveCommand = null;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      consoleLogs.push({ type: msg.params.type, text });
      if (msg.params.type === 'error') {
        errors.push(`[Console error]: ${text}`);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(`[Exception]: ${msg.params.exceptionDetails.text}`);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  function send(method, params = {}) {
    return new Promise((resolve) => {
      curId++;
      resolveCommand = resolve;
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Runtime.enable');
  await send('Log.enable');

  console.log('Waiting for initial render and compilation...');
  await sleep(12000);

  // Stepping through workflow states using Space key
  console.log('Stepping through workflow states with Space key...');
  for (let i = 0; i < 8; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await sleep(600);
  }

  // Click stations
  console.log('Selecting stations...');
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const arbiter = btns.find(b => b.textContent.includes('Main Arbiter'));
      if (arbiter) arbiter.click();
    `
  });
  await sleep(600);

  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const sandbox = btns.find(b => b.textContent.includes('Sandbox Kiln'));
      if (sandbox) sandbox.click();
    `
  });
  await sleep(600);

  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const coder = btns.find(b => b.textContent.includes('Coding Agent'));
      if (coder) coder.click();
    `
  });
  await sleep(600);

  // Screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  if (ss.result?.data) {
    writeFileSync('test_render_review.png', Buffer.from(ss.result.data, 'base64'));
    console.log('Saved test_render_review.png');
  }

  console.log('\n--- CONSOLE LOGS ---');
  consoleLogs.forEach((l) => console.log(`[${l.type}] ${l.text}`));

  const rootUnmountErrors = errors.filter((e) =>
    e.includes('Attempted to synchronously unmount a root while React was already rendering')
  );

  console.log('\n--- VERDICT ---');
  console.log('Total console logs:', consoleLogs.length);
  console.log('Total errors:', errors.length);
  console.log('Synchronous root unmount errors:', rootUnmountErrors.length);

  ws.close();
  edge.kill();
  try {
    rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}

main().catch((err) => {
  console.error(err);
  edge.kill();
  try {
    rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
});
