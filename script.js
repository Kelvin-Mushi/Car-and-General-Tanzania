

window.addEventListener('beforeunload', () => {
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
    type1:"",
    type2:"",
    type3:"",
  },
  {
    name: "Cummins Power Generation",
    description: "Protect your home and belongings with our reliable home insurance policy.",
    image1:"",
    image2:"",
    image3:"",
    logo:"./products_logos/cumminspower.png",
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
function displayProducts(name) {
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
                <div class="product-header-animated">
                  <img src="${product.logo}" alt="Product Logo" class="product-logo">
                </div>
                <button class="back-btn" id="backBtn">← Back to Previous Page</button>
            </div>
        </div>
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
}


// Event listener for product buttons
const kirloskarBtn = document.getElementById('kirloskar');
if (kirloskarBtn) {
  kirloskarBtn.addEventListener('click', () => {
    displayProducts('Kirloskar Chillers');
  });
}

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
if (mrf) {
  mrfBtn.addEventListener('click', () => {
    displayProducts('MRF')
  })
}
