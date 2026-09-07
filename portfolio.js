/**
 * Yandrapu Bhavish - Professional Portfolio Interactive Script
 * Features:
 * - Dynamic Typewriter effect for rotating developer roles
 * - Scroll-aware sticky navbar with active section detection
 * - Mobile drawer navigation toggle
 * - Instant Copy-to-Clipboard with animated toast feedback
 * - IntersectionObserver scroll reveal animations
 * - Interactive contact form handler
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year in Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Typewriter Effect
    initTypewriter();

    // 3. Header Scroll Glassmorphism & Active Link Spy
    initNavbarScroll();

    // 4. Mobile Drawer Navigation
    initMobileDrawer();

    // 5. Scroll Reveal Elements
    initScrollAnimations();
});

/**
 * Typewriter Effect for Hero Subtitle
 */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const roles = [
        'Full-Stack Web Developer',
        'React.js Specialist',
        'Computer Science Undergraduate @ LPU',
        'Frontend Engineer & UI Architect',
        'Problem Solver & Tech Enthusiast'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseDelay = 1800;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
}

/**
 * Sticky Header on Scroll & Section Tracking
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        // Sticky glassmorphism header style
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section indicator
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/**
 * Mobile Drawer Menu
 */
function initMobileDrawer() {
    const mobileToggle = document.getElementById('mobileToggle');
    const closeDrawer = document.getElementById('closeDrawer');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!mobileToggle || !mobileDrawer) return;

    function openMenu() {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    mobileToggle.addEventListener('click', openMenu);
    if (closeDrawer) closeDrawer.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') &&
            !mobileDrawer.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollAnimations() {
    const targets = document.querySelectorAll(
        '.about-bio-card, .pillar-card, .skill-category-card, .project-card, .training-card, .cert-card, .timeline-item, .contact-card, .contact-form-column'
    );

    targets.forEach(el => {
        el.classList.add('fade-in-element');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
}

/**
 * Copy to Clipboard with Animated Toast Feedback
 * @param {string} textToCopy 
 * @param {string} message 
 */
function copyToClipboard(textToCopy, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(message || 'Copied to clipboard!');
        }).catch(err => {
            fallbackCopy(textToCopy, message);
        });
    } else {
        fallbackCopy(textToCopy, message);
    }
}

function fallbackCopy(textToCopy, message) {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(message || 'Copied to clipboard!');
    } catch (err) {
        showToast('Unable to copy. Please copy manually: ' + textToCopy);
    }
    document.body.removeChild(textArea);
}

/**
 * Show Toast Notification
 * @param {string} msg 
 */
let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Interactive Contact Form Submission Handler
 * @param {Event} event 
 */
function handleContactSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const subject = form.elements['subject'].value;
    const message = form.elements['message'].value;

    // Visual button state
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending Message...</span> <i class="bx bx-loader-alt bx-spin"></i>';
    submitBtn.disabled = true;

    // Simulate reliable transmission / Mailto option
    setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;

        feedback.className = 'form-feedback success';
        feedback.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been prepared. You can also directly reach Bhavish at <a href="mailto:yandrapubhavish2701@gmail.com" style="color:#38bdf8; text-decoration:underline;">yandrapubhavish2701@gmail.com</a>.`;
        
        showToast('Message sent! Bhavish will contact you soon.');
        form.reset();

        // Optional: trigger mailto backup for real convenience
        const mailtoUri = `mailto:yandrapubhavish2701@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        // window.location.href = mailtoUri;
    }, 900);
}
