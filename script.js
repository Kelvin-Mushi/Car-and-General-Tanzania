function renderRoute(targetId) {
  if (!targetId) return;

  // Reset TVS category cards whenever the route changes
  const tvsCategoryProducts = document.querySelector("#tvsCategoryProducts");
  const tvsCategoryButtons = document.querySelectorAll(".tvs-category-btn");

  if (tvsCategoryProducts) {
    tvsCategoryProducts.classList.remove("open");
    tvsCategoryProducts.innerHTML = "";
  }

  tvsCategoryButtons.forEach(button => {
    button.classList.remove("active");
  });

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
                    title: "Superior Rear Suspension",
                    category: "SAFETY",
                    image: "assets/tvs/hlx1254g/features/safety-1.png",
                    description: "Keeps your ride safe."
                },
                {
                    title: "Ecothrust Engine",
                    category: "PERFOMANCE",
                    image: "assets/tvs/hlx1254g/features/engine.png",
                    description: "Gives you confidence on any envrionment."
                },
                {
                    title: "Stylish Design",
                    category: "COMFORT",
                    image: "assets/tvs/hlx1254g/features/convinience-1.png",
                    description: "Designed to provide a comfortable riding experience."
                }
            ],
            colours: [
                {
                    name: "Flame Red",
                    hex: "#c9202b",
                    image: "assets/tvs/hlx1254g/colours/red.webp"
                },
                {
                    name: "Midnight Black",
                    hex: "#151515",
                    image: "assets/tvs/hlx1254g/colours/black.webp"
                },
                {
                    name: "Polyster Blue",
                    hex: "#214f96",
                    image: "assets/tvs/hlx1254g/colours/blue.webp"
                }
            ],
            specifications: [
                ["Engine Type", "4 Stroke Natural Air Cooled"],
                ["Engine Displacement", "124.53CC"],
                ["Maximum Power", "8.09 kW @8000 rpm"],
                ["Maximum Torque", "10.8 Nm@5500rpm"],
                ["Starting", "Electric Start and Kick Start"],
                ["Transmission", "4 Speed Constant Mesh"],
                ["Clutch & Transmission", "Wet Type Plate"]
            ],
            spares: [
                {
                    name: "Cables",
                    category: "ENGINE",
                    image: "assets/tvs/hlx1254g/spares/cables.png",
                    description: "Genuine replacement Cables."
                },
                {
                    name: "Clutch Plates",
                    category: "ENGINE",
                    image: "assets/tvs/hlx1254g/spares/clutch-plates.png",
                    description: "Genuine replacement Clutch Plates."
                },
                {
                    name: "cylinder-block",
                    category: "BRAKING",
                    image: "assets/tvs/hlx1254g/spares/cylinder-block.png",
                    description: "Genuine replacement cylinder-block."
                }
            ]
        },

        hlx150x: {
            name: "TVS HLX 150X",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/hlx150x/card.webp",
            hero: [
                {
                    image: "assets/tvs/hlx150x/hero-01.webp",
                    title: "TVS hlx150x",
                    text: "Efficient, practical and ready for everyday life."
                },
                {
                    image: "assets/tvs/hlx150x/hero-02.webp",
                    title: "Go further",
                    text: "A motorcycle designed around everyday mobility."
                }
            ],
            frames: {
                path: "assets/tvs/hlx150x/360/frame-",
                count: 15,
                extension: "webp"
            },
            features: [
                {
                    title: "Analog Display",
                    category: "TECHNOLOGY",
                    image: "assets/tvs/hlx150x/features/convinience-3.png",
                    description: "Know your fuel level at a glance."
                },
                {
                    title: "USB Charger",
                    category: "CONVENIENCE",
                    image: "assets/tvs/hlx150x/features/convinience-2.png",
                    description: "Charge compatible devices while travelling."
                },
                {
                    title: "Powerful Engine",
                    category: "PERFOMANCE",
                    image: "assets/tvs/hlx150x/features/perfomance-1.png",
                    description: "Gives you confidence to go anywhere."
                }
            ],
            colours: [
                {
                    name: "Midnight Black",
                    hex: "#171717",
                    image: "assets/tvs/hlx150x/colours/hlx-150x-black.webp"
                },
                {
                    name: "Flame Red",
                    hex: "#d52630",
                    image: "assets/tvs/hlx150x/colours/hlx-150x-red.webp"
                },
                {
                    name: "Polyster Blue",
                    hex: "#0b2edc",
                    image: "assets/tvs/hlx150x/colours/hlx-150x-blue.webp"
                }
            ],
            specifications: [
                ["Engine Type", "4 Stroke Natural Air Cooled"],
                ["Engine Displacement", "147.49CC"],
                ["Maximum Power", "8.9kw@7500rpm"],
                ["Maximum Torque", "12.3Nm@5000rpm"],
                ["Starting", "Electric Start and Kick Start"],
                ["Transmission", "5 Speed Constant Mesh"],
                ["Clutch & Transmission", "Wet, Multi-Disk Type Plate"]
            ],
            spares: [
                {
                    name: "Cylinder Block",
                    category: "ENGINE",
                    image: "assets/tvs/hlx150x/spares/cylinder-block-genuine.png",
                    description: "Genuine TVS replacement Cylinder Block."
                },
                {
                    name: "Engine Oil",
                    category: "ENGINE",
                    image: "assets/tvs/hlx150x/spares/engine-oil-genuine.png",
                    description: "Genuine TVS replacement Engine Oil."
                },
                {
                    name: "Valves",
                    category: "ENGINE",
                    image: "assets/tvs/hlx150x/spares/valve-genuine.png",
                    description: "Genuine TVS replacement Valves."
                }
            ]
        },

        hlx1255g: {
            name: "TVS HLX 125 5G",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/hlx1255g/card.webp",
            hero: [
                {
                    image: "assets/tvs/hlx1255g/hero-01.webp",
                    title: "TVS hlx1255g",
                    text: "Efficient, practical and ready for everyday life."
                },
                {
                    image: "assets/tvs/hlx1255g/hero-02.webp",
                    title: "Go further",
                    text: "A motorcycle designed around everyday mobility."
                }
            ],
            frames: {
                path: "assets/tvs/hlx1255g/360/frame-",
                count: 15,
                extension: "webp"
            },
            features: [
                {
                    title: "Lights",
                    category: "SAFETY",
                    image: "assets/tvs/hlx1255g/features/safety-2.png",
                    description: "Ride comfortably day and night."
                },
                {
                    title: "Strong Carrier",
                    category: "CONVENIENCE",
                    image: "assets/tvs/hlx1255g/features/convinience-6.png",
                    description: "Heavy load? Issue solved."
                }
            ],
            colours: [
                {
                    name: "Black",
                    hex: "#171717",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-black.webp"
                },
                {
                    name: "Black",
                    hex: "#171717",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-black1.webp"
                },
                {
                    name: "Black",
                    hex: "#0922e7",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-blue.webp"
                },
                {
                    name: "Black",
                    hex: "#0c21e3",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-blue2.webp"
                },
                {
                    name: "Red",
                    hex: "#d52630",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-red.webp"
                },
                {
                    name: "Red",
                    hex: "#d52630",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-red2.webp"
                }
            ],
            specifications: [
                ["Engine Type", "4 Stroke Natural Air Cooled"],
                ["Engine Displacement", "125CC"],
                ["Maximum Power", "8.5 kw @ 8500 rpm"],
                ["Maximum Torque", "11 Nm@6500rpm"],
                ["Starting", "Electric Start and Kick Start"],
                ["Transmission", "5 Speed Constant Mesh"]
            ],
            spares: [
                {
                    name: "Spark Plug",
                    category: "ENGINE",
                    image: "assets/tvs/hlx1255g/spares/spark-plug-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "TSL Lamp",
                    category: "LIGHTS",
                    image: "assets/tvs/hlx1255g/spares/tsl-lamp-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "Valves",
                    category: "LIGHTS",
                    image: "assets/tvs/hlx1255g/spares/valve-genuine.png",
                    description: "Genuine TVS replacement Valves."
                }
            ]
        },

        hlxplus: {
            name: "TVS HLX PLUS",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/hlxplus/card.webp",
            hero: [
                {
                    image: "assets/tvs/hlxplus/hero-01.webp",
                    title: "TVS hlxplus",
                    text: "Performance-inspired engineering for riders who want more."
                },
                {
                    image: "assets/tvs/hlxplus/hero-02.webp",
                    title: "Born to perform",
                    text: "A bold motorcycle with a distinctive character."
                }
            ],
            frames: {
                path: "assets/tvs/hlxplus/360/frame-",
                count: 14,
                extension: "webp"
            },
            features: [
                {
                    title: "Powerful Engine",
                    category: "PERFOMANCE",
                    image: "assets/tvs/hlxplus/features/perfomance-1.png",
                    description: "Gives. you confidence to go anywhere."
                },
                {
                    title: "Analog Display",
                    category: "TECHNOLOGY",
                    image: "assets/tvs/hlxplus/features/convinience-3.png",
                    description: "Important riding information presented clearly."
                },
                {
                    title: "USB Charger",
                    category: "TECHNOLOGY",
                    image: "assets/tvs/hlxplus/features/convinience-2.png",
                    description: "Keeps your devices charged."
                }
            ],
            colours: [
                {
                    name: "Red",
                    hex: "#d8202c",
                    image: "assets/tvs/hlxplus/colours/hlx-plus-red.webp"
                },
                {
                    name: "Black",
                    hex: "#111111",
                    image: "assets/tvs/hlxplus/colours/hlx-plus-black.webp"
                },
                {
                    name: "Blue",
                    hex: "#0821e2",
                    image: "assets/tvs/hlxplus/colours/hlx-plus-blue.webp"
                }
            ],
            specifications: [
                ["Engine Type", "4 Stroke Natural Air Cooled"],
                ["Engine Displacement", "99.7 CC"],
                ["Maximum Power", "5.53 kw @ 7000rpm"],
                ["Maximum Torque", "8.2 Nm @ 5000 rpm"],
                ["Starting", "Electric Start and Kick Start"],
                ["Transmission", "4 Speed Constant Mesh"],
                ["Clutch & Transmission", "Wet, Multi disc Type"]
            ],
            spares: [
                {
                    name: "Spark Plug",
                    category: "ENGINE",
                    image: "assets/tvs/hlxplus/spares/spark-plug-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "TSL Lamp",
                    category: "LIGHTS",
                    image: "assets/tvs/hlxplus/spares/tsl-lamp-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "valves",
                    category: "LIGHTS",
                    image: "assets/tvs/hlxplus/spares/valve-genuine.png",
                    description: "Genuine TVS replacement valves."
                }
            ]
        },

         xl100: {
            name: "TVS XL100 Heavy-Duty",
            category: "2-wheeler",
            type: "MOTORCYCLE",
            cardImage: "assets/tvs/xl100/card.webp",
            hero: [
                {
                    image: "assets/tvs/xl100/hero-01.webp",
                    title: "TVS xl100",
                    text: "Performance-inspired engineering for riders who want more."
                },
                {
                    image: "assets/tvs/xl100/hero-02.webp",
                    title: "Born to perform",
                    text: "A bold motorcycle with a distinctive character."
                }
            ],
            frames: {
                path: "assets/tvs/xl100/360/frame-",
                count: 15,
                extension: "webp"
            },
            features: [
                {
                    title: "Comfortable Seat",
                    category: "COMFORT",
                    image: "assets/tvs/xl100/features/Comfort.webp",
                    description: "Design to provide a less fatigue journey."
                },
                {
                    title: "Durability",
                    category: "CONVENIENCE",
                    image: "assets/tvs/xl100/features/Durability.webp",
                    description: "Built for heavy duty rides."
                },
                {
                    title: "I-Touch Start",
                    category: "STARTING",
                    image: "assets/tvs/xl100/features/i-touch-start.webp",
                    description: "Starting Made Easy."
                }
            ],
            colours: [
                {
                    name: "Red",
                    hex: "#d8202c",
                    image: "assets/tvs/xl100/colours/hlx-100-red.webp"
                },
                {
                    name: "Black",
                    hex: "#111111",
                    image: "assets/tvs/xl100/colours/hlx-100-black.webp"
                },
                {
                    name: "Blue",
                    hex: "#0821e2",
                    image: "assets/tvs/xl100/colours/hlx-100-blue.webp"
                },
                {
                    name: "Green",
                    hex: "#219a0e",
                    image: "assets/tvs/xl100/colours/hlx-100-green.webp"
                }
            ],
            specifications: [
                ["Engine Type", "Single cylinder, 4 stroke, air cooled spark ignition engine"],
                ["Engine Displacement", "99.7 CC"],
                ["Maximum Power", "3.2 kW @ 6000 rpm"],
                ["Maximum Torque", "6.5 Nm @ 3500 rpm"]
            ],
            spares: [
                {
                    name: "Spark Plug",
                    category: "ENGINE",
                    image: "assets/tvs/xl100/spares/spark-plug-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "TSL Lamp",
                    category: "LIGHTS",
                    image: "assets/tvs/xl100/spares/tsl-lamp-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "valves",
                    category: "LIGHTS",
                    image: "assets/tvs/xl100/spares/valve-genuine.png",
                    description: "Genuine TVS replacement valves."
                }
            ]
        },

        tvsking: {
            name: "TVS King Deluxe",
            category: "3-wheeler",
            type: "THREE WHEELER",
            cardImage: "assets/tvs/tvsking/card.webp",
            hero: [
                {
                    image: "assets/tvs/tvsking/hero-01.webp",
                    title: "TVS tvsking",
                    text: "Built for business, mobility and everyday transport."
                },
                {
                    image: "assets/tvs/tvsking/hero-02.webp",
                    title: "Move more",
                    text: "Practical three-wheeler performance for demanding journeys."
                }
            ],
            frames: {
                path: "assets/tvs/tvsking/360/frame-",
                count: 13,
                extension: "webp"
            },
            features: [
                {
                    title: "Driver Footrest",
                    category: "COMFORT",
                    image: "assets/tvs/tvsking/features/comfort.png",
                    description: "Designed with everyday driver and passenger comfort in mind."
                },
                {
                    title: "3 Stage Air Filtration",
                    category: "DURABILITY",
                    image: "assets/tvs/tvsking/features/durability-1.png",
                    description: "Designed to for Durability."
                },
                {
                    title: "3 Stage Air Filtration",
                    category: "DURABILITY",
                    image: "assets/tvs/tvsking/features/durability-1.png",
                    description: "Designed to for Durability."
                }
            ],
            colours: [
                {
                    name: "Blue",
                    hex: "#245291",
                    image: "assets/tvs/tvsking/colours/tvs-king-blue.webp"
                },
                {
                    name: "Red",
                    hex: "#d5202c",
                    image: "assets/tvs/tvsking/colours/tvs-king-red.webp"
                },
                {
                    name: "Green",
                    hex: "#088d0b",
                    image: "assets/tvs/tvsking/colours/tvs-king-green.webp"
                }
            ],
            specifications: [
                ["Engine Type", "4 Stroke, Single Cylinder Air Cooled, Spark ignition Si-Engine"],
                ["Starting", "Electric (ISG) and Hand Start"],
                ["Engine Displacement", "199.26 cc"],
                ["Maximum Power", "7.5 Kw @ rpm 5500"],
                ["Maximum Torque", "15.5 Nm @ 3250 rpm"],
                ["Transmission", "4 Forward and 1 Reverse speed Constant Mesh Fork and Cam type Shift mechanism"],
                ["Ignition System", "DC Digital TCI"]
            ],
            spares: [
                {
                    name: "Spark Plug",
                    category: "ENGINE",
                    image: "assets/tvs/tvsking/spares/plug.webp",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "Piston Rings",
                    category: "ENGINE",
                    image: "assets/tvs/tvsking/spares/piston-rings-genuine.png",
                    description: "Genuine TVS replacement Piston Rings."
                }
            ]
        },

        tvscng: {
            name: "King Deluxe plus CNG",
            category: "3-wheeler",
            type: "THREE WHEELER",
            cardImage: "assets/tvs/tvscng/card.webp",
            hero: [
                {
                    image: "assets/tvs/tvscng/hero-01.webp",
                    title: "TVS King Deluxe",
                    text: "Practical mobility with a premium everyday experience."
                }
            ],
            frames: {
                path: "assets/tvs/tvscng/360/frame-",
                count: 12,
                extension: "webp"
            },
            features: [
                {
                    title: "Passenger Comfort",
                    category: "COMFORT",
                    image: "assets/tvs/tvscng/features/comfort-2.png",
                    description: "A practical cabin designed around everyday passenger needs."
                },
                {
                    title: "30 Litre/5Kg CNG Tank",
                    category: "CONVENIENCE",
                    image: "assets/tvs/tvscng/features/convinience-2.png",
                    description: "Capacity to do business for full day with one full tank of gas."
                },
                {
                    title: "Brighter HeadLamp",
                    category: "SAFETY",
                    image: "assets/tvs/tvscng/features/safety-1.png",
                    description: "Brighter light for better visibilty at night."
                }
            ],
            colours: [
                {
                    name: "Green",
                    hex: "#47bb08",
                    image: "assets/tvs/tvscng/colours/tvs-cng-green.webp"
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
                    name: "Spark Plug",
                    category: "ENGINE",
                    image: "assets/tvs/tvscng/spares/spark-plug-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "Valves",
                    category: "ENGINE",
                    image: "assets/tvs/tvscng/spares/valve-genuine.png",
                    description: "Genuine TVS replacement Valves."
                }
            ]
        },

        tvscargo: {
            name: "TVS CARGO",
            category: "3-wheeler",
            type: "THREE WHEELER",
            cardImage: "assets/tvs/tvscargo/card.webp",
            hero: [
                {
                    image: "assets/tvs/tvscargo/hero-01.webp",
                    title: "TVS tvscargo",
                    text: "Built for business, mobility and everyday transport."
                },
                {
                    image: "assets/tvs/tvscargo/hero-02.webp",
                    title: "Move more",
                    text: "Practical three-wheeler performance for demanding journeys."
                }
            ],
            frames: {
                path: "assets/tvs/tvscargo/360/frame-",
                count: 36,
                extension: "webp"
            },
            features: [
                {
                    title: "I-touch Start",
                    category: "START",
                    image: "assets/tvs/tvscargo/features/convinience-1.png",
                    description: "Designed with everyday driver comfort in mind."
                },
                {
                    title: "Audio Player",
                    category: "TECHNOLOGY",
                    image: "assets/tvs/tvscargo/features/convinience-4.png",
                    description: "Designed to help you spend more time on the road."
                },
                {
                    title: "Easy Reverse gear",
                    category: "COVENIENCE",
                    image: "assets/tvs/tvscargo/features/convinience-3.png",
                    description: "Designed with everyday driver comfort in mind."
                }
            ],
            colours: [
                {
                    name: "White",
                    hex: "#f4f6f8",
                    image: "assets/tvs/tvscargo/colours/tvs-cargo-white.webp"
                },
                {
                    name: "Yellow",
                    hex: "#efdc10",
                    image: "assets/tvs/tvscargo/colours/tvs-cargo-yellow.webp"
                }
            ],
            specifications: [
                ["Engine Type", " Stroke, Liquid cooled, Single Cylinder"],
                ["Starting", "Electric (ISG) and Hand Start"],
                ["Engine Displacement", "225.8 cc"],
                ["Maximum Power", "7.8 kW(10 bhp) @ 4750 rpm"],
                ["Max Speed", "65 ± 2 km/h"],
                ["Maximum Torque", "18.5 Nm @ 3000 rpm"],
                ["Transmission", "Manual 4 Speed, 1 Reverse"]
            ],
            spares: [
                {
                    name: "Spark Plug",
                    category: "ENGINE",
                    image: "assets/tvs/tvscargo/spares/spark-plug-genuine.png",
                    description: "Genuine TVS replacement Spark Plug."
                },
                {
                    name: "TSL Lamp",
                    category: "LIGHTS",
                    image: "assets/tvs/tvscargo/spares/tsl-lamp-genuine.png",
                    description: "Genuine TVS replacement TSL Lamp."
                },
                {
                    name: "Valves",
                    category: "LIGHTS",
                    image: "assets/tvs/tvscargo/spares/valve-genuine.png",
                    description: "Genuine TVS replacement Valves."
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

        setTimeout(() => {
        const navbarOffset = 100;

        const position =
            categoryProducts.getBoundingClientRect().top +
            window.scrollY -
            navbarOffset;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });
    }, 100);
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