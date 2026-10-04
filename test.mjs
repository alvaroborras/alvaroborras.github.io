import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const html = readFileSync('index.html', 'utf8');
const element = (dataset = {}) => ({
  dataset, hidden: true, attributes: {},
  setAttribute(key, value) { this.attributes[key] = value; },
  addEventListener(type, handler) { this[type] = handler; },
});
const projects = [...html.matchAll(/data-category="([^"]+)"/g)].map(([, category]) => ({ ...element({ category }), hidden: false }));
const buttons = [...html.matchAll(/data-filter="([^"]+)"/g)].map(([, filter]) => element({ filter }));
const theme = element();
const filters = element();
filters.querySelectorAll = () => buttons;
const count = {};
const root = element();
const document = {
  documentElement: root,
  querySelector: selector => ({ '#theme': theme, '#filters': filters, '#project-count': count })[selector],
  querySelectorAll: () => projects,
};
runInNewContext(readFileSync('script.js', 'utf8'), { document });
assert.equal(theme.hidden, false);
assert.equal(filters.hidden, false);
theme.click();
assert.equal(root.dataset.theme, 'light');
assert.equal(theme.attributes['aria-label'], 'Use dark theme');
theme.click();
assert.equal(root.dataset.theme, 'dark');
assert.equal(theme.attributes['aria-pressed'], 'false');
filters.click({ target: { closest: () => null } });
for (const button of buttons) {
  filters.click({ target: { closest: () => button } });
  const expected = projects.filter(p => button.dataset.filter === 'all' || p.dataset.category === button.dataset.filter);
  assert.deepEqual(projects.filter(p => !p.hidden), expected);
  assert.equal(count.textContent, `showing ${expected.length} of ${projects.length}`);
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(buttons.filter(b => b.attributes['aria-pressed'] === 'true').length, 1);
}
for (const [, path] of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
  if (!path.includes(':')) assert.ok(existsSync(path), `Missing asset: ${path}`);
}
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`), `Missing anchor: ${id}`);
assert.ok(!/adolfo|viguera/i.test(html), 'Reference author left in page');
assert.ok(!/buglens|langevin/i.test(html), 'Removed project left in page');
assert.equal(projects.length, 4);
assert.ok(html.includes('4 selected projects'));
assert.ok(html.includes('showing 4 of 4'));
assert.ok(html.includes("Let's connect :)"));
assert.ok(!html.includes('class="battle"'), 'Removed contact message remains');
assert.ok(buttons.every(b => projects.some(p => b.dataset.filter === 'all' || p.dataset.category === b.dataset.filter)), 'Empty filter category');
const postPath = 'blog/modular-inverses-rendering-check';
const post = readFileSync(`${postPath}/index.html`, 'utf8');
for (const [, path] of post.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
  if (!path.includes(':')) assert.ok(existsSync(resolve(postPath, path.split('#')[0])), `Missing post asset: ${path}`);
}
assert.ok(post.includes('<mfrac>') && post.includes('<msub>') && post.includes('<msup>'), 'Missing math examples');
const example = post.match(/<code data-language="python">([\s\S]*?)<\/code>/)[1].replace(/<[^>]*>/g, '');
const result = spawnSync('python3', ['-c', example], { encoding: 'utf8' });
assert.equal(result.status, 0, result.stderr);
assert.equal(result.stdout.trim(), '4\nNo inverse for 6 modulo 9');
const postTheme = element();
const postDocument = {
  documentElement: root,
  querySelector: selector => selector === '#theme' ? postTheme : null,
  querySelectorAll: () => [],
};
runInNewContext(readFileSync('script.js', 'utf8'), { document: postDocument });
postTheme.click();
assert.equal(root.dataset.theme, 'light');
for (const saved of ['light', 'dark', 'invalid']) {
  let stored = saved;
  const localStorage = { getItem: () => stored, setItem: (key, value) => { stored = value; } };
  runInNewContext(readFileSync('script.js', 'utf8'), { document: postDocument, localStorage });
  const initial = saved === 'light' ? 'light' : 'dark';
  assert.equal(root.dataset.theme, initial);
  postTheme.click();
  assert.equal(stored, initial === 'light' ? 'dark' : 'light');
  assert.equal(postTheme.textContent, `◐ ${stored === 'light' ? 'Dark' : 'Light'} theme`);
}
console.log('Passed: persistent themes, storage fallback, contact heading, filters, assets, math, and executable blog code.');
