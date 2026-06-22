<?php
/**
 * Murdeni FAQ Block Class
 * 
 * Handles registration and rendering of the FAQ block.
 * 
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_FAQ
 */
class Murdeni_FAQ {
    
    /**
     * Initialize the block
     */
    public function init() {
        // Register block assets.
        add_action('init', array($this, 'register_block_assets'));
        
        // Register frontend script for FAQ functionality.
        add_action('wp_enqueue_scripts', array($this, 'register_frontend_assets'));
    }
    
    /**
     * Register block assets
     */
    public function register_block_assets() {
        // Register block editor script
        wp_register_script(
            'murdeni-faq-editor',
            MURDENI_BLOCKS_URL . 'build/faq/index.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data'),
            MURDENI_BLOCKS_VERSION,
            true
        );

        // Register block editor styles
        wp_register_style(
            'murdeni-faq-editor-style',
            MURDENI_BLOCKS_URL . 'build/faq/index.css',
            array('wp-edit-blocks'),
            MURDENI_BLOCKS_VERSION
        );

        // Register frontend styles
        wp_register_style(
            'murdeni-faq-style',
            MURDENI_BLOCKS_URL . 'build/faq/style-index.css',
            array(),
            MURDENI_BLOCKS_VERSION
        );

        // Register block type.
        register_block_type(
            MURDENI_BLOCKS_PATH . 'build/faq',
            array(
                'render_callback' => array($this, 'render_block'),
                'editor_script'   => 'murdeni-faq-editor',
                'editor_style'    => 'murdeni-faq-editor-style',
                'style'           => 'murdeni-faq-style',
            )
        );
    }
    
    /**
     * Register frontend assets
     */
    public function register_frontend_assets() {
        // Register frontend script
        wp_register_script(
            'murdeni-faq-frontend',
            MURDENI_BLOCKS_URL . 'build/faq/frontend.js',
            array(),
            MURDENI_BLOCKS_VERSION,
            true
        );
    }
    
    /**
     * Register block category
     */
    public function register_block_category($categories, $post) {
        return array_merge(
            $categories,
            array(
                array(
                    'slug' => 'murdeni-blocks',
                    'title' => __('Murdeni Blocks', 'murdeni-blocks'),
                )
            )
        );
    }
   
    
    /**
     * Render the FAQ block
     *
     * @param array $attributes Block attributes
     * @return string Rendered block HTML
     */
    public function render_block($attributes) {
        // Enqueue frontend script
        wp_enqueue_script('murdeni-faq-frontend');
        
        // Extract attributes
        $items = isset($attributes['items']) ? $attributes['items'] : array();
        $allow_multiple = isset($attributes['allowMultipleOpen']) ? $attributes['allowMultipleOpen'] : false;
        $initially_open = isset($attributes['initiallyOpen']) ? $attributes['initiallyOpen'] : false;
        $title_tag = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h3';
        $title_font_size = isset($attributes['titleFontSize']) ? $attributes['titleFontSize'] : 18;
        $title_color = isset($attributes['titleColor']) ? $attributes['titleColor'] : '';
        $content_font_size = isset($attributes['contentFontSize']) ? $attributes['contentFontSize'] : 16;
        $content_color = isset($attributes['contentColor']) ? $attributes['contentColor'] : '';
        $border_width = isset($attributes['borderWidth']) ? $attributes['borderWidth'] : 1;
        $border_color = isset($attributes['borderColor']) ? $attributes['borderColor'] : '#e0e0e0';
        $border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 4;
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '';
        $active_background_color = isset($attributes['activeBackgroundColor']) ? $attributes['activeBackgroundColor'] : '';
        $icon_color = isset($attributes['iconColor']) ? $attributes['iconColor'] : '';
        $icon_position = isset($attributes['iconPosition']) ? $attributes['iconPosition'] : 'right';
        $icon_type = isset($attributes['iconType']) ? $attributes['iconType'] : 'plus-minus';
        $spacing = isset($attributes['spacing']) ? $attributes['spacing'] : 10;
        $padding = isset($attributes['padding']) ? $attributes['padding'] : 15;
        $section_title = isset($attributes['sectionTitle']) ? $attributes['sectionTitle'] : '';
        $section_title_tag = isset($attributes['sectionTitleTag']) ? $attributes['sectionTitleTag'] : 'h2';
        $section_title_font_size = isset($attributes['sectionTitleFontSize']) ? $attributes['sectionTitleFontSize'] : 24;
        $section_title_color = isset($attributes['sectionTitleColor']) ? $attributes['sectionTitleColor'] : '';
        $section_title_align = isset($attributes['sectionTitleAlign']) ? $attributes['sectionTitleAlign'] : 'center';
        
        // Generate unique ID for this FAQ block
        $block_id = 'murdeni-faq-' . uniqid();
        
        // Start output buffering
        ob_start();
        
        // Custom inline styles
        $custom_css = "
            #{$block_id} .murdeni-faq__item {
                margin-bottom: {$spacing}px;
                border-width: {$border_width}px;
                border-color: 1px solid var(--color-background-faq-border, {$border_color});
                border-radius: {$border_radius}px;
                " . ($background_color ? "background-color: {$background_color};" : "") . "
            }
            #{$block_id} .murdeni-faq__item.is-open {
                " . ($active_background_color ? "background-color: {$active_background_color};" : "") . "
            }
            #{$block_id} .murdeni-faq__header {
                padding: {$padding}px;
                font-size: {$title_font_size}px;
                " . ($title_color ? "color: {$title_color};" : "") . "
                " . ($icon_position === 'left' ? "flex-direction: row-reverse;" : "") . "
            }
            #{$block_id} .murdeni-faq__content {                
                font-size: {$content_font_size}px;
                " . ($content_color ? "color: {$content_color};" : "") . "
                border-top: {$border_width}px solid var(--color-background-faq-border, {$border_color});
            }
            #{$block_id} .murdeni-faq__icon {
                " . ($icon_color ? "color: {$icon_color};" : "") . "
            }
            #{$block_id} .murdeni-faq__section-title {
                font-size: {$section_title_font_size}px;
                text-align: {$section_title_align};
                " . ($section_title_color ? "color: {$section_title_color};" : "") . "
                margin-bottom: 20px;
            }
        ";
        ?>
        <style>
            <?php echo $custom_css; ?>
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="murdeni-faq" data-allow-multiple="<?php echo esc_attr($allow_multiple ? 'true' : 'false'); ?>" data-initially-open="<?php echo esc_attr($initially_open ? 'true' : 'false'); ?>">
            <?php if (!empty($section_title)) : ?>
                <<?php echo esc_html($section_title_tag); ?> class="murdeni-faq__section-title">
                    <?php echo esc_html($section_title); ?>
                </<?php echo esc_html($section_title_tag); ?>>
            <?php endif; ?>
            
            <div class="murdeni-faq__items">
                <?php foreach ($items as $item) : ?>
                    <div class="murdeni-faq__item">
                        <div class="murdeni-faq__header">
                            <<?php echo esc_html($title_tag); ?> class="murdeni-faq__title">
                                <?php echo wp_kses_post($item['question']); ?>
                            </<?php echo esc_html($title_tag); ?>>
                            
                            <div class="murdeni-faq__icon">
                                <?php if ($icon_type === 'plus-minus') : ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="murdeni-faq__icon-plus">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="murdeni-faq__icon-minus" style="display: none;">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                <?php else : ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="murdeni-faq__icon-arrow">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="murdeni-faq__content">
                            <div class="murdeni-faq__answer">
                                <?php echo wp_kses_post($item['answer']); ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        
        // Return the buffered content
        return ob_get_clean();
    }
}
