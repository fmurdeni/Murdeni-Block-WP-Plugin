/**
 * Gallery Carousel Frontend Script
 * 
 * Handles carousel functionality for the Gallery Carousel block.
 */

(function($) {
    'use strict';

    // Initialize when DOM is ready
    $(document).ready(function() {
        initGalleryCarousels();
    });

    /**
     * Initialize all gallery carousels on the page
     */
    function initGalleryCarousels() {
        $('.murdeni-gallery-carousel').each(function() {
            const carousel = $(this);
            const carouselId = carousel.attr('id');
            
            // Get carousel settings
            const slidesToShow = parseInt(carousel.data('slides-to-show')) || 3;
            const gap = parseInt(carousel.data('gap')) || 20;
            const showArrows = carousel.data('show-arrows') !== 'false';
            const showDots = carousel.data('show-dots') !== 'false';
            const autoplay = carousel.data('autoplay') || false;
            const autoplaySpeed = parseInt(carousel.data('autoplay-speed')) || 3000;
            
            // Debug autoplay settings
            console.log('Carousel settings:', {
                id: carouselId,
                slidesToShow,
                gap,
                showArrows,
                showDots,
                autoplay,
                autoplaySpeed
            });
            
            // Set CSS variables for styling
            carousel.css('--slides-to-show', slidesToShow);
            carousel.css('--gap-size', gap + 'px');
            
            // Initialize carousel
            const carouselInstance = new GalleryCarousel(carousel, {
                slidesToShow: slidesToShow,
                gap: gap,
                showArrows: showArrows,
                showDots: showDots,
                autoplay: autoplay,
                autoplaySpeed: autoplaySpeed
            });
            
            // Store carousel instance in data attribute
            carousel.data('carousel-instance', carouselInstance);
        });
    }

    /**
     * Gallery Carousel Class
     */
    class GalleryCarousel {
        /**
         * Constructor
         * 
         * @param {jQuery} element - Carousel element
         * @param {Object} options - Carousel options
         */
        constructor(element, options) {
            this.carousel = element;
            this.track = this.carousel.find('.murdeni-gallery-carousel__track');
            this.items = this.carousel.find('.murdeni-gallery-carousel__item');
            this.prevBtn = this.carousel.find('.murdeni-gallery-carousel__arrow--prev');
            this.nextBtn = this.carousel.find('.murdeni-gallery-carousel__arrow--next');
            this.dots = this.carousel.find('.murdeni-gallery-carousel__dot');
            
            // Options
            this.options = {
                slidesToShow: options.slidesToShow || 3,
                gap: options.gap || 20,
                showArrows: options.showArrows !== false,
                showDots: options.showDots !== false,
                autoplay: options.autoplay || false,
                autoplaySpeed: options.autoplaySpeed || 3000
            };
            
            // State
            this.currentSlide = 0;
            this.totalSlides = this.items.length;
            this.slideWidth = 0;
            this.autoplayTimer = null;
            
            // Initialize
            this.init();
        }
        
        /**
         * Initialize carousel
         */
        init() {
            if (this.totalSlides <= 0) {
                return;
            }
            
            // Calculate slide width
            this.calculateSlideWidth();
            
            // Set initial position
            this.goToSlide(0);
            
            // Add event listeners
            this.bindEvents();
            
            // Start autoplay if enabled
            if (this.options.autoplay) {
                // Small delay to ensure everything is properly initialized
                setTimeout(() => {
                    this.startAutoplay();
                }, 100);
            }
            
            // Handle window resize
            $(window).on('resize', this.handleResize.bind(this));
        }
        
        /**
         * Calculate slide width
         */
        calculateSlideWidth() {
            const containerWidth = this.carousel.width();
            const totalGapWidth = (this.options.slidesToShow - 1) * this.options.gap;
            this.slideWidth = (containerWidth - totalGapWidth) / this.options.slidesToShow;
            
            // Set width for each slide
            this.items.css({
                'flex-basis': this.slideWidth + 'px',
                'max-width': this.slideWidth + 'px',
                'margin-right': this.options.gap + 'px'
            });
        }
        
        /**
         * Bind event listeners
         */
        bindEvents() {
            // Arrow navigation
            if (this.options.showArrows) {
                this.prevBtn.on('click', this.prevSlide.bind(this));
                this.nextBtn.on('click', this.nextSlide.bind(this));
            }
            
            // Dot navigation
            if (this.options.showDots) {
                this.dots.on('click', this.onDotClick.bind(this));
            }
            
            // Pause autoplay on hover
            if (this.options.autoplay) {
                this.carousel.on('mouseenter', this.stopAutoplay.bind(this));
                this.carousel.on('mouseleave', this.startAutoplay.bind(this));
            }
            
            // Touch swipe for mobile
            this.initTouchSwipe();
        }
        
        /**
         * Go to specific slide
         * 
         * @param {number} index - Slide index
         */
        goToSlide(index) {
            // Ensure index is within bounds
            if (index < 0) {
                index = 0;
            } else if (index > this.totalSlides - this.options.slidesToShow) {
                index = this.totalSlides - this.options.slidesToShow;
            }
            
            // Update current slide
            this.currentSlide = index;
            
            // Calculate translation
            const translateX = -1 * this.slideWidth * index;
            const gapOffset = index * this.options.gap;
            
            // Apply translation
            this.track.css('transform', `translateX(${translateX - gapOffset}px)`);
            
            // Update dots
            if (this.options.showDots) {
                this.dots.removeClass('is-active');
                this.dots.eq(index).addClass('is-active');
            }
            
            // Update arrow states
            this.updateArrowStates();
        }
        
        /**
         * Go to next slide
         */
        nextSlide() {
            this.goToSlide(this.currentSlide + 1);
        }
        
        /**
         * Go to previous slide
         */
        prevSlide() {
            this.goToSlide(this.currentSlide - 1);
        }
        
        /**
         * Handle dot click
         * 
         * @param {Event} e - Click event
         */
        onDotClick(e) {
            const index = $(e.currentTarget).data('index');
            this.goToSlide(index);
        }
        
        /**
         * Update arrow states (disabled/enabled)
         */
        updateArrowStates() {
            if (this.options.showArrows) {
                // Enable/disable prev button
                if (this.currentSlide <= 0) {
                    this.prevBtn.prop('disabled', true).addClass('is-disabled');
                } else {
                    this.prevBtn.prop('disabled', false).removeClass('is-disabled');
                }
                
                // Enable/disable next button
                if (this.currentSlide >= this.totalSlides - this.options.slidesToShow) {
                    this.nextBtn.prop('disabled', true).addClass('is-disabled');
                } else {
                    this.nextBtn.prop('disabled', false).removeClass('is-disabled');
                }
            }
        }
        
        /**
         * Start autoplay
         */
        startAutoplay() {
            // Clear any existing timer first
            this.stopAutoplay();
            
            if (this.options.autoplay) {
                console.log('Starting autoplay with speed:', this.options.autoplaySpeed);
                this.autoplayTimer = setInterval(() => {
                    if (this.currentSlide < this.totalSlides - this.options.slidesToShow) {
                        this.nextSlide();
                    } else {
                        this.goToSlide(0); // Loop back to first slide
                    }
                }, this.options.autoplaySpeed);
            }
        }
        
        /**
         * Stop autoplay
         */
        stopAutoplay() {
            if (this.autoplayTimer) {
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        }
        
        /**
         * Handle window resize
         */
        handleResize() {
            // Recalculate slide width
            this.calculateSlideWidth();
            
            // Update current slide position
            this.goToSlide(this.currentSlide);
        }
        
        /**
         * Initialize touch swipe functionality
         */
        initTouchSwipe() {
            const container = this.carousel.find('.murdeni-gallery-carousel__container');
            let touchStartX = 0;
            let touchStartY = 0;
            let initialScrollTop = 0;
            let startTime = 0;
            let isHorizontalSwipe = false;
            let hasMoved = false;
            
            // Handle touch start
            container.on('touchstart', (e) => {
                // Store initial touch position
                touchStartX = e.originalEvent.touches[0].clientX;
                touchStartY = e.originalEvent.touches[0].clientY;
                initialScrollTop = $(window).scrollTop();
                startTime = new Date().getTime();
                isHorizontalSwipe = false;
                hasMoved = false;
                
                // Pause autoplay during swipe
                if (this.options.autoplay) {
                    this.stopAutoplay();
                }
            });
            
            // Handle touch move - but don't interfere with vertical scrolling
            container.on('touchmove', (e) => {
                if (e.originalEvent.touches.length !== 1) return;
                
                const touchX = e.originalEvent.touches[0].clientX;
                const touchY = e.originalEvent.touches[0].clientY;
                
                const diffX = touchStartX - touchX;
                const diffY = touchStartY - touchY;
                hasMoved = true;
                
                // Determine if this is primarily a horizontal swipe
                // Only interfere with default behavior if it's clearly a horizontal swipe
                if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 10) {
                    isHorizontalSwipe = true;
                    e.preventDefault();
                    
                    // Apply visual feedback during swipe
                    const currentTranslateX = -1 * this.slideWidth * this.currentSlide;
                    const gapOffset = this.currentSlide * this.options.gap;
                    const dragOffset = -diffX;
                    this.track.css('transform', `translateX(${currentTranslateX - gapOffset + dragOffset}px)`);
                } else {
                    // Let the browser handle vertical scrolling naturally
                    isHorizontalSwipe = false;
                }
            });
            
            // Handle touch end
            container.on('touchend', (e) => {
                const endTime = new Date().getTime();
                const touchDuration = endTime - startTime;
                
                // Only process as a swipe if:
                // 1. It was primarily a horizontal movement
                // 2. The touch didn't last too long (not a slow drag)
                // 3. The user actually moved their finger
                if (isHorizontalSwipe && touchDuration < 300 && hasMoved) {
                    const touchX = e.originalEvent.changedTouches[0].clientX;
                    const diffX = touchStartX - touchX;
                    
                    // Minimum swipe distance threshold
                    const threshold = 50;
                    
                    if (Math.abs(diffX) > threshold) {
                        if (diffX > 0) {
                            // Swipe left - go to next slide
                            this.nextSlide();
                        } else {
                            // Swipe right - go to previous slide
                            this.prevSlide();
                        }
                    } else {
                        // Reset to current slide if swipe wasn't significant
                        this.goToSlide(this.currentSlide);
                    }
                } else {
                    // Reset position for non-swipe touches
                    this.goToSlide(this.currentSlide);
                }
                
                // Resume autoplay if it was enabled
                if (this.options.autoplay) {
                    this.startAutoplay();
                }
            });
            
            // Handle mouse events separately (desktop only)
            if (!('ontouchstart' in window)) {
                let isMouseDown = false;
                let mouseStartX = 0;
                
                container.on('mousedown', (e) => {
                    isMouseDown = true;
                    mouseStartX = e.clientX;
                    e.preventDefault(); // Prevent text selection
                    
                    if (this.options.autoplay) {
                        this.stopAutoplay();
                    }
                });
                
                $(document).on('mousemove', (e) => {
                    if (!isMouseDown) return;
                    
                    const diffX = mouseStartX - e.clientX;
                    
                    // Apply visual feedback during mouse drag
                    const currentTranslateX = -1 * this.slideWidth * this.currentSlide;
                    const gapOffset = this.currentSlide * this.options.gap;
                    const dragOffset = -diffX;
                    this.track.css('transform', `translateX(${currentTranslateX - gapOffset + dragOffset}px)`);
                });
                
                $(document).on('mouseup mouseleave', (e) => {
                    if (!isMouseDown) return;
                    isMouseDown = false;
                    
                    const diffX = mouseStartX - e.clientX;
                    const threshold = 50;
                    
                    if (Math.abs(diffX) > threshold) {
                        if (diffX > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    } else {
                        this.goToSlide(this.currentSlide);
                    }
                    
                    if (this.options.autoplay) {
                        this.startAutoplay();
                    }
                });
            }
        }
    }

})(jQuery);
