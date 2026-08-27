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

//nav links activation in any page
document.addEventListener('DOMContentLoaded', () => {

  // Function to show the main page (#all) and hide all product detail containers
  function showMainView() {
    // 1. Hide all individual product detail sections
    document.querySelectorAll('.product-detail-section').forEach(detail => {
      detail.style.display = 'none';
    });

    // 2. Hide the product view wrapper/container (holding the top logo & back button)
    // Adjust selector below if your wrapper uses a different class/id (e.g., #product-view-wrapper)
    const productWrapper = document.querySelector('.product-detail-container') || document.querySelector('#product-wrapper');
    if (productWrapper) {
      productWrapper.style.display = 'none';
    }

    // 3. Completely restore the main homepage container
    const mainContent = document.getElementById('all');
    if (mainContent) {
      mainContent.style.display = 'block';
    }
  }

  // 1. HANDLE DROPDOWN PRODUCT SELECTION
  document.querySelectorAll('.dropdown-menu a').forEach(productLink => {
    productLink.addEventListener('click', function(e) {
      e.preventDefault();

      // Show the product view wrapper if it was hidden
      const productWrapper = document.querySelector('.product-detail-container') || document.querySelector('#product-wrapper');
      if (productWrapper) {
        productWrapper.style.display = 'block';
      }

      // Hide the main page container while viewing a product
      const mainContent = document.getElementById('all');
      if (mainContent) {
        mainContent.style.display = 'none';
      }

      // Trigger your existing product switch function
      const productId = this.id;
      if (typeof showProductDetail === 'function') {
        showProductDetail(productId);
      }
    });
  });

  // 2. HANDLE MAIN NAVIGATION LINKS (Home, Dealer Locator, Testimonials, About Us)
  document.querySelectorAll('.nav-links > a:not(.dropdown-toggle)').forEach(mainLink => {
    mainLink.addEventListener('click', function(e) {
      const targetHash = this.getAttribute('href');

      // Reset view to main #all container
      showMainView();

      // Handle Home link click
      if (targetHash === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } 
      // Handle section scroll targets (#about-us, #dealer-locator, #testimonials)
      else if (targetHash.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Update active nav button class
      document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

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
    sectionId: "develon-section",
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Kubota",
    description: "High-quality lubricants for your vehicle's engine.",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/kubotalogo.svg.png",
    sectionId: "kubota-section",
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
    sectionId: "briggs-section",
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
    sectionId: "mrf-section",
    type1:"",
    type2:"",
    type3:"",
  }

];

const all = document.getElementById('all');
const productSection = document.getElementById('product-section');

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

const kubotaBtn = document.getElementById('kubota');
if (kubotaBtn) {
  kubotaBtn.addEventListener('click', () => {
    displayProducts('Kubota');
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
    { id: 'nav-kubota', name: 'Kubota' },
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
