// ==========================================
// CLINICA MEDICARE
// ADMIN LOGIN
// ==========================================
const SUPABASE_URL =
    "https://stejywpaxavvmjkzndwh.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KxxqH7WDzoB6aI4MuBcUpA_XAWnVr0K";


// ==========================================
// SUPABASE CLIENT
// ==========================================

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            storageKey: "clinica-medicare-admin-auth"
        }
    }
);

// ==========================================
// ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    if (!errorMessage) return;

    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    if (successMessage) {
        successMessage.textContent = "";
        successMessage.style.display = "none";
    }
}


// ==========================================
// SHOW SUCCESS
// ==========================================

function showSuccess(message) {

    if (!successMessage) return;

    successMessage.textContent = message;
    successMessage.style.display = "block";

    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }
}


// ==========================================
// HIDE MESSAGES
// ==========================================

function clearMessages() {

    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }

    if (successMessage) {
        successMessage.textContent = "";
        successMessage.style.display = "none";
    }
}


// ==========================================
// RESET LOGIN BUTTON
// ==========================================

function resetLoginButton() {

    if (!loginButton) return;

    loginButton.disabled = false;
    loginButton.textContent = "Login to Admin Panel";
}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearMessages();

        const email = emailInput
            ? emailInput.value.trim()
            : "";

        const password = passwordInput
            ? passwordInput.value
            : "";


        // ------------------------------
        // VALIDATION
        // ------------------------------

        if (!email) {

            showError("Please enter your email address.");

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        if (!password) {

            showError("Please enter your password.");

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        // ------------------------------
        // BUTTON LOADING
        // ------------------------------

        if (loginButton) {

            loginButton.disabled = true;
            loginButton.textContent = "Signing in...";
        }


        try {

            // ------------------------------
            // SUPABASE LOGIN
            // ------------------------------

            const {
                data,
                error
            } = await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


            // ------------------------------
            // SUPABASE ERROR
            // ------------------------------

            if (error) {
                throw error;
            }


            // ------------------------------
            // SESSION CHECK
            // ------------------------------

            if (
                !data ||
                !data.session ||
                !data.user
            ) {

                throw new Error(
                    "Login successful, but no active session was created."
                );
            }


            console.log(
                "Admin login successful:",
                data.user.email
            );


            // ------------------------------
            // SUCCESS MESSAGE
            // ------------------------------

            showSuccess(
                "Login successful. Opening dashboard..."
            );


            if (loginButton) {

                loginButton.textContent =
                    "Opening Dashboard...";
            }


            // ------------------------------
            // OPEN DASHBOARD
            // ------------------------------

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 500);


        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );


            let message =
                "Unable to login. Please try again.";


            if (error && error.message) {

                message = error.message;
            }


            // ------------------------------
            // FRIENDLY ERRORS
            // ------------------------------

            if (
                message
                    .toLowerCase()
                    .includes("invalid login credentials")
            ) {

                message =
                    "Invalid email or password.";
            }


            if (
                message
                    .toLowerCase()
                    .includes("email not confirmed")
            ) {

                message =
                    "Your email is not confirmed. Please confirm your email in Supabase Authentication.";
            }


            if (
                message
                    .toLowerCase()
                    .includes("failed to fetch")
            ) {

                message =
                    "Unable to connect to Supabase. Please check your internet connection or Supabase project status.";
            }


            showError(message);

            resetLoginButton();
        }

    });

}


// ==========================================
// ENTER KEY SUPPORT
// ==========================================

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                loginForm
            ) {

                event.preventDefault();

                loginForm.requestSubmit();
            }

        }
    );
}


// ==========================================
// READY
// ==========================================

console.log(
    "Clinica Medicare Admin Login loaded."
);