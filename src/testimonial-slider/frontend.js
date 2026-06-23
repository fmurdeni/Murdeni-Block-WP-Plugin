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
            const slidesToShow = 1;
            const autoplay = $slider.data('autoplay') !== undefined ? $slider.data('autoplay') : true;
            const autoplaySpeed = $slider.data('autoplay-speed') || 3000;
            const arrows = $slider.data('arrows') !== undefined ? $slider.data('arrows') : true;
            const dots = $slider.data('dots') !== undefined ? $slider.data('dots') : true;
            const infinite = $slider.data('infinite') !== undefined ? $slider.data('infinite') : true;
            const speed = $slider.data('speed') || 500;
            const pauseOnHover = $slider.data('pause-on-hover') !== undefined ? $slider.data('pause-on-hover') : true;
            const originalCount = $slider.children().length;
            const smoothLoop = infinite && originalCount > 1;
            let isLoopResetting = false;

            $slider.children().each(function() {
                const $slide = $(this);
                const $bottom = $slide.find('.testimonial-card-bottom').first();

                if (!$bottom.length || $bottom.find('.testimonial-review-link').length) {
                    return;
                }

                const $previousLink = $slide.prev().find('.testimonial-review-link').last();

                if ($previousLink.length) {
                    $bottom.append($previousLink.clone(false, false));
                }
            });

            if (smoothLoop && !$slider.data('smooth-loop-ready')) {
                const $originalSlides = $slider.children().clone(true, true);
                $slider.empty();
                $slider.append($originalSlides.clone(true, true));
                $slider.append($originalSlides.clone(true, true));
                $slider.append($originalSlides.clone(true, true));
                $slider.data('smooth-loop-ready', true);
            }

            function getOriginalIndex(index) {
                return ((index % originalCount) + originalCount) % originalCount;
            }

            function updateLoopDots(index) {
                const $dots = $slider.next('.murdeni-loop-dots');
                const activeIndex = getOriginalIndex(index);

                $dots.find('li').removeClass('slick-active');
                $dots.find('li').eq(activeIndex).addClass('slick-active');
            }

            function buildLoopDots() {
                if (!smoothLoop || !dots) {
                    return;
                }

                $slider.next('.murdeni-loop-dots').remove();

                const $dots = $('<ul class="slick-dots murdeni-loop-dots" role="tablist"></ul>');

                for (let i = 0; i < originalCount; i++) {
                    const $item = $('<li role="presentation"><button type="button" role="tab">' + (i + 1) + '</button></li>');

                    $item.on('click', function(event) {
                        event.preventDefault();
                        $slider.slick('slickGoTo', originalCount + i);
                    });

                    $dots.append($item);
                }

                $slider.after($dots);
                updateLoopDots(originalCount);
            }
            
            // Initialize Slick slider
            $slider.slick({
                slidesToShow: slidesToShow,
                slidesToScroll: 1,
                autoplay: autoplay,
                autoplaySpeed: autoplaySpeed,
                arrows: arrows,
                dots: smoothLoop ? false : dots,
                infinite: smoothLoop ? false : infinite,
                initialSlide: smoothLoop ? originalCount : 0,
                speed: speed,
                pauseOnHover: pauseOnHover,
                adaptiveHeight: true,
                centerMode: true,
                centerPadding: '22%',
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 1,
                            centerMode: true,
                            centerPadding: '16%',
                            arrows: false
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            centerMode: true,
                            centerPadding: '12%',
                            arrows: false
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            centerMode: true,
                            centerPadding: '24px',
                            arrows: false
                        }
                    }
                ]
            });

            buildLoopDots();

            if (smoothLoop) {
                $slider.on('afterChange', function(event, slick, currentSlide) {
                    updateLoopDots(currentSlide);

                    if (isLoopResetting) {
                        return;
                    }

                    if (currentSlide < originalCount) {
                        isLoopResetting = true;
                        $slider.slick('slickGoTo', currentSlide + originalCount, true);
                        isLoopResetting = false;
                    } else if (currentSlide >= originalCount * 2) {
                        isLoopResetting = true;
                        $slider.slick('slickGoTo', currentSlide - originalCount, true);
                        isLoopResetting = false;
                    }
                });
            }
            
            // Add fade-in effect after initialization
            setTimeout(function() {
                $slider.css('opacity', 1);
            }, 100);
        });
    }
})(jQuery);
