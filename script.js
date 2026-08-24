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