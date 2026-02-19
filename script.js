/**
 * ====================================================================
 * PREMIUM WEDDING INVITATION WEBSITE - JAVASCRIPT
 * Interactive Features and Animations for Sindhuja & Naresh Wedding
 * ====================================================================
 */

/* ==================== 1. GLOBAL VARIABLES ==================== */
const weddingDate = new Date("February 21, 2026 03:32:00").getTime();
let isPlaying = false;
let lastScrollTop = 0;

/* ==================== 2. DOM CONTENT LOADED ==================== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCountdown();
    initScrollAnimations();
    initNavigation();
    initParticles();
    initPetals();
    initSmoothScroll();
    initLazyLoading();
});

/* ==================== 3. COUNTDOWN TIMER ==================== */
function initCountdown() {
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM elements
        updateCountdownElement('days', days, 365);
        updateCountdownElement('hours', hours, 24);
        updateCountdownElement('minutes', minutes, 60);
        updateCountdownElement('seconds', seconds, 60);

        // Check if countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            displayWeddingMessage();
        }
    }, 1000);
}

function updateCountdownElement(id, value, max) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value.toString().padStart(2, '0');
        
        // Update circular progress
        const parent = element.closest('.countdown-box');
        if (parent) {
            const progressCircle = parent.querySelector('.countdown-progress');
            if (progressCircle) {
                const circumference = 2 * Math.PI * 45; // radius = 45
                const progress = (value / max) * circumference;
                const offset = circumference - progress;
                progressCircle.style.strokeDashoffset = offset;
            }
        }
    }
}

function displayWeddingMessage() {
    const countdownWrapper = document.querySelector('.countdown-wrapper');
    if (countdownWrapper) {
        countdownWrapper.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center;">
                <h2 style="font-family: var(--font-display); color: var(--primary-maroon); font-size: 3rem; margin-bottom: 1rem;">
                    🎉 The Wedding Day is Here! 🎉
                </h2>
                <p style="font-size: 1.3rem; color: var(--text-light);">
                    Celebrating the union of Sindhuja & Naresh
                </p>
            </div>
        `;
    }
}

/* ==================== 4. SCROLL ANIMATIONS ==================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Add stagger effect for multiple elements
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children).filter(
                        child => child.classList.contains('reveal-on-scroll')
                    );
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all elements with reveal-on-scroll class
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });
}

/* ==================== 5. NAVIGATION FUNCTIONALITY ==================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar hide/show on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('hidden');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Active link highlighting
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Call once on load
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ==================== 6. SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty or just "#" links
            if (href === '#' || href === '') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==================== 7. MUSIC CONTROL ==================== */
function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');
    const musicIcon = document.getElementById('musicIcon');
    
    if (!bgMusic) return;
    
    if (isPlaying) {
        bgMusic.pause();
        musicControl.classList.remove('playing');
        musicIcon.className = 'fas fa-music';
    } else {
        // Play music
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    musicControl.classList.add('playing');
                    musicIcon.className = 'fas fa-pause';
                })
                .catch(error => {
                    console.log('Music autoplay prevented:', error);
                    // Show a message to user if needed
                });
        }
    }
    
    isPlaying = !isPlaying;
}

/* ==================== 8. DIVINE PARTICLES ANIMATION ==================== */
function initParticles() {
    const particleContainer = document.getElementById('divineParticles');
    if (!particleContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'divine-particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
}

/* ==================== 9. FLOWER PETALS ANIMATION ==================== */
function initPetals() {
    const petalsContainer = document.getElementById('flowerPetals');
    if (!petalsContainer) return;
    
    const petalCount = 25;
    
    for (let i = 0; i < petalCount; i++) {
        createPetal(petalsContainer);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Random properties
    const size = Math.random() * 10 + 8;
    const startX = Math.random() * 100;
    const duration = Math.random() * 5 + 8;
    const delay = Math.random() * 10;
    
    // Random colors - shades of pink and red
    const colors = [
        'linear-gradient(135deg, #FFB6C1, #FF69B4)',
        'linear-gradient(135deg, #FFC0CB, #FFB6C1)',
        'linear-gradient(135deg, #FFE4E1, #FFC0CB)',
        'linear-gradient(135deg, #FF1493, #C71585)'
    ];
    
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${startX}%`;
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;
    
    container.appendChild(petal);
}

/* ==================== 10. LAZY LOADING IMAGES ==================== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ==================== 11. GALLERY LIGHTBOX ==================== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            openLightbox(imgSrc);
        });
    });
}

function openLightbox(imageSrc) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="Gallery Image">
        </div>
    `;
    
    // Add styles dynamically
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    
    // Trigger animation
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Close functionality
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => closeLightbox(lightbox));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function closeLightbox(lightbox) {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        document.body.removeChild(lightbox);
    }, 300);
}

/* ==================== 12. FORM VALIDATION (IF RSVP ADDED) ==================== */
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showError(input, 'This field is required');
        } else {
            input.classList.remove('error');
            hideError(input);
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Please enter a valid email');
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(input.value.replace(/[\s-]/g, ''))) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Please enter a valid phone number');
            }
        }
    });
    
    return isValid;
}

function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
}

function hideError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

/* ==================== 13. PARALLAX EFFECTS ==================== */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* ==================== 14. COPY TO CLIPBOARD ==================== */
function copyToClipboard(text, button) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        
        document.body.removeChild(textArea);
    }
}

function showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
}

/* ==================== 15. PRELOADER (OPTIONAL) ==================== */
function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
}

/* ==================== 16. SHARE FUNCTIONALITY ==================== */
function shareInvitation(platform) {
    const url = window.location.href;
    const title = 'Sindhuja & Naresh Wedding Invitation';
    const text = 'You are cordially invited to celebrate our wedding on February 21, 2026';
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else if (platform === 'native' && navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(err => console.log('Share failed:', err));
    }
}

/* ==================== 17. DETECT MOBILE DEVICE ==================== */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/* ==================== 18. SAVE THE DATE TO CALENDAR ==================== */
function addToCalendar() {
    const event = {
        title: 'Sindhuja & Naresh Wedding',
        description: 'Wedding Ceremony - Muhurtham at 3:32 AM',
        location: 'Thurpu Thanda, Enugal, Warangal, Telangana',
        start: new Date('February 21, 2026 03:32:00'),
        end: new Date('February 21, 2026 23:59:59')
    };
    
    // Format dates for calendar
    const startDate = formatDateForCalendar(event.start);
    const endDate = formatDateForCalendar(event.end);
    
    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
}

function formatDateForCalendar(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/* ==================== 19. PERFORMANCE OPTIMIZATION ==================== */
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ==================== 20. ACCESSIBILITY ENHANCEMENTS ==================== */
function initAccessibility() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Add custom keyboard shortcuts if needed
        if (e.key === 'm' && e.ctrlKey) {
            e.preventDefault();
            toggleMusic();
        }
    });
    
    // Add focus indicators for keyboard navigation
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--secondary-gold)';
            this.style.outlineOffset = '4px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
}

/* ==================== 21. ERROR HANDLING ==================== */
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You can add custom error handling here
});

/* ==================== 22. CONSOLE WELCOME MESSAGE ==================== */
console.log('%c👰 Welcome to Sindhuja & Naresh Wedding Invitation 🤵', 'color: #DAA520; font-size: 20px; font-weight: bold;');
console.log('%cWe are delighted to have you here!', 'color: #8B0000; font-size: 14px;');
console.log('%cWedding Date: February 21, 2026', 'color: #666; font-size: 12px;');

/* ==================== 23. EXPORT FUNCTIONS (IF NEEDED) ==================== */
// Make functions available globally if needed
window.weddingApp = {
    toggleMusic,
    shareInvitation,
    addToCalendar,
    copyToClipboard
};

/* ==================== 24. ADDITIONAL ENHANCEMENTS ==================== */

// Auto-play music on user interaction (respecting autoplay policies)
let hasInteracted = false;
function enableAutoMusic() {
    if (!hasInteracted) {
        hasInteracted = true;
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic && !isPlaying) {
            // Don't auto-play, let user control
            // bgMusic.play().catch(() => {});
        }
    }
}

document.addEventListener('click', enableAutoMusic, { once: true });
document.addEventListener('touchstart', enableAutoMusic, { once: true });

// Initialize gallery lightbox
initGalleryLightbox();

// Initialize accessibility features
initAccessibility();

// Initialize parallax effects if elements exist
if (document.querySelector('[data-parallax]')) {
    initParallax();
}

// Initialize preloader if it exists
if (document.getElementById('preloader')) {
    initPreloader();
}

/* ==================== END OF SCRIPT ==================== */
