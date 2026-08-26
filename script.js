// 1. Instantly clear any hash (#) from the address bar without reloading
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
}

// 2. Force scroll restoration to manual and force viewport to top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
});

let slideIntervalTimer = null;

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

//DATA DISPLAY FOR CARGEN PRODUCTS
const products = [
  {
    name: "Kirloskar Chillers",
    description: "Kirloskar Chillers has been a leading player in the HVAC&R space for the last 20 years. We provide the reliability, the operating efficiency and the responsive after-sales support that has always been associated with the Kirloskar name.",
    image1:"https://www.kirloskarchillers.com/o/kirloskar-common-theme/images/round.png",
    image2:"https://th.bing.com/th/id/OIP.D3xTsTQ262xjc5O7Svk_6gHaEK?w=327&h=184&c=7&r=0&o=7&pid=1.7&rm=3",
    image3:"https://th.bing.com/th/id/OIP.ryo75zHrUtsaWYGwVOhBUwHaFH?w=195&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
    logo:"./products_logos/kirloscar_chillers.png",
    sectionId: "kirloskar-section",
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Cummins Power Generation",
    description: "Protect your home and belongings with our reliable home insurance policy.",
    image1:"https://www.cummins.com/sites/default/files/styles/scroll_jack_image/public/2024-11/Connect%20Series%20Liquid%20Cooled%2080-150kW%20Home%20Generator%20Photoshoot%20Columbus%20IN%2037407.jpg?h=43ae4763&itok=Y9aJNA9n",
    image2:"https://www.cummins.com/sites/default/files/styles/large/public/2024-11/AdobeStock_103000711.jpeg?itok=M8riyrRz",
    image3:"https://www.cummins.com/sites/default/files/styles/hero_feature/public/2023-11/generator-hero.webp?h=d1cb525d&itok=8pmN878H",
    logo:"./products_logos/cumminspower.png",
    sectionId: "cummins-section",
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Ingersoll Rand",
    description: "High-performance engines for various industrial applications.",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/ingersoll.png",
    sectionId: "ingersoll-section",
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Develon",
    description: "Durable construction and excavation equipment for your projects.",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/develonlogo.png",
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Valvoline",
    description: "High-quality lubricants for your vehicle's engine.",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/valvoline.png",
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Briggs & Stratton",
    description: "Reliable lawn mowers and outdoor equipment for your garden.",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/briggslogo.png.webp",
    type1:"",
    type2:"",
    type3:"",
  },
    {
    name: "MRF",
    description: "Original, Durable Tyres for your Car, 3-Wheeler and 2-Wheeler",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/mrflogo.png",
    type1:"",
    type2:"",
    type3:"",
  }

];

const all = document.getElementById('all');
const productSection = document.getElementById('product-section');

//A FUNCTION TO DISPLAY PRODUCTS BASED ON THE NAME PASSED
/*function displayProducts(name) {
    // Clear any running slideshow timer before opening a new product
  if (slideIntervalTimer) {
    clearInterval(slideIntervalTimer);
  }
  all.style.display = 'none'; // Hide the main content
  productSection.style.display = 'block'; // Show the product section 
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant'
  }); 
  const product = products.find(p => p.name === name);
  if (product) {
    productSection.innerHTML = `
           <!-- Dynamic Background Slideshow -->
        <div class="bg-slideshow">
            <div class="bg-slide active" style="background-image: url('${product.image1}');"></div>
            <div class="bg-slide" style="background-image: url('${product.image2}');"></div>
            <div class="bg-slide" style="background-image: url('${product.image3}');"></div>
            
            <!-- Gradient overlay -->
            <!--<div class="bg-overlay"></div>-->
        </div>
    
        <div class="product-container">
            <div class="product-left">
                <button class="back-btn" id="backBtn">← Back to Home</button>
                <div class="product-header-animated">
                  <img src="${product.logo}" alt="Product Logo" class="product-logo">
                </div>
            </div>
        </div>

        <!-- CUMMINS SOLUTIONS & PRODUCTS SECTION -->
<section class="cummins-section" id="cummins-section" style="display: none">
  <div class="cummins-container">
    
    <!-- HEADER -->
    <header class="cummins-header">
      <span class="cummins-badge">ALWAYS ON • ALWAYS POWERING</span>
      <h2 class="cummins-title">Cummins Power & Maintenance Solutions</h2>
      <p class="cummins-subtitle">
        Delivering world-class power generation, heavy-duty engines, filtration science, and premium lubrication backed by global service excellence.
      </p>
    </header>

    <!-- PRODUCT & SERVICE CARDS GRID -->
    <div class="cummins-grid">
      
      <!-- CARD 1: CUMMINS ENGINES -->
      <article class="cummins-card">
        <div class="card-image-wrap">
          <img src="https://www.cummins.com/sites/default/files/styles/product_display/public/2025-02/b72-product-da.png" alt="Cummins Heavy-Duty Engine" class="card-img" />
          <span class="card-category">Powertrain</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">Cummins Engines</h3>
          <p class="card-description">
            Engineered for high reliability, maximum uptime, and unmatched thermal efficiency across highway, off-highway, agricultural, and industrial applications.
          </p>
          <ul class="card-features">
            <li>Advanced fuel injection & combustion systems</li>
            <li>Optimized power-to-weight performance</li>
            <li>Compliant with stringent global emission standards</li>
          </ul>
        </div>
      </article>

      <!-- CARD 2: POWER GENERATION -->
      <article class="cummins-card">
        <div class="card-image-wrap">
          <img src="https://cdn.ade-power.com/assets/img/generators/cummins/33kva-38kva-cummins-silent-diesel-generator-cummins-c33d5-c38d5.jpg" alt="Cummins Power Generation Generator Set" class="card-img" />
          <span class="card-category">Power Systems</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">Cummins Power Generation</h3>
          <p class="card-description">
            Fully integrated power systems including diesel & gas generator sets, automatic transfer switches, and digital controls for standby and prime power needs.
          </p>
          <ul class="card-features">
            <li>Seamless integration from 10 kVA to 3750 kVA</li>
            <li>Single-source manufacturing for engine & alternator</li>
            <li>Instant emergency power backup systems</li>
          </ul>
        </div>
      </article>

      <!-- CARD 3: FLEETGUARD FILTRATION -->
      <article class="cummins-card">
        <div class="card-image-wrap">
          <img src="https://cdn11.bigcommerce.com/s-hc30m/images/stencil/1280x1280/products/3258/16295/LF17475__49306.1767628362.jpg" alt="Fleetguard Heavy Duty Filter" class="card-img" />
          <span class="card-category">Filtration</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">Fleetguard Filtration</h3>
          <p class="card-description">
            Advanced air, lube, fuel, and hydraulic filtration systems designed specifically to safeguard equipment components and lower Total Cost of Ownership (TCO).
          </p>
          <ul class="card-features">
            <li>Patented NanoNet® media technology</li>
            <li>Superior contaminant retention efficiency</li>
            <li>Extended drain interval protection</li>
          </ul>
        </div>
      </article>

      <!-- CARD 4: VALVOLINE LUBRICANTS -->
      <article class="cummins-card">
        <div class="card-image-wrap">
          <img src="https://www.valvolineglobal.com/497878/globalassets/vcom/product%20detail%20pages/heavy%20duty/us_818289_val_prem_blue_8600_10w30_1gal.png" alt="Valvoline Premium Blue Engine Oil" class="card-img" />
          <span class="card-category">Lubrication</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">Valvoline™ Premium Blue</h3>
          <p class="card-description">
            The exclusive heavy-duty engine oil endorsed and co-developed with Cummins to maximize engine life, reduce oil consumption, and ensure thermal stability.
          </p>
          <ul class="card-features">
            <li>Officially approved for Cummins engines</li>
            <li>Enhanced wear protection & soot control</li>
            <li>Extends maintenance & oil drain intervals</li>
          </ul>
        </div>
      </article>

    </div>

    <!-- AFTER SALES & SERVICE BANNER -->
    <div class="cummins-banner">
      <div class="banner-image">
        <img src="https://www.cummins.com/sites/default/files/styles/scroll_jack_image/public/2025-06/diesel-technician.jpg" alt="Cummins Certified Technician Service" />
      </div>
      <div class="banner-info">
        <span class="banner-tag">SUPPORT & MAINTENANCE</span>
        <h3 class="banner-heading">After Sales & Global Service</h3>
        <p class="banner-text">
          Maximize equipment uptime with certified field engineers, genuine OEM replacement parts, and 24/7 technical assistance through our global service network.
        </p>
        <div class="banner-stats">
          <div class="stat-item">
            <span class="stat-num">500+</span>
            <span class="stat-lbl">Global Distributors</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">190+</span>
            <span class="stat-lbl">Countries Served</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">24/7</span>
            <span class="stat-lbl">Cummins Care Support</span>
          </div>
        </div>
        <a href="#contact" class="cummins-btn">Request Support</a>
      </div>
    </div>

  </div>
</section>
    `;

    // ---SLIDESHOW & BACK BUTTON LOGIC ---
    const slides = productSection.querySelectorAll('.bg-slide');
    let currentSlide = 0;

    if (slides.length > 1) {
      slideIntervalTimer = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 3000);
    }

    // Fixed Back Button (hides product section & shows main content)
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (slideIntervalTimer) clearInterval(slideIntervalTimer);
        productSection.style.display = 'none';
        all.style.display = 'block';
      });
    }
  }
}*/
function displayProducts(name) {
  if (slideIntervalTimer) clearInterval(slideIntervalTimer);

  const product = products.find(p => p.name === name);
  if (!product) return;

  // 1. Toggle main views
  all.style.display = 'none';
  productSection.style.display = 'block';
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // 2. Set header logo
  const logoImg = document.getElementById('product-logo-img');
  if (logoImg) logoImg.src = product.logo;

  // 3. Hide ALL unique sections first
  document.querySelectorAll('.product-detail-section').forEach(sec => {
    sec.style.display = 'none';
  });

  // 4. Show ONLY the clicked product's section
  if (product.sectionId) {
    const targetSection = document.getElementById(product.sectionId);
    if (targetSection) targetSection.style.display = 'block';
  }
}

// Universal click listener (No long arrays or repeat code needed)
document.addEventListener('click', (e) => {
  // Check if clicked element (or parent link) has a data-product attribute
  const trigger = e.target.closest('[data-product]');
  if (trigger) {
    e.preventDefault();
    const productName = trigger.getAttribute('data-product');
    displayProducts(productName);
  }
});

// Shared Back Button Listener
const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (slideIntervalTimer) clearInterval(slideIntervalTimer);
    productSection.style.display = 'none';
    all.style.display = 'block';
  });
}

// Event listener for product buttons
const kirloskarBtn = document.getElementById('kirloskar');
if (kirloskarBtn) {
  kirloskarBtn.addEventListener('click', () => {
    displayProducts('Kirloskar Chillers');
  });

}

const cumminsSection = document.getElementById('cummins-section');
const cumminsBtn = document.getElementById('cummins');
if (cumminsBtn) {
  cumminsBtn.addEventListener('click', () => {
    displayProducts('Cummins Power Generation');
  });
}

const ingersollRandBtn = document.getElementById('ingersoll');
if (ingersollRandBtn) {
  ingersollRandBtn.addEventListener('click', () => {
    displayProducts('Ingersoll Rand');
  });
}

const develonBtn = document.getElementById('develon');
if (develonBtn) {
  develonBtn.addEventListener('click', () => {
    displayProducts('Develon');
  });
}

const valvolineBtn = document.getElementById('valvoline');
if (valvolineBtn) {
  valvolineBtn.addEventListener('click', () => {
    displayProducts('Valvoline');
  });
}

const briggsAndStrattonBtn = document.getElementById('briggs');
if (briggsAndStrattonBtn) {
  briggsAndStrattonBtn.addEventListener('click', () => {
    displayProducts('Briggs & Stratton');
  });
}
const mrfBtn = document.getElementById('mrf');
if (mrfBtn) {
  mrfBtn.addEventListener('click', () => {
    displayProducts('MRF')
  })
}

// Dropdown Nav Product Click Handlers
const productNavs = [
    { id: 'nav-kirloskar', name: 'Kirloskar Chillers' },
    { id: 'nav-cummins', name: 'Cummins Power Generation' },
    { id: 'nav-ingersoll', name: 'Ingersoll Rand' },
    { id: 'nav-develon', name: 'Develon' },
    { id: 'nav-valvoline', name: 'Valvoline' },
    { id: 'nav-briggs', name: 'Briggs & Stratton' },
    { id: 'nav-mrf', name: 'MRF' }
];

productNavs.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            displayProducts(item.name);
        });
    }
});

//PRODUCT SECTION LOGIC
