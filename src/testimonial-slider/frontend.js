/**
 * Testimonial Slider Frontend Script
 * 
 * This script initializes the Slick slider for testimonials
 */

(function($) {
    'use strict';

    // Initialize testimonial sliders when DOM is ready
    $(document).ready(function() {
        initTestimonialSliders();
    });

    // Re-initialize sliders when new content is loaded (for AJAX pagination, etc.)
    $(document).on('post-load', function() {
        initTestimonialSliders();
    });

    // Initialize all testimonial sliders on the page
    function initTestimonialSliders() {
        $('.testimonial-slider').each(function() {
            const $slider = $(this);
            
            // Skip if already initialized
            if ($slider.hasClass('slick-initialized')) {
                return;
            }
            
            // Get settings from data attributes
            const slidesToShow = $slider.data('slides-to-show') || 1;
            const autoplay = $slider.data('autoplay') !== undefined ? $slider.data('autoplay') : true;
            const autoplaySpeed = $slider.data('autoplay-speed') || 3000;
            const arrows = $slider.data('arrows') !== undefined ? $slider.data('arrows') : true;
            const dots = $slider.data('dots') !== undefined ? $slider.data('dots') : true;
            const infinite = $slider.data('infinite') !== undefined ? $slider.data('infinite') : true;
            const speed = $slider.data('speed') || 500;
            const pauseOnHover = $slider.data('pause-on-hover') !== undefined ? $slider.data('pause-on-hover') : true;
            
            // Initialize Slick slider
            $slider.slick({
                slidesToShow: slidesToShow,
                slidesToScroll: 1,
                autoplay: autoplay,
                autoplaySpeed: autoplaySpeed,
                arrows: arrows,
                dots: dots,
                infinite: infinite,
                speed: speed,
                pauseOnHover: pauseOnHover,
                adaptiveHeight: true,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: Math.min(slidesToShow, 2),
                            arrows: false
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            arrows: false
                        }
                    }
                ]
            });
            
            // Add fade-in effect after initialization
            setTimeout(function() {
                $slider.css('opacity', 1);
            }, 100);
        });
    }
})(jQuery);
