function openLoginPopup() {
  closeAuthPopup();

  const overlay = document.createElement("div");
  overlay.className = "auth-modal-overlay active";
  overlay.id = "authModal";

  overlay.innerHTML = `
    <div class="auth-popup-box">
      <button class="auth-close-btn" onclick="closeAuthPopup()">
        <i class="icon-x"></i>
      </button>

      <div class="auth-header">
        <div class="logo-box">
          <i class="icon-file-text"></i>
        </div>
        <h2>Login to Your Account</h2>
      </div>

      <form id="popupLoginForm" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <div class="input-box">
            <i class="icon-mail"></i>
            <input type="email" id="loginEmail" placeholder="Enter your email">
          </div>
          <small id="loginEmailError"></small>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="input-box">
            <i class="icon-lock"></i>
            <input type="password" id="loginPassword" placeholder="Enter your password">
            <button type="button" class="eye-btn" id="loginTogglePassword">
              <i class="icon-eye"></i>
            </button>
          </div>
          <small id="loginPasswordError"></small>
        </div>

        <div id="loginMessage" class="auth-message"></div>

        <button type="submit" class="auth-submit-btn" id="popupLoginBtn">
          Sign in
        </button>
      </form>

      <div class="auth-switch-text">
        Don't have an account?
        <button type="button" onclick="openSignupPopup()">Sign up</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById("popupLoginForm");
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");
  const message = document.getElementById("loginMessage");
  const btn = document.getElementById("popupLoginBtn");
  const togglePassword = document.getElementById("loginTogglePassword");

  togglePassword.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";
    message.className = "auth-message";
    message.textContent = "";

    let isValid = true;

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
    } else {
      password.classList.remove("error");
    }

    if (!isValid) return;

    btn.disabled = true;
    btn.textContent = "Signing in...";

    try {
      const res = await fetch(API_PATHS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.className = "auth-message error-msg";
        message.textContent = data.message || "Invalid login details";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      message.className = "auth-message success-msg";
      message.textContent = "Login successful";

      setTimeout(() => {
        closeAuthPopup();
        window.location.href = "./html/mainpage.html";
      }, 800);

    } catch (error) {
      message.className = "auth-message error-msg";
      message.textContent = "Server error. Please try again.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  });
}

function closeAuthPopup() {
  const modal = document.getElementById("authModal");
  if (modal) modal.remove();
}

document.addEventListener("click", function (e) {
  if (e.target.closest("#loginBtn") || e.target.closest("#mobileLoginBtn")) {
    e.preventDefault();
    openLoginPopup();
  }
});