(() => {
  let visibleAside = null;
  let activeTrigger = null;
  let openedAtScrollY = 0;

  function closeAside(restoreFocus = false) {
    if (!visibleAside) return;

    visibleAside.classList.add('no-opac');
    visibleAside.setAttribute('aria-hidden', 'true');
    visibleAside.inert = true;
    activeTrigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) activeTrigger.focus();
    visibleAside = null;
    activeTrigger = null;
  }

  // Match data-aside on each project link to its aside's id.
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('#development [data-aside], #projects [data-aside]');

    if (trigger) {
      const aside = document.getElementById(trigger.dataset.aside);
      if (!aside || aside.closest('section') !== trigger.closest('section')) return;

      event.preventDefault();
      closeAside();
      visibleAside = aside;
      activeTrigger = trigger;
      openedAtScrollY = window.scrollY;
      aside.classList.remove('no-opac');
      aside.setAttribute('aria-hidden', 'false');
      aside.inert = false;
      trigger.setAttribute('aria-expanded', 'true');
      aside.querySelector('.aside-close').focus({ preventScroll: true });
      return;
    }

    if (!visibleAside) return;
    if (event.target.closest('.aside-close') && visibleAside.contains(event.target)) {
      closeAside(true);
    } else if (!visibleAside.contains(event.target)) {
      closeAside();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAside(true);
  });

  window.addEventListener('scroll', () => {
    if (visibleAside && Math.abs(window.scrollY - openedAtScrollY) > 100) {
      closeAside();
    }
  }, { passive: true });
})();
