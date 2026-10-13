// The page's two behaviours: copy the install lines, filter the catalogue.
document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).innerText.trim());
    b.textContent = 'Copied';
    setTimeout(() => (b.textContent = 'Copy'), 1600);
  } catch {}
}));
const input = document.querySelector('.search input');
if (input) input.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll('.list li').forEach((li) => { const on = !q || li.dataset.search.includes(q); li.hidden = !on; shown += on; });
  document.querySelectorAll('.group').forEach((g) => (g.hidden = ![...g.querySelectorAll('li')].some((li) => !li.hidden)));
  document.querySelector('.none').hidden = shown > 0;
});
