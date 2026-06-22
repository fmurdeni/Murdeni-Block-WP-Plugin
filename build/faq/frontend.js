/**
 * Murdeni FAQ Block Frontend Script
 * 
 * Handles accordion functionality for the FAQ block with smooth animations.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ accordions
    initMurdeniFAQs();
});

/**
 * Initialize Murdeni FAQ Accordions
 */
function initMurdeniFAQs() {
    // Get all FAQ blocks
    const faqBlocks = document.querySelectorAll('.murdeni-faq');
    
    if (!faqBlocks.length) {
        return;
    }
    
    // Initialize each FAQ block
    faqBlocks.forEach((faqBlock) => {
        const allowMultiple = faqBlock.getAttribute('data-allow-multiple') === 'true';
        const initiallyOpen = faqBlock.getAttribute('data-initially-open') === 'true';
        const items = faqBlock.querySelectorAll('.murdeni-faq__item');
        
        // Set initial state
        items.forEach((item, index) => {
            const header = item.querySelector('.murdeni-faq__header');
            const content = item.querySelector('.murdeni-faq__content');
            
            // Set initial visibility
            if (initiallyOpen) {
                item.classList.add('is-open');
                if (content) {
                    content.style.display = 'block';
                    content.style.height = content.scrollHeight + 'px';
                }
            } else {
                item.classList.remove('is-open');
                if (content) {
                    content.style.display = 'none';
                    content.style.height = '0';
                }
            }
            
            // Add click event
            if (header) {
                header.addEventListener('click', function() {
                    toggleFaqItem(item, faqBlock, allowMultiple);
                });
            }
        });
    });
}

/**
 * Toggle FAQ item with smooth animation
 */
function toggleFaqItem(item, faqBlock, allowMultiple) {
    const isOpen = item.classList.contains('is-open');
    const content = item.querySelector('.murdeni-faq__content');
    
    // Close other items if not allowing multiple open items
    if (!allowMultiple && !isOpen) {
        const otherItems = faqBlock.querySelectorAll('.murdeni-faq__item.is-open');
        otherItems.forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.classList.remove('is-open');
                const otherContent = otherItem.querySelector('.murdeni-faq__content');
                if (otherContent) {
                    slideUp(otherContent, 300);
                }
            }
        });
    }
    
    // Toggle current item with smooth animation
    if (isOpen) {
        item.classList.remove('is-open');
        if (content) {
            slideUp(content, 300);
        }
    } else {
        item.classList.add('is-open');
        if (content) {
            slideDown(content, 300);
        }
    }
}

/**
 * Smooth slide up animation
 * @param {HTMLElement} element - The element to animate
 * @param {number} duration - Animation duration in ms
 */
function slideUp(element, duration = 300) {
    // Set initial height
    element.style.height = element.offsetHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-in-out`;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    
    // Trigger reflow
    element.offsetHeight;
    
    // Start animation
    element.style.height = '0';
    
    // Clean up after animation
    window.setTimeout(() => {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
    }, duration);
}

/**
 * Smooth slide down animation
 * @param {HTMLElement} element - The element to animate
 * @param {number} duration - Animation duration in ms
 */
function slideDown(element, duration = 300) {
    // Set initial state
    element.style.display = 'block';
    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.transition = `height ${duration}ms ease-in-out`;
    
    // Get the natural height
    const height = element.scrollHeight;
    
    // Start animation
    element.style.height = height + 'px';
    
    // Clean up after animation
    window.setTimeout(() => {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
    }, duration);
}
