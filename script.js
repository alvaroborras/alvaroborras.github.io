const theme = document.querySelector('#theme');
theme.hidden = false;
theme.addEventListener('click', () => {
  const light = document.documentElement.dataset.theme !== 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  theme.setAttribute('aria-pressed', String(light));
  theme.setAttribute('aria-label', `Use ${light ? 'dark' : 'light'} theme`);
});

const filters = document.querySelector('#filters');
const projects = [...document.querySelectorAll('[data-category]')];
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
