document.addEventListener("DOMContentLoaded", () => {
    // -------------------------
    // LOGIN & ACCESS CONTROL LOGIC
    // -------------------------
    const userClass = localStorage.getItem("sciBiteClass");
    
    // Page access restriction
    const lessonMeta = document.querySelector('meta[name="lesson-class"]');
    if (lessonMeta && userClass) {
        if (lessonMeta.content !== userClass) {
            alert(`You are logged in as Class ${userClass}. Access to Class ${lessonMeta.content} topics is restricted.`);
            window.location.href = "index.html";
        }
    }
    
    // Auth state UI updates
    const navLoginBtns = document.querySelectorAll(".login-btn-nav");
    if (userClass) {
        navLoginBtns.forEach(btn => {
            btn.textContent = "Logout";
            btn.href = "#";
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("sciBiteClass");
                window.location.reload();
            });
        });
    }

    // Handle Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const classSelect = document.getElementById("class");
            localStorage.setItem("sciBiteClass", classSelect.value);
            window.location.href = "index.html";
        });
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
            // Hide filter buttons that don't match user class to strictly lock them via UI
            filterBtns.forEach(btn => {
                const val = btn.getAttribute("data-filter");
                if(val !== userClass && val !== "all") {
                    btn.style.display = "none";
                }
            });
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
