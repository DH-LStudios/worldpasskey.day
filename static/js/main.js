document.addEventListener('DOMContentLoaded', function() {
    // Create page transition element
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on user preference
    if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', 'dark');
        }
    });


    // Enhanced smooth scroll with transitions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show transition
            transitionElement.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Hide all sections
                document.querySelectorAll('section').forEach(section => {
                    section.classList.add('section-transition', 'entering');
                });
                
                // Delay scroll and show animation
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Show target section
                    targetElement.classList.remove('entering');
                    targetElement.classList.add('entered');
                    
                    // Hide transition overlay
                    setTimeout(() => {
                        transitionElement.classList.remove('active');
                    }, 500);
                }, 300);
            }
        });
    });

    // Enhanced Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add section transition classes
                entry.target.classList.add('section-transition', 'entered');
                entry.target.classList.remove('entering');

                // If this is an infographic card, trigger SVG animations
                if (entry.target.classList.contains('infographic-card')) {
                    const svg = entry.target.querySelector('.infographic-svg');
                    if (svg) {
                        svg.querySelectorAll('.animate-draw, .animate-fade-scale').forEach(element => {
                            // Reset animations
                            element.style.animation = 'none';
                            element.offsetHeight; // Trigger reflow
                            element.style.animation = null;
                        });
                    }
                }
            } else {
                entry.target.classList.remove('visible');
                // Reset section transition classes
                entry.target.classList.add('entering');
                entry.target.classList.remove('entered');
            }
        });
    }, observerOptions);

    // Observe all sections, cards, and infographics
    document.querySelectorAll('section, .mission-card, .resource-card, .infographic-card').forEach(element => {
        element.classList.add('content-section');
        observer.observe(element);
    });

    // Add hover animation to resource cards
    document.querySelectorAll('.resource-card, .infographic-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});
