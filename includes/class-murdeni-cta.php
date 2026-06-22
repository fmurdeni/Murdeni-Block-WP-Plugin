<?php
/**
 * Murdeni CTA Block Class
 * 
 * Handles registration and rendering of the CTA block.
 * 
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_CTA
 */
class Murdeni_CTA {
    
    /**
     * Initialize the block
     */
    public function init() {
        // Register block assets.
        add_action('init', array($this, 'register_block_assets'));
    }
    
    /**
     * Register block assets
     */
    public function register_block_assets() {
        // Register block editor script
        wp_register_script(
            'murdeni-cta-editor',
            MURDENI_BLOCKS_URL . 'build/cta/index.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data'),
            MURDENI_BLOCKS_VERSION,
            true
        );

        // Register block editor styles
        wp_register_style(
            'murdeni-cta-editor-style',
            MURDENI_BLOCKS_URL . 'build/cta/index.css',
            array('wp-edit-blocks'),
            MURDENI_BLOCKS_VERSION
        );

        // Register frontend styles
        wp_register_style(
            'murdeni-cta-style',
            MURDENI_BLOCKS_URL . 'build/cta/style-index.css',
            array(),
            MURDENI_BLOCKS_VERSION
        );

        // Register block type.
        register_block_type(
            MURDENI_BLOCKS_PATH . 'build/cta',
            array(
                'render_callback' => array($this, 'render_block'),
                'editor_script'   => 'murdeni-cta-editor',
                'editor_style'    => 'murdeni-cta-editor-style',
                'style'           => 'murdeni-cta-style',
            )
        );
    }
    
    /**
     * Render the CTA block
     *
     * @param array $attributes Block attributes
     * @return string Rendered block HTML
     */
    public function render_block($attributes) {
        // Extract attributes
        $title = isset($attributes['title']) ? $attributes['title'] : '';
        $title_tag = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h2';
        $title_font_size = isset($attributes['titleFontSize']) ? $attributes['titleFontSize'] : 32;
        $title_color = isset($attributes['titleColor']) ? $attributes['titleColor'] : '';
        
        $description = isset($attributes['description']) ? $attributes['description'] : '';
        $description_font_size = isset($attributes['descriptionFontSize']) ? $attributes['descriptionFontSize'] : 18;
        $description_color = isset($attributes['descriptionColor']) ? $attributes['descriptionColor'] : '';
        
        $button_text = isset($attributes['buttonText']) ? $attributes['buttonText'] : '';
        $button_url = isset($attributes['buttonUrl']) ? $attributes['buttonUrl'] : '#';
        $button_new_tab = isset($attributes['buttonNewTab']) ? $attributes['buttonNewTab'] : false;
        $button_background_color = isset($attributes['buttonBackgroundColor']) ? $attributes['buttonBackgroundColor'] : '';
        $button_text_color = isset($attributes['buttonTextColor']) ? $attributes['buttonTextColor'] : '';
        $button_border_radius = isset($attributes['buttonBorderRadius']) ? $attributes['buttonBorderRadius'] : 4;
        $button_size = isset($attributes['buttonSize']) ? $attributes['buttonSize'] : 'medium';
        
        $layout = isset($attributes['layout']) ? $attributes['layout'] : 'centered';
        $content_width = isset($attributes['contentWidth']) ? $attributes['contentWidth'] : 800;
        $content_alignment = isset($attributes['contentAlignment']) ? $attributes['contentAlignment'] : 'center';
        
        $padding = isset($attributes['padding']) ? $attributes['padding'] : array(
            'top' => 60,
            'right' => 30,
            'bottom' => 60,
            'left' => 30
        );
        
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '';
        $background_image = isset($attributes['backgroundImage']) ? $attributes['backgroundImage'] : array('url' => '', 'id' => 0, 'alt' => '');
        $background_overlay = isset($attributes['backgroundOverlay']) ? $attributes['backgroundOverlay'] : '';
        $background_overlay_opacity = isset($attributes['backgroundOverlayOpacity']) ? $attributes['backgroundOverlayOpacity'] : 0.7;
        $border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 0;
        $box_shadow = isset($attributes['boxShadow']) ? $attributes['boxShadow'] : false;
        
        // Generate unique ID for this CTA block
        $block_id = 'murdeni-cta-' . uniqid();
        
        // Start output buffering
        ob_start();
        
        // Custom inline styles
        $custom_css = "
            #{$block_id} {
                " . ($background_color ? "background-color: {$background_color};" : "") . "
                " . ($background_image['url'] ? "background-image: url({$background_image['url']});" : "") . "
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: {$border_radius}px;
                " . ($box_shadow ? "box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" : "") . "
                padding: {$padding['top']}px {$padding['right']}px {$padding['bottom']}px {$padding['left']}px;
                text-align: {$content_alignment};
                position: relative;
                overflow: hidden;
            }
            #{$block_id} .murdeni-cta__title {
                font-size: {$title_font_size}px;
                " . ($title_color ? "color: {$title_color};" : "") . "
            }
            #{$block_id} .murdeni-cta__description {
                font-size: {$description_font_size}px;
                " . ($description_color ? "color: {$description_color};" : "") . "
            }
            #{$block_id} .murdeni-cta__button {
                " . ($button_background_color ? "background-color: {$button_background_color};" : "") . "
                " . ($button_text_color ? "color: {$button_text_color};" : "") . "
                border-radius: {$button_border_radius}px;
            }
            #{$block_id} .murdeni-cta__content {
                max-width: {$content_width}px;
                " . ($content_alignment === 'center' ? "margin: 0 auto;" : "") . "
            }
        ";
        ?>
        <style>
            <?php echo $custom_css; ?>
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="murdeni-cta murdeni-cta--<?php echo esc_attr($layout); ?> <?php echo $background_overlay ? 'has-overlay' : ''; ?>" <?php if ($background_overlay) : ?>style="--overlay-color: <?php echo esc_attr($background_overlay); ?>; --overlay-opacity: <?php echo esc_attr($background_overlay_opacity); ?>;"<?php endif; ?>>
            
            <div class="murdeni-cta__content">
                <?php if ($layout === 'split' || $layout === 'banner') : ?>
                    <div class="murdeni-cta__text-content">
                <?php endif; ?>
                
                <?php if ($title) : ?>
                    <<?php echo esc_html($title_tag); ?> class="murdeni-cta__title">
                        <?php echo wp_kses_post($title); ?>
                    </<?php echo esc_html($title_tag); ?>>
                <?php endif; ?>
                
                <?php if ($description) : ?>
                    <p class="murdeni-cta__description">
                        <?php echo wp_kses_post($description); ?>
                    </p>
                <?php endif; ?>
                
                <?php if ($layout === 'split' || $layout === 'banner') : ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($button_text && $button_url) : ?>
                    <div class="murdeni-cta__button-container">
                        <a href="<?php echo esc_url($button_url); ?>" 
                           class="murdeni-cta__button murdeni-cta__button--<?php echo esc_attr($button_size); ?>"
                           <?php echo $button_new_tab ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
                            <span class="murdeni-cta__button-text"><?php echo esc_html($button_text); ?></span>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        
        // Return the buffered content
        return ob_get_clean();
    }
}
