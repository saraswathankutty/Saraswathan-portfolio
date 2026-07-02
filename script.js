document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Screen
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }, 1000);

    // 2. Initialize AOS
    AOS.init({
        duration: 800,
        once: false,
        offset: 100
    });

    // 3. Theme Toggle
    const themeBtn = document.getElementById("theme-toggle");
    const htmlEl = document.documentElement;
    const icon = themeBtn.querySelector("i");
    
    let isDark = true;
    themeBtn.addEventListener("click", () => {
        isDark = !isDark;
        if(isDark) {
            htmlEl.setAttribute("data-theme", "dark");
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            initParticles("dark");
        } else {
            htmlEl.setAttribute("data-theme", "light");
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
            initParticles("light");
        }
    });

    // 4. Mobile Menu
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
    // Close mobile menu on link click
    document.querySelectorAll(".mobile-nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });

    // 5. Scroll Progress Bar
    const scrollBar = document.getElementById("scroll-bar");
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollBar.style.width = scrollPercent + "%";
    });

    // 6. Typing Animation
    const typingText = document.getElementById("typing-text");
    const words = [
        "C# & .NET Core Developer", 
        "Angular Enthusiast", 
        "Microservices Architect", 
        "SQL Optimizer"
    ];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if(isDeleting) {
            typingText.textContent = currentWord.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, letterIndex + 1);
            letterIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if(!isDeleting && letterIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if(isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 7. Skill Bars Animation on Scroll
    const skillProgresses = document.querySelectorAll('.skill-progress');
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const el = entry.target;
                el.style.width = el.getAttribute('data-width');
                observer.unobserve(el);
            }
        });
    };
    const skillObserver = new IntersectionObserver(animateSkills, { threshold: 0.5 });
    skillProgresses.forEach(skill => {
        skillObserver.observe(skill);
    });

    // 8. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 9. Animated Counters
    const counters = document.querySelectorAll('.counter');
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if(current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (target > 20 ? '%' : '+');
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    };
    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 10. GitHub API Fetch
    const githubContainer = document.getElementById('github-repos-container');
    // Using a sample GitHub username (microsoft) for demonstration purposes if "yourusername" is not replaced
    fetch('https://api.github.com/users/microsoft/repos?sort=updated&per_page=2')
        .then(res => {
            if(!res.ok) throw new Error("User not found");
            return res.json();
        })
        .then(data => {
            githubContainer.innerHTML = '';
            if(data.length === 0) {
                githubContainer.innerHTML = '<p>No repositories found.</p>';
                return;
            }
            data.forEach(repo => {
                const repoHTML = `
                    <div class="github-repo-card">
                        <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                        <p>${repo.description || 'No description available'}</p>
                        <small>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | ${repo.language || 'N/A'}</small>
                    </div>
                `;
                githubContainer.innerHTML += repoHTML;
            });
        })
        .catch(err => {
            // Fallback content
            githubContainer.innerHTML = `
                <div class="github-repo-card">
                    <h4><a href="#">Stockcount-Microservices</a></h4>
                    <p>Enterprise inventory management backend powered by .NET 8.</p>
                    <small>⭐ 12 | 🍴 3 | C#</small>
                </div>
                <div class="github-repo-card">
                    <h4><a href="#">ERP-Angular-UI</a></h4>
                    <p>Frontend application for the ERP system.</p>
                    <small>⭐ 8 | 🍴 2 | TypeScript</small>
                </div>
            `;
        });

    // 11. Scroll to Top
    const scrollTopBtn = document.getElementById("scroll-top");
    window.addEventListener("scroll", () => {
        if(window.scrollY > 500) {
            scrollTopBtn.style.display = "flex";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 12. EmailJS Form Handling
    if(typeof emailjs !== "undefined") {
        emailjs.init("YOUR_PUBLIC_KEY"); // Placeholder
    }
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("form-status");
    
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('hr_name', document.getElementById('hr_name').value);
        formData.append('company_name', document.getElementById('company_name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('message', document.getElementById('message').value);

        try {
            // NOTE: This requires a PHP-enabled server to work.
            // GitHub Pages only hosts static files (HTML/CSS/JS).
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData
            });

            if(response.ok) {
                formStatus.innerHTML = '<p style="color: var(--secondary-color);"><i class="fas fa-check-circle"></i> Message sent successfully! I will get back to you soon.</p>';
                contactForm.reset();
            } else {
                formStatus.innerHTML = '<p style="color: #ef4444;"><i class="fas fa-times-circle"></i> Failed to send message. Please try again later.</p>';
            }
        } catch (error) {
            formStatus.innerHTML = '<p style="color: #ef4444;"><i class="fas fa-times-circle"></i> Network error. Please ensure this is hosted on a PHP server.</p>';
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
        
        setTimeout(() => {
            formStatus.innerHTML = '';
        }, 5000);
    });

    // 13. Particles JS Init
    function initParticles(theme) {
        const color = theme === "dark" ? "#ffffff" : "#3b82f6";
        const linesColor = theme === "dark" ? "#ffffff" : "#3b82f6";
        
        if(window.particlesJS) {
            particlesJS("particles-js", {
                "particles": {
                    "number": {
                        "value": 50,
                        "density": { "enable": true, "value_area": 800 }
                    },
                    "color": { "value": color },
                    "shape": {
                        "type": "circle",
                    },
                    "opacity": {
                        "value": 0.3,
                        "random": false,
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": linesColor,
                        "opacity": 0.2,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": { "enable": true, "mode": "grab" },
                        "onclick": { "enable": true, "mode": "push" },
                        "resize": true
                    },
                    "modes": {
                        "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
                        "push": { "particles_nb": 4 }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Init particles with default theme (dark)
    initParticles("dark");
});
