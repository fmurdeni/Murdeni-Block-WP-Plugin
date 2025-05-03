/**
 * Murdeni Portfolio Grid Frontend Script
 * 
 * Handles the popup functionality for the Portfolio Grid block
 */

// Use an immediately-invoked function expression to avoid global scope pollution
(function() {
    // Function to initialize the portfolio grid functionality
    function initPortfolioGrid() {
        if (typeof jQuery === 'undefined') {
            console.error('jQuery is not loaded. Portfolio Grid popup functionality will not work.');
            return;
        }
        
        var $ = jQuery;
        // console.log('Portfolio Grid script loaded');
        
        // Attach click event to portfolio grid items using event delegation
        $(document).on('click', '.murdeni-portfolio-grid-item', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // console.log('Portfolio item clicked');
            
            var item = $(this);
            var container = item.closest('.murdeni-portfolio-grid');
            var containerId = container.attr('id');
            var modal = $('#' + containerId + '-modal');
            
            if (!modal.length) {
                console.error('Modal not found for container:', containerId);
                return;
            }
            
            // console.log('Modal found:', modal);
            
            // Get post data from the item
            var title = item.find('.murdeni-portfolio-grid-title').text() || '';
            var category = item.find('.murdeni-portfolio-grid-category').html() || '';
            var tags = item.find('.murdeni-portfolio-grid-tags').html() || '';
            var imageUrlElement = item.find('.murdeni-portfolio-grid-image-url');
            var imageUrl = '';
            
            if (imageUrlElement.length) {
                imageUrl = imageUrlElement.attr('data-full-image-url') || imageUrlElement.data('full-image-url') || '';
                // console.log('Image URL:', imageUrl);
            }
            
            var content = item.find('.murdeni-portfolio-grid-full-content').html() || '';
            
            // Populate modal content
            var modalTitle = modal.find('.murdeni-portfolio-grid-modal-title');
            var modalMeta = modal.find('.murdeni-portfolio-grid-modal-meta');
            var modalTags = modal.find('.murdeni-portfolio-grid-modal-tags');
            var modalImage = modal.find('.murdeni-portfolio-grid-modal-image img');
            var modalBody = modal.find('.murdeni-portfolio-grid-modal-body');
            
            modalTitle.text(title);
            modalMeta.html(category);
            
            // Display tags if available
            if (tags) {
                modalTags.html('<strong>Tags:</strong> ' + tags);
                modalTags.show();
            } else {
                modalTags.hide();
            }
            
            if (imageUrl) {
                modalImage.attr('src', imageUrl);
                modalImage.attr('alt', title);
                modal.find('.murdeni-portfolio-grid-modal-image').show();
            } else {
                modal.find('.murdeni-portfolio-grid-modal-image').hide();
            }
            
            modalBody.html(content);
            
            // Show modal
            modal.css('display', 'block');
            $('body').css('overflow', 'hidden');
            
            // console.log('Modal displayed');
        });
        
        // Close modal when clicking the close button
        $(document).on('click', '.murdeni-portfolio-grid-modal-close', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // console.log('Close button clicked');
            $(this).closest('.murdeni-portfolio-grid-modal').css('display', 'none');
            $('body').css('overflow', 'auto');
        });
        
        // Close modal when clicking outside the content
        $(document).on('click', '.murdeni-portfolio-grid-modal', function(e) {
            if (e.target === this) {
                // console.log('Clicked outside modal content');
                $(this).css('display', 'none');
                $('body').css('overflow', 'auto');
            }
        });
        
        // Close modal with Escape key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                // console.log('Escape key pressed');
                $('.murdeni-portfolio-grid-modal').each(function() {
                    if ($(this).css('display') === 'block') {
                        $(this).css('display', 'none');
                        $('body').css('overflow', 'auto');
                    }
                });
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioGrid);
    } else {
        initPortfolioGrid();
    }
    
    // Also initialize when window is fully loaded (backup)
    window.addEventListener('load', initPortfolioGrid);
})();
