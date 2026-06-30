const header = document.getElementById("header");

header.innerHTML = `

<!-- =========================
        TOP HEADER START
========================= -->

<div class="top-header">

    <div class="container">

        <!-- Left Side -->
        <div class="top-left">

            <a href="https://maps.google.com/?q=S-3 SHIV DHAM, VI PL2 SHIV NAGAR-A JHOTWARA JAIPUR-302012" target="_blank">
                <i class="fas fa-location-dot"></i>
                JHOTWARA JAIPUR
            </a>

            <a href="tel:+918239707266">
                <i class="fas fa-phone"></i>
                +91-8239707266
            </a>

            <a href="mailto:connect@aakhyaanfoundation.org">
                <i class="fas fa-envelope"></i>
                connect@aakhyaanfoundation.org
            </a>

        </div>

        <!-- Right Side -->
        <div class="top-right">

            <a href="https://www.facebook.com/people/Aakhyaan-Foundation/61562046999019/" target="_blank">
                <i class="fab fa-facebook-f"></i>
            </a>

            <a href="https://www.instagram.com/aakhyanfoundation/" target="_blank">
                <i class="fab fa-instagram"></i>
            </a>

            <a href="https://x.com/" target="_blank">
                <i class="fab fa-twitter"></i>
            </a>

            <a href="https://www.linkedin.com/company/aakhyaan-foundation/" target="_blank">
                <i class="fab fa-linkedin-in"></i>
            </a>

            <div class="auth-buttons">
               <a href="javascript:void(0)" id="logoutBtn" class="logout-btn">
                 <i class="fas fa-sign-in-alt"></i>
                    Logout
               </a>
           </div>

        </div>

    </div>

</div>
`;



header.innerHTML += `

<!-- =========================
        NAVBAR START
========================= -->

<header class="navbar-area" id="navbar">

    <div class="container nav-container">

        <!-- Logo -->
        <div class="logo">

            <a href="#">
                <img src="../logo.png" alt="logo">
            </a>

        </div>

        <!-- Navigation -->
        <nav class="nav-menu" id="navMenu">

            <ul>


                <!-- INFORMATION DESK -->
                <li class="dropdown">

                    <a href="#">
                        INFORMATION DESK
                        <i class="fa-solid fa-angle-down"></i>
                    </a>

                    <ul class="submenu">

                        <li><a href="../html/upcomingevent.html">Upcoming Event</a></li>
                        <li><a href="../html/documents.html">REPORT</a></li>
                        <li><a href="../html/auditdocuments.html">AUDIT</a></li>
                        <li><a href="../html/donors.html">List Of Donors</a></li>

                    </ul>

                </li>

                <!-- RESOURCES -->
                <li class="dropdown">

                    <a href="#">
                        RESOURCES
                        <i class="fa-solid fa-angle-down"></i>
                    </a>

                    <ul class="submenu">
                        <li><a href="../html/activitycalendar.html">ACTIVITY CALENDAR</a></li>
                        <li><a href="../html/presscoverage.html">PRESS COVERAGE</a></li>
                        <li><a href="../html/blog.html">JOURNALING / NEWSLETTERS / BLOGS</a></li>
                        <li><a href="../html/gallery.html">Gallery</a></li>

                    </ul>

                </li>


            </ul>

        </nav>

        <!-- Mobile Button -->

        <div class="mobile-btn" id="menuBtn">

            <i class="fas fa-bars"></i>

        </div>

    </div>

</header>

`;




header.innerHTML += `

<!-- =========================
      MOBILE NAVBAR START
========================= -->

<div class="mobile-menu" id="mobileMenu">

    <!-- Close Button -->
    <div class="close-btn" id="closeBtn">
        <i class="fas fa-times"></i>
    </div>


        </li>

        <!-- INFORMATION DESK -->
        <li class="mobile-dropdown">

            <div class="mobile-link">
                <a href="#">INFORMATION DESK</a>
                <span class="mobile-toggle">+</span>
            </div>

            <ul class="mobile-submenu">
     
                        <li><a href="../html/upcomingevent.html">Upcoming Event</a></li>
                        <li><a href="../html/documents.html">REPORT</a></li>
                        <li><a href="../html/auditdocuments.html">AUDIT</a></li>
                        <li><a href="../html/donors.html">List Of Donors</a></li>

            </ul>

        </li>

        <!-- RESOURCES -->
        <li class="mobile-dropdown">

            <div class="mobile-link">
                <a href="#">RESOURCES</a>
                <span class="mobile-toggle">+</span>
            </div>

            <ul class="mobile-submenu">

                        <li><a href="../html/activitycalendar.html">ACTIVITY CALENDAR</a></li>
                        <li><a href="../html/presscoverage.html">PRESS COVERAGE</a></li>
                        <li><a href="../html/blog.html">JOURNALING / NEWSLETTERS / BLOGS</a></li>
                        <li><a href="../html/gallery.html">Gallery</a></li>

            </ul>

        </li>



        <!-- MOBILE DONATE BUTTON -->
        <li class="mobile-donate">
           <a href="donate.html">
               Donate Now
           </a>
       </li>

       
        <div class="mobile-contact-info">

            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>connect@aakhyaanfoundation.org</span>
            </div>

            <div class="contact-item">
                <i class="fas fa-location-dot"></i>
                <span>Jhotwara Jaipur, Rajasthan</span>
            </div>

            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>+91 8239707266</span>
            </div>

            <div class="mobile-social">

                <a href="#">
                    <i class="fab fa-facebook-f"></i>
                </a>

                <a href="#">
                    <i class="fab fa-instagram"></i>
                </a>

                <a href="#">
                    <i class="fab fa-linkedin-in"></i>
                </a>

                <a href="#">
                    <i class="fab fa-twitter"></i>
                </a>

            </div>

           <div class="mobile-auth">
              <a href="javascript:void(0)" id="mobileLogoutBtn" class="mobile-logout">
                  <i class="fas fa-sign-in-alt"></i>
                   Logout
              </a>
            </div>

        </div>

    </ul>

</div>

<div class="overlay" id="overlay"></div>

`;


// ===============================
// LOGOUT
// ===============================

document.addEventListener("click", function (e) {

    // Desktop Logout
    if (e.target.closest("#logoutBtn")) {

        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();

        window.location.href = "../index.html";
    }

    // Mobile Logout
    if (e.target.closest("#mobileLogoutBtn")) {

        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();

        window.location.href = "../index.html";
    }

});