import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
// ## ADD sendPasswordResetEmail ##
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, where, query, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showModal, showPage } from './ui.js';

// Firebase configuration remains the same
const firebaseConfig = {
    apiKey: "AIzaSyDiY6DtTQZdm6uHhNWWh6h3FsMwaBoJzKk",
    authDomain: "stellar-student-hub.firebaseapp.com",
    projectId: "stellar-student-hub",
    storageBucket: "stellar-student-hub.firebasestorage.app",
    messagingSenderId: "494604224449",
    appId: "1:494604224449:web:7ac5b154a7e514cf339140"
};
const appId = "stellar-student-hub";

let db, auth;

async function initFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            
            const logoutBtn = document.getElementById("logoutBtn");
            const loginLink = document.getElementById("loginLink");
            const dashboardLink = document.getElementById("dashboardLink");
            const registerLink = document.querySelector('a[onclick="showPage(\'registration\')"]');
            
            // Mobile navigation elements
            const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
            const mobileLoginLink = document.getElementById("mobileLoginLink");
            const mobileDashboardLink = document.getElementById("mobileDashboardLink");
            
            // Debug: Log all found elements
            console.log('Found elements:', {
                logoutBtn: logoutBtn,
                loginLink: loginLink,
                dashboardLink: dashboardLink,
                registerLink: registerLink,
                mobileLogoutBtn: mobileLogoutBtn,
                mobileLoginLink: mobileLoginLink,
                mobileDashboardLink: mobileDashboardLink
            });
            
            if (user) {
                console.log('User is logged in, updating navigation...');
                document.getElementById('user-id').innerText = 'User logged in';
                
                // Desktop navigation
                if (logoutBtn) logoutBtn.classList.remove('hidden');
                if (loginLink) loginLink.classList.add('hidden');
                if (dashboardLink) dashboardLink.classList.remove('hidden');
                if (registerLink) registerLink.classList.add('hidden');
                
                // Mobile navigation
                if (mobileLogoutBtn) {
                    mobileLogoutBtn.classList.remove('hidden');
                    mobileLogoutBtn.style.display = 'block';
                }
                if (mobileLoginLink) {
                    mobileLoginLink.classList.add('hidden');
                    mobileLoginLink.style.display = 'none';
                }
                if (mobileDashboardLink) {
                    mobileDashboardLink.classList.remove('hidden');
                    mobileDashboardLink.style.display = 'block';
                }
            } else {
                console.log('User is logged out, updating navigation...');
                document.getElementById('user-id').innerText = 'User not signed in';
                
                // Desktop navigation
                if (logoutBtn) logoutBtn.classList.add('hidden');
                if (loginLink) loginLink.classList.remove('hidden');
                if (dashboardLink) dashboardLink.classList.add('hidden');
                if (registerLink) registerLink.classList.remove('hidden');
                
                // Mobile navigation
                if (mobileLogoutBtn) {
                    mobileLogoutBtn.classList.add('hidden');
                    mobileLogoutBtn.style.display = 'none';
                }
                if (mobileLoginLink) {
                    mobileLoginLink.classList.remove('hidden');
                    mobileLoginLink.style.display = 'block';
                }
                if (mobileDashboardLink) {
                    mobileDashboardLink.classList.add('hidden');
                    mobileDashboardLink.style.display = 'none';
                }
            }
                         });
         
         // Update navigation state after Firebase auth is ready
         setTimeout(() => {
             console.log('Firebase auth ready, updating navigation state...');
             if (typeof updateNavigationState === 'function') {
                 updateNavigationState();
             }
             if (typeof checkNavigationState === 'function') {
                 checkNavigationState();
             }
         }, 200);
         
     } catch (error) {
         console.error("Firebase initialization failed:", error);
         showModal('error', `Firebase initialization failed: ${error.message}`);
     }
}

// Function to populate dashboard with user data
async function populateDashboard() {
    try {
        // Get current user from auth
        const currentUser = auth.currentUser;
        
        if (currentUser) {
            console.log("Current user:", currentUser.uid, currentUser.email);
            
            // Since users are stored by username in registration, we need to find the username first
            // Look for user by email in the users collection
            const usersRef = collection(db, `artifacts/${appId}/public/data/users`);
            const q = query(usersRef, where("email", "==", currentUser.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log("User data found:", userData);
                
                // Update dashboard fields
                document.getElementById('dashboard-name').textContent = userData.name || 'Not specified';
                document.getElementById('dashboard-major').textContent = userData.major || 'Not specified';
                document.getElementById('dashboard-year').textContent = userData.year || 'Not specified';
            } else {
                console.log("No user data found for email:", currentUser.email);
                // No user data found
                document.getElementById('dashboard-name').textContent = 'No data found';
                document.getElementById('dashboard-major').textContent = 'No data found';
                document.getElementById('dashboard-year').textContent = 'No data found';
            }
        } else {
            console.log("No authenticated user");
            // No authenticated user
            document.getElementById('dashboard-name').textContent = 'Not authenticated';
            document.getElementById('dashboard-major').textContent = 'Not authenticated';
            document.getElementById('dashboard-year').textContent = 'Not authenticated';
        }
    } catch (error) {
        console.error("Error populating dashboard:", error);
        document.getElementById('dashboard-name').textContent = 'Error loading data';
        document.getElementById('dashboard-major').textContent = 'Error loading data';
        document.getElementById('dashboard-year').textContent = 'Error loading data';
    }
}

// Function to manually update navigation state
function updateNavigationState() {
    const user = auth.currentUser;
    console.log('Manually updating navigation state for user:', user);
    
    const logoutBtn = document.getElementById("logoutBtn");
    const loginLink = document.getElementById("loginLink");
    const dashboardLink = document.getElementById("dashboardLink");
    const registerLink = document.querySelector('a[onclick="showPage(\'registration\')"]');
    
    // Mobile navigation elements
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    const mobileLoginLink = document.getElementById("mobileLoginLink");
    const mobileDashboardLink = document.getElementById("mobileDashboardLink");
    
    // Debug: Log all found elements
    console.log('Navigation elements found:', {
        logoutBtn: logoutBtn,
        loginLink: loginLink,
        dashboardLink: dashboardLink,
        registerLink: registerLink,
        mobileLogoutBtn: mobileLogoutBtn,
        mobileLoginLink: mobileLoginLink,
        mobileDashboardLink: mobileDashboardLink
    });
    
    if (user) {
        console.log('User is logged in, updating navigation...');
        document.getElementById('user-id').innerText = 'User logged in';
        
        // Desktop navigation
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (loginLink) loginLink.classList.add('hidden');
        if (dashboardLink) dashboardLink.classList.remove('hidden');
        if (registerLink) registerLink.classList.add('hidden');
        
        // Mobile navigation
        if (mobileLogoutBtn) {
            mobileLogoutBtn.classList.remove('hidden');
            mobileLogoutBtn.style.display = 'block';
        }
        if (mobileLoginLink) {
            mobileLoginLink.classList.add('hidden');
            mobileLoginLink.style.display = 'none';
        }
        if (mobileDashboardLink) {
            mobileDashboardLink.classList.remove('hidden');
            mobileDashboardLink.style.display = 'block';
        }
    } else {
        console.log('User is logged out, updating navigation...');
        document.getElementById('user-id').innerText = 'User not signed in';
        
        // Desktop navigation
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (loginLink) loginLink.classList.remove('hidden');
        if (dashboardLink) dashboardLink.classList.add('hidden');
        if (registerLink) registerLink.classList.remove('hidden');
        
        // Mobile navigation
        if (mobileLogoutBtn) {
            mobileLogoutBtn.classList.add('hidden');
            mobileLogoutBtn.style.display = 'none';
        }
        if (mobileLoginLink) {
            mobileLoginLink.classList.remove('hidden');
            mobileLoginLink.style.display = 'block';
        }
        if (mobileDashboardLink) {
            mobileDashboardLink.classList.add('hidden');
            mobileDashboardLink.style.display = 'none';
        }
    }
}

// Function to check and fix navigation state
function checkNavigationState() {
    console.log('Checking navigation state...');
    const user = auth.currentUser;
    
    // Get all navigation elements
    const logoutBtn = document.getElementById("logoutBtn");
    const loginLink = document.getElementById("loginLink");
    const dashboardLink = document.getElementById("dashboardLink");
    const registerLink = document.querySelector('a[onclick="showPage(\'registration\')"]');
    
    // Mobile navigation elements
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    const mobileLoginLink = document.getElementById("mobileLoginLink");
    const mobileDashboardLink = document.getElementById("mobileDashboardLink");
    
    if (user) {
        console.log('User is logged in, ensuring correct navigation state...');
        // Desktop navigation
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (loginLink) loginLink.classList.add('hidden');
        if (dashboardLink) dashboardLink.classList.remove('hidden');
        if (registerLink) registerLink.classList.add('hidden');
        
        // Mobile navigation
        if (mobileLogoutBtn) {
            mobileLogoutBtn.classList.remove('hidden');
            mobileLogoutBtn.style.display = 'block';
        }
        if (mobileLoginLink) {
            mobileLoginLink.classList.add('hidden');
            mobileLoginLink.style.display = 'none';
        }
        if (mobileDashboardLink) {
            mobileDashboardLink.classList.remove('hidden');
            mobileDashboardLink.style.display = 'block';
        }
    } else {
        console.log('User is logged out, ensuring correct navigation state...');
        // Desktop navigation
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (loginLink) loginLink.classList.remove('hidden');
        if (dashboardLink) dashboardLink.classList.add('hidden');
        if (registerLink) registerLink.classList.remove('hidden');
        
        // Mobile navigation - Force hide with both class and style
        if (mobileLogoutBtn) {
            mobileLogoutBtn.classList.add('hidden');
            mobileLogoutBtn.style.display = 'none';
            console.log('Forced mobile logout button to hide');
        }
        if (mobileLoginLink) {
            mobileLoginLink.classList.remove('hidden');
            mobileLoginLink.style.display = 'block';
        }
        if (mobileDashboardLink) {
            mobileDashboardLink.classList.add('hidden');
            mobileDashboardLink.style.display = 'none';
        }
    }
}

// Debug function to inspect current navigation state
function debugNavigationState() {
    console.log('=== DEBUG NAVIGATION STATE ===');
    const user = auth.currentUser;
    console.log('Current user:', user);
    
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    const mobileLoginLink = document.getElementById("mobileLoginLink");
    
    console.log('Mobile logout button:', mobileLogoutBtn);
    console.log('Mobile logout button classes:', mobileLogoutBtn ? mobileLogoutBtn.className : 'null');
    console.log('Mobile logout button hidden:', mobileLogoutBtn ? mobileLogoutBtn.classList.contains('hidden') : 'null');
    
    console.log('Mobile login link:', mobileLoginLink);
    console.log('Mobile login link classes:', mobileLoginLink ? mobileLoginLink.className : 'null');
    console.log('Mobile login link hidden:', mobileLoginLink ? mobileLoginLink.classList.contains('hidden') : 'null');
    
    console.log('=== END DEBUG ===');
}

async function registerUser(event) {
     event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const major = document.getElementById("major").value;
    const year = document.getElementById("year").value;

    if (!email || !password || !username || !name) {
        showModal('error', 'Please fill out all required fields.');
        return;
    }

    try {
        const userRef = doc(db, `artifacts/${appId}/public/data/users`, username);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            showModal('error', 'Username already exists. Please choose a different one.');
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, `artifacts/${appId}/public/data/users`, username), {
            name, email, username, major, year,
            uid: userCredential.user.uid,
            createdAt: new Date()
        });

        showModal('success', 'Registration successful! Redirecting to login...');
        setTimeout(() => showPage('login'), 1500);

    } catch (error) {
        console.error("Error during registration:", error);
        showModal('error', `Registration failed: ${error.message}`);
    }
}

async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        showModal('error', 'Please enter your username and password.');
        return;
    }

    try {
        const userRef = doc(db, `artifacts/${appId}/public/data/users`, username);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            showModal('error', 'Invalid username or password.');
            return;
        }

        const userData = docSnap.data();
        const email = userData.email;

        await signInWithEmailAndPassword(auth, email, password);

                         showModal('success', `Login successful! Welcome back, ${userData.name}.`);
         setTimeout(() => {
             hideModal();
             showPage('dashboard');
             // Update navigation state after successful login
             setTimeout(() => {
                 updateNavigationState();
                 checkNavigationState();
             }, 100);
         }, 1500);

    } catch (error) {
        console.error("Error during login:", error);
        showModal('error', `Login failed: Invalid username or password.`);
    }
}

async function logoutUser() {
    try {
        await signOut(auth);
        
        // Clear the login form fields
        const loginUsernameField = document.getElementById("login-username");
        const loginPasswordField = document.getElementById("login-password");
        
        if (loginUsernameField) {
            loginUsernameField.value = "";
        }
        if (loginPasswordField) {
            loginPasswordField.value = "";
        }
        
        showModal('success', 'You have been logged out.');
        showPage('login');
        // Update navigation state after logout
        setTimeout(() => {
            updateNavigationState();
            checkNavigationState();
        }, 100);
    } catch (error) {
        console.error("Error during logout:", error);
        showModal('error', `Logout failed: ${error.message}`);
    }
}

// ## NEW FORGOT PASSWORD FUNCTION ##
async function forgotPassword(event) {
    event.preventDefault();
    const email = prompt("Please enter your email address to reset your password:");
        
    if (!email) {
        showModal('error', 'Email address is required for password reset.');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showModal('success', 'Password reset email sent! Please check your inbox.');
    } catch (error) {
        console.error("Error sending password reset email:", error);
        showModal('error', `Could not send reset email: ${error.message}`);
    }
}

// Export functions for use in other modules
export {
    initFirebase,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    populateDashboard,
    updateNavigationState,
    checkNavigationState,
    debugNavigationState
};