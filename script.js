document.addEventListener("DOMContentLoaded", () => {
    // -------------------------
    // LOGIN & ACCESS CONTROL LOGIC
    // -------------------------
    const userClass = localStorage.getItem("sciBiteClass");
    
    // Page access restriction removed as per user request
    /*
    const lessonMeta = document.querySelector('meta[name="lesson-class"]');
    if (lessonMeta && userClass) {
        if (lessonMeta.content !== userClass) { ... }
    }
    */
    
    // Auth state UI updates
    const navLinks = document.querySelector(".nav-links");
    const navLoginBtn = document.querySelector(".login-btn-nav");
    
    if (localStorage.getItem("sciBiteLoggedIn") === "true") {
        if (navLoginBtn) {
            // Replace login button with user profile icon
            const userProfile = document.createElement("div");
            userProfile.className = "user-profile animate-in";
            userProfile.id = "user-profile-btn";
            userProfile.innerHTML = `
                <span class="user-icon">👤</span>
                <span class="user-name">Student</span>
            `;
            
            navLoginBtn.parentNode.replaceChild(userProfile, navLoginBtn);
            
            userProfile.addEventListener("click", () => {
                showLogoutModal();
            });
        }
    }

    function showLogoutModal() {
        // Create modal structure if it doesn't exist
        let modal = document.getElementById("logout-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "logout-modal";
            modal.className = "modal-overlay";
            modal.innerHTML = `
                <div class="modal-card">
                    <span class="modal-icon">👋</span>
                    <h3>Ready to Leave?</h3>
                    <p>Are you sure you want to logout? You'll need to login again to see your progress.</p>
                    <div class="modal-btns">
                        <button class="modal-btn modal-btn-cancel" id="logout-cancel">Stay Here</button>
                        <button class="modal-btn modal-btn-confirm" id="logout-confirm">Logout</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById("logout-cancel").addEventListener("click", () => {
                modal.classList.remove("show");
            });

            document.getElementById("logout-confirm").addEventListener("click", () => {
                localStorage.removeItem("sciBiteLoggedIn");
                localStorage.removeItem("sciBiteClass");
                window.location.href = "index.html";
            });
        }
        
        // Final trigger for animation
        setTimeout(() => modal.classList.add("show"), 10);
    }

    // Handle Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Set login flags
            localStorage.setItem("sciBiteLoggedIn", "true");
            localStorage.setItem("sciBiteClass", "all"); // Default to all access
            
            showToast("Success! You have logged in successfully. 🧪");
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        });
    }

    // Toast Notification Helper
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `
            <span class="toast-icon">✅</span>
            <span class="toast-message">${message}</span>
        `;
        document.body.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => toast.classList.add("show"), 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Glassmorphism hover spotlight for lesson cards
    const cards = document.querySelectorAll(".lesson-wrapper");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // Topic Filter Logic for Class 9th and 10th on Homepage
    const filterBtns = document.querySelectorAll(".filter-btn");
    const gridCards = document.querySelectorAll("#lessons-grid .lesson-wrapper");

    const setupFilters = () => {
        if (filterBtns.length === 0) return;
        
        let initialFilter = "all";
        if (userClass) {
            initialFilter = userClass;

        }
        
        const applyFilter = (filterValue) => {
            filterBtns.forEach(b => {
                if(b.getAttribute("data-filter") === filterValue) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });

            gridCards.forEach(card => {
                const cardClass = card.getAttribute("data-class");
                if (filterValue === "all" || cardClass === filterValue) {
                    card.style.display = "block";
                    card.style.animation = "none";
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = "fadeIn 0.5s ease forwards";
                } else {
                    card.style.display = "none";
                }
            });
        };

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                applyFilter(btn.getAttribute("data-filter"));
            });
        });
        
        applyFilter(initialFilter);
    };
    setupFilters();
});
