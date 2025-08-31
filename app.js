
// Import UI functions
import { setupMobileMenu, showPage, updatePasswordStrength, showModal, hideModal, toggleMobileMenu } from './ui.js';

// Import Firebase/Auth functions
import { initFirebase, registerUser, loginUser, logoutUser, forgotPassword, populateDashboard, updateNavigationState, checkNavigationState } from './firebase.js';

// This is the main entry point for your application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Initialize the connection to Firebase first!
        await initFirebase();
        
        // 2. Set up all the UI event listeners
        setupMobileMenu();
        
        // 3. Show the default page
        showPage('home');
        
        // 4. Force update navigation state after DOM is loaded
        setTimeout(() => {
            console.log('DOM loaded, forcing navigation state update...');
            updateNavigationState();
            checkNavigationState();
            
            // Force a second check after a longer delay to ensure everything is loaded
            setTimeout(() => {
                console.log('Second check after DOM load...');
                checkNavigationState();
            }, 1000);
        }, 500);
        
        // 5. Set up periodic navigation state checks (but only if needed)
        let lastAuthState = null;
        setInterval(() => {
            // We need to access auth from the firebase module
            // This will be handled by the auth state change listener in firebase.js
        }, 5000); // Check every 5 seconds, but only update if state changed
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showModal('error', 'Failed to initialize application. Please refresh the page.');
    }
});

// Make the functions your HTML needs globally available
window.showPage = showPage;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.forgotPassword = forgotPassword;
window.updatePasswordStrength = updatePasswordStrength;
window.hideModal = hideModal;
window.showModal = showModal;
window.toggleMobileMenu = toggleMobileMenu;
window.populateDashboard = populateDashboard;