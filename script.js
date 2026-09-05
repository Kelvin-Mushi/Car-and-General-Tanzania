let slideIntervalTimer = null;

const allNavLinks = document.querySelectorAll('.nav-links a[data-target]');

allNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    const isMainLink = link.getAttribute('data-type') === 'all';

    if (isMainLink) {
      // 1. Hide all individual product sections
      productSections.forEach(section => section.classList.add('hidden'));

      // 2. Show main landing view
      mainSections.style.display = 'block';

      // 3. Scroll handling
      if (targetId && targetId !== 'home-section') {
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }

    } else {
      // 1. Hide the main landing view
      mainSections.style.display = 'none';

      // 2. Hide ALL product sections first
      productSections.forEach(section => section.classList.add('hidden'));

      // 3. Show ONLY the requested product section
      const activeProduct = document.getElementById(targetId);
      if (activeProduct) {
        activeProduct.classList.remove('hidden'); // Preserves display: flex from CSS
        window.scrollTo(0, 0);
      }
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
    // Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto Advance Slider every 5 Seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Dealer Card Selection Highlight
    const dealerCards = document.querySelectorAll('.dealer-card');
    dealerCards.forEach(card => {
        card.addEventListener('click', () => {
            dealerCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
});

//PRODUCTS SECTION LOGIC
const navLinks = document.querySelectorAll('.nav-btn');
const productSections = document.querySelectorAll('.page-section');
const mainSections = document.getElementById('all');

navLinks.forEach(link => {
  link.addEventListener('click', function(e){
    e.preventDefault();
    const targetId = this.getAttribute('data-target');

    mainSections.style.display = 'none';
    document.getElementById(targetId).classList.remove('hidden');

    //deactivating stage 1 links and it's sublinks
    stage1Links.forEach(item => item.classList.remove('active'));
    stage2Links.forEach(item => item.classList.remove('active'));
    stage2Menus.forEach(menu => menu.classList.remove('active'));
    productDisplay.forEach(display => display.classList.remove('active'));
  });
});

//PRODUCTS SIDEBAR LOGIC
const stage1Links = document.querySelectorAll('.stage-1');
const stage2Menus = document.querySelectorAll('.stage-2');

stage1Links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const targetMenu = document.getElementById(targetId);

        if (targetMenu) {
            // Check if the clicked menu is already open
            const isAlreadyOpen = targetMenu.classList.contains('active');

            // 1. Close all dropdowns
            stage2Menus.forEach(menu => menu.classList.remove('active'));

            // 2. Open the clicked dropdown only if it wasn't already open (toggle behavior)
            if (!isAlreadyOpen) {
                targetMenu.classList.add('active');
            }
        }

        window.scroll(0,0);
    });
});

//active button logic for stage 1 btn
const sidebarLinks = document.querySelectorAll('.stage-1');

stage1Links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    stage1Links.forEach(item => item.classList.remove('active'));
    link.classList.add('active');

    //deactivating my stage 2 links and their displays when a different stage 1 btn is clicked
    stage2Links.forEach(item => item.classList.remove('active'));
    productDisplay.forEach(display => display.classList.remove('active'));
  });
});


const productDisplay = document.querySelectorAll('.product-display');
const stage2Links = document.querySelectorAll('.sub-link');

//stage 2 links click logic
stage2Links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    stage2Links.forEach(item => item.classList.remove('active'));
    this.classList.add('active');

    // ALWAYS hide all product displays first
    productDisplay.forEach(display => display.classList.remove('active'));

    // Get target ID and show corresponding display (if it exists)
    const targetId = this.getAttribute('data-target');
    
    if (targetId) {
      const targetDisplay = document.getElementById(targetId);
      if (targetDisplay) {
        targetDisplay.classList.add('active');
      }
    }
  });
});

// Update Current Year in Footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

//Privacy Policy Page
const privacyLink = document.getElementById('privacy-link');
const privacyModal = document.getElementById('privacy-modal');
const closeModal = document.getElementById('close-modal');

// Open modal on click
privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'flex';
});

// Close modal on 'X' click
closeModal.addEventListener('click', () => {
    privacyModal.style.display = 'none';
});

// Close modal when clicking anywhere outside the card
window.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        privacyModal.style.display = 'none';
    }
});

//Terms and Conditions Page
const termsLink = document.getElementById('terms-link');
const termsModal = document.getElementById('terms-modal');
const closeModal2 = document.getElementById('close-modal2');

// Open modal on click
termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'flex';
});

// Close modal on 'X' click
closeModal2.addEventListener('click', () => {
    termsModal.style.display = 'none';
});

// Close modal when clicking anywhere outside the card
window.addEventListener('click', (e) => {
    if (e.target === termsModal) {
        termsModal.style.display = 'none';
    }
});