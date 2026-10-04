import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

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
  assert.equal(count.textContent, `showing ${expected.length} of 6`);
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(buttons.filter(b => b.attributes['aria-pressed'] === 'true').length, 1);
}
for (const [, path] of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
  if (!path.includes(':')) assert.ok(existsSync(path), `Missing asset: ${path}`);
}
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`), `Missing anchor: ${id}`);
assert.ok(!/adolfo|viguera/i.test(html), 'Reference author left in page');
console.log('Passed: theme, all project filters, local assets, anchors, and author replacement.');
