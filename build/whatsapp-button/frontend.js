/**
 * WhatsApp Button Frontend Script
 */

document.addEventListener('DOMContentLoaded', function() {
    const disabledButtons = document.querySelectorAll('.murdeni-whatsapp-button.animation-disabled');

    disabledButtons.forEach(button => {
        button.style.opacity = '';
        button.style.transform = '';
        button.style.transition = '';

        const whatsappButton = button.querySelector('.whatsapp-button');
        if (whatsappButton) {
            whatsappButton.style.transform = '';
            whatsappButton.style.transition = '';
        }
    });

    // Add animation effect to floating WhatsApp buttons
    const floatingButtons = document.querySelectorAll('.murdeni-whatsapp-button.floating:not(.animation-disabled)');
    
    floatingButtons.forEach(button => {
        // Add entrance animation
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 500);
        
        // Add hover effect
        const whatsappButton = button.querySelector('.whatsapp-button');
        if (whatsappButton) {
            whatsappButton.addEventListener('mouseenter', () => {
                whatsappButton.style.transform = 'scale(1.1)';
            });
            
            whatsappButton.addEventListener('mouseleave', () => {
                whatsappButton.style.transform = 'scale(1)';
            });
        }
    });
});
