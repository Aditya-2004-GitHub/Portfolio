// Document Ready and Initial Setup
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    setupTypewriterEffect();
    setupScrollAnimations();
    setupNavigation();
    setupContactForm();
    setupProgressBars();
    setupNavbarScroll();
    setupCardHoverEffects();
    setupMouseTracking();
    addDynamicStyles();
}

// Fixed Typewriter Effect
function setupTypewriterEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const texts = ['Full Stack Developer', 'Web Developer', 'Software Engineer', 'Angular Expert'];
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentText = texts[currentTextIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 75;
        } else {
            typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(type, typeSpeed);
    }

    // Start immediately
    type();
}

// Fixed Smooth Scrolling Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Global scroll to section function - Fixed
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const navbarHeight = 80;
        const offsetTop = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Update active nav link immediately
        setTimeout(() => {
            updateActiveNavLink();
        }, 100);
    }
}

// Scroll Animations with Intersection Observer
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Progress Bar Animations
function setupProgressBars() {
    const skillCards = document.querySelectorAll('.skill-card');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                const targetWidth = progressFill.getAttribute('data-width');

                setTimeout(() => {
                    progressFill.style.width = targetWidth + '%';
                }, 500);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillCards.forEach(card => {
        observer.observe(card);
    });
}

// Fixed Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', debounce(function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.boxShadow = 'none';
        }

        updateActiveNavLink();
        lastScrollTop = scrollTop;
    }, 10));
}

// Fixed Update Active Navigation Link
function updateActiveNavLink() {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = 'home';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = sectionId;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Fixed Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('query');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');

    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', clearError);
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', clearError);
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', clearError);

    function clearError(e) {
        const input = e.target;
        input.classList.remove('error');
        const errorId = input.id + 'Error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            hideError(errorElement);
        }
    }

    // Form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameValid = validateName();
        const emailValid = validateEmail();
        const messageValid = validateMessage();

        if (nameValid && emailValid && messageValid) {
            submitForm();
        } else {
            // Shake the form to indicate error
            contactForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                contactForm.style.animation = '';
            }, 500);
        }
    });

    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');

        if (name.length < 2) {
            showError(errorElement, 'Name must be at least 2 characters long');
            nameInput.classList.add('error');
            return false;
        }

        hideError(errorElement);
        nameInput.classList.remove('error');
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showError(errorElement, 'Email is required');
            emailInput.classList.add('error');
            return false;
        }

        if (!emailRegex.test(email)) {
            showError(errorElement, 'Please enter a valid email address');
            emailInput.classList.add('error');
            return false;
        }

        hideError(errorElement);
        emailInput.classList.remove('error');
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const errorElement = document.getElementById('messageError');

        if (message.length < 10) {
            showError(errorElement, 'Message must be at least 10 characters long');
            messageInput.classList.add('error');
            return false;
        }

        hideError(errorElement);
        messageInput.classList.remove('error');
        return true;
    }

    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.animation = 'fadeInError 0.3s ease';
    }

    function hideError(errorElement) {
        errorElement.style.display = 'none';
    }

    function submitForm() {
        buttonText.classList.add('hidden');
        buttonLoading.classList.remove('hidden');
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            query: messageInput.value.trim()
        };

        fetch("https://portfolio-n5zs.onrender.com/send-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.text();
            })
            .then(() => {
                contactForm.reset();
                showSuccessMessage();
            })
            .catch((err) => {
                alert("Failed to send message: " + err.message);
            })
            .finally(() => {
                buttonText.classList.remove('hidden');
                buttonLoading.classList.add('hidden');
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            });
    }


    function showSuccessMessage() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: rgba(0, 212, 255, 0.9);
                color: white;
                padding: 3rem;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                margin: 2rem;
                animation: scaleIn 0.3s ease;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✉️</div>
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Message Sent Successfully!</h3>
                <p style="margin-bottom: 0;">Thank you for reaching out. I'll get back to you soon.</p>
            </div>
        `;

        document.body.appendChild(overlay);

        // Close on click
        overlay.addEventListener('click', function () {
            overlay.remove();
        });

        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 4000);
    }
}

// Enhanced Card Hover Effects
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        });
    });

    // Enhanced project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth Mouse Tracking for Cards
function setupMouseTracking() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInError {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .form-control.error {
            border-color: #ff4444 !important;
            box-shadow: 0 0 20px rgba(255, 68, 68, 0.3) !important;
        }
        
        .form-error {
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            display: none;
        }
        
        .nav-link.active {
            color: #00d4ff !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
        
        /* Enhanced button animations */
        .btn {
            position: relative;
            z-index: 1;
        }
        
        .btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            z-index: -1;
            transform: translateX(-100%);
            transition: transform 0.6s;
        }
        
        .btn:hover::after {
            transform: translateX(100%);
        }
        
        /* Project card enhancements */
        .project-card-inner {
            transition: transform 0.6s ease;
        }
        
        .project-card:hover .project-card-inner {
            transform: rotateY(180deg);
        }
        
        /* Mobile responsiveness fixes */
        @media (max-width: 768px) {
            .floating-card {
                display: none;
            }
            
            .hero-visual {
                display: none;
            }
            
            .hero-container {
                grid-template-columns: 1fr !important;
                text-align: center;
            }
            
            .nav-menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Utility function for debouncing scroll events
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

// Loading animation for the page
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        // Close any open modals or overlays
        const overlay = document.querySelector('div[style*="position: fixed"][style*="z-index: 10000"]');
        if (overlay) {
            overlay.remove();
        }
    }
});

// Enhanced accessibility
function setupAccessibility() {
    // Add skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: fixed;
        top: -100px;
        left: 0;
        background: #00d4ff;
        color: white;
        padding: 1rem;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', function () {
        this.style.top = '0';
        this.classList.remove('sr-only');
    });

    skipLink.addEventListener('blur', function () {
        this.style.top = '-100px';
        this.classList.add('sr-only');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn, index) => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent || `Button ${index + 1}`);
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', setupAccessibility);

// mongodb+srv://adityahedau293:Aditya123@cluster0.kdbgd.mongodb.net/ClinicWorld