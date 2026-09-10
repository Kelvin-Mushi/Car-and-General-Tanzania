
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


// Array of background image for products page URLs
const backgroundImages = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80'
];

let currentImageIndex = 0;
const targetOpacity = '0.2'; // Sets your desired peak transparency

const allPageSections = document.querySelectorAll('.page-section');

// Inject dedicated background layers into each .page-section
allPageSections.forEach(section => {
  const bgLayer = document.createElement('div');
  bgLayer.className = 'page-section-bg';
  bgLayer.style.backgroundImage = `url("${backgroundImages[0]}")`;
  bgLayer.style.opacity = targetOpacity;
  section.prepend(bgLayer);
});

function rotateBackgrounds() {
  currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
  const nextImageUrl = backgroundImages[currentImageIndex];

  document.querySelectorAll('.page-section-bg').forEach(bg => {
    // Subtle dip towards 0.08 reveals slightly more of the base background during transition
    bg.style.opacity = '0.1'; 
    
    setTimeout(() => {
      bg.style.backgroundImage = `url("${nextImageUrl}")`;
      // Return back to target transparency
      bg.style.opacity = targetOpacity; 
    }, 750);
  });
}

// Rotate images every 6 seconds
setInterval(rotateBackgrounds, 5000);


/*TVS PRODUCT SECTION===============================================================================
==================================================================================================*/
document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       TVS PRODUCT DATABASE
    ===================================================== */

    const tvsProducts = {

        hlx1254g: {
            name: "HLX 125 4G",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/hlx1254g/card.webp",
            hero: [
                {
                    image: "assets/tvs/hlx1254g/hero-01.webp",
                    title: "HLX 125 4G",
                    text: "Built for everyday journeys, work and adventure."
                },
                {
                    image: "assets/tvs/hlx1254g/hero-02.webp",
                    title: "Ready for every road",
                    text: "Practical performance with dependable TVS engineering."
                }
            ],
            frames: {
                path: "assets/tvs/hlx1254g/360/frame-",
                count: 20,
                extension: "webp"
            },
            features: [
                {
                    title: "USB Phone Charger",
                    category: "CONVENIENCE",
                    image: "assets/tvs/hlx1254g/features/usb.webp",
                    description: "Keep your phone powered while you're on the move."
                },
                {
                    title: "Fuel Gauge",
                    category: "CONVENIENCE",
                    image: "assets/tvs/hlx1254g/features/fuel-gauge.webp",
                    description: "Monitor your fuel level easily while riding."
                },
                {
                    title: "Comfortable Seating",
                    category: "COMFORT",
                    image: "assets/tvs/hlx1254g/features/seating.webp",
                    description: "Designed to provide a comfortable riding experience."
                },
                {
                    title: "Modern Lighting",
                    category: "LIGHTING",
                    image: "assets/tvs/hlx1254g/features/lights.webp",
                    description: "Lighting designed to provide visibility and a distinctive appearance."
                }
            ],
            colours: [
                {
                    name: "Fiery Red",
                    hex: "#c9202b",
                    image: "assets/tvs/hlx1254g/colours/red.webp"
                },
                {
                    name: "Midnight Black",
                    hex: "#151515",
                    image: "assets/tvs/hlx1254g/colours/black.webp"
                },
                {
                    name: "Royal Blue",
                    hex: "#214f96",
                    image: "assets/tvs/hlx1254g/colours/blue.webp"
                }
            ],
            specifications: [
                ["Engine Type", "Single Cylinder"],
                ["Engine Displacement", "125 cc"],
                ["Maximum Power", "8.1 kW"],
                ["Maximum Torque", "10.8 Nm"],
                ["Fuel Capacity", "12 Litres"],
                ["Transmission", "5 Speed"],
                ["Front Brake", "Disc"],
                ["Rear Brake", "Drum"]
            ],
            spares: [
                {
                    name: "Oil Filter",
                    category: "ENGINE",
                    image: "assets/tvs/hlx1254g/spares/oil-filter.webp",
                    description: "Genuine replacement oil filter."
                },
                {
                    name: "Air Filter",
                    category: "ENGINE",
                    image: "assets/tvs/hlx1254g/spares/air-filter.webp",
                    description: "Genuine replacement air filter."
                },
                {
                    name: "Brake Pads",
                    category: "BRAKING",
                    image: "assets/tvs/hlx1254g/spares/brake-pads.webp",
                    description: "Genuine replacement brake components."
                }
            ]
        },

        tvssport: {
            name: "TVS Sport",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/sport/card.webp",
            hero: [
                {
                    image: "assets/tvs/sport/hero-01.webp",
                    title: "TVS Sport",
                    text: "Efficient, practical and ready for everyday life."
                },
                {
                    image: "assets/tvs/sport/hero-02.webp",
                    title: "Go further",
                    text: "A motorcycle designed around everyday mobility."
                }
            ],
            frames: {
                path: "assets/tvs/sport/360/frame-",
                count: 36,
                extension: "webp"
            },
            features: [
                {
                    title: "Fuel Gauge",
                    category: "CONVENIENCE",
                    image: "assets/tvs/sport/features/fuel.webp",
                    description: "Know your fuel level at a glance."
                },
                {
                    title: "USB Charger",
                    category: "CONVENIENCE",
                    image: "assets/tvs/sport/features/usb.webp",
                    description: "Charge compatible devices while travelling."
                }
            ],
            colours: [
                {
                    name: "Black",
                    hex: "#171717",
                    image: "assets/tvs/sport/colours/black.webp"
                },
                {
                    name: "Red",
                    hex: "#d52630",
                    image: "assets/tvs/sport/colours/red.webp"
                }
            ],
            specifications: [
                ["Engine Type", "Single Cylinder"],
                ["Engine Displacement", "110 cc"],
                ["Fuel Capacity", "10 Litres"],
                ["Transmission", "4 Speed"]
            ],
            spares: [
                {
                    name: "Oil Filter",
                    category: "ENGINE",
                    image: "assets/tvs/sport/spares/oil-filter.webp",
                    description: "Genuine TVS replacement part."
                }
            ]
        },

        tvsapache: {
            name: "TVS Apache",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/apache/card.webp",
            hero: [
                {
                    image: "assets/tvs/apache/hero-01.webp",
                    title: "TVS Apache",
                    text: "Performance-inspired engineering for riders who want more."
                },
                {
                    image: "assets/tvs/apache/hero-02.webp",
                    title: "Born to perform",
                    text: "A bold motorcycle with a distinctive character."
                }
            ],
            frames: {
                path: "assets/tvs/apache/360/frame-",
                count: 36,
                extension: "webp"
            },
            features: [
                {
                    title: "LED Headlamp",
                    category: "LIGHTING",
                    image: "assets/tvs/apache/features/led.webp",
                    description: "Distinctive lighting with excellent road visibility."
                },
                {
                    title: "Digital Display",
                    category: "TECHNOLOGY",
                    image: "assets/tvs/apache/features/display.webp",
                    description: "Important riding information presented clearly."
                }
            ],
            colours: [
                {
                    name: "Red",
                    hex: "#d8202c",
                    image: "assets/tvs/apache/colours/red.webp"
                },
                {
                    name: "Black",
                    hex: "#111111",
                    image: "assets/tvs/apache/colours/black.webp"
                }
            ],
            specifications: [
                ["Engine Type", "Single Cylinder"],
                ["Engine Displacement", "160 cc"],
                ["Fuel Capacity", "12 Litres"],
                ["Transmission", "5 Speed"]
            ],
            spares: [
                {
                    name: "Air Filter",
                    category: "ENGINE",
                    image: "assets/tvs/apache/spares/air-filter.webp",
                    description: "Genuine TVS replacement air filter."
                }
            ]
        },

        tvsking: {
            name: "TVS King",
            category: "3-wheeler",
            type: "THREE WHEELER",
            cardImage: "assets/tvs/king/card.webp",
            hero: [
                {
                    image: "assets/tvs/king/hero-01.webp",
                    title: "TVS King",
                    text: "Built for business, mobility and everyday transport."
                },
                {
                    image: "assets/tvs/king/hero-02.webp",
                    title: "Move more",
                    text: "Practical three-wheeler performance for demanding journeys."
                }
            ],
            frames: {
                path: "assets/tvs/king/360/frame-",
                count: 36,
                extension: "webp"
            },
            features: [
                {
                    title: "Comfortable Seating",
                    category: "COMFORT",
                    image: "assets/tvs/king/features/seating.webp",
                    description: "Designed with everyday driver and passenger comfort in mind."
                },
                {
                    title: "Large Fuel Tank",
                    category: "EFFICIENCY",
                    image: "assets/tvs/king/features/fuel.webp",
                    description: "Designed to help you spend more time on the road."
                }
            ],
            colours: [
                {
                    name: "Blue",
                    hex: "#245291",
                    image: "assets/tvs/king/colours/blue.webp"
                },
                {
                    name: "Red",
                    hex: "#d5202c",
                    image: "assets/tvs/king/colours/red.webp"
                }
            ],
            specifications: [
                ["Engine Type", "Single Cylinder"],
                ["Engine Displacement", "199 cc"],
                ["Fuel Capacity", "16 Litres"],
                ["Transmission", "4 Speed"]
            ],
            spares: [
                {
                    name: "Air Filter",
                    category: "ENGINE",
                    image: "assets/tvs/king/spares/air-filter.webp",
                    description: "Genuine TVS replacement air filter."
                },
                {
                    name: "Oil Filter",
                    category: "ENGINE",
                    image: "assets/tvs/king/spares/oil-filter.webp",
                    description: "Genuine TVS replacement oil filter."
                }
            ]
        },

        tvskingdeluxe: {
            name: "TVS King Deluxe",
            category: "3-wheeler",
            type: "THREE WHEELER",
            cardImage: "assets/tvs/king-deluxe/card.webp",
            hero: [
                {
                    image: "assets/tvs/king-deluxe/hero-01.webp",
                    title: "TVS King Deluxe",
                    text: "Practical mobility with a premium everyday experience."
                }
            ],
            frames: {
                path: "assets/tvs/king-deluxe/360/frame-",
                count: 36,
                extension: "webp"
            },
            features: [
                {
                    title: "Passenger Comfort",
                    category: "COMFORT",
                    image: "assets/tvs/king-deluxe/features/seating.webp",
                    description: "A practical cabin designed around everyday passenger needs."
                },
                {
                    title: "Durable Design",
                    category: "DURABILITY",
                    image: "assets/tvs/king-deluxe/features/durability.webp",
                    description: "Engineered for demanding everyday commercial use."
                }
            ],
            colours: [
                {
                    name: "Blue",
                    hex: "#234f91",
                    image: "assets/tvs/king-deluxe/colours/blue.webp"
                },
                {
                    name: "White",
                    hex: "#eeeeee",
                    image: "assets/tvs/king-deluxe/colours/white.webp"
                }
            ],
            specifications: [
                ["Engine Type", "Single Cylinder"],
                ["Engine Displacement", "199 cc"],
                ["Fuel Capacity", "16 Litres"],
                ["Transmission", "4 Speed"]
            ],
            spares: [
                {
                    name: "Air Filter",
                    category: "ENGINE",
                    image: "assets/tvs/king-deluxe/spares/air-filter.webp",
                    description: "Genuine TVS replacement air filter."
                }
            ]
        }

    };

    /* =====================================================
       DEFAULT HERO
       These images are shown before a product is selected.
    ===================================================== */

    const defaultHero = [
        {
            image: "assets/tvs/hero/tvs-01.webp",
            title: "TVS",
            text: "Powerful mobility. Built for everyday journeys."
        },
        {
            image: "assets/tvs/hero/tvs-02.webp",
            title: "TVS Motorcycles",
            text: "Explore motorcycles designed for your everyday journey."
        },
        {
            image: "assets/tvs/hero/tvs-03.webp",
            title: "TVS Three-Wheelers",
            text: "Practical mobility built around your business."
        }
    ];

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const page = document.querySelector("#tvs-product-page");
    if (!page) return;

    const heroSlides = document.querySelector("#tvsHeroSlides");
    const heroDots = document.querySelector("#tvsHeroDots");
    const heroPrev = document.querySelector("#tvsHeroPrev");
    const heroNext = document.querySelector("#tvsHeroNext");
    const categoryButtons = document.querySelectorAll(".tvs-category-btn");
    const categoryProducts = document.querySelector("#tvsCategoryProducts");
    const details = document.querySelector("#tvsDetails");
    const navProduct = document.querySelector("#tvsNavProduct");
    const selectedName = document.querySelector("#tvsSelectedName");
    const quickLinks = document.querySelector("#tvsQuickLinks");

    let currentHero = 0;
    let heroTimer;
    let currentProductId = null;

    /* =====================================================
       HERO
    ===================================================== */

    function renderHero(slides) {
        heroSlides.innerHTML = "";
        heroDots.innerHTML = "";

        slides.forEach((slide, index) => {
            const article = document.createElement("article");
            article.className = `tvs-hero-slide${index === 0 ? " active" : ""}`;
            article.innerHTML = `
                <img src="${slide.image}" alt="${slide.title}">
                <div class="tvs-hero-overlay">
                    <div class="tvs-hero-content">
                        <small>TVS MOTOR</small>
                        <h2>${slide.title}</h2>
                        <p>${slide.text}</p>
                    </div>
                </div>
            `;
            heroSlides.appendChild(article);

            const dot = document.createElement("button");
            dot.className = `tvs-hero-dot${index === 0 ? " active" : ""}`;
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.addEventListener("click", () => showHero(index));
            heroDots.appendChild(dot);
        });

        currentHero = 0;
        startHeroTimer();
    }

    function showHero(index) {
        const slides = heroSlides.querySelectorAll(".tvs-hero-slide");
        const dots = heroDots.querySelectorAll(".tvs-hero-dot");
        if (!slides.length) return;

        currentHero = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => slide.classList.toggle("active", i === currentHero));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentHero));
    }

    function startHeroTimer() {
        clearInterval(heroTimer);
        heroTimer = setInterval(() => showHero(currentHero + 1), 5000);
    }

    heroPrev.addEventListener("click", () => {
        showHero(currentHero - 1);
        startHeroTimer();
    });

    heroNext.addEventListener("click", () => {
        showHero(currentHero + 1);
        startHeroTimer();
    });

    renderHero(defaultHero);

    /* =====================================================
       CATEGORY BUTTONS
    ===================================================== */

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;
            const isActive = button.classList.contains("active");

            categoryButtons.forEach(btn => btn.classList.remove("active"));

            if (isActive) {
                categoryProducts.classList.remove("open");
                categoryProducts.innerHTML = "";
                return;
            }

            button.classList.add("active");
            renderCategoryProducts(category);
        });
    });

    function renderCategoryProducts(category) {
        categoryProducts.innerHTML = "";

        Object.entries(tvsProducts).forEach(([id, product]) => {
            if (product.category !== category) return;

            const card = document.createElement("article");
            card.className = "tvs-mini-card";
            card.dataset.product = id;

            card.innerHTML = `
                <div class="tvs-mini-card-image">
                    <img src="${product.cardImage}" alt="${product.name}">
                </div>
                <div class="tvs-mini-card-info">
                    <small>${product.type}</small>
                    <h3>${product.name}</h3>
                </div>
            `;

            card.addEventListener("click", () => loadProduct(id));
            categoryProducts.appendChild(card);
        });

        categoryProducts.classList.add("open");
    }

    /* =====================================================
       LOAD PRODUCT
    ===================================================== */

    function loadProduct(id) {
        const product = tvsProducts[id];
        if (!product) return;

        currentProductId = id;

        navProduct.textContent = product.name;
        selectedName.textContent = product.name;

        renderHero(product.hero);
        render360(product);
        renderFeatures(product);
        renderColours(product);
        renderSpecifications(product);
        renderSpares(product);
        renderRelated(id);

        details.classList.add("visible");

        window.setTimeout(() => {
            details.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }

    /* =====================================================
       360 VIEW
    ===================================================== */

    let frames = [];
    let frameIndex = 0;
    let dragging = false;
    let startX = 0;

    async function render360(product) {
        const image = document.querySelector("#tvs360Image");
        const loading = document.querySelector("#tvs360Loading");

        frames = [];
        frameIndex = 0;
        loading.style.display = "flex";

        for (let i = 1; i <= product.frames.count; i++) {
            const frame = new Image();
            const number = String(i).padStart(2, "0");
            frame.src = `${product.frames.path}${number}.${product.frames.extension}`;
            frames.push(frame);
        }

        await Promise.all(
            frames.map(frame => new Promise(resolve => {
                frame.onload = resolve;
                frame.onerror = resolve;
            }))
        );

        if (frames[0]) image.src = frames[0].src;
        loading.style.display = "none";
    }

    function rotate360(direction) {
        if (!frames.length) return;

        frameIndex += direction;

        if (frameIndex < 0) frameIndex = frames.length - 1;
        if (frameIndex >= frames.length) frameIndex = 0;

        document.querySelector("#tvs360Image").src = frames[frameIndex].src;
    }

    const viewer360 = document.querySelector("#tvs360Viewer");

    viewer360.addEventListener("pointerdown", event => {
        dragging = true;
        startX = event.clientX;
        viewer360.setPointerCapture(event.pointerId);
    });

    viewer360.addEventListener("pointermove", event => {
        if (!dragging) return;

        const distance = event.clientX - startX;

        if (Math.abs(distance) > 8) {
            rotate360(distance > 0 ? -1 : 1);
            startX = event.clientX;
        }
    });

    viewer360.addEventListener("pointerup", () => dragging = false);
    viewer360.addEventListener("pointercancel", () => dragging = false);

    /* =====================================================
       FEATURES
    ===================================================== */

    function renderFeatures(product) {
        const image = document.querySelector("#tvsFeatureImage");
        const number = document.querySelector("#tvsFeatureNumber");
        const category = document.querySelector("#tvsFeatureCategory");
        const title = document.querySelector("#tvsFeatureTitle");
        const description = document.querySelector("#tvsFeatureDescription");
        const controls = document.querySelector("#tvsFeatureControls");

        controls.innerHTML = "";

        product.features.forEach((feature, index) => {
            const button = document.createElement("button");
            button.className = "tvs-feature-btn";
            button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${feature.title}`;

            button.addEventListener("click", () => {
                image.style.opacity = "0";

                setTimeout(() => {
                    image.src = feature.image;
                    image.alt = feature.title;
                    category.textContent = feature.category;
                    title.textContent = feature.title;
                    description.textContent = feature.description;
                    number.textContent = String(index + 1).padStart(2, "0");
                    image.style.opacity = "1";
                }, 180);

                controls.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
            });

            controls.appendChild(button);

            if (index === 0) button.click();
        });
    }

    /* =====================================================
       COLOURS
    ===================================================== */

    function renderColours(product) {
        const image = document.querySelector("#tvsColourImage");
        const name = document.querySelector("#tvsColourName");
        const options = document.querySelector("#tvsColourOptions");

        options.innerHTML = "";

        product.colours.forEach((colour, index) => {
            const button = document.createElement("button");
            button.className = "tvs-colour-option";
            button.style.background = colour.hex;
            button.title = colour.name;

            button.addEventListener("click", () => {
                image.style.opacity = "0";

                setTimeout(() => {
                    image.src = colour.image;
                    image.alt = colour.name;
                    name.textContent = colour.name;
                    image.style.opacity = "1";
                }, 180);

                options.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
            });

            options.appendChild(button);

            if (index === 0) button.click();
        });
    }

    /* =====================================================
       SPECIFICATIONS
    ===================================================== */

    function renderSpecifications(product) {
        const table = document.querySelector("#tvsSpecTable");
        table.innerHTML = "";

        product.specifications.forEach(spec => {
            const row = document.createElement("div");
            row.className = "tvs-spec-row";
            row.innerHTML = `
                <span>${spec[0]}</span>
                <strong>${spec[1]}</strong>
            `;
            table.appendChild(row);
        });
    }

    /* =====================================================
       SPARE PARTS
    ===================================================== */

    function renderSpares(product) {
        const grid = document.querySelector("#tvsSparesGrid");
        grid.innerHTML = "";

        product.spares.forEach(spare => {
            const card = document.createElement("article");
            card.className = "tvs-spare-card";
            card.innerHTML = `
                <div class="tvs-spare-image">
                    <img src="${spare.image}" alt="${spare.name}">
                </div>
                <div class="tvs-spare-content">
                    <small>${spare.category}</small>
                    <h3>${spare.name}</h3>
                    <p>${spare.description}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    /* =====================================================
       YOU MAY ALSO LIKE
    ===================================================== */

    function renderRelated(currentId) {
        const slider = document.querySelector("#tvsRelatedSlider");
        slider.innerHTML = "";

        Object.entries(tvsProducts).forEach(([id, product]) => {
            if (id === currentId) return;

            const card = document.createElement("article");
            card.className = "tvs-related-card";

            card.innerHTML = `
                <img src="${product.cardImage}" alt="${product.name}">
                <div>
                    <small>${product.type}</small>
                    <h3>${product.name}</h3>
                </div>
            `;

            card.addEventListener("click", () => loadProduct(id));
            slider.appendChild(card);
        });
    }

    document.querySelector("#tvsRelatedPrev").addEventListener("click", () => {
        document.querySelector("#tvsRelatedSlider").scrollBy({
            left: -350,
            behavior: "smooth"
        });
    });

    document.querySelector("#tvsRelatedNext").addEventListener("click", () => {
        document.querySelector("#tvsRelatedSlider").scrollBy({
            left: 350,
            behavior: "smooth"
        });
    });

    /* =====================================================
       CHANGE PRODUCT
    ===================================================== */

    document.querySelector("#tvsBackToProducts").addEventListener("click", () => {
        details.classList.remove("visible");

        window.setTimeout(() => {
            details.style.display = "none";
            details.removeAttribute("style");
            document.querySelector(".tvs-selector").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);

        details.classList.remove("visible");
    });

    /* =====================================================
       QUICK NAVIGATION
    ===================================================== */

    quickLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", event => {
            if (!currentProductId) {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(link.getAttribute("href"));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

});