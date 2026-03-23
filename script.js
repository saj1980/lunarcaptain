/* ============================================================
   LigaCaptain — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Lucide Icons
  // ============================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ============================================================
  // 1b. Onboarding form — AJAX submit via Formspree
  // ============================================================
  const form = document.getElementById('onboarding-form');
  const formSuccess = document.getElementById('form-success');
  const successEmail = document.getElementById('success-email');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const email = data.get('email');

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.classList.add('hidden');
          if (successEmail) successEmail.textContent = email;
          formSuccess.classList.remove('hidden');
        } else {
          alert('Noget gik galt — prøv igen eller send en mail til kontakt@lunarcaptain.dk');
        }
      } catch {
        alert('Netværksfejl — prøv igen eller send en mail til kontakt@lunarcaptain.dk');
      }
    });
  }

  // ============================================================
  // 1c. Announcement bar close
  // ============================================================
  const announcementBar = document.getElementById('announcement-bar');
  const closeBtn = document.getElementById('close-announcement');

  if (closeBtn && announcementBar) {
    closeBtn.addEventListener('click', () => {
      announcementBar.style.maxHeight = announcementBar.offsetHeight + 'px';
      requestAnimationFrame(() => {
        announcementBar.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        announcementBar.style.maxHeight = '0';
        announcementBar.style.opacity = '0';
        announcementBar.style.overflow = 'hidden';
        navbar.style.setProperty('top', '0px', 'important');
      });
      setTimeout(() => announcementBar.remove(), 320);
    });
  }

  // ============================================================
  // 2. Nav scroll behaviour (glassmorphism + announcement offset)
  // ============================================================
  const navbar = document.getElementById('navbar');

  function getAnnouncementHeight() {
    const bar = document.getElementById('announcement-bar');
    return bar ? bar.offsetHeight : 0;
  }

  function updateNavTop() {
    navbar.style.top = getAnnouncementHeight() + 'px';
  }

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  }

  updateNavTop();
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  window.addEventListener('resize', updateNavTop);
  handleNavScroll();

  // ============================================================
  // 3. Mobile menu toggle
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function openMenu() {
    mobileDrawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Swap icon to X
    hamburger.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function closeMenu() {
    mobileDrawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Swap icon back to menu
    hamburger.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  hamburger.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when clicking any link inside drawer
  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // ============================================================
  // 4. Scroll Reveal (IntersectionObserver)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
          setTimeout(() => {
            el.classList.add('visible');
          }, delay);
          revealObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -32px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================================
  // 5. Counter animation for stats
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const frameDuration = 16;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Ease out cubic: starts fast, slows down
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current = target * progress;

      if (isDecimal) {
        // target is stored as integer * 10 (e.g. 48 = 4.8)
        el.textContent = (current / 10).toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString('da-DK') + suffix;
      }

      if (frame >= totalFrames) {
        clearInterval(timer);
        if (isDecimal) {
          el.textContent = (target / 10).toFixed(1) + suffix;
        } else {
          el.textContent = target.toLocaleString('da-DK') + suffix;
        }
      }
    }, frameDuration);
  }

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(el => statsObserver.observe(el));
  }

  // ============================================================
  // 6. Active nav link tracking
  // ============================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.5
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // ============================================================
  // 7. Testimonial touch carousel (mobile only)
  // ============================================================
  const container = document.getElementById('testimonial-container');

  if (container) {
    let touchStartX = 0;
    let touchEndX = 0;
    let currentIndex = 0;
    let cards = [];
    let isCarouselMode = false;

    function setupCarousel() {
      const isMobile = window.innerWidth < 768;

      if (isMobile && !isCarouselMode) {
        // Enter carousel mode
        cards = Array.from(container.querySelectorAll('.testimonial-card'));
        container.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6');
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.minHeight = '260px';
        cards.forEach((card, i) => {
          card.style.position = 'absolute';
          card.style.width = '100%';
          card.style.top = '0';
          card.style.left = '0';
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = i === 0 ? '1' : '0';
          card.style.transform = i === 0 ? 'translateX(0)' : 'translateX(100%)';
          card.style.pointerEvents = i === 0 ? 'auto' : 'none';
        });
        isCarouselMode = true;
      } else if (!isMobile && isCarouselMode) {
        // Exit carousel mode
        cards.forEach(card => {
          card.style.position = '';
          card.style.width = '';
          card.style.top = '';
          card.style.left = '';
          card.style.transition = '';
          card.style.opacity = '';
          card.style.transform = '';
          card.style.pointerEvents = '';
        });
        container.style.overflow = '';
        container.style.position = '';
        container.style.minHeight = '';
        container.classList.add('grid', 'md:grid-cols-3', 'gap-6');
        isCarouselMode = false;
      }
    }

    function goToSlide(index) {
      if (!isCarouselMode || cards.length === 0) return;
      const prev = currentIndex;
      currentIndex = (index + cards.length) % cards.length;

      cards.forEach((card, i) => {
        if (i === currentIndex) {
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
          card.style.pointerEvents = 'auto';
        } else if (i === prev) {
          card.style.opacity = '0';
          card.style.transform = currentIndex > prev ? 'translateX(-100%)' : 'translateX(100%)';
          card.style.pointerEvents = 'none';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateX(100%)';
          card.style.pointerEvents = 'none';
        }
      });
    }

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });

    setupCarousel();
    window.addEventListener('resize', setupCarousel);
  }

  // ============================================================
  // 8. Hold / Klub — searchable combobox
  // ============================================================
  const holdSearch   = document.getElementById('hold-search');
  const holdHidden   = document.getElementById('hold');
  const holdListbox  = document.getElementById('hold-listbox');
  const holdClear    = document.getElementById('hold-clear');
  const holdCombobox = document.getElementById('hold-combobox');

  if (holdSearch && holdListbox && holdHidden) {

    let activeIndex = -1;

    const escHtml = (s) =>
      s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    const highlight = (text, query) => {
      if (!query) return escHtml(text);
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return escHtml(text);
      return escHtml(text.slice(0, idx))
        + '<span class="hold-match">' + escHtml(text.slice(idx, idx + query.length)) + '</span>'
        + escHtml(text.slice(idx + query.length));
    };

    const renderList = (query) => {
      const q = query.trim();
      const ql = q.toLowerCase();
      const matches = q
        ? DPF_TEAMS.filter(t => t.name.toLowerCase().includes(ql)).slice(0, 80)
        : DPF_TEAMS.slice(0, 80);

      holdListbox.innerHTML = '';
      activeIndex = -1;

      if (matches.length === 0) {
        const li = document.createElement('li');
        li.className = 'hold-no-results';
        li.textContent = 'Ingen hold fundet — skriv dit holdnavn manuelt';
        holdListbox.appendChild(li);
      } else {
        matches.forEach((team) => {
          const li = document.createElement('li');
          li.setAttribute('role', 'option');
          li.setAttribute('data-value', team.name);
          const meta = [team.region, team.div].filter(Boolean).join(' · ');
          li.innerHTML =
            '<span class="hold-item-name">' + highlight(team.name, q) + '</span>' +
            (meta ? '<span class="hold-item-meta">' + escHtml(meta) + '</span>' : '');
          li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectTeam(team.name);
          });
          holdListbox.appendChild(li);
        });
      }
    };

    const openDropdown = () => {
      renderList(holdSearch.value);
      holdListbox.classList.remove('hidden');
      holdSearch.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = () => {
      holdListbox.classList.add('hidden');
      holdSearch.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    };

    const selectTeam = (team) => {
      holdHidden.value = team;
      holdSearch.value = team;
      if (holdClear) holdClear.classList.remove('hidden');
      closeDropdown();
    };

    const clearSelection = () => {
      holdHidden.value = '';
      holdSearch.value = '';
      if (holdClear) holdClear.classList.add('hidden');
      holdSearch.focus();
      openDropdown();
    };

    const updateActiveItem = (delta) => {
      const items = holdListbox.querySelectorAll('li:not(.hold-no-results)');
      if (items.length === 0) return;
      if (items[activeIndex]) items[activeIndex].classList.remove('active');
      activeIndex = Math.max(0, Math.min(items.length - 1, activeIndex + delta));
      const active = items[activeIndex];
      active.classList.add('active');
      active.scrollIntoView({ block: 'nearest' });
    };

    holdSearch.addEventListener('focus', () => {
      openDropdown();
    });

    holdSearch.addEventListener('input', () => {
      holdHidden.value = '';
      holdClear.classList.add('hidden');
      openDropdown();
    });

    holdSearch.addEventListener('keydown', (e) => {
      if (!holdListbox.classList.contains('hidden')) {
        if (e.key === 'ArrowDown') { e.preventDefault(); updateActiveItem(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); updateActiveItem(-1); }
        else if (e.key === 'Enter') {
          e.preventDefault();
          const active = holdListbox.querySelector('li.active');
          if (active && active.dataset.value) selectTeam(active.dataset.value);
        }
        else if (e.key === 'Escape') { closeDropdown(); }
      }
    });

    holdSearch.addEventListener('blur', () => {
      // slight delay to allow mousedown on list item to fire first
      setTimeout(() => {
        closeDropdown();
        // if nothing selected but text typed, allow free text entry
        if (holdSearch.value && !holdHidden.value) {
          holdHidden.value = holdSearch.value;
          holdClear.classList.remove('hidden');
        }
      }, 180);
    });

    if (holdClear) {
      holdClear.addEventListener('click', clearSelection);
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!holdCombobox.contains(e.target)) {
        closeDropdown();
      }
    });
  }

});
