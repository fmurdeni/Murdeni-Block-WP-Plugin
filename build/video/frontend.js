/**
 * Murdeni Video Frontend Script
 * 
 * Handles lightbox functionality for the Video block.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize video lightbox
    initMurdeniVideoLightbox();
});

/**
 * Initialize Murdeni Video Lightbox
 */
function initMurdeniVideoLightbox() {
    // Get all video overlays
    const videoOverlays = document.querySelectorAll('.murdeni-video__overlay');
    
    if (!videoOverlays.length) {
        return;
    }
    
    // Create lightbox container if it doesn't exist
    let lightbox = document.querySelector('.murdeni-video__lightbox');
    
    if (!lightbox) {
        lightbox = createVideoLightbox();
        document.body.appendChild(lightbox);
    }
    
    // Add click event to video overlays
    videoOverlays.forEach((overlay) => {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get video ID
            const videoId = this.getAttribute('data-video-id');
            
            if (videoId) {
                openVideoLightbox(videoId);
            }
        });
    });
}

/**
 * Create video lightbox container
 */
function createVideoLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'murdeni-video__lightbox';
    
    // Create lightbox content
    const content = document.createElement('div');
    content.className = 'murdeni-video__lightbox-content';
    lightbox.appendChild(content);
    
    // Create close button
    const closeButton = document.createElement('div');
    closeButton.className = 'murdeni-video__lightbox-close';
    closeButton.setAttribute('aria-label', murdeniVideo.closeLabel || 'Close');
    lightbox.appendChild(closeButton);
    
    // Add close event
    closeButton.addEventListener('click', closeVideoLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeVideoLightbox();
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('is-active')) {
            return;
        }
        
        if (e.key === 'Escape') {
            closeVideoLightbox();
        }
    });
    
    return lightbox;
}

/**
 * Open video lightbox
 */
function openVideoLightbox(videoId) {
    const lightbox = document.querySelector('.murdeni-video__lightbox');
    const content = lightbox.querySelector('.murdeni-video__lightbox-content');
    
    // Clear content
    content.innerHTML = '';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'murdeni-video__lightbox-video';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    content.appendChild(iframe);
    
    // Show lightbox
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close video lightbox
 */
function closeVideoLightbox() {
    const lightbox = document.querySelector('.murdeni-video__lightbox');
    
    if (!lightbox) {
        return;
    }
    
    // Hide lightbox
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    
    // Clear content after animation
    setTimeout(() => {
        const content = lightbox.querySelector('.murdeni-video__lightbox-content');
        content.innerHTML = '';
    }, 300);
}
