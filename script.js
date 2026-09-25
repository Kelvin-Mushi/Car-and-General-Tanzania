document.addEventListener('DOMContentLoaded', () => {
  const tzLink = document.getElementById('tanzaniaLink');

  if (tzLink) {
    tzLink.addEventListener('click', (event) => {
      // 1. Display the popup prompt
      alert("You are now in Tanzania Website");
    });
  }
});

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
// SIDEBAR DROPDOWNS & UI TOGGLES
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

  //about us
    const aboutExtended = document.getElementById('extended-about');
    const historyLink = document.getElementById('history-link');
    const historySection = document.getElementById('history-section');
    const seeMoreBtn = document.getElementById('see-more-btn');
    const managementTeamBtn = document.getElementById('management-team-btn');
    const managementTeamSection = document.getElementById('management-team');

    seeMoreBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        aboutExtended.classList.add('active');

        setTimeout(()=>{
            aboutExtended.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

    })

    historyLink.addEventListener('click', (e) => {
    e.preventDefault();

        if (historyLink && historySection) {
            historyLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 1. Reveal section using correct variable name
                aboutExtended.classList.add('active');
                
                // 2. Allow 50ms for browser layout reflow before scrolling
                setTimeout(() => {
                historySection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                }, 50);
            });
        }
    });

    managementTeamBtn.addEventListener('click', (e) => {
    e.preventDefault();

        if (managementTeamBtn && managementTeamSection) {
            managementTeamBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 1. Reveal section using correct variable name
                aboutExtended.classList.add('active');
                
                // 2. Allow 50ms for browser layout reflow before scrolling
                setTimeout(() => {
                managementTeamSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                }, 50);
            });
        }
    });

    if(aboutExtended){
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        // If section is active BUT its top edge drops below or goes above view boundary
        if (aboutExtended.classList.contains('active')) {
            const rect = entry.boundingClientRect;
            
            // When user scrolls back UP past the top of the section
            if (rect.top > window.innerHeight || rect.bottom < 0) {
            aboutExtended.classList.remove('active');
            }
        }
        });
    }, {
        threshold: 0 // Triggers as soon as the section completely leaves the viewport
    });

    observer.observe(aboutExtended);
    }
    
  // Footer Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

//===================MAP
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('tanzaniaMap');
  if (!mapElement) return;

  // 1. Initialize the map centered on Tanzania
  const map = L.map('tanzaniaMap').setView([-6.3690, 34.8888], 6); // Coordinates center of TZ, Zoom level 6

  // 2. Load OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // 3. Array of all 14 branch locations with coordinates
  const branches = [
    { name: "Dar es Salaam Branch", lat: -6.8235, lng: 39.2695, info: "Main Head Office & Service Center" },
    { name: "Arusha Branch", lat: -3.3869, lng: 36.6830, info: "Sales & Service Showroom" },
    { name: "Mwanza (Sengerema) Branch", lat: -2.5407, lng: 32.6267, info: "Regional Distribution Point" },
    { name: "Mbeya Branch", lat: -8.9094, lng: 33.4586, info: "Southern Highlands Outlet" },
    { name: "Mtwara Branch", lat: -10.2736, lng: 40.1828, info: "Coastal Branch" },
    { name: "Kahama Branch", lat: -3.8376, lng: 32.6015, info: "Shinyanga Region Branch" },
    { name: "Tanga Branch", lat: -5.0689, lng: 39.0988, info: "Tanga Port Area Branch" },
    { name: "Tunduma Branch", lat: -9.3000, lng: 32.7667, info: "Border Trade Service Point" },
    { name: "Sumbawanga Branch", lat: -7.9667, lng: 31.6167, info: "Rukwa Outlet" },
    { name: "Singida Branch", lat: -4.8167, lng: 34.7500, info: "Central Zone Branch" },
    { name: "Moshi Branch", lat: -3.3349, lng: 37.3404, info: "Kilimanjaro Branch" },
    { name: "Morogoro Branch", lat: -6.8278, lng: 37.6591, info: "Morogoro Town Outlet" },
    { name: "Zanzibar Branch", lat: -6.1659, lng: 39.2026, info: "Island Showroom & Spares" },
    { name: "Pwani (Kibaaha) Branch", lat: -6.7667, lng: 38.9167, info: "Pwani Regional Center" }
  ];

  // 4. Loop through array and plot markers with popups
  branches.forEach(branch => {
    const marker = L.marker([branch.lat, branch.lng]).addTo(map);
    
    // Bind popup content to each marker
    const popupContent = `
      <div class="branch-popup">
        <h4>${branch.name}</h4>
        <p>${branch.info}</p>
      </div>
    `;
    marker.bindPopup(popupContent);
  });
});

/*====================COUNTER====================== */
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.count-num');
  const animationDuration = 1800; // Takes 1.8 seconds to count up

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        // Smooth ease-out effect
        const easeOutQuad = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOutQuad * target);

        counter.innerText = currentCount.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  // Run immediately on page load
  animateCounters();

  // Re-run every 4000 milliseconds (4 seconds)
  setInterval(() => {
    animateCounters();
  }, 4000);
});
// ==========================================================================
// 3. MODALS (PRIVACY POLICY & TERMS)
// ==========================================================================

const privacyLink = document.getElementById('privacy-link');
const privacyLink2 = document.getElementById('privacy-link2');
const privacyModal = document.getElementById('privacy-modal');
const closeModal = document.getElementById('close-modal');

if (privacyLink && privacyModal || privacyLink2 && privacyModal) {
  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'flex';
  });

  privacyLink2.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'flex';
  });
}

if (closeModal && privacyModal) {
  closeModal.addEventListener('click', () => {
    privacyModal.style.display = 'none';
  });
}

//terms
const termsLink = document.getElementById('terms-link');
const termsModal = document.getElementById('terms-modal');
const closeModal2 = document.getElementById('close-modal2');
const termsLink2 = document.getElementById('terms-link2');

if (termsLink && termsModal || termsLink2 && termsModal) {
  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'flex';
  });

  termsLink2.addEventListener('click', (e) => {
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
/*const backgroundImages = [
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
setInterval(rotateBackgrounds, 5000);*/


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
            performance: [
                {
                    title: "Ecothrust Engine",
                    category: "PERFOMANCE",
                    image: "assets/tvs/hlx1254g/features/engine.png",
                    description: "Gives you confidence on any envrionment."
                }
            ],
            convenience: [
                {
                    title: "USB Phone Charger",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/hlx-125/Features/usb.webp",
                    description: "Gives you confidence on any envrionment."
                },
                {
                    title: "Stylish Design",
                    category: "CONVENIENCE",
                    image: "assets/tvs/hlx1254g/features/convinience-1.png",
                    description: "Designed to provide a comfortable riding experience."
                },
                {
                    title: "Fuel Gauge",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/hlx-125/Features/Fuel-meter.webp",
                    description: "Designed to provide a comfortable riding experience."
                }
            ],
            safety: [
                {
                    title: "Superior Rear Suspension",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/hlx-125/Features/susp.webp",
                    description: "Gives you confidence on any envrionment."
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
            chassisSuspension: [
                ["Front Suspension", "Telescopic Oil Damped"],
                ["Rear Suspension", "Hydraulic Shock absorber"]
            ],
            electricals: [
                ["Battery", "12V, 5Ah"],
                ["Gear Indication", "12V, 1.7Wx5"]
            ],
            dimensionWeight: [
                ["Length", "2000 mm"],
                ["Width", "745 mm"],
                ["Height", "1030 mm"],
                ["Wheel base", "1260 mm"],
                ["Saddle height", "830 mm"],
                ["Ground clearance", "180 mm"],
                ["Vehicle kerb weight", "115 kg"],
                ["Fuel tank capacity", "12 L"],
                ["Reserve capacity", "2 L"],
            ],
            wheelsBrakes: [
                ["Front Tyre", '2.75X17, 41P, Duragrip'],
                ["Rear Tyre", '100/90X17, 51P, Duragrip'],
                ["Front Brake", '130mm Drum'],
                ["Rear Brake", '130mm Drum']
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
            performance: [
                {
                    title: "150cc Ecothrust Engine",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-150-X-F1-engine.webp",
                    description: "Gives you confidence on any envrionment."
                }
            ],
            convenience: [
                {
                    title: "Big Strong Carrier",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-150-X-F2-carrier.webp",
                    description: "Carries more & Heavy loads."
                },
                {
                    title: "USB Phone Charger",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-150-X-F3-usb.webp",
                    description: "Charge devices as ayou go."
                },
                {
                    title: "Fuel Gauge",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-5-gear-F4-gear-position.webp",
                    description: "Designed to provide a comfortable riding experience."
                },
                {
                    title: "Electric Start",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-150-X-F5-hand-starter.webp",
                    description: "Easy starting."
                }
            ],
            safety: [
                {
                    title: "Superior Rear shock Suspension",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-150-X-F7-susp.webp",
                    description: "Comfortabilty even ata higher loads."
                },
                {
                    title: "Third Pillon Footrest with Plate",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/HLX-150-X-F6-footrest.webp",
                    description: "Better grip and comfortability."
                },
                {
                    title: "Hazard Lamp",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/HLX-150X-5-GEAR/web/Feature/hazard-lamp.webp",
                    description: "Safe driving at night."
                }
            ],
            colours: [
                {
                    name: "Midnight Black",
                    hex: "#171717",
                    image: "assets/tvs/hlx150x/colours/hlx-150x-black.webp"
                },
                {
                    name: "Polyster Blue",
                    hex: "#0b2edc",
                    image: "assets/tvs/hlx150x/colours/hlx-150x-blue.webp"
                },
                {
                    name: "Flame Red",
                    hex: "#d52630",
                    image: "assets/tvs/hlx150x/colours/hlx-150x-red.webp"
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
            chassisSuspension: [
                ["Front Suspension", "Fork Travel, Telescopic"],
                ["Rear Suspension", "Hydraulic Shock absorber"]
            ],
            electricals: [
                ["Gear Indication", "12V, 1.7Wx5"]
            ],
            dimensionWeight: [
                ["Length", "2040 mm"],
                ["Width", "745 mm"],
                ["Height", "1150 mm"],
                ["Wheel base", "1295 mm"],
                ["Saddle height", "834 mm"],
                ["Ground clearance", "195 mm"],
                ["Vehicle kerb weight", "119 kg"],
                ["Fuel tank capacity", "12 L"],
                ["Reserve capacity", "2 L"],
            ],
            wheelsBrakes: [
                ["Front Tyre", '2.75X17, 41P, Duragrip'],
                ["Rear Tyre", '90/90X18, 51P, Duragrip'],
                ["Front Brake", '130mm Drum Internal Expanding Shoe Type'],
                ["Rear Brake", '130mm Drum Internal Expanding Shoe Type']
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
            performance: [
                {
                    title: "125 cc 5 Gear Ecothrust Engine",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Engine.webp",
                    description: "Gives you confidence on any envrionment."
                }
            ],
            convenience: [
                {
                    title: "New graphics",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/hlx-125/Features/usb.webp",
                    description: "Makes riders standout."
                },
                {
                    title: "USB Port",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/USB.webp",
                    description: "Keep phone charged as you go."
                },
                {
                    title: "Fuel Indicator",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Fuel-Meter.webp",
                    description: "Accurate identification of fuel levels."
                },
                {
                    title: "Extra stong carrier",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Carrier.webp",
                    description: "Easy transportation of loads."
                },
                {
                    title: "Electric Start",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Electric-Starter.webp",
                    description: "Faster and smooth starts."
                },
                {
                    title: "Black alloy wheel",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/AlloyWheel.webp",
                    description: "Premium style."
                },
                {
                    title: "DC Headlamp",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Headlamp-(1).webp",
                    description: "Better visibility."
                }
            ],
            safety: [
                {
                    title: "Tough and smooth shock absorber",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Suspension.webp",
                    description: "Gives you confidence on any envrionment."
                },
                {
                    title: "Hazard lamp",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Headlamp-(1).webp",
                    description: "Four side blinkers for clear visibility."
                }
            ],
            colours: [
                {
                    name: "Black",
                    hex: "#171717",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-black1.webp"
                },
                {
                    name: "Blue",
                    hex: "#0c21e3",
                    image: "assets/tvs/hlx1255g/colours/hlx-125-5g-blue2.webp"
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
            chassisSuspension: [
                ["Front Suspension", "Telescopic Oil Damped"],
                ["Rear Suspension", "Tough & Smooth Suspension"]
            ],
            electricals: [
                ["Battery", "12V, 5Ah"],
                ["Gear Indication", "12V, 1.7Wx5"]
            ],
            dimensionWeight: [
                ["Length", "2040 mm"],
                ["Width", "740 mm"],
                ["Height", "1040 mm"],
                ["Wheel base", "1293 mm"],
                ["Saddle height", "790 mm"],
                ["Ground clearance", "165 mm"],
                ["Vehicle kerb weight", "121 kg"],
                ["Fuel tank capacity", "12 L"],
                ["Reserve capacity", "2 L"],
            ],
            wheelsBrakes: [
                ["Front Tyre", '2.75X17, Tubeless'],
                ["Rear Tyre", '18 X 3"'],
                ["Front Brake", '130mm Drum'],
                ["Rear Brake", '130mm Drum']
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
            performance: [
                {
                    title: "Powerful Engine",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HlX-plus/Features/engine.webp",
                    description: "Gives you confidence on any envrionment."
                }
            ],
            convenience: [
                {
                    title: "USB Port",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HlX-plus/Features/USB.webp",
                    description: "Keep phone charged as you go."
                },
                {
                    title: "Fuel Indicator",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HlX-plus/Features/Fuel-Meter.webp",
                    description: "Accurate identification of fuel levels."
                },
                {
                    title: "Sturdy Pillon carrier",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HlX-plus/Features/Carrier.webp",
                    description: "Easy transportation of loads."
                },
                {
                    title: "Electric Start",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HLX-125-5G/web/feature/Electric-Starter.webp",
                    description: "Faster and smooth starts."
                }
            ],
            safety: [
                {
                    title: "Superior rear suspension",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/HlX-plus/Features/Susp.webp",
                    description: "Gives you confidence on any envrionment."
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
            chassisSuspension: [
                ["Front Suspension", "Telescopic Oil Damped"],
                ["Rear Suspension", "Hydraulic Shock absorber"]
            ],
            electricals: [
                ["Battery", "12V, 5Ah"],
                ["Gear Indication", "12V, 1.7Wx5"]
            ],
            dimensionWeight: [
                ["Length", "2011 mm"],
                ["Width", "700 mm"],
                ["Height", "1050 mm"],
                ["Wheel base", "1250 mm"],
                ["Saddle height", "NA"],
                ["Ground clearance", "160 mm"],
                ["Vehicle kerb weight", "106 kg"],
                ["Fuel tank capacity", "12 L"],
                ["Reserve capacity", "2 L"],
            ],
            wheelsBrakes: [
                ["Front Tyre", '2.75X17'],
                ["Rear Tyre", '3.00X17'],
                ["Front Brake", '110 mm Drum'],
                ["Rear Brake", '110 mm Drum']
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
            performance: [
                {
                    title: "Powerful 100 cc Engine",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/XL-100-Heavy-Duty/web/Feature/engine.webp",
                    description: "Top notch perfomance."
                }
            ],
            convenience: [
                {
                    title: "i-touch start",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/XL-100-Heavy-Duty/web/Feature/i-touch-start.webp",
                    description: "Instant and silent starting."
                }
            ],
            safety: [
                {
                    title: "Front hyraulic suspension",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/XL-100-Heavy-Duty/web/Feature/HEAVY-DUTY-SHOCK-ABSORBER.webp",
                    description: "Gives you confidence on any envrionment."
                },
                {
                    title: "Sync braking technology",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/XL-100-Heavy-Duty/web/Feature/DURA-GRIP-TYRE.webp",
                    description: "Superior braking control."
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
            chassisSuspension: [
                ["Front", "Telescopic spring type hydraulic"],
                ["Rear", "Swing arm fitted with hydraulic shock absorbers"]
            ],
            electricals: [
                ["Ignition System", "Electronic Ignition"],
                ["Head Lamp", "12V, 35/35W x 1"],
                ["Taillamp", "12V, 5/21W x 1"]
            ],
            dimensionWeight: [
                ["Wheelbase", "1228 mm"],
                ["Overall Length", "1895 mm"],
                ["Overall Width", "670 mm"],
                ["Overall Height", "1077 mm"],
                ["Fuel Tank Capacity", "4 liters"]
            ],
            wheelsBrakes: [
                ["Front Tyre", '2.50 x 16 - 6PR'],
                ["Rear Tyre", '2.50 x 16 - 6PR'],
                ["Front Brake", '80 mm Dia drum'],
                ["Rear Brake", '110 mm Dia drum']
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
            performance: [
                {
                    title: "3 Stage air filtration",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/3-Stage-Air-filtration_Red.webp",
                    description: "Top notch perfomance."
                },
                {
                    title: "Ventilated tail door",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/Ventilated-tail-door_REd.webp",
                    description: "Better engine cooling."
                }
            ],
            convenience: [
                {
                    title: "Driver footrest",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/driver-footrest_Red.webp",
                    description: "More comfort to the driver."
                },
                {
                    title: "Easy Reverse Gear",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/Easy-Reverse-gear_Red.webp",
                    description: "Patented reverse gear in hand."
                },
                {
                    title: "Twin Locable Glovebox",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/Twin-Locable-Glovebox_Red.webp",
                    description: "Easy storage of day to day usables."
                },
                {
                    title: "Music System",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/Music-System_Red.webp",
                    description: "Play music on the go. Bluetooth | FM | MP3."
                }
            ],
            safety: [
                {
                    title: "Chasis mounted bumper",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/Chassis-mounted-bumper_Red.webp",
                    description: "Gives you confidence on any envrionment."
                },
                {
                    title: "Stylish Bright twin Headlamps",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Deluxe/Web/Features/Stylish-Bright-Twin-Headlamps-latest_Red.webp",
                    description: "Safe driving at night."
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
                ["Starting", "Electric and Hand Start"],
                ["Engine Displacement", "199.26 cc"],
                ["Maximum Power", "7.5 Kw @ rpm 5500"],
                ["Maximum Torque", "15.5 Nm @ 3250 rpm"],
                ["Transmission", "4 Forward and 1 Reverse speed Constant Mesh Fork and Cam type Shift mechanism"],
                ["Ignition System", "DC Digital TCI"]
            ],
            chassisSuspension: [
                ["Chassis Type", "Semi Monocoque"],
                ["Front", "Trailing Arm Type"],
                ["Rear", "Coil Spring with Co-Axial Hydraulic Damper"]
            ],
            electricals: [
                ["Battery", "12V, 32 Ah"],
                ["Head Lamp", "12 V, 35/35W*2, Twin head lamp"],
                ["Tail Lamp, Stop Lamp", "12 V, 21/5W*2"],
                ["Turn Signal Lamp", "12 V, 10 W*4"],
                ["Reverse Lamp", "12 V,21 W*1"]
            ],
            dimensionWeight: [
                ["Wheelbase", "1985 mm"],
                ["Wheel Track", "1150 mm"],
                ["Overall Length", "2647 mm"],
                ["Overall Width", "1329 mm"],
                ["Overall Height", "1740 mm"],
                ["Fuel Tank Capacity", "10 litre (Petrol)"],
                ["Kerb Weight", "347 kg"],
                ["Ground Clearance", "194mm (Unladen) /165 mm (Laden)"]
            ],
            wheelsBrakes: [
                ["Rim size - Front & Rear", '3.00 D x 8"'],
                ["Tyre size - Front & Rear", '4.00 – 8, 6 PR'],
                ["Brakes (Front & Rear)", 'Drum, Hydraulic & Automatic Adjuster Type']
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
            performance: [
                {
                    title: "Powerful 200cc TVS King engine",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/engine.webp",
                    description: "Stronger | Fuel efficiency | Longer life."
                }
            ],
            convenience: [
                {
                    title: "King Size Driver seat & Back seat",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/king-size-seat.webp",
                    description: "More comfort to the driver & Passenger."
                },
                {
                    title: "Tubeless Tyre",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/tubeless_tyre.webp",
                    description: "Tubeless Tyre with coloured rim."
                },
                {
                    title: "Larger Foldable Mirror",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/foldable_mirror.webp",
                    description: "Extra wide visibility."
                },
                {
                    title: "30 Litre/5Kg CNG Tank",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/cng-tank.webp",
                    description: "Business Full day with one full tank."
                },
                {
                    title: "New Trendy Tail Lamp",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/tail-lamp.webp",
                    description: "Thick bezel & pleasant jewel-type light pattern."
                },
                {
                    title: "New bolder grill & bezel",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/bolderbazel.webp",
                    description: "Study look."
                }
            ],
            safety: [
                {
                    title: "Thickest in-class canopy",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/canopy.webp",
                    description: "Longer lofe 20% extra thickness."
                },
                {
                    title: "Brighter Headlamps",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King-Delux-Plus-CNG/Features/headlamp.webp",
                    description: "Safe driving at night."
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
                ["Engine Type", "4 Stroke,Air Cooled,Single cylinder SI Engine"],
                ["Engine Displacement", "199.26 cc"],
                ["Maximum Power", "6.3 Kw @ 5500 rpm"],
                ["Maximum Torque", "13 Nm @ 3250 rpm"],
                ["Starting", "Electric Start/ Hand Start"],
                ["Ignition System", "DC Digital TCI"],
                ["Megneto", "12V, 65W @1000rpm & 155 w @2000 rpm"],
                ["Transmission", "4 Forward and 1 Reverse speed"]
            ],
            chassisSuspension: [
                ["Chassis Type", "Semi Monocoque"],
                ["Front", "Trailing Arm Type"],
                ["Rear", "Trailing Arm Type"]
            ],
            electricals: [
                ["Battery", "12V, 32 Ah"],
                ["Head Lamp", "12V,35/35Wx2"]
            ],
            dimensionWeight: [
                ["Wheelbase", "1990 mm"],
                ["Overall Length", "2647 mm"],
                ["Overall Width", "1329 mm"],
                ["Overall Height", "1740 mm"],
                ["Fuel Tank Capacity", "30 Litre CNG tank with 8 Litre petrol tank"],
                ["Kerb Weight", "405 kg"]
            ],
            wheelsBrakes: [
                ["Tyre size - Front & Rear", '4.00 – 8.76E 6PR'],
                ["Brakes (Front & Rear)", 'Drum, Hydraulic']
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
            performance: [
                {
                    title: "3 Stage air filtration",
                    category: "PERFOMANCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King_Kargo_225LC/Features/3-starge-air-filtration.webp",
                    description: "Enhances durability."
                }
            ],
            convenience: [
                {
                    title: "I-touch start",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King_Kargo_225LC/Features/1-Touch-Start.webp",
                    description: "Instant silent start."
                },
                {
                    title: "Easy Reverse gear",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King_Kargo_225LC/Features/Easy-reverse-gear.webp",
                    description: "Retented reverse gear in hand."
                },
                {
                    title: "Music Player",
                    category: "CONVENIENCE",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King_Kargo_225LC/Features/Music-player.webp",
                    description: "Music on the go."
                }
            ],
            safety: [
                {
                    title: "Larger Foldable Mirror",
                    category: "SAFETY",
                    image: "https://www.tvsmotor.com/tz/-/media/Feature/IB/Webp-Images/NewUI/Product/Non-premium/King_Kargo_225LC/Features/Large-foldable-mirror.webp",
                    description: "Extra wide visibility, Foldable & Sturdy."
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
                ["Engine Type", "4 Stroke, Liquid cooled, Single Cylinder"],
                ["Starting", "Electric (ISG) and Hand Start"],
                ["Engine Displacement", "225.8 cc"],
                ["Maximum Power", "7.8 kW(10 bhp) @ 4750 rpm"],
                ["Max Speed", "65 ± 2 km/h"],
                ["Maximum Torque", "18.5 Nm @ 3000 rpm"],
                ["Transmission", "Manual 4 Speed, 1 Reverse"]
            ],
            chassisSuspension: [
                ["Chassis Type", "Semi Monocoque"],
                ["Front", "Trailing Arm Type"],
                ["Rear", "Trailing Arm Type"]
            ],
            electricals: [
                ["Battery", "12V, 32 Ah"],
                ["Head Lamp", "35/35W, DC"],
                ["Tail Lamp, Stop Lamp", "21 W, 5W"],
                ["Turn Signal Lamp", "10 W"],
                ["Reverse Lamp", "21 W"]
            ],
            dimensionWeight: [
                ["Wheelbase", "1990 mm"],
                ["Wheel Track", "1150 mm"],
                ["Overall Length", "3010 mm"],
                ["Overall Width", "1350 mm"],
                ["Overall Height", "1720 mm"],
                ["Fuel Tank Capacity", "15 ± 0.5 litre (Petrol)"],
                ["Ground Clearance", "169 mm"],
                ["Kerb Weight with 90% fuel", "345 kg"]
            ],
            wheelsBrakes: [
                ["Rim size - Front & Rear", '3.00D x 8"'],
                ["Tyre size - Front & Rear", '4.00 – 8.76E 6PR'],
                ["Brakes (Front & Rear)", 'Drum, Hydraulic']
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

            card.addEventListener("click", () => {
                const specBtn = document.querySelectorAll('.main-spec-btn');
                const featureBtn = document.querySelectorAll('.main-feature-btn');

                featureBtn.forEach(button => button.classList.remove("active"));
                specBtn.forEach(button => button.classList.remove("active"));
                loadProduct(id)
            });
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

        if (navProduct) navProduct.textContent = product.name;
        if (selectedName) selectedName.textContent = product.name;

        renderHero(product.hero);
        render360(product);
        renderFeatures(product);
        renderColours(product);
        renderSpecifications(product);
        //renderSpares(product);
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
        const featureBtn = document.querySelectorAll('.main-feature-btn');
        const featureLayout = document.querySelector('.tvs-feature-layout');

        featureBtn.forEach(button =>{
            button.addEventListener('click', (e)=>{
                featureBtn.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                if(button.innerHTML === "Convenience"){
                    controls.innerHTML = "";
                    featureLayout.style.display = 'grid';

                        product.convenience.forEach((feature, index) => {
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

                if(button.innerHTML === "Perfomance"){
                    controls.innerHTML = ""
                    featureLayout.style.display = 'grid';

                        product.performance.forEach((feature, index) => {
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

                if(button.innerHTML === "Safety"){
                    controls.innerHTML = "";
                    featureLayout.style.display = 'grid';

                        product.safety.forEach((feature, index) => {
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
            });
        });

       controls.innerHTML = "";
       featureLayout.style.display = 'none';
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
        const specBtn = document.querySelectorAll('.main-spec-btn');

        specBtn.forEach(button =>{
            button.addEventListener('click', (e)=>{
                specBtn.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

            if(button.textContent.trim() === "Engine & Control"){
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

                if(button.textContent.trim() === "Chassis & Suspension"){
                    table.innerHTML = "";

                    product.chassisSuspension.forEach(spec => {
                    const row = document.createElement("div");
                    row.className = "tvs-spec-row";
                    row.innerHTML = `
                        <span>${spec[0]}</span>
                        <strong>${spec[1]}</strong>
                    `;
                    table.appendChild(row);
                    });
                }

                if(button.textContent.trim() === "Electricals"){
                    table.innerHTML = "";

                    product.electricals.forEach(spec => {
                    const row = document.createElement("div");
                    row.className = "tvs-spec-row";
                    row.innerHTML = `
                        <span>${spec[0]}</span>
                        <strong>${spec[1]}</strong>
                    `;
                    table.appendChild(row);
                    });
                }

                if(button.textContent.trim() === "Dimension & Weight"){
                    table.innerHTML = "";

                    product.dimensionWeight.forEach(spec => {
                    const row = document.createElement("div");
                    row.className = "tvs-spec-row";
                    row.innerHTML = `
                        <span>${spec[0]}</span>
                        <strong>${spec[1]}</strong>
                    `;
                    table.appendChild(row);
                    });
                }

                if(button.textContent.trim() === "Wheels & Brakes"){
                    table.innerHTML = "";

                    product.wheelsBrakes.forEach(spec => {
                    const row = document.createElement("div");
                    row.className = "tvs-spec-row";
                    row.innerHTML = `
                        <span>${spec[0]}</span>
                        <strong>${spec[1]}</strong>
                    `;
                    table.appendChild(row);
                    });
                }
            });
        });

        table.innerHTML = "";

        /*product.specifications.forEach(spec => {
            const row = document.createElement("div");
            row.className = "tvs-spec-row";
            row.innerHTML = `
                <span>${spec[0]}</span>
                <strong>${spec[1]}</strong>
            `;
            table.appendChild(row);
        });*/
    }

    /*          <button class="main-spec-btn active">Engine & Control</button>
                <button class="main-spec-btn">Chassis & Suspension</button>
                <button class="main-spec-btn">Electricals</button>
                <button class="main-spec-btn">Dimension & Weight</button>
                <button class="main-spec-btn">Wheels & Brakes</button> */
    /* =====================================================
       SPARE PARTS
    ===================================================== */

    /*function renderSpares(product) {
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
    }*/

    /* =====================================================
       YOU MAY ALSO LIKE
    ===================================================== */
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

        card.addEventListener("click", () => {
            const specBtn = document.querySelectorAll('.main-spec-btn');
            const featureBtn = document.querySelectorAll('.main-feature-btn');

            featureBtn.forEach(button => button.classList.remove("active"));
            specBtn.forEach(button => button.classList.remove("active"));
            loadProduct(id)
        });

        slider.appendChild(card);
    });

    /*
       Start automatic sliding after the cards
       have been rendered.
    */
    startRelatedAutoSlide();
}


/* =====================================================
   RELATED PRODUCTS - AUTOMATIC SLIDER
===================================================== */

let relatedAutoSlide = null;

function startRelatedAutoSlide() {

    const slider = document.querySelector("#tvsRelatedSlider");

    if (!slider) return;

    if (relatedAutoSlide) {
        cancelAnimationFrame(relatedAutoSlide);
    }

    let lastTime = 0;

    function move(timestamp) {

        if (!lastTime) {
            lastTime = timestamp;
        }

        const elapsed = timestamp - lastTime;

        if (!relatedPaused && elapsed >= 20) {

            slider.scrollLeft += 1;

            lastTime = timestamp;
        }

        if (
            slider.scrollLeft + slider.clientWidth >=
            slider.scrollWidth - 2
        ) {
            slider.scrollLeft = 0;
        }

        relatedAutoSlide = requestAnimationFrame(move);
    }

    relatedAutoSlide = requestAnimationFrame(move);
}


/* =====================================================
   PAUSE WHILE HOVERING
===================================================== */

const relatedSlider = document.querySelector("#tvsRelatedSlider");

let relatedPaused = false;

if (relatedSlider) {

    relatedSlider.addEventListener("mouseenter", () => {
        relatedPaused = true;
    });

    relatedSlider.addEventListener("mouseleave", () => {
        relatedPaused = false;
    });
}


/* =====================================================
   MANUAL PREVIOUS BUTTON
===================================================== */

document.querySelector("#tvsRelatedPrev").addEventListener("click", () => {
    relatedPaused = true;
    const slider = document.querySelector("#tvsRelatedSlider");

    slider.scrollBy({
        left: -350,
        behavior: "smooth"
    });
});


/* =====================================================
   MANUAL NEXT BUTTON
===================================================== */

document.querySelector("#tvsRelatedNext").addEventListener("click", () => {
    relatedPaused = true;
    const slider = document.querySelector("#tvsRelatedSlider");

    slider.scrollBy({
        left: 350,
        behavior: "smooth"
    });
});

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

/*==============request quote form================== */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('quoteModal');
  const closeModalBtn = document.getElementById('closeQuoteModal');
  
  // Select all quote buttons strictly by class
  const quoteButtons = document.querySelectorAll('.request-quote-btn');

  quoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Find the parent product-row of the clicked button
      const productRow = btn.closest('.product-row');
      
      if (productRow) {
        const title = productRow.querySelector('.product-title')?.innerText || 'Product Quote';
        const imgSrc = productRow.querySelector('.product-image img')?.src || '';

        // Update modal display elements
        document.getElementById('modalProductTitle').innerText = title;
        document.getElementById('modalProductImg').src = imgSrc;

        // Set hidden form fields for email submission
        document.getElementById('hiddenProductTitle').value = title;
        document.getElementById('hiddenProductImg').value = imgSrc;
      }

      // Display the modal
      modal.classList.add('active');
    });
  });

  // Close modal when clicking the X button
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close modal when clicking outside the card overlay
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

//==============PRODUCT PAGE ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const allContainers = document.querySelectorAll('.product-display, .products-home-container');

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = btn.dataset.target || btn.getAttribute('href')?.replace('#', '');
      
      // 1. Hide all containers
      allContainers.forEach(el => el.classList.remove('active'));

      // 2. Show selected container & re-trigger simple CSS animation
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        void targetEl.offsetWidth; // force browser repaint
        targetEl.classList.add('active');
      }
    });
  });
});

//===============SEARCH. BAR
// 1. Define your searchable site index
// Add all products, categories, or sections you want users to find
const searchIndex = [
  { name: "Kirloskar", type: "Products", targetId: "kirloskar-section" },
  { name: "Cummins", type: "Products", targetId: "cummins-section" },
  { name: "Ingesoll", type: "Products", targetId: "ingesoll-section" },
  { name: "MRF Tyres", type: "Products", targetId: "mrf-section" },
  { name: "Briggs & Stratton", type: "Products", targetId: "briggs-section" },
  { name: "Air Compressors", type: "Kirloskar", targetId: "air-compressors" },
  { name: "Gas Systems", type: "Kirloskar", targetId: "gas" },
  { name: "Refrigeration Compressors", type: "Kirloskar", targetId: "refrigeration" },
  { name: "Chillers", type: "Kirloskar", targetId: "chillers" },
  { name: "Heat Pumps", type: "Kirloskar", targetId: "heat-pump" },
  { name: "Gas Generators", type: "Kirloskar", targetId: "gas-gen" },
  { name: "Wheel Loaders", type: "Cummins", targetId: "wheel-loaders" },
  { name: "Excavators", type: "Cummins", targetId: "excavators" },
  { name: "Attachments", type: "Cummins", targetId: "" },
  { name: "Lawn Mowers", type: "Briggs & Stratton", targetId: "lawn-mower" },
  { name: "Briggs & Stratton Gensets", type: "Briggs & Stratton", targetId: "genset" },
  { name: "Brush Cutters", type: "Briggs & Stratton", targetId: "other-products" },
  { name: "Water Pumps", type: "Briggs & Stratton", targetId: "other-products" },
  { name: "Cummins Genset", type: "Cummins", targetId: "power-gen" },
  { name: "Cummins Engines", type: "Cummins", targetId: "engines" },
  { name: "Ingersoll Air Compressors", type: "Ingersoll", targetId: "ingersoll-air" },
  { name: "Ingersoll Power Tools", type: "Ingersoll", targetId: "Power Tools" },
  { name: "Dryers", type: "Ingersoll", targetId: "dryers" },
  { name: "Compressors", type: "Compair", targetId: "compair-air" },
  { name: "Two Wheeler Tyres", type: "MRF Tyres", targetId: "2w-tyres" },
  { name: "Two Wheeler Tyres", type: "MRF Tyres", targetId: "3w-tyres" }
];

//=====SEARCH BAR
/*document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchInput || !searchResults) return;

    function clearSearch() {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.classList.remove('active');
  }
  // 2. Real-time typing listener ('input' fires on every keystroke)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    // Clear dropdown if query is empty
    if (query.length === 0) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('active');
      return;
    }

    // Filter array based on match
    const matches = searchIndex.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );

    // Render filtered results
    renderResults(matches);
  });

  // 3. Render items into the dropdown
  function renderResults(matches) {
    searchResults.innerHTML = '';

    if (matches.length === 0) {
      searchResults.innerHTML = '<li class="no-results">No products found</li>';
      searchResults.classList.add('active');
      return;
    }

    matches.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-target="${item.targetId}">${item.name}</a> <small style="color:#888;">(${item.type})</small>`;
      
      // Store target ID on the element
      li.dataset.dataTarget = item.targetId;
        
      // 4. Click event to handle navigation
      li.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents page reload from <a> tag
        
        handleNavigation(item.targetId, item.name);
        
        // Clear input text and close dropdown
        clearSearch();
      });

      searchResults.appendChild(li);
    });

    searchResults.classList.add('active');
  }

  // Close dropdown if user clicks anywhere outside the search container
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchResults.classList.remove('active');;
    }
  });
});*/
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchInput || !searchResults) return;

  // Function to completely reset and clear the search bar UI
  function clearSearch() {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.classList.remove('active');
  }

  // Real-time typing listener
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query.length === 0) {
      clearSearch();
      return;
    }

    const matches = searchIndex.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );

    renderResults(matches);
  });

  // Render items into the dropdown
  function renderResults(matches) {
    searchResults.innerHTML = '';

    if (matches.length === 0) {
      searchResults.innerHTML = '<li class="no-results">No products found</li>';
      searchResults.classList.add('active');
      return;
    }

    matches.forEach(item => {
      const li = document.createElement('li');
      // Added href="#" and preventDefault handling so empty href doesn't reload page
      li.innerHTML = `<a href="#" data-target="${item.targetId}">${item.name}</a> <small style="color:#888;">(${item.type})</small>`;
      
      li.dataset.targetId = item.targetId;
        
      li.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents page reload from <a> tag
        
        handleNavigation(item.targetId, item.name);
        
        // Clear input text and close dropdown
        clearSearch();
      });

      searchResults.appendChild(li);
    });

    searchResults.classList.add('active');
  }

  // Global Click Listener: Ensure any global data-target clicks or outside clicks clear the input
  document.addEventListener('click', (e) => {
    // If the clicked element is any link with a data-target, clear the search bar
    if (e.target.closest('[data-target]')) {
      clearSearch();
    }

    // Close dropdown if user clicks anywhere outside the search container
    if (!e.target.closest('.search-container')) {
      searchResults.classList.remove('active');
    }
  });
});