import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = mkdtempSync(join(tmpdir(), 'edge-review-'));

const edge = spawn(EDGE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9222',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu=false',
  '--enable-webgl',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let nextId = 1;
function sendCommand(ws, method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (err) {
        reject(err);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  console.log('Waiting for Edge debugging port...');
  let version = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      if (res.ok) {
        version = await res.json();
        break;
      }
    } catch {
      await sleep(250);
    }
  }

  if (!version) {
    throw new Error('Failed to connect to Edge remote debugging port');
  }

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const page = pages[0];
  const wsUrl = page.webSocketDebuggerUrl;

  console.log('Connecting to WebSocket:', wsUrl);
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const consoleLogs = [];
  const errors = [];

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const { type, args } = msg.params;
      const text = args.map((a) => a.value ?? a.description ?? '').join(' ');
      consoleLogs.push({ type, text });
      if (type === 'error' || type === 'assert') {
        errors.push(`[Console ${type}]: ${text}`);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const { exceptionDetails } = msg.params;
      errors.push(`[Exception]: ${exceptionDetails.text} ${exceptionDetails.exception?.description || ''}`);
    } else if (msg.method === 'Log.entryAdded') {
      const { level, text } = msg.params.entry;
      if (level === 'error') {
        errors.push(`[Browser Log error]: ${text}`);
      }
    }
  });

  await sendCommand(ws, 'Runtime.enable');
  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'Log.enable');

  console.log('Navigating to http://localhost:3009 ...');
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3009' });

  await sleep(4000);

  // Take screenshot of initial state
  const ss1 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  writeFileSync('test_screenshot_initial.png', Buffer.from(ss1.data, 'base64'));
  console.log('Initial screenshot saved to test_screenshot_initial.png');

  // Trigger keyboard Space to advance workflow through its phases
  console.log('Stepping through workflow states...');
  for (let step = 0; step < 7; step++) {
    // Send Space keydown and keyup
    await sendCommand(ws, 'Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: ' ',
      code: 'Space',
      windowsVirtualKeyCode: 32
    });
    await sendCommand(ws, 'Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: ' ',
      code: 'Space',
      windowsVirtualKeyCode: 32
    });
    await sleep(1000);
  }

  // Click on roster items via evaluating JS
  console.log('Clicking on Roster items in DOM...');
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const arbiterBtn = buttons.find(b => b.textContent.includes('Main Arbiter'));
        if (arbiterBtn) arbiterBtn.click();
      })()
    `
  });
  await sleep(800);

  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const sandboxBtn = buttons.find(b => b.textContent.includes('Sandbox Kiln'));
        if (sandboxBtn) sandboxBtn.click();
      })()
    `
  });
  await sleep(800);

  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const coderBtn = buttons.find(b => b.textContent.includes('Coding Agent'));
        if (coderBtn) coderBtn.click();
      })()
    `
  });
  await sleep(800);

  // Take screenshot of final interacted state
  const ss2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  writeFileSync('test_screenshot_interacted.png', Buffer.from(ss2.data, 'base64'));
  console.log('Interacted screenshot saved to test_screenshot_interacted.png');

  // Check for root unmount errors specifically
  const unmountErrors = errors.filter(e => e.includes('synchronously unmount a root') || e.includes('createRoot'));
  
  console.log('\n================ VERIFICATION SUMMARY ================');
  console.log('Total console events captured:', consoleLogs.length);
  console.log('Total error events captured:', errors.length);
  console.log('Synchronous root unmount errors:', unmountErrors.length);
  if (unmountErrors.length > 0) {
    console.error('FAIL: Unmount errors detected:');
    unmountErrors.forEach(e => console.error('  ', e));
  } else {
    console.log('PASS: Zero synchronous root unmount errors detected!');
  }

  if (errors.length > 0) {
    console.log('\nAll captured errors:');
    errors.forEach(e => console.log('  ', e));
  }

  ws.close();
  edge.kill();
  try {
    rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}

main().catch((err) => {
  console.error('Error in verification script:', err);
  edge.kill();
  try {
    rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
  process.exit(1);
});
