console.log('Willkommen im Tibetan Momo Restaurant!'); 

// Utility function for mobile detection
function isMobile() {
    const width = window.innerWidth;
    const mobile = width <= 768;
    return mobile;
}

// Load navbar into all pages
async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const navbarHtml = await response.text();
        
        if (!navbarHtml || navbarHtml.trim() === '') {
            throw new Error('Navbar HTML is empty');
        }
        
        // Find the navbar placeholder or create one
        let navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) {
            // If no placeholder exists, insert navbar at the beginning of body
            const body = document.body;
            const firstChild = body.firstChild;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = navbarHtml;
            const navbar = tempDiv.firstElementChild;
            if (navbar) {
                body.insertBefore(navbar, firstChild);
            }
        } else {
            // Replace the container div with the actual navbar
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = navbarHtml;
            const navbar = tempDiv.firstElementChild;
            if (navbar && navbarContainer.parentNode) {
                navbarContainer.parentNode.replaceChild(navbar, navbarContainer);
            }
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
        // Show visible error in development
        const container = document.getElementById('navbar-container');
        if (container) {
            container.innerHTML = '<p style="color: red; padding: 1rem;">Error loading navbar. Please check console for details.</p>';
        }
    }
}

// Load footer into all pages
async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const footerHtml = await response.text();
        
        if (!footerHtml || footerHtml.trim() === '') {
            throw new Error('Footer HTML is empty');
        }
        
        // Find the footer placeholder or create one
        let footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            // If no placeholder exists, insert footer before the closing body tag
            const body = document.body;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = footerHtml;
            const footer = tempDiv.firstElementChild;
            if (footer) {
                body.appendChild(footer);
            }
        } else {
            // Replace the container div with the actual footer
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = footerHtml;
            const footer = tempDiv.firstElementChild;
            if (footer && footerContainer.parentNode) {
                footerContainer.parentNode.replaceChild(footer, footerContainer);
            }
        }
    } catch (error) {
        console.error('Error loading footer:', error);
        // Show visible error in development
        const container = document.getElementById('footer-container');
        if (container) {
            container.innerHTML = '<p style="color: red; padding: 1rem;">Error loading footer. Please check console for details.</p>';
        }
    }
}

// Smooth scroll to anchors
function initSmoothScroll() {
    // Handle both #anchor and page.html#anchor links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Extract the hash part (e.g., #about from index.html#about or just #about)
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return; // No hash found
            
            const hash = href.substring(hashIndex);
            if (hash === '#' || hash.length <= 1) return; // Invalid hash
            
            // Get current page path (e.g., /index.html or /impressum.html)
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';
            
            // Extract page from href (e.g., index.html from index.html#about)
            const hrefBeforeHash = href.substring(0, hashIndex);
            const hrefPage = hrefBeforeHash || 'index.html';
            
            // Check if it's a same-page anchor
            const isSamePage = hrefPage === currentPage || (hrefPage === '' && currentPage === 'index.html');
            
            if (isSamePage) {
                // Same page - smooth scroll
                e.preventDefault();
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // If cross-page, let the browser handle navigation normally
        });
    });
}

// Handle logo click - smooth scroll to top on same page
function initLogoScroll() {
    const logoLink = document.querySelector('.logo a[href="index.html"]');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';
            
            // If already on index.html, smooth scroll to top
            if (currentPage === 'index.html') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            // If on another page, let the browser navigate normally
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded on:', window.location.pathname);
    
    // Initialize components
    new CookieConsent();
    initSmoothScroll();
    initLogoScroll();
    
    // Handle smooth scroll on page load if there's a hash in the URL
    if (window.location.hash) {
        const hash = window.location.hash;
        const target = document.querySelector(hash);
        if (target) {
            // Small delay to ensure page is fully rendered
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
    
    // Load navbar and footer
    console.log('Loading navbar and footer...');
    Promise.all([loadNavbar(), loadFooter()]).then(() => {
        console.log('Navbar and footer loaded successfully');
        // Re-initialize smooth scroll for dynamically loaded navbar links
        initSmoothScroll();
        initLogoScroll();
        
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-links a');
        const body = document.body;

        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        body.appendChild(overlay);


        // Toggle menu function (only works on mobile)
        function toggleMenu() {
            if (!isMobile()) return; // Don't toggle on desktop
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }

        // Toggle menu on hamburger click (only on mobile)
        if (hamburger) {
            hamburger.addEventListener('click', toggleMenu);
        }

        // Close menu when clicking a link (only on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile()) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside (only on mobile)
        overlay.addEventListener('click', () => {
            if (isMobile()) {
                toggleMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (!isMobile() && navMenu.classList.contains('active')) {
                // Close mobile menu when switching to desktop
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
});

// Auto-update copyright year
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.cookieName = 'tibetan_momo_cookie_consent';
        this.cookieExpiryDays = 365;
        this.popup = document.getElementById('cookie-consent');
        this.acceptBtn = document.getElementById('accept-cookies');
        this.rejectBtn = document.getElementById('reject-cookies');
        
        this.init();
    }

    init() {
        // Check if user has already made a choice
        if (!this.hasConsent()) {
            this.showPopup();
        }
        
        // Add event listeners
        this.acceptBtn.addEventListener('click', () => this.acceptCookies());
        this.rejectBtn.addEventListener('click', () => this.rejectCookies());
    }

    hasConsent() {
        return this.getCookie(this.cookieName) !== null;
    }

    showPopup() {
        // Small delay to ensure smooth animation
        setTimeout(() => {
            this.popup.classList.add('show');
        }, 1000);
    }

    hidePopup() {
        this.popup.classList.remove('show');
    }

    acceptCookies() {
        this.setCookie(this.cookieName, 'accepted', this.cookieExpiryDays);
        this.hidePopup();
        this.loadAnalytics();
    }

    rejectCookies() {
        this.setCookie(this.cookieName, 'rejected', this.cookieExpiryDays);
        this.hidePopup();
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    loadAnalytics() {
        // Placeholder for analytics loading
        // You can add Google Analytics, Facebook Pixel, or other tracking scripts here
        console.log('Analytics would be loaded here');
    }
}

