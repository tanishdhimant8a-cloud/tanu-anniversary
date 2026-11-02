/**
 * Tanuu — A Year of Us
 * Main Application Logic & Romantic Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Navigation Scroll Spy & Smooth Scrolling
     ========================================================================== */
  const sections = [
    { id: 'prologue', path: 'prologue' },
    { id: 'the-journey', path: 'the-journey' },
    { id: 'gallery', path: 'gallery' },
    { id: 'our-song', path: 'our-song' },
    { id: 'love-letter', path: 'love-letter' },
    { id: 'voice-note', path: 'voice-note' },
    { id: 'anniversary-reel', path: 'anniversary-reel' },
    { id: 'promises', path: 'promises' },
    { id: 'forever', path: 'forever' }
  ];

  const desktopNavLinks = document.querySelectorAll('header nav a[data-path]');
  const mobileNavLinks = document.querySelectorAll('#mobile-drawer a[data-path]');

  const activeClasses = [
    'bg-primary-container',
    'text-on-primary-container',
    'font-label-md',
    'text-label-md',
    'rounded-full',
    'px-space-sm',
    'py-space-xs',
    'shadow-[0_0_16px_rgba(141,38,63,0.4)]'
  ];
  const inactiveClasses = [
    'font-label-caps',
    'text-label-caps',
    'text-on-surface-variant',
    'hover:text-on-surface',
    'px-space-xs',
    'py-space-xs'
  ];

  function setActiveNavLink(path) {
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('data-path') === path) {
        link.classList.remove(...inactiveClasses);
        link.classList.add(...activeClasses);
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove(...activeClasses);
        link.classList.add(...inactiveClasses);
        link.removeAttribute('aria-current');
      }
    });

    mobileNavLinks.forEach(link => {
      if (link.getAttribute('data-path') === path) {
        link.classList.add('bg-primary-container', 'text-on-primary-container');
        link.classList.remove('text-on-surface-variant');
      } else {
        link.classList.remove('bg-primary-container', 'text-on-primary-container');
        link.classList.add('text-on-surface-variant');
      }
    });
  }

  // Observe Sections for Viewport Scroll Spy
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNavLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });

  // Smooth scroll with offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if open
        closeMobileDrawer();
      }
    });
  });

  /* ==========================================================================
     2. Mobile Drawer Navigation
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('pointer-events-none', 'opacity-0');
    const panel = mobileDrawer.querySelector('.drawer-panel');
    if (panel) {
      panel.classList.remove('translate-x-full');
    }
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    const panel = mobileDrawer.querySelector('.drawer-panel');
    if (panel) {
      panel.classList.add('translate-x-full');
    }
    setTimeout(() => {
      mobileDrawer.classList.add('pointer-events-none', 'opacity-0');
    }, 300);
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeMobileDrawer();
    });
  }

  /* ==========================================================================
     3. Interactive Memory Modal
     ========================================================================== */
  const modal = document.getElementById('memoryModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalTag = document.getElementById('modalTag');
  const modalDesc = document.getElementById('modalDesc');
  const cherishBtn = document.getElementById('modalCherishBtn');
  const triggers = document.querySelectorAll('.gallery-trigger');

  let cherishedCount = 142;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      const title = trigger.getAttribute('data-title') || 'Archived Frame';
      const date = trigger.getAttribute('data-date') || '04.11.2026';
      const tag = trigger.getAttribute('data-tag') || 'Memory Archive';
      const desc = trigger.getAttribute('data-desc') || 'A timeless moment captured forever.';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDate) modalDate.textContent = date;
      if (modalTag) modalTag.textContent = tag;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || title;
      }

      openModal();
    });
  });

  function openModal() {
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    const inner = modal.firstElementChild;
    if (inner) {
      inner.classList.remove('scale-95');
      inner.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    const inner = modal.firstElementChild;
    if (inner) {
      inner.classList.remove('scale-100');
      inner.classList.add('scale-95');
    }
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Cherish Button Sparkle Burst
  if (cherishBtn) {
    cherishBtn.addEventListener('click', function () {
      cherishedCount++;
      this.innerHTML = `
        <span class="material-symbols-outlined text-sm align-middle mr-1" style="font-variation-settings: 'FILL' 1;">favorite</span>
        Cherished (${cherishedCount})
      `;
      this.classList.add('shadow-[0_0_20px_rgba(255,178,188,0.8)]');

      // Trigger floating mini hearts near button
      const rect = cherishBtn.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        spawnFloatingEmoji('❤️', rect.left + rect.width / 2, rect.top);
      }
    });
  }

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeFullArchiveModal();
      closeKeepsakeModal();
      closeMobileDrawer();
    }
  });

  /* ==========================================================================
     4. Gallery Filter Tabs
     ========================================================================== */
  const filterButtons = document.querySelectorAll('#gallery [data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-trigger');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button styles
      filterButtons.forEach(b => {
        b.className = 'px-space-md py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-widest transition-colors';
      });
      btn.className = 'px-space-md py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest shadow-[0_0_15px_rgba(141,38,63,0.4)]';

      // Filter gallery items
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || 'all';
        if (filter === 'all' || itemCategory.includes(filter)) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     5. Unlock Full Archive Modal
     ========================================================================== */
  const unlockBtn = document.getElementById('unlock-archive-btn');
  const archiveModal = document.getElementById('fullArchiveModal');
  const closeArchiveBtn = document.getElementById('closeArchiveModalBtn');

  function openFullArchiveModal() {
    if (!archiveModal) return;
    archiveModal.classList.remove('opacity-0', 'pointer-events-none');
    archiveModal.firstElementChild.classList.remove('scale-95');
    archiveModal.firstElementChild.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }

  function closeFullArchiveModal() {
    if (!archiveModal) return;
    archiveModal.classList.add('opacity-0', 'pointer-events-none');
    archiveModal.firstElementChild.classList.remove('scale-100');
    archiveModal.firstElementChild.classList.add('scale-95');
    document.body.style.overflow = '';
  }

  if (unlockBtn) unlockBtn.addEventListener('click', openFullArchiveModal);
  if (closeArchiveBtn) closeArchiveBtn.addEventListener('click', closeFullArchiveModal);
  if (archiveModal) {
    archiveModal.addEventListener('click', (e) => {
      if (e.target === archiveModal) closeFullArchiveModal();
    });
  }

  /* ==========================================================================
     6. 12 Little Things Interactive Cards
     ========================================================================== */
  const littleThingsCards = document.querySelectorAll('#little-things .group');
  littleThingsCards.forEach(card => {
    card.addEventListener('click', function () {
      this.classList.toggle('active-card');
      const arrow = this.querySelector('.material-symbols-outlined.text-xs');
      if (arrow) {
        if (this.classList.contains('active-card')) {
          arrow.textContent = 'favorite';
          arrow.style.fontVariationSettings = "'FILL' 1";
        } else {
          arrow.textContent = 'arrow_forward';
          arrow.style.fontVariationSettings = "'FILL' 0";
        }
      }
    });
  });

  /* ==========================================================================
     7. Floating Confetti / Celebration Particles Burst
     ========================================================================== */
  function spawnFloatingEmoji(emoji, x, y) {
    const span = document.createElement('span');
    span.innerText = emoji;
    span.className = 'fixed pointer-events-none z-50 text-2xl transition-all duration-1000';
    span.style.left = `${x + (Math.random() * 60 - 30)}px`;
    span.style.top = `${y + (Math.random() * 40 - 20)}px`;
    span.style.opacity = '1';
    span.style.transform = 'translateY(0px) scale(0.8)';
    document.body.appendChild(span);

    requestAnimationFrame(() => {
      span.style.transform = `translateY(-${80 + Math.random() * 120}px) scale(${1.2 + Math.random() * 0.4})`;
      span.style.opacity = '0';
    });

    setTimeout(() => {
      span.remove();
    }, 1100);
  }

  window.celebrateLove = function () {
    const heartEmojis = ['❤️', '✨', '🌹', '🥂', '💫', '💖', '💍'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 36; i++) {
      setTimeout(() => {
        const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        const posX = centerX + (Math.random() * 500 - 250);
        const posY = centerY + (Math.random() * 300 - 150);
        spawnFloatingEmoji(emoji, posX, posY);
      }, i * 35);
    }
  };

  /* ==========================================================================
     8. Keepsake Memory Book Modal & Printable Certificate
     ========================================================================== */
  const keepsakeBtn = document.getElementById('download-keepsake-btn');
  const keepsakeModal = document.getElementById('keepsakeModal');
  const closeKeepsakeBtn = document.getElementById('closeKeepsakeBtn');
  const printKeepsakeBtn = document.getElementById('printKeepsakeBtn');

  function openKeepsakeModal() {
    if (!keepsakeModal) return;
    keepsakeModal.classList.remove('opacity-0', 'pointer-events-none');
    keepsakeModal.firstElementChild.classList.remove('scale-95');
    keepsakeModal.firstElementChild.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }

  function closeKeepsakeModal() {
    if (!keepsakeModal) return;
    keepsakeModal.classList.add('opacity-0', 'pointer-events-none');
    keepsakeModal.firstElementChild.classList.remove('scale-100');
    keepsakeModal.firstElementChild.classList.add('scale-95');
    document.body.style.overflow = '';
  }

  if (keepsakeBtn) keepsakeBtn.addEventListener('click', openKeepsakeModal);
  if (closeKeepsakeBtn) closeKeepsakeBtn.addEventListener('click', closeKeepsakeModal);
  if (keepsakeModal) {
    keepsakeModal.addEventListener('click', (e) => {
      if (e.target === keepsakeModal) closeKeepsakeModal();
    });
  }
  if (printKeepsakeBtn) {
    printKeepsakeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     9. Live Anniversary Elapsed Counter (365 Days & Beyond)
     ========================================================================== */
  const anniversaryDate = new Date('2025-11-04T00:00:00'); // Anniversary Day 1

  function updateLiveCounter() {
    const now = new Date();
    const diff = Math.max(0, now - anniversaryDate);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const daysEl = document.getElementById('live-days');
    const hoursEl = document.getElementById('live-hours');
    const minsEl = document.getElementById('live-mins');
    const secsEl = document.getElementById('live-secs');

    if (daysEl) daysEl.textContent = days.toLocaleString();
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minsEl) minsEl.textContent = minutes.toString().padStart(2, '0');
    if (secsEl) secsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateLiveCounter();
  setInterval(updateLiveCounter, 1000);

  /* ==========================================================================
     10. Ambient Canvas: Floating Rose Petals & Golden Embers
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1.5,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.2,
        isPetal: Math.random() > 0.4,
        color: Math.random() > 0.5 ? 'rgba(255, 178, 188,' : 'rgba(232, 207, 181,'
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isPetal) {
          // Delicate rose petal curve
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.radius * 2, -p.radius, p.radius * 3, p.radius, 0, p.radius * 3);
          ctx.bezierCurveTo(-p.radius * 3, p.radius, -p.radius * 2, -p.radius, 0, 0);
          ctx.fillStyle = `${p.color} ${p.opacity * 0.7})`;
          ctx.fill();
        } else {
          // Soft glowing golden ember
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} ${p.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 178, 188, 0.4)';
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }
});
