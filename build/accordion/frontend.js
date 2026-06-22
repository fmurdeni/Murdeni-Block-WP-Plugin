/**
 * Murdeni Accordion Frontend Script
 * 
 * Handles accordion functionality for the Accordion block.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordions
    initMurdeniAccordions();
});

/**
 * Initialize Murdeni Accordions
 */
function initMurdeniAccordions() {
    // Get all accordions
    const accordions = document.querySelectorAll('.murdeni-accordion');
    
    if (!accordions.length) {
        return;
    }
    
    // Initialize each accordion
    accordions.forEach((accordion) => {
        const allowMultiple = accordion.getAttribute('data-allow-multiple') === 'true';
        const initiallyOpen = accordion.getAttribute('data-initially-open') === 'true';
        const items = accordion.querySelectorAll('.murdeni-accordion__item');
        
        // Set initial state
        items.forEach((item, index) => {
            const header = item.querySelector('.murdeni-accordion__header');
            const content = item.querySelector('.murdeni-accordion__content');
            
            // Set initial visibility
            if (initiallyOpen) {
                item.classList.add('is-open');
                if (content) {
                    content.style.display = 'block';
                }
            } else {
                item.classList.remove('is-open');
                if (content) {
                    content.style.display = 'none';
                }
            }
            
            // Add click event
            if (header) {
                header.addEventListener('click', function() {
                    toggleAccordionItem(item, accordion, allowMultiple);
                });
            }
        });
    });
}

/**
 * Toggle accordion item
 */
function toggleAccordionItem(item, accordion, allowMultiple) {
    const isOpen = item.classList.contains('is-open');
    const content = item.querySelector('.murdeni-accordion__content');
    
    // Close other items if not allowing multiple open items
    if (!allowMultiple && !isOpen) {
        const otherItems = accordion.querySelectorAll('.murdeni-accordion__item.is-open');
        otherItems.forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.classList.remove('is-open');
                const otherContent = otherItem.querySelector('.murdeni-accordion__content');
                if (otherContent) {
                    slideUp(otherContent, 300);
                }
            }
        });
    }
    
    // Toggle current item
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
 * Animation utilities for accordion
 * CSS class-based implementation without height animation
 */

// Animation configuration
const ANIMATION_CONFIG = {
    duration: 300      // Animation duration in ms
};

/**
 * Slide up animation - CSS class-based implementation
 * @param {HTMLElement} element - The element to animate
 * @param {number} duration - Animation duration in ms
 */
function slideUp(element, duration = ANIMATION_CONFIG.duration) {
    // Cancel any running animations
    if (element._animation) {
        clearTimeout(element._animation);
        element._animation = null;
    }
    
    // Add animation class
    element.classList.add('murdeni-accordion__content--animating');
    element.classList.add('murdeni-accordion__content--closing');
    
    // Clean up after animation
    element._animation = setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove('murdeni-accordion__content--animating');
        element.classList.remove('murdeni-accordion__content--closing');
        element._animation = null;
    }, duration);
}

/**
 * Slide down animation - CSS class-based implementation
 * @param {HTMLElement} element - The element to animate
 * @param {number} duration - Animation duration in ms
 */
function slideDown(element, duration = ANIMATION_CONFIG.duration) {
    // Cancel any running animations
    if (element._animation) {
        clearTimeout(element._animation);
        element._animation = null;
    }
    
    // Set initial state
    element.style.display = 'block';
    
    // Add animation classes
    element.classList.add('murdeni-accordion__content--animating');
    element.classList.add('murdeni-accordion__content--opening');
    
    // Clean up after animation
    element._animation = setTimeout(() => {
        element.classList.remove('murdeni-accordion__content--animating');
        element.classList.remove('murdeni-accordion__content--opening');
        element._animation = null;
    }, duration);
}

/**
 * Get the natural height of an element - simple, reliable implementation
 * @param {HTMLElement} element - Element to measure
 * @returns {string} - Height with 'px' unit
 */
function getElementHeight(element) {
    // Create a clone for measurement
    const clone = element.cloneNode(true);
    
    // Style for measurement
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.display = 'block';
    clone.style.height = 'auto';
    
    // Add to DOM, measure, then remove
    document.body.appendChild(clone);
    const height = clone.offsetHeight;
    document.body.removeChild(clone);
    
    return height + 'px';
}
