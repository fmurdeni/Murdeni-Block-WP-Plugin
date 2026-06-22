<?php
/**
 * Testimonial Slider Block Class
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Murdeni Testimonial Slider Class
 */
class Murdeni_Testimonial_Slider {

    /**
     * Initialize the class
     */
    public function init() {
        // Register block
        add_action('init', array($this, 'register_block'));       
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_filter('render_block', array($this, 'render_block_scripts'), 10, 2);
    }

    /**
     * Register block
     */
	    public function register_block() {
	        // Register block type from metadata (block.json)
	        if (function_exists('register_block_type_from_metadata')) {
	            register_block_type_from_metadata(
	                MURDENI_BLOCKS_PATH . 'build/testimonial-slider',
                array(
                    'render_callback' => array($this, 'render_testimonial_slider'),
                )
            );
	        }
	    }

	    /**
	     * Get stable initials for generated avatars.
	     */
	    private function get_author_initials($author_name) {
	        $words = preg_split('/\s+/', trim($author_name));
	        $initials = '';

	        if (!empty($words)) {
	            foreach (array_slice($words, 0, 2) as $word) {
	                if (!empty($word)) {
	                    $initials .= strtoupper(substr($word, 0, 1));
	                }
	            }
	        }

	        return !empty($initials) ? $initials : '?';
	    }

	    /**
	     * Get a saved or deterministic color for generated avatars.
	     */
	    private function get_author_avatar_color($testimonial, $author_name) {
	        if (!empty($testimonial['authorAvatarColor']) && preg_match('/^#[0-9a-fA-F]{6}$/', $testimonial['authorAvatarColor'])) {
	            return $testimonial['authorAvatarColor'];
	        }

	        $colors = array('#16a34a', '#0ea5e9', '#f97316', '#8b5cf6', '#ef4444', '#0891b2');
	        $seed = !empty($author_name) ? $author_name : (isset($testimonial['id']) ? $testimonial['id'] : '');
	        $index = abs(crc32($seed)) % count($colors);

	        return $colors[$index];
	    }

	    /**
	     * Check whether the testimonial has a real uploaded author image.
	     */
	    private function has_custom_author_image($author_image) {
	        return !empty($author_image) && strpos($author_image, 'placehold.co') === false;
	    }

	    /**
	     * Normalize per-testimonial review URLs before rendering.
	     */
	    private function normalize_review_url($review_url) {
	        $review_url = trim((string) $review_url);

	        if (empty($review_url)) {
	            return '';
	        }

	        if (!preg_match('/^[a-z][a-z0-9+.-]*:/i', $review_url) && strpos($review_url, '//') !== 0 && strpos($review_url, '#') !== 0) {
	            $review_url = 'https://' . $review_url;
	        }

	        return $review_url;
	    }
	
	    /**
	     * Enqueue frontend scripts
	     */
    public function enqueue_frontend_scripts() {
        // Register Slick CSS
        wp_register_style(
            'slick',
            'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css',
            array(),
            '1.8.1'
        );
        
        // Register Slick Theme CSS
        wp_register_style(
            'slick-theme',
            'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css',
            array('slick'),
            '1.8.1'
        );
        
        // Register Slick JS
        wp_register_script(
            'slick-js',
            'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
            array('jquery'),
            '1.8.1',
            true
        );
        
        // Register testimonial slider style
        wp_register_style(
            'murdeni-block-testimonial-slider-style',
            MURDENI_BLOCKS_URL . 'build/testimonial-slider/style-index.css',
            array('slick', 'slick-theme'),
            MURDENI_BLOCKS_VERSION
        );
        
        // Register testimonial slider script
        wp_register_script(
            'murdeni-block-testimonial-slider-frontend',
            MURDENI_BLOCKS_URL . 'build/testimonial-slider/frontend.js',
            array('jquery', 'slick-js'),
            MURDENI_BLOCKS_VERSION,
            true
        );
        
    }

    public function render_block_scripts($block_content, $block) {
        if ($block['blockName'] === 'murdeni/testimonial-slider') {
            wp_enqueue_style('slick');
            wp_enqueue_style('slick-theme');
            wp_enqueue_style('murdeni-block-testimonial-slider-style');
            wp_enqueue_script('slick-js');
            wp_enqueue_script('murdeni-block-testimonial-slider-frontend');
        }
        return $block_content;
    }

    /**
     * Render testimonial slider block
     */
    public function render_testimonial_slider($attributes) {
        // Extract attributes
        $testimonials = isset($attributes['testimonials']) ? $attributes['testimonials'] : array();
        $top_image = isset($attributes['topImage']) ? $attributes['topImage'] : '';
        $slides_to_show = 1;
        $autoplay = isset($attributes['autoplay']) ? $attributes['autoplay'] : true;
        $autoplay_speed = isset($attributes['autoplaySpeed']) ? $attributes['autoplaySpeed'] : 3000;
        $arrows = isset($attributes['arrows']) ? $attributes['arrows'] : true;
        $dots = isset($attributes['dots']) ? $attributes['dots'] : true;
        $infinite = isset($attributes['infinite']) ? $attributes['infinite'] : true;
        $speed = isset($attributes['speed']) ? $attributes['speed'] : 500;
        $pause_on_hover = isset($attributes['pauseOnHover']) ? $attributes['pauseOnHover'] : true;
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '#ffffff';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#333333';
        $rating_color = isset($attributes['ratingColor']) ? $attributes['ratingColor'] : '#FFD700';
        $border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 8;
        $box_shadow = isset($attributes['boxShadow']) ? $attributes['boxShadow'] : true;
        $show_overall_rating = isset($attributes['showOverallRating']) ? $attributes['showOverallRating'] : false;
        $reviewer_count = isset($attributes['reviewerCount']) ? $attributes['reviewerCount'] : 0;
        $overall_rating_text = isset($attributes['overallRatingText']) ? $attributes['overallRatingText'] : 'Berdasarkan %d ulasan pelanggan';
        $show_review_link = isset($attributes['showReviewLink']) ? $attributes['showReviewLink'] : false;
        $review_link_text = isset($attributes['reviewLinkText']) ? $attributes['reviewLinkText'] : 'Tambahkan Ulasan';
        $review_link_url = isset($attributes['reviewLinkUrl']) ? $attributes['reviewLinkUrl'] : '#';
        $fixed_height = isset($attributes['fixedHeight']) ? $attributes['fixedHeight'] : false;
        $slide_height = isset($attributes['slideHeight']) ? $attributes['slideHeight'] : 300;
        $card_bottom_title = isset($attributes['cardBottomTitle']) ? $attributes['cardBottomTitle'] : 'Klik Kaca Mobil Tangerang - Garansi & Cepat 2 Jam Beres';
        $card_bottom_subtitle = isset($attributes['cardBottomSubtitle']) ? $attributes['cardBottomSubtitle'] : 'Bengkel Kaca Mobil';
        $card_review_link_text = isset($attributes['cardReviewLinkText']) ? $attributes['cardReviewLinkText'] : __('Lihat di Google', 'murdeni-blocks');
        
        // Generate unique ID for this block instance
        $block_id = 'murdeni-testimonial-slider-' . uniqid();
        
        // Start output buffering
        ob_start();
        
        // Custom CSS variables
        ?>
        <style>
            #<?php echo esc_attr($block_id); ?> {
                --testimonial-bg-color: <?php echo esc_attr($background_color); ?>;
                --testimonial-text-color: <?php echo esc_attr($text_color); ?>;
                --testimonial-rating-color: <?php echo esc_attr($rating_color); ?>;
                --testimonial-border-radius: <?php echo esc_attr($border_radius); ?>px;
                --testimonial-box-shadow: <?php echo $box_shadow ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none'; ?>;
                <?php if ($fixed_height) : ?>
                --testimonial-slide-height: <?php echo esc_attr($slide_height); ?>px;
                <?php endif; ?>
            }
            
            <?php if ($fixed_height) : ?>
            #<?php echo esc_attr($block_id); ?> .testimonial-slide {
                height: var(--testimonial-slide-height, 300px);
                overflow-y: auto;
            }
            <?php endif; ?>
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="testimonial-slider-container">
            <div class="testimonial-header">

                <?php if ($show_overall_rating && !empty($testimonials)) : 
                    // Calculate average rating
                    $total_rating = 0;
                    foreach ($testimonials as $testimonial) {
                        $total_rating += isset($testimonial['rating']) ? $testimonial['rating'] : 0;
                    }
                    $average_rating = count($testimonials) > 0 ? $total_rating / count($testimonials) : 0;
                    $formatted_rating = number_format($average_rating, 1);
                ?>
                
                <div class="testimonial-overall-rating">
                    <div class="overall-rating-stars">
                        <?php 
                        // Output stars based on average rating
                        for ($i = 0; $i < 5; $i++) {
                            echo '<span class="' . ($i < $average_rating ? 'star filled' : 'star empty') . '">★</span>';
                        }
                        ?>
                        <span class="average-rating"><?php echo esc_html($formatted_rating); ?></span>
                    </div>
                    <div class="overall-rating-text">
                        <?php echo esc_html(sprintf($overall_rating_text, $reviewer_count)); ?>
                    </div>
                    <?php if ($show_review_link) : ?>
                    <div class="review-link">
                        <a href="<?php echo esc_url($review_link_url); ?>" target="_blank" rel="noopener noreferrer">
                            <?php echo esc_html($review_link_text); ?>
                        </a>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

                <?php if (!empty($top_image)) : ?>
                <img src="<?php echo esc_url($top_image); ?>" alt="" />
                <?php endif; ?>
            </div>
            
            <div class="testimonial-slider" 
                data-slides-to-show="<?php echo esc_attr($slides_to_show); ?>"
                data-autoplay="<?php echo esc_attr($autoplay ? 'true' : 'false'); ?>"
                data-autoplay-speed="<?php echo esc_attr($autoplay_speed); ?>"
                data-arrows="<?php echo esc_attr($arrows ? 'true' : 'false'); ?>"
                data-dots="<?php echo esc_attr($dots ? 'true' : 'false'); ?>"
                data-infinite="<?php echo esc_attr($infinite ? 'true' : 'false'); ?>"
                data-speed="<?php echo esc_attr($speed); ?>"
                data-pause-on-hover="<?php echo esc_attr($pause_on_hover ? 'true' : 'false'); ?>"
                style="opacity: 0; transition: opacity 0.3s ease;"
            >
                <?php
                // Loop through testimonials
                if (!empty($testimonials)) :
                    foreach ($testimonials as $testimonial) :
                        $rating = isset($testimonial['rating']) ? $testimonial['rating'] : 5;
                        $content = isset($testimonial['content']) ? $testimonial['content'] : '';
                        $author_name = isset($testimonial['authorName']) ? $testimonial['authorName'] : '';
                        $author_position = isset($testimonial['authorPosition']) ? $testimonial['authorPosition'] : '';
	                        $author_image = isset($testimonial['authorImage']) && $this->has_custom_author_image($testimonial['authorImage']) ? $testimonial['authorImage'] : '';
	                        $bottom_image = isset($testimonial['bottomImage']) && !empty($testimonial['bottomImage']) ? $testimonial['bottomImage'] : '';
	                        $review_time = isset($testimonial['reviewTime']) ? $testimonial['reviewTime'] : '';
	                        $review_url = isset($testimonial['reviewUrl']) ? $this->normalize_review_url($testimonial['reviewUrl']) : '';
	                        $author_initials = $this->get_author_initials($author_name);
	                        $author_avatar_color = $this->get_author_avatar_color($testimonial, $author_name);
	                        ?>
	                        <div class="testimonial-slide">
	                            <div class="testimonial-card">
	                                <div class="testimonial-author">
	                                    <div class="author-image">
	                                        <?php if (!empty($author_image)) : ?>
	                                        <img src="<?php echo esc_url($author_image); ?>" alt="<?php echo esc_attr($author_name); ?>" />
	                                        <?php else : ?>
	                                        <span class="author-initials" style="background-color: <?php echo esc_attr($author_avatar_color); ?>;">
	                                            <?php echo esc_html($author_initials); ?>
	                                        </span>
	                                        <?php endif; ?>
	                                    </div>
                                    <div class="author-info">
                                        <h4><?php echo esc_html($author_name); ?></h4>
                                        <p><?php echo esc_html($author_position); ?></p>
                                    </div>
                                    <?php if (!empty($review_time)) : ?>
                                    <div class="testimonial-review-time"><?php echo esc_html($review_time); ?></div>
                                    <?php endif; ?>
                                </div>
                                <div class="testimonial-rating">
                                    <?php 
                                    // Output stars based on rating
                                    for ($i = 0; $i < 5; $i++) {
                                        echo '<span class="' . ($i < $rating ? 'star filled' : 'star empty') . '">★</span>';
                                    }
                                    ?>
                                </div>
                                <div class="testimonial-content">
                                    <p><?php echo wp_kses_post($content); ?></p>
                                </div>
                                <?php if (!empty($card_bottom_title) || !empty($card_bottom_subtitle) || !empty($review_url)) : ?>
                                <div class="testimonial-card-bottom">
                                    <div class="testimonial-bottom-copy">
                                        <?php if (!empty($card_bottom_title)) : ?>
                                        <div class="testimonial-bottom-title"><?php echo esc_html($card_bottom_title); ?></div>
                                        <?php endif; ?>
                                        <?php if (!empty($card_bottom_subtitle)) : ?>
                                        <div class="testimonial-bottom-subtitle"><?php echo esc_html($card_bottom_subtitle); ?></div>
                                        <?php endif; ?>
                                    </div>
                                    <?php if (!empty($review_url)) : ?>
                                    <a class="testimonial-review-link" href="<?php echo esc_url($review_url); ?>" target="_blank" rel="noopener noreferrer">
                                        <?php echo esc_html($card_review_link_text); ?>
                                    </a>
                                    <?php endif; ?>
                                </div>
                                <?php endif; ?>
                                <?php if (!empty($bottom_image)) : ?>
                                <div class="testimonial-bottom-image">
                                    <img src="<?php echo esc_url($bottom_image); ?>" alt="" />
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php
                    endforeach;
                endif;
                ?>
            </div>
        </div>
        <?php
        
        // Return the output
        return ob_get_clean();
    }
}
