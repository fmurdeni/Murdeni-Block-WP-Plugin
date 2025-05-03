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
        $slides_to_show = isset($attributes['slidesToShow']) ? $attributes['slidesToShow'] : 1;
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
                --testimonial-box-shadow: <?php echo $box_shadow ? '0 4px 16px rgba(0, 0, 0, 0.1)' : 'none'; ?>;
            }
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="testimonial-slider-container">
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
                        $author_image = isset($testimonial['authorImage']) ? $testimonial['authorImage'] : '';
                        ?>
                        <div class="testimonial-slide">
                            <div class="testimonial-card">
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
                                <div class="testimonial-author">
                                    <div class="author-image">
                                        <img src="<?php echo esc_url($author_image); ?>" alt="<?php echo esc_attr($author_name); ?>" />
                                    </div>
                                    <div class="author-info">
                                        <h4><?php echo esc_html($author_name); ?></h4>
                                        <p><?php echo esc_html($author_position); ?></p>
                                    </div>
                                </div>
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
