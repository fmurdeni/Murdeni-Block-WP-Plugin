/**
 * Murdeni Post Grid Popup Frontend Script
 * 
 * Handles the popup functionality for the Post Grid Popup block
 */

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        initPostGridPopup();
    });
    
    /**
     * Initialize Post Grid Popup functionality
     */
    function initPostGridPopup() {
        // Get all post grid popup containers
        const popupContainers = document.querySelectorAll('.murdeni-post-grid-popup');
        if (!popupContainers.length) return;
        
        // Loop through each container
        popupContainers.forEach(container => {
            const containerId = container.id;
            const modal = document.getElementById(containerId + '-modal');
            
            if (!modal) return;
            
            const closeBtn = modal.querySelector('.murdeni-post-grid-popup-modal-close');
            const modalTitle = modal.querySelector('.murdeni-post-grid-popup-modal-title');
            const modalMeta = modal.querySelector('.murdeni-post-grid-popup-modal-meta');
            const modalImage = modal.querySelector('.murdeni-post-grid-popup-modal-image img');
            const modalBody = modal.querySelector('.murdeni-post-grid-popup-modal-body');
            
            // Get all popup buttons within this container
            const popupButtons = container.querySelectorAll('.murdeni-post-grid-popup-button');
            
            // Add click event to popup buttons
            popupButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const postId = this.getAttribute('data-post-id');
                    const article = container.querySelector(`.murdeni-post-grid-popup-item[data-post-id="${postId}"]`);
                    
                    if (!article) return;
                    
                    // Get post data from the article
                    const title = article.querySelector('.murdeni-post-grid-popup-title').textContent;
                    const meta = article.querySelector('.murdeni-post-grid-popup-meta') ? 
                                article.querySelector('.murdeni-post-grid-popup-meta').innerHTML : '';
                    const imageUrlElement = article.querySelector('.murdeni-post-grid-popup-featured-image-url');
                    const imageUrl = imageUrlElement ? imageUrlElement.getAttribute('data-image-url') : '';
                    const content = article.querySelector('.murdeni-post-grid-popup-full-content').innerHTML;
                    
                    // Populate modal content
                    modalTitle.textContent = title;
                    modalMeta.innerHTML = meta;
                    
                    if (imageUrl) {
                        modalImage.src = imageUrl;
                        modalImage.alt = title;
                        modal.querySelector('.murdeni-post-grid-popup-modal-image').style.display = 'block';
                    } else {
                        modal.querySelector('.murdeni-post-grid-popup-modal-image').style.display = 'none';
                    }
                    
                    modalBody.innerHTML = content;
                    
                    // Show modal
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                });
            });
            
            // Also make the entire card clickable
            const cards = container.querySelectorAll('.murdeni-post-grid-popup-card');
            
            cards.forEach(card => {
                card.addEventListener('click', function(e) {
                    // Don't trigger if clicking on the button (it has its own handler)
                    if (e.target.closest('.murdeni-post-grid-popup-button')) {
                        return;
                    }
                    
                    const article = this.closest('.murdeni-post-grid-popup-item');
                    if (!article) return;
                    
                    const postId = article.getAttribute('data-post-id');
                    const button = article.querySelector(`.murdeni-post-grid-popup-button[data-post-id="${postId}"]`);
                    
                    if (button) {
                        // Simulate button click
                        button.click();
                    }
                });
            });
            
            // Close modal when clicking the close button
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            // Close modal when clicking outside the content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
})();
