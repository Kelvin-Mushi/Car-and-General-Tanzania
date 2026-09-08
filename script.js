
/**
 * Universal Function to route views, handle standalone stage-1 links,
 * and keep active sidebar states synchronized without collision.
 */
function renderRoute(targetId) {
  if (!targetId) return;

  const allPageSections = document.querySelectorAll('.page-section');
  const allProductDisplays = document.querySelectorAll('.product-display');
  const mainSections = document.getElementById('all');
  const allProductsHomePages = document.querySelectorAll('.products-home');
  const allSidebarLinks = document.querySelectorAll('.stage-1, .sub-link');
  const allStage2Menus = document.querySelectorAll('.stage-2');

  // Case A: Homepage Landing View
  if (targetId === 'all' || targetId === 'home-section') {
    allPageSections.forEach(sec => sec.classList.add('hidden'));
    allProductDisplays.forEach(display => display.classList.remove('active'));
    allSidebarLinks.forEach(link => link.classList.remove('active'));
    allStage2Menus.forEach(menu => menu.classList.remove('active'));
    if (mainSections) mainSections.style.display = 'block';
    window.scrollTo(0, 0);
    return;
  }

  if (mainSections) mainSections.style.display = 'none';

  // Case B: Opening a Main Section (e.g., cummins-section)
  const targetSection = document.getElementById(targetId);
  if (targetSection && targetSection.classList.contains('page-section')) {
    allPageSections.forEach(sec => sec.classList.add('hidden'));
    targetSection.classList.remove('hidden');

    // Hide all individual product displays & reveal intro section
    allProductDisplays.forEach(display => display.classList.remove('active'));
    allProductsHomePages.forEach(home => home.classList.remove('hidden'));

    allStage2Menus.forEach(menu => menu.classList.remove('active'));
    allSidebarLinks.forEach(link => link.classList.remove('active'));

    window.scrollTo(0, 0);
    return;
  }

  // Case C: Opening a Specific Product Display (e.g., power-gen, engines)
  const targetDisplay = document.getElementById(targetId);
  if (targetDisplay && targetDisplay.classList.contains('product-display')) {
    // 1. Force the page section containing this display to be visible
    const parentSection = targetDisplay.closest('.page-section');
    if (parentSection) {
      allPageSections.forEach(sec => sec.classList.add('hidden'));
      parentSection.classList.remove('hidden');
    }

    // 2. Hide ALL category intro homes
    allProductsHomePages.forEach(home => home.classList.add('hidden'));

    // 3. Hide all other product displays and activate target
    allProductDisplays.forEach(display => display.classList.remove('active'));
    targetDisplay.classList.add('active');

    // 4. Highlight active link
    allSidebarLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-route') || link.getAttribute('data-target');
      if (linkTarget === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo(0, 0);
  }
}

/**
 * Pushes view state into history and updates address bar hash
 */
function navigateTo(targetId) {
  renderRoute(targetId);
  history.pushState({ targetId }, '', `#${targetId}`);
}

/// Global Click Listener: Intercepts routing, anchors, and standalone links
document.addEventListener('click', (e) => {
  const routeLink = e.target.closest('[data-route], [data-target], a[href^="#"]');
  if (!routeLink) return;

  // 1. ACCORDION GUARD: Skip ONLY stage-1 links that actually toggle a stage-2 dropdown
  if (routeLink.classList.contains('stage-1') && !routeLink.classList.contains('no-dropdown')) {
    const parentLi = routeLink.closest('li');
    const hasDropdown = parentLi && parentLi.querySelector('.stage-2');
    if (hasDropdown) return; // Exit and let your accordion toggle logic handle it
  }

  const dataTarget = routeLink.getAttribute('data-route') || routeLink.getAttribute('data-target');
  const hrefTarget = routeLink.getAttribute('href');

  // 2. CASE A: Standard Anchor Scrolling (e.g., href="#about-us")
  if (!dataTarget && hrefTarget && hrefTarget.startsWith('#')) {
    const targetId = hrefTarget.replace('#', '');
    if (targetId && targetId !== '') {
      e.preventDefault();

      const mainSections = document.getElementById('all');
      if (mainSections) mainSections.style.display = 'block';

      const allPageSections = document.querySelectorAll('.page-section');
      allPageSections.forEach(sec => sec.classList.add('hidden'));

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        history.pushState({ targetId }, '', `#${targetId}`);
      }
    }
    return;
  }

  // 3. CASE B: Single-Page Application Router
  if (dataTarget) {
    e.preventDefault();
    navigateTo(dataTarget);
  }
});

// Browser Back & Forward Event Listener
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.targetId) {
    renderRoute(e.state.targetId);
  } else if (window.location.hash) {
    const hashTarget = window.location.hash.replace('#', '');
    renderRoute(hashTarget);
  } else {
    // Default fallback to home view on initial back
    renderRoute('all');
  }
});


// ==========================================================================
// 2. SIDEBAR DROPDOWNS & UI TOGGLES
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Restore initial section on direct URL load or refresh
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    renderRoute(initialHash);
  }

  const stage1Links = document.querySelectorAll('.stage-1');
  const stage2Menus = document.querySelectorAll('.stage-2');
  const stage2Links = document.querySelectorAll('.sub-link');
  const productDisplay = document.querySelectorAll('.product-display');
  const productsHomePage = document.getElementById('products-home');

  // Accordion Dropdowns for Sidebar (ONLY for links with dropdowns)
  stage1Links.forEach(link => {
    link.addEventListener('click', function(e) {
      // If it's a standalone link with no dropdown, skip this listener completely!
      if (this.classList.contains('no-dropdown')) return;

      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const targetMenu = document.getElementById(targetId);

      if (targetMenu) {
        const isAlreadyOpen = targetMenu.classList.contains('active');
        stage2Menus.forEach(menu => menu.classList.remove('active'));
        if (!isAlreadyOpen) {
          targetMenu.classList.add('active');
        }
      }

      stage1Links.forEach(item => item.classList.remove('active'));
      this.classList.add('active');

      stage2Links.forEach(item => item.classList.remove('active'));
      productDisplay.forEach(display => display.classList.remove('active'));

      if (productsHomePage) productsHomePage.classList.remove('hidden');
      window.scrollTo(0, 0);
    });
  });

  // Slider Logic
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);

  // Dealer Card Highlight
  const dealerCards = document.querySelectorAll('.dealer-card');
  dealerCards.forEach(card => {
    card.addEventListener('click', () => {
      dealerCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Footer Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});


// ==========================================================================
// 3. MODALS (PRIVACY POLICY & TERMS)
// ==========================================================================

const privacyLink = document.getElementById('privacy-link');
const privacyModal = document.getElementById('privacy-modal');
const closeModal = document.getElementById('close-modal');

if (privacyLink && privacyModal) {
  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'flex';
  });
}

if (closeModal && privacyModal) {
  closeModal.addEventListener('click', () => {
    privacyModal.style.display = 'none';
  });
}

const termsLink = document.getElementById('terms-link');
const termsModal = document.getElementById('terms-modal');
const closeModal2 = document.getElementById('close-modal2');

if (termsLink && termsModal) {
  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'flex';
  });
}

if (closeModal2 && termsModal) {
  closeModal2.addEventListener('click', () => {
    termsModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (privacyModal && e.target === privacyModal) privacyModal.style.display = 'none';
  if (termsModal && e.target === termsModal) termsModal.style.display = 'none';
});