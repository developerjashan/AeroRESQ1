document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const forgotPassword = document.getElementById('forgotPassword');
    const createAccount = document.getElementById('createAccount');

    // Function to handle sign in
    const handleSignIn = async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // In a real application, you would send this to your backend server
            // For demo purposes, we'll just simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful login
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);

            // Redirect to home page
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error signing in. Please try again.');
            console.error('Sign in error:', error);
        }
    };

    // Function to handle forgot password
    const handleForgotPassword = (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        if (!email) {
            alert('Please enter your email address');
            return;
        }

        // In a real application, you would send a password reset email
        alert('Password reset link has been sent to your email address');
    };

    // Function to handle create account
    const handleCreateAccount = (event) => {
        event.preventDefault();
        
        // In a real application, you would redirect to a signup page
        alert('Sign up functionality coming soon!');
    };

    // Event listeners
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }

    if (forgotPassword) {
        forgotPassword.addEventListener('click', handleForgotPassword);
    }

    if (createAccount) {
        createAccount.addEventListener('click', handleCreateAccount);
    }

    // Check authentication status
    const checkAuth = () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userEmail = localStorage.getItem('userEmail');

        if (isAuthenticated === 'true' && window.location.pathname.includes('signin.html')) {
            // Redirect to home if already authenticated
            window.location.href = 'index.html';
        }

        // Update UI based on auth status
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const signInLink = navLinks.querySelector('a[href="signin.html"]');
            if (signInLink && isAuthenticated === 'true') {
                signInLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Sign Out (${userEmail})`;
                signInLink.href = '#';
                signInLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userEmail');
                    window.location.href = 'signin.html';
                });
            }
        }
    };

    // Check authentication status on page load
    checkAuth();
}); 