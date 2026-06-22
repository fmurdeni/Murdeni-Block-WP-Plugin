/**
 * Frontend JavaScript for the Custom Listing block
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any frontend functionality for the custom listing block
    const customListingBlocks = document.querySelectorAll('.murdeni-custom-listing');
    
    if (customListingBlocks.length) {
        customListingBlocks.forEach(block => {
            // Add hover effects or other interactive features if needed
            const items = block.querySelectorAll('.murdeni-custom-listing__item');
            
            items.forEach(item => {
                // Example: Add click event for mobile devices to show hover state
                item.addEventListener('touchstart', function() {
                    // Implementation if needed
                });
            });
        });
    }
});
