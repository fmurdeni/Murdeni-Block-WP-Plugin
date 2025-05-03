/**
 * Frontend JavaScript for the Skills Percentage block
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        initSkillsPercentage();
    });

    /**
     * Initialize skills percentage animations
     */
    function initSkillsPercentage() {
        const skillsContainers = document.querySelectorAll('.murdeni-skills-percentage');
        
        if (!skillsContainers.length) return;
        
        skillsContainers.forEach(container => {
            const animateOnScroll = container.getAttribute('data-animate') === 'true';
            
            if (animateOnScroll) {
                // Add animation class
                container.classList.add('murdeni-skills-percentage-animate');
                
                // Set up intersection observer for scroll animation
                animateSkillBars(container);
            } else {
                // Set widths immediately without animation
                const bars = container.querySelectorAll('.murdeni-skills-percentage-bar');
                bars.forEach(bar => {
                    const percentage = bar.getAttribute('data-percentage');
                    bar.style.width = percentage + '%';
                });
            }
        });
    }

    /**
     * Initialize skill bars animation
     */
    function animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.murdeni-skills-percentage-bar');
        
        if (!skillBars.length) return;
        
        // Animate on scroll
        window.addEventListener('scroll', () => {
            skillBars.forEach(bar => {
                const barTop = bar.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (barTop < windowHeight - 100) {
                    // Use data-width attribute for the new design
                    const percentage = bar.getAttribute('data-width') || bar.getAttribute('data-percentage');
                    if (percentage) {
                        bar.style.width = percentage + '%';
                        bar.style.transition = 'width 1s ease-in-out';
                    }
                }
            });
        });
    }
})();
