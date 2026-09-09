
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

    const tvsPage =
        document.querySelector("#tvsProductPage");

    if (!tvsPage) return;


    /* =====================================================
       HERO SLIDER
    ====================================================== */

    const heroSlides =
        tvsPage.querySelectorAll(".tvs-hero-slide");

    const heroDots =
        tvsPage.querySelectorAll(".tvs-hero-dots button");

    const nextHero =
        tvsPage.querySelector(".tvs-next");

    const prevHero =
        tvsPage.querySelector(".tvs-prev");

    let currentHero = 0;

    let heroTimer;


    function showHero(index) {

        currentHero =
            (index + heroSlides.length)
            % heroSlides.length;

        heroSlides.forEach((slide, i) => {

            slide.classList.toggle(
                "active",
                i === currentHero
            );

        });


        heroDots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentHero
            );

        });

    }


    function startHeroTimer() {

        clearInterval(heroTimer);

        heroTimer = setInterval(() => {

            showHero(currentHero + 1);

        }, 6000);

    }


    nextHero.addEventListener("click", () => {

        showHero(currentHero + 1);

        startHeroTimer();

    });


    prevHero.addEventListener("click", () => {

        showHero(currentHero - 1);

        startHeroTimer();

    });


    heroDots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showHero(index);

            startHeroTimer();

        });

    });


    startHeroTimer();


    /* =====================================================
       SMOOTH NAVIGATION
    ====================================================== */

    tvsPage
        .querySelectorAll(".tvs-anchor-nav a")
        .forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );

                if (!target) return;

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =====================================================
       360 DEGREE VIEWER
    ====================================================== */

    const viewer =
        tvsPage.querySelector(".tvs-360-viewer");

    const viewerImage =
        tvsPage.querySelector("#tvs360Image");

    const frameCount = 20;

    const framePath =
        "assets/tvs/raider/360/frame-";


    const frames = [];

    let currentFrame = 0;

    let startX = 0;

    let isDragging = false;


    /*
        PRELOAD FRAMES
    */

    viewer.classList.add("loading");


    for (let i = 1; i <= frameCount; i++) {

        const image = new Image();

        const frameNumber =
            String(i).padStart(2, "0");

        image.src =
            `${framePath}${frameNumber}.webp`;

        frames.push(image);

    }


    Promise.all(
        frames.map(image => {

            return new Promise(resolve => {

                image.onload = resolve;

                image.onerror = resolve;

            });

        })
    ).then(() => {

        viewer.classList.remove("loading");

    });


    function showFrame(frame) {

        currentFrame =
            (frame + frameCount)
            % frameCount;

        const image =
            frames[currentFrame];

        if (image && image.complete) {

            viewerImage.src = image.src;

        }

    }


    function startDrag(x) {

        isDragging = true;

        startX = x;

    }


    function moveDrag(x) {

        if (!isDragging) return;

        const difference =
            x - startX;

        /*
            Adjust sensitivity here.

            Smaller number =
            motorcycle rotates faster.

        */

        const sensitivity = 7;

        if (Math.abs(difference) >= sensitivity) {

            if (difference > 0) {

                showFrame(currentFrame - 1);

            } else {

                showFrame(currentFrame + 1);

            }

            startX = x;

        }

    }


    function stopDrag() {

        isDragging = false;

    }


    /* MOUSE */

    viewer.addEventListener(
        "mousedown",
        event => {

            startDrag(event.clientX);

        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            moveDrag(event.clientX);

        }
    );


    window.addEventListener(
        "mouseup",
        stopDrag
    );


    /* TOUCH */

    viewer.addEventListener(
        "touchstart",
        event => {

            startDrag(
                event.touches[0].clientX
            );

        },
        { passive: true }
    );


    viewer.addEventListener(
        "touchmove",
        event => {

            moveDrag(
                event.touches[0].clientX
            );

        },
        { passive: true }
    );


    viewer.addEventListener(
        "touchend",
        stopDrag
    );


    /* =====================================================
       FEATURES
    ====================================================== */

    const features = [

        {
            title: "Stylish Design",

            category: "CONVENIENCE",

            image:
                "assets/tvs/raider/features/convinience-1.png",

            description:
                "Built to satisfy all your motocycle needs."
        },

        {
            title: "Ecothrust Engine",

            category: "PERFOMANCE",

            image:
                "assets/tvs/raider/features/engine.png",

            description:
                "Durable engine that gives more power and more trips per fill"
        },

        {
            title: "Superior Rear Suspension",

            category: "SAFETY",

            image:
                "assets/tvs/raider/features/safety-1.png",

            description:
                "Hydraulic shocks for a comfortable ride even at higher loads."
        }

    ];


    const featureImage =
        tvsPage.querySelector("#tvsFeatureImage");

    const featureTitle =
        tvsPage.querySelector("#tvsFeatureTitle");

    const featureDescription =
        tvsPage.querySelector("#tvsFeatureDescription");

    const featureCategory =
        tvsPage.querySelector(".tvs-feature-category");

    const featureButtons =
        tvsPage.querySelectorAll(".tvs-feature-btn");

    const featureNumber =
        tvsPage.querySelector(".tvs-feature-number");


    featureButtons.forEach(button => {

        button.addEventListener("click", () => {

            const index =
                Number(button.dataset.feature);

            const feature =
                features[index];

            featureButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");


            featureImage.style.opacity = "0";


            setTimeout(() => {

                featureImage.src =
                    feature.image;

                featureTitle.textContent =
                    feature.title;

                featureDescription.textContent =
                    feature.description;

                featureCategory.textContent =
                    feature.category;

                featureNumber.textContent =
                    String(index + 1)
                    .padStart(2, "0");

                featureImage.style.opacity = "1";

            }, 220);

        });

    });


    /* =====================================================
       COLOUR SELECTOR
    ====================================================== */

    const colourButtons =
        tvsPage.querySelectorAll(
            ".tvs-colour-option"
        );

    const colourImage =
        tvsPage.querySelector("#tvsColourImage");

    const colourName =
        tvsPage.querySelector("#tvsColourName");


    colourButtons.forEach(button => {

        button.addEventListener("click", () => {

            const image =
                button.dataset.image;

            const name =
                button.dataset.name;


            colourButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");


            colourImage.classList.add(
                "tvs-colour-changing"
            );


            setTimeout(() => {

                colourImage.src = image;

                colourName.textContent =
                    name;

                colourImage.classList.remove(
                    "tvs-colour-changing"
                );

            }, 250);

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const animatedElements =
        tvsPage.querySelectorAll(
            ".tvs-section-heading, " +
            ".tvs-feature-showcase, " +
            ".tvs-colour-showcase, " +
            ".tvs-spec-card, " +
            ".tvs-spare-card"
        );


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "tvs-visible"
                        );

                    }

                });

            },
            {
                threshold: .12
            }
        );


    animatedElements.forEach(element => {

        revealObserver.observe(element);

    });


    /* =====================================================
       HERO IMAGE PARALLAX
    ====================================================== */

    const hero =
        tvsPage.querySelector(".tvs-hero");


    hero.addEventListener(
        "mousemove",
        event => {

            const rect =
                hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left)
                / rect.width
                - .5;

            const y =
                (event.clientY - rect.top)
                / rect.height
                - .5;


            const activeImage =
                tvsPage.querySelector(
                    ".tvs-hero-slide.active img"
                );


            if (!activeImage) return;


            activeImage.style.transform =
                `translate(${x * 12}px, ${y * 8}px) scale(1.02)`;

        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {

            const activeImage =
                tvsPage.querySelector(
                    ".tvs-hero-slide.active img"
                );

            if (!activeImage) return;

            activeImage.style.transform =
                "translate(0,0) scale(1)";

        }
    );


});