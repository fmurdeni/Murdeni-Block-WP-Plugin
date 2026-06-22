/**
 * Media Gallery Frontend Script
 * 
 * Handles lightbox functionality for the Media Gallery block.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize lightbox
    initMediaGalleryLightbox();
});

/**
 * Initialize Media Gallery Lightbox
 */
function initMediaGalleryLightbox() {
    // Get all gallery items with lightbox enabled
    const galleryItems = document.querySelectorAll('.murdeni-media-gallery__item-link[data-lightbox="true"]');
    
    if (!galleryItems.length) {
        return;
    }
    
    // Create lightbox container if it doesn't exist
    let lightbox = document.querySelector('.murdeni-media-gallery__lightbox');
    
    if (!lightbox) {
        lightbox = createLightbox();
        document.body.appendChild(lightbox);
    }
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get item data
            const type = this.getAttribute('data-type');
            const caption = this.getAttribute('data-caption');
            
            // Open lightbox
            if (type === 'image') {
                const imageUrl = this.getAttribute('data-full-image');
                openImageLightbox(imageUrl, caption, index, galleryItems);
            } else if (type === 'video') {
                const videoId = this.getAttribute('data-video-id');
                openVideoLightbox(videoId, caption, index, galleryItems);
            }
        });
    });
}

/**
 * Create lightbox container
 */
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'murdeni-media-gallery__lightbox';
    
    // Create lightbox content
    const content = document.createElement('div');
    content.className = 'murdeni-media-gallery__lightbox-content';
    lightbox.appendChild(content);
    
    // Create close button
    const closeButton = document.createElement('div');
    closeButton.className = 'murdeni-media-gallery__lightbox-close';
    closeButton.setAttribute('aria-label', murdeniMediaGallery.closeLabel || 'Close');
    lightbox.appendChild(closeButton);
    
    // Create navigation buttons
    const nav = document.createElement('div');
    nav.className = 'murdeni-media-gallery__lightbox-nav';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'murdeni-media-gallery__lightbox-prev';
    prevButton.innerHTML = '&#10094;';
    prevButton.setAttribute('aria-label', murdeniMediaGallery.prevLabel || 'Previous');
    
    const nextButton = document.createElement('button');
    nextButton.className = 'murdeni-media-gallery__lightbox-next';
    nextButton.innerHTML = '&#10095;';
    nextButton.setAttribute('aria-label', murdeniMediaGallery.nextLabel || 'Next');
    
    nav.appendChild(prevButton);
    nav.appendChild(nextButton);
    lightbox.appendChild(nav);
    
    // Add close event
    closeButton.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('is-active')) {
            return;
        }
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            document.querySelector('.murdeni-media-gallery__lightbox-prev').click();
        } else if (e.key === 'ArrowRight') {
            document.querySelector('.murdeni-media-gallery__lightbox-next').click();
        }
    });
    
    return lightbox;
}

/**
 * Open image lightbox
 */
function openImageLightbox(imageUrl, caption, index, allItems) {
    const lightbox = document.querySelector('.murdeni-media-gallery__lightbox');
    const content = lightbox.querySelector('.murdeni-media-gallery__lightbox-content');
    
    // Clear content
    content.innerHTML = '';
    
    // Create image
    const img = document.createElement('img');
    img.className = 'murdeni-media-gallery__lightbox-image';
    img.src = imageUrl;
    img.alt = caption || '';
    content.appendChild(img);
    
    // Add caption if available
    if (caption) {
        const captionEl = document.createElement('div');
        captionEl.className = 'murdeni-media-gallery__lightbox-caption';
        captionEl.textContent = caption;
        content.appendChild(captionEl);
    }
    
    // Setup navigation
    setupLightboxNavigation(index, allItems);
    
    // Show lightbox
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

/**
 * Open video lightbox
 */
function openVideoLightbox(videoId, caption, index, allItems) {
    const lightbox = document.querySelector('.murdeni-media-gallery__lightbox');
    const content = lightbox.querySelector('.murdeni-media-gallery__lightbox-content');
    
    // Clear content
    content.innerHTML = '';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'murdeni-media-gallery__lightbox-video';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    content.appendChild(iframe);
    
    // Add caption if available
    if (caption) {
        const captionEl = document.createElement('div');
        captionEl.className = 'murdeni-media-gallery__lightbox-caption';
        captionEl.textContent = caption;
        content.appendChild(captionEl);
    }
    
    // Setup navigation
    setupLightboxNavigation(index, allItems);
    
    // Show lightbox
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

/**
 * Setup lightbox navigation
 */
function setupLightboxNavigation(currentIndex, allItems) {
    const lightbox = document.querySelector('.murdeni-media-gallery__lightbox');
    const prevButton = lightbox.querySelector('.murdeni-media-gallery__lightbox-prev');
    const nextButton = lightbox.querySelector('.murdeni-media-gallery__lightbox-next');
    
    // Remove previous event listeners
    const newPrevButton = prevButton.cloneNode(true);
    const newNextButton = nextButton.cloneNode(true);
    
    prevButton.parentNode.replaceChild(newPrevButton, prevButton);
    nextButton.parentNode.replaceChild(newNextButton, nextButton);
    
    // Add new event listeners
    newPrevButton.addEventListener('click', function() {
        const prevIndex = currentIndex - 1 < 0 ? allItems.length - 1 : currentIndex - 1;
        allItems[prevIndex].click();
    });
    
    newNextButton.addEventListener('click', function() {
        const nextIndex = currentIndex + 1 >= allItems.length ? 0 : currentIndex + 1;
        allItems[nextIndex].click();
    });
    
    // Hide navigation if only one item
    if (allItems.length <= 1) {
        newPrevButton.style.display = 'none';
        newNextButton.style.display = 'none';
    } else {
        newPrevButton.style.display = '';
        newNextButton.style.display = '';
    }
}

/**
 * Close lightbox
 */
function closeLightbox() {
    const lightbox = document.querySelector('.murdeni-media-gallery__lightbox');
    
    if (!lightbox) {
        return;
    }
    
    // Hide lightbox
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    
    // Clear content after animation
    setTimeout(() => {
        const content = lightbox.querySelector('.murdeni-media-gallery__lightbox-content');
        content.innerHTML = '';
    }, 300);
}
