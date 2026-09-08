
function renderRoute(targetId) {
  if (!targetId) return;

  const allPageSections = document.querySelectorAll('.page-section');
  const allProductDisplays = document.querySelectorAll('.product-display');
  const mainSections = document.getElementById('all');
  const productsHomePage = document.getElementById('products-home');
  const subLinks = document.querySelectorAll('.sub-link');

  // 1. Synchronize sub-link active highlights
  subLinks.forEach(link => {
    const linkTarget = link.getAttribute('data-route') || link.getAttribute('data-target');
    if (linkTarget === targetId) {
      link.classList.add('active');

      // Expand parent sidebar dropdown if closed
      const parentMenu = link.closest('.stage-2');
      if (parentMenu) {
        document.querySelectorAll('.stage-2').forEach(menu => menu.classList.remove('active'));
        parentMenu.classList.add('active');
      }
    } else {
      link.classList.remove('active');
    }
  });

  // Case A: Returning to Main Landing View (Homepage)
  if (targetId === 'all' || targetId === 'home-section') {
    allPageSections.forEach(sec => sec.classList.add('hidden'));
    allProductDisplays.forEach(display => display.classList.remove('active'));
    if (mainSections) mainSections.style.display = 'block';
    window.scrollTo(0, 0);
    return;
  }

  // Hide the global landing view
  if (mainSections) mainSections.style.display = 'none';

  // Case B: Opening a top-level Page Section (e.g., Kirloscar main category page)
  const targetSection = document.getElementById(targetId);
  if (targetSection && targetSection.classList.contains('page-section')) {
    // 1. Hide all other page sections
    allPageSections.forEach(sec => sec.classList.add('hidden'));
    targetSection.classList.remove('hidden');

    // 2. RESET PRODUCT DETAILS: Clear old product display states and show products-home
    allProductDisplays.forEach(display => display.classList.remove('active'));
    if (productsHomePage) {
      productsHomePage.classList.remove('hidden');
    }

    window.scrollTo(0, 0);
    return;
  }

  // Case C: Opening a specific Product Detail view (clicked from sidebar sub-links)
  const targetDisplay = document.getElementById(targetId);
  if (targetDisplay && targetDisplay.classList.contains('product-display')) {
    // Hide the category introduction container
    if (productsHomePage) productsHomePage.classList.add('hidden');

    // Hide previous product detail displays and reveal only the requested one
    allProductDisplays.forEach(display => display.classList.remove('active'));
    targetDisplay.classList.add('active');

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

// Global Click Listener: Handles routing & anchor scrolling seamlessly
document.addEventListener('click', (e) => {
  const routeLink = e.target.closest('[data-route], [data-target], a[href^="#"]');
  
  if (!routeLink) return;

  // 1. Skip stage-1 accordion headers so sidebar dropdowns open/close normally
  if (routeLink.classList.contains('stage-1')) return;

  // 2. Read target from attributes or href anchor
  const dataTarget = routeLink.getAttribute('data-route') || routeLink.getAttribute('data-target');
  const hrefTarget = routeLink.getAttribute('href');

  // CASE A: Standard Anchor Link (e.g., href="#about-us")
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

  // CASE B: Router Link (data-route or data-target)
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

  // Accordion Dropdowns for Sidebar
  stage1Links.forEach(link => {
    link.addEventListener('click', function(e) {
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