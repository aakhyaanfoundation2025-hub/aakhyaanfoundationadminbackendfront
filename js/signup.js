function openSignupPopup() {
  closeAuthPopup();

  const overlay = document.createElement("div");
  overlay.className = "signup-modal-overlay active";
  overlay.id = "authModal";

  overlay.innerHTML = `
    <div class="signup-popup-box">
      <button class="signup-close-btn" onclick="closeAuthPopup()">
        <i class="icon-x"></i>
      </button>

      <div class="signup-header">
        <div class="signup-logo-box">
          <i class="icon-file-text"></i>
        </div>
        <h2>Create Account</h2>
      </div>

      <form id="popupSignupForm" class="signup-form">

        <div class="signup-form-group">
          <label>Full Name</label>
          <div class="signup-input-box">
            <i class="icon-user"></i>
            <input type="text" id="signupName" placeholder="Enter your full name">
          </div>
          <small id="signupNameError"></small>
        </div>

        <div class="signup-form-group">
          <label>Email</label>
          <div class="signup-input-box">
            <i class="icon-mail"></i>
            <input type="email" id="signupEmail" placeholder="Enter your email">
          </div>
          <small id="signupEmailError"></small>
        </div>

        <div class="signup-form-group">
          <label>Password</label>
          <div class="signup-input-box">
            <i class="icon-lock"></i>
            <input type="password" id="signupPassword" placeholder="Create password">
            <button type="button" class="signup-eye-btn" id="signupTogglePassword">
              <i class="icon-eye"></i>
            </button>
          </div>
          <small id="signupPasswordError"></small>
        </div>

        <div class="signup-form-group">
          <label>Confirm Password</label>
          <div class="signup-input-box">
            <i class="icon-lock"></i>
            <input type="password" id="signupConfirmPassword" placeholder="Confirm password">
            <button type="button" class="signup-eye-btn" id="signupToggleConfirmPassword">
              <i class="icon-eye"></i>
            </button>
          </div>
          <small id="signupConfirmPasswordError"></small>
        </div>

        <div class="signup-form-group">
          <label>Admin Secret Key</label>
          <div class="signup-input-box">
            <i class="icon-key"></i>
            <input type="password" id="signupSecretKey" placeholder="Enter admin secret key">
          </div>
          <small id="signupSecretKeyError"></small>
        </div>

        <p class="signup-terms">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

        <div id="signupMessage" class="signup-message"></div>

        <button type="submit" class="signup-submit-btn" id="popupSignupBtn">
          Create Account
        </button>

      </form>

      <div class="signup-switch-text">
        Already have an account?
        <button type="button" onclick="openLoginPopup()">Sign in</button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById("popupSignupForm");
  const name = document.getElementById("signupName");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const confirmPassword = document.getElementById("signupConfirmPassword");
  const secretKey = document.getElementById("signupSecretKey");

  const nameError = document.getElementById("signupNameError");
  const emailError = document.getElementById("signupEmailError");
  const passwordError = document.getElementById("signupPasswordError");
  const confirmPasswordError = document.getElementById("signupConfirmPasswordError");
  const secretKeyError = document.getElementById("signupSecretKeyError");

  const message = document.getElementById("signupMessage");
  const btn = document.getElementById("popupSignupBtn");

  document
    .getElementById("signupTogglePassword")
    .addEventListener("click", () => {
      password.type = password.type === "password" ? "text" : "password";
    });

  document
    .getElementById("signupToggleConfirmPassword")
    .addEventListener("click", () => {
      confirmPassword.type =
        confirmPassword.type === "password" ? "text" : "password";
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    secretKeyError.textContent = "";

    message.className = "signup-message";
    message.textContent = "";

    let isValid = true;

    if (!name.value.trim()) {
      nameError.textContent = "Name is required";
      name.classList.add("error");
      isValid = false;
    } else {
      name.classList.remove("error");
    }

    if (!email.value.trim()) {
      emailError.textContent = "Email is required";
      email.classList.add("error");
      isValid = false;
    } else {
      email.classList.remove("error");
    }

    if (!password.value.trim()) {
      passwordError.textContent = "Password is required";
      password.classList.add("error");
      isValid = false;
    } else if (password.value.length < 6) {
      passwordError.textContent =
        "Password must be at least 6 characters";
      password.classList.add("error");
      isValid = false;
    } else {
      password.classList.remove("error");
    }

    if (!confirmPassword.value.trim()) {
      confirmPasswordError.textContent =
        "Please confirm your password";
      confirmPassword.classList.add("error");
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      confirmPasswordError.textContent =
        "Passwords do not match";
      confirmPassword.classList.add("error");
      isValid = false;
    } else {
      confirmPassword.classList.remove("error");
    }

    if (!secretKey.value.trim()) {
      secretKeyError.textContent = "Admin secret key is required";
      secretKey.classList.add("error");
      isValid = false;
    } else {
      secretKey.classList.remove("error");
    }

    if (!isValid) return;

    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {

      const res = await fetch(API_PATHS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          password: password.value,
          secretKey: secretKey.value.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.className = "signup-message error-msg";
        message.textContent =
          data.message || "Registration failed";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      message.className = "signup-message success-msg";
      message.textContent = "Account created successfully";

      setTimeout(() => {
        closeAuthPopup();
        if (window.afterAuthSuccess) {
          window.afterAuthSuccess();
          window.afterAuthSuccess = null;
        }
      }, 800);

    } catch (error) {

      message.className = "signup-message error-msg";
      message.textContent =
        "Server error. Please try again.";

    } finally {

      btn.disabled = false;
      btn.textContent = "Create Account";

    }

  });

}


// ===============================
// SIGNUP BUTTON EVENTS
// ===============================

document.addEventListener("click", function (e) {

  if (
    e.target.closest("#signupBtn") ||
    e.target.closest("#mobileSignupBtn")
  ) {
    e.preventDefault();
    openSignupPopup();
  }

});