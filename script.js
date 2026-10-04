const theme = document.querySelector('#theme');
function setTheme(value) {
  const light = value === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  theme.setAttribute('aria-pressed', String(light));
  theme.setAttribute('aria-label', `Use ${light ? 'dark' : 'light'} theme`);
  theme.textContent = `◐ ${light ? 'Dark' : 'Light'} theme`;
}
try { setTheme(localStorage.getItem('theme')); }
catch { setTheme('dark'); }
theme.hidden = false;
theme.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  try { localStorage.setItem('theme', document.documentElement.dataset.theme); }
  catch { /* Theme switching still works when browser storage is unavailable. */ }
});

const filters = document.querySelector('#filters');
const projects = [...document.querySelectorAll('[data-category]')];
if (filters) {
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    for (const option of filters.querySelectorAll('button')) {
      option.setAttribute('aria-pressed', String(option === button));
    }
    for (const project of projects) {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
    }
    document.querySelector('#project-count').textContent = `showing ${projects.filter(project => !project.hidden).length} of ${projects.length}`;
  });
}
