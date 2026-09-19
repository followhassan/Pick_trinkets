document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
  }

  document.querySelectorAll('.add-form').forEach((form) => {
    const input = form.querySelector('input[name="qty"]');
    if (!input) return;
    form.querySelectorAll('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = Number(btn.getAttribute('data-step') || 0);
        const min = Number(input.min || 1);
        const max = Number(input.max || 99);
        const next = Math.min(max, Math.max(min, Number(input.value || 1) + step));
        input.value = String(next);
      });
    });
  });
});
