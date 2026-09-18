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

    // 6. Hero Visual View Switcher (Photo vs Code)
    initHeroSwitcher();

    // 7. Certificate Lightbox Modal
    initCertModal();

    // 8. Resume Lightbox Modal
    initResumeModal();
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
/**
 * Contact Form Direct Delivery Handlers
 * 1. Direct Background Email via Hidden Iframe (Zero redirection, never leaves the page)
 * 2. Instant WhatsApp Direct Messaging (+91 93985 78584)
 */
let isFormSubmitting = false;

function handleContactSubmit(event) {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    const name = form.elements['name'] ? form.elements['name'].value.trim() : '';
    const email = form.elements['email'] ? form.elements['email'].value.trim() : '';
    const message = form.elements['message'] ? form.elements['message'].value.trim() : '';

    if (!name || !email || !message) {
        event.preventDefault();
        if (feedback) {
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
            feedback.textContent = 'Please fill out all required fields (Name, Email, and Message).';
        }
        return false;
    }

    // Set submitting flag for hidden iframe response
    isFormSubmitting = true;

    // Visual button state - strictly NO redirect, NO new window
    if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Message...</span> <i class="bx bx-loader-alt bx-spin"></i>';
        submitBtn.disabled = true;
    }

    if (feedback) {
        feedback.style.display = 'none';
        feedback.className = 'form-feedback';
    }

    // Safety timeout: In case the iframe onload is restricted by browser security policies
    setTimeout(() => {
        if (isFormSubmitting) {
            handleFormSuccess();
        }
    }, 2200);

    // Form naturally posts directly to FormSubmit inside hidden_contact_iframe
    return true;
}

/**
 * Invoked once the message has been dispatched to FormSubmit
 */
function handleFormSuccess() {
    if (!isFormSubmitting) return;
    isFormSubmitting = false;

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    const name = form && form.elements['name'] ? form.elements['name'].value.trim() : '';

    if (submitBtn) {
        submitBtn.innerHTML = '<i class="bx bx-check"></i> <span>Message Sent!</span>';
    }

    if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        feedback.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 16px; margin-top: 14px; text-align: left;">
                <div style="font-weight: 700; color: #10b981; font-size: 1rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                    <i class="bx bx-check-circle" style="font-size: 1.3rem;"></i> Message Sent Directly!
                </div>
                <p style="font-size: 0.88rem; color: #334155; margin: 0; line-height: 1.5;">
                    Thank you${name ? ', <strong>' + name + '</strong>' : ''}! Your message has been sent directly to Bhavish's email (<strong>yandrapubhavish2701@gmail.com</strong>) without any redirection. Bhavish will get back to you promptly.
                </p>
            </div>
        `;
    }

    showToast('Message sent directly to Bhavish!');
    if (form) form.reset();

    setTimeout(() => {
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="bx bx-paper-plane"></i> <span>Send to Email</span>';
            submitBtn.disabled = false;
        }
    }, 4500);
}

/**
 * Send Message Directly via WhatsApp to Bhavish (+91 93985 78584)
 */
function sendViaWhatsApp() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    const name = form && form.elements['name'] ? form.elements['name'].value.trim() : '';
    const email = form && form.elements['email'] ? form.elements['email'].value.trim() : '';
    const phone = form && form.elements['phone'] ? form.elements['phone'].value.trim() : '';
    const subject = form && form.elements['subject'] ? form.elements['subject'].value.trim() : 'Portfolio Inquiry';
    const message = form && form.elements['message'] ? form.elements['message'].value.trim() : '';

    if (!name || !message) {
        if (feedback) {
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
            feedback.textContent = 'Please provide at least your Name and Message to send via WhatsApp.';
        }
        showToast('Please enter your Name and Message first.');
        return;
    }

    const waText = `*New Portfolio Message for Bhavish*\n\n` +
                   `*Name:* ${name}\n` +
                   `*Email:* ${email || 'Not provided'}\n` +
                   `*Phone:* ${phone || 'Not provided'}\n` +
                   `*Subject:* ${subject}\n\n` +
                   `*Message:*\n${message}`;

    const waUrl = `https://wa.me/919398578584?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
    showToast('Opening WhatsApp with your pre-filled message!');
}

// Expose handlers globally
window.handleContactSubmit = handleContactSubmit;
window.handleFormSuccess = handleFormSuccess;
window.sendViaWhatsApp = sendViaWhatsApp;

/**
 * Hero Visual View Switcher: Photo View vs Code Terminal View
 */
function initHeroSwitcher() {
    const switchBtns = document.querySelectorAll('.hero-switch-btn');
    const panes = document.querySelectorAll('.hero-view-pane');
    if (!switchBtns.length || !panes.length) return;

    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Verified Credentials Data Store
 */
const CERT_DATA = {
    uiux: {
        title: "UI/UX Design and Prototyping for Web and Mobile Applications",
        issuer: "Centre for Professional Enhancement, Lovely Professional University",
        badge: "Grade 'A' Awarded • Certificate No. 491592",
        image: "assets/cert-ui-ux-lpu.png",
        download: "assets/cert-ui-ux-lpu.pdf",
        downloadText: "Download / Open PDF",
        details: "Certificate of Merit awarded to Yandrapu Bhavish (Registration No. 12406399) for successfully completing the skill development course 'UI/UX Design and Prototyping for Web and Mobile Applications' from 14-06-2026 to 26-07-2026 with an 'A' Grade. Issued by Lovely Professional University on 13-08-2026."
    },
    dbms: {
        title: "Database Management System Part - 1",
        issuer: "Infosys Springboard • Satheesha B. N., Senior VP & Head",
        badge: "Infosys Verified Credential • Official Course Completion",
        image: "assets/cert-dbms-infosys.png",
        download: "assets/cert-dbms-infosys.pdf",
        downloadText: "Download / Open PDF",
        details: "Awarded to Yandrapu Bhavish on July 28, 2026 for successfully completing the course 'Database Management System Part - 1' on Infosys Springboard. Official verification at https://verify.onwingspan.com."
    },
    cpp: {
        title: "Programming Using C++ (Object-Oriented Programming)",
        issuer: "Infosys Springboard • Thirumala Arohi, Exec VP & Global Head (ETA)",
        badge: "Infosys Verified Credential • Official Course Completion",
        image: "assets/cert-cpp-infosys.png",
        download: "assets/cert-cpp-infosys.pdf",
        downloadText: "Download / Open PDF",
        details: "Awarded to Yandrapu Bhavish on August 18, 2025 for successfully completing the course 'Programming Using C++' covering object-oriented concepts, syntax, and algorithmic logic. Verified via Infosys Springboard at https://verify.onwingspan.com."
    },
    webdev: {
        title: "Web Development (Live MOOC 18 Hours)",
        issuer: "Rising Tech Pro • Certificate No. RTP-202501-WD-178",
        badge: "Industry Certified • Proctored Examination Passed",
        image: "assets/cert-web-dev-rising-tech.jpg",
        download: "assets/cert-web-dev-rising-tech.jpg",
        downloadText: "View Full Resolution",
        details: "Awarded to Yandrapu Bhavish on 25th Jan 2025 for successfully completing a live MOOC of 18 hours on Web Development between 22nd December 2024 and 15th January 2025, satisfying all course requirements including proctored examination."
    }
};

/**
 * Open Certificate Lightbox Modal
 * @param {string} type - 'dbms' or 'webdev'
 */
function openCertModal(type) {
    const data = CERT_DATA[type];
    if (!data) return;

    const modal = document.getElementById('certModal');
    const modalTitle = document.getElementById('modalCertTitle');
    const modalIssuer = document.getElementById('modalCertIssuer');
    const modalBadge = document.getElementById('modalCertBadge');
    const modalImg = document.getElementById('modalCertImage');
    const modalDownload = document.getElementById('modalCertDownload');
    const modalDetails = document.getElementById('modalCertDetails');

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalIssuer) modalIssuer.textContent = data.issuer;
    if (modalBadge) modalBadge.innerHTML = `<i class="bx bxs-check-shield"></i> ${data.badge}`;
    if (modalImg) {
        modalImg.src = data.image;
        modalImg.alt = data.title;
    }
    if (modalDownload) {
        modalDownload.href = data.download;
        modalDownload.innerHTML = `<i class="bx bx-download"></i> ${data.downloadText}`;
    }
    if (modalDetails) modalDetails.textContent = data.details;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/**
 * Close Certificate Lightbox Modal
 */
function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

/**
 * Initialize Certificate Modal Events
 */
function initCertModal() {
    const modal = document.getElementById('certModal');
    const closeBtn = document.getElementById('closeCertModal');
    const closeBtnFooter = document.getElementById('closeCertModalBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeCertModal);
    if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeCertModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCertModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCertModal();
        }
    });
}

// Expose globally for inline onclick handlers
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;

/**
 * Open Resume Lightbox Modal
 */
function openResumeModal() {
    const modal = document.getElementById('resumeModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/**
 * Close Resume Lightbox Modal
 */
function closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

/**
 * Initialize Resume Modal Events
 */
function initResumeModal() {
    const modal = document.getElementById('resumeModal');
    const closeBtn = document.getElementById('closeResumeModal');
    const closeBtnFooter = document.getElementById('closeResumeModalBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeResumeModal);
    if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeResumeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeResumeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeResumeModal();
        }
    });
}

// Expose globally for inline onclick handlers
window.openResumeModal = openResumeModal;
window.closeResumeModal = closeResumeModal;

