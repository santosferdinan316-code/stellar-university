// Mobile Navigation Toggle
function toggleMobileMenu() {
    console.log('toggleMobileMenu called!');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileMenu.classList.contains('hidden')) {
        console.log('Opening mobile menu');
        mobileMenu.classList.remove('hidden');
        mobileMenuToggle.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        `;
    } else {
        console.log('Closing mobile menu');
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;
    }
}

// Enhanced mobile touch handling
function addMobileTouchHandling() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        // Remove existing event listeners
        mobileMenuToggle.replaceWith(mobileMenuToggle.cloneNode(true));
        const newToggle = document.getElementById('mobile-menu-toggle');
        
        // Add multiple event types for maximum compatibility
        newToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Touch start detected');
            toggleMobileMenu();
        }, { passive: false });
        
        newToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Touch end detected');
        }, { passive: false });
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Click detected');
            toggleMobileMenu();
        });
        
        // Add pointer events for modern browsers
        newToggle.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Pointer down detected');
            toggleMobileMenu();
        }, { passive: false });
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuToggle.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            `;
        }
    });
    
    // Initialize enhanced mobile touch handling
    addMobileTouchHandling();
}

// Custom Modal Logic
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');

function showModal(type, message) {
    modalTitle.textContent = type === 'success' ? 'Success!' : 'Error!';
    modalTitle.classList.remove('text-red-600', 'text-green-600');
    modalTitle.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');
    modalMessage.textContent = message;
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
}

function hideModal() {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
}

// Page Navigation Logic
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
    const activePage = document.getElementById(`${pageId}-page`);
    if (activePage) {
        activePage.classList.remove('hidden');
    }
    
    // If navigating to dashboard, populate it with user data
    if (pageId === 'dashboard') {
        // Add a small delay to ensure Firebase is ready and elements are loaded
        setTimeout(() => {
            if (window.populateDashboard) {
                window.populateDashboard();
            }
        }, 100);
    }
}

// Password Strength Meter Logic
function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');
    let score = 0;
    let text = "Too short";
    let color = "bg-red-500"; // Use Tailwind bg colors

    if (password.length >= 8) {
        score++;
        text = "Weak";
        color = "bg-orange-500";
    }
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        score++;
    }
    if (password.match(/[0-9]/)) {
        score++;
    }
    if (password.match(/[^a-zA-Z0-9]/)) {
        score++;
    }

    // Update text and color based on score
    if (score >= 3) {
        text = "Strong";
        color = "bg-green-500";
    } else if (score >= 2) {
        text = "Medium";
        color = "bg-yellow-500";
    }

    const width = (score / 4) * 100;
    strengthBar.style.width = `${width}%`;
    // Remove old color classes and add the new one
    strengthBar.classList.remove('bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500');
    if (password.length > 0) {
         strengthBar.classList.add(color);
    }
    strengthText.textContent = text;
}

// Export functions for use in other modules
export {
    toggleMobileMenu,
    setupMobileMenu,
    showModal,
    hideModal,
    showPage,
    updatePasswordStrength
};