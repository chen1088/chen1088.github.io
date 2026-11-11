const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'fresh-text-link.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '..', 'prompts', 'manifest.json'), 'utf8'));
const COUNT = manifest.variants.length;
const VERSION = manifest.version;
const validPaths = new Set(manifest.variants.map(v => '/prompts/' + v.file));
assert.equal(COUNT, 50);
assert.equal(validPaths.size, COUNT);
let clock = 1000;

function storage(blocked = false) {
  const values = new Map();
  return {
    values,
    getItem(key) { if (blocked) throw new Error('Storage unavailable'); return values.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('Storage unavailable'); values.set(key, value); }
  };
}

function page(saved) {
  const listeners = new Map();
  const link = {
    href: 'https://chen1088.github.io/prompts/mfg-01.txt?v=mfg-conversational-50-v3',
    addEventListener(type, fn) { listeners.set(type, fn); }
  };
  vm.runInNewContext(source, {
    document: { baseURI: 'https://chen1088.github.io/', getElementById: () => link },
    localStorage: saved, URL, crypto: webcrypto, Date: { now: () => ++clock }, Math
  });
  return {
    href: () => link.href,
    activate(type = 'click', button = 0) {
      listeners.get(type)({ type, button });
      const url = new URL(link.href);
      assert.ok(validPaths.has(url.pathname), 'Selected prompt must be in the published set');
      assert.ok(url.searchParams.get('v').startsWith(VERSION + '-'));
      return url.pathname;
    }
  };
}

for (const reloadEvery of [0, 1, 3, COUNT]) {
  const saved = storage();
  let current = page(saved);
  let previous = null;
  const seen = [];
  for (let i = 0; i < 1000; i++) {
    if (reloadEvery && i && i % reloadEvery === 0) current = page(saved);
    const next = current.activate();
    assert.notEqual(next, previous, 'Adjacent activations must differ');
    previous = next;
    seen.push(next);
    if (seen.length === COUNT) { assert.equal(new Set(seen).size, COUNT, 'Each cycle must contain every prompt'); seen.length = 0; }
  }
}

const blocked = page(storage(true));
let previous = null;
let cycle = [];
for (let i = 0; i < 100; i++) {
  const next = blocked.activate();
  assert.notEqual(next, previous);
  previous = next; cycle.push(next);
  if (cycle.length === COUNT) { assert.equal(new Set(cycle).size, COUNT); cycle = []; }
}

const damaged = storage();
damaged.values.set('chenxu:mfg-prompts:mfg-conversational-50-v3', '{not JSON');
assert.ok(page(damaged).activate());

const writable = storage();
page(writable);
const readOnly = { getItem: key => writable.getItem(key), setItem() { throw new Error('Read only'); } };
const fallback = page(readOnly);
const fallbackCycle = Array.from({ length: COUNT }, () => fallback.activate());
assert.equal(new Set(fallbackCycle).size, COUNT, 'Readable but unwritable storage must use page memory');
damaged.values.set('chenxu:mfg-prompts:mfg-conversational-50-v3', JSON.stringify({ version: 'mfg-conversational-50-v3', remaining: [100, 100], last: -1 }));
assert.ok(page(damaged).activate());

const multi = page(storage());
const before = multi.href();
multi.activate('auxclick', 2);
assert.equal(multi.href(), before, 'Right-button auxclick must not consume another prompt');
const first = multi.activate('auxclick', 1);
const second = multi.activate('contextmenu', 2);
assert.notEqual(first, second);
assert.notEqual(second, multi.activate('click'));
console.log('Passed: 4,000 activations with reloads, 100 without storage, cycle boundaries, damaged storage, and alternate activations.');
