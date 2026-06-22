<?php
/**
 * Custom Listing Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_Custom_Listing
 */
class Murdeni_Custom_Listing {
    /**
     * Initialize the class
     */
    public function init() {
        // Register block
        add_action('init', array($this, 'register_block'));
    }

    /**
     * Register the block
     */
    public function register_block() {
        // Register block using block.json
        register_block_type(
            MURDENI_BLOCKS_PATH . 'build/custom-listing',
            array(
                'render_callback' => array($this, 'render_block'),
            )
        );
    }

    /**
     * Render the block on the frontend
     *
     * @param array $attributes Block attributes.
     * @return string Rendered block HTML.
     */
    public function render_block($attributes) {
        // Extract attributes
        $title = isset($attributes['title']) ? $attributes['title'] : '';
        $description = isset($attributes['description']) ? $attributes['description'] : '';
        $layout = isset($attributes['layout']) ? $attributes['layout'] : 'grid';
        $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;
        $items = isset($attributes['items']) ? $attributes['items'] : array();
        $image_size = isset($attributes['imageSize']) ? $attributes['imageSize'] : 80;
        $content_align = isset($attributes['contentAlign']) ? $attributes['contentAlign'] : 'center';
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '';
        $button_spacing = isset($attributes['buttonSpacing']) ? $attributes['buttonSpacing'] : 10;
        $button_alignment = isset($attributes['buttonAlignment']) ? $attributes['buttonAlignment'] : 'center';

        // Generate inline styles
        $container_style = '';
        if ($background_color) {
            $container_style .= 'background-color: ' . esc_attr($background_color) . ';';
        }
        if ($text_color) {
            $container_style .= 'color: ' . esc_attr($text_color) . ';';
        }

        // CSS variables for columns and button spacing
        $css_vars = '';
        $css_vars .= '--columns: ' . esc_attr($columns) . ';';
        $css_vars .= '--button-spacing: ' . esc_attr($button_spacing) . 'px;';
        $css_vars .= '--button-alignment: ' . esc_attr($button_alignment) . ';';

        // Start output buffer
        ob_start();
        ?>
        <section class="murdeni-custom-listing murdeni-custom-listing--<?php echo esc_attr($layout); ?> align-<?php echo esc_attr($content_align); ?>" style="<?php echo esc_attr($container_style . $css_vars); ?>">
            <div class="murdeni-custom-listing__header">
                <?php if ($title) : ?>
                    <h2 class="murdeni-custom-listing__title">
                        <?php echo wp_kses_post($title); ?>
                    </h2>
                <?php endif; ?>

                <?php if ($description) : ?>
                    <div class="murdeni-custom-listing__description">
                        <?php echo wp_kses_post($description); ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="murdeni-custom-listing__items murdeni-custom-listing__items--<?php echo esc_attr($layout); ?>">
                <?php foreach ($items as $item) : ?>
                    <div class="murdeni-custom-listing__item">
                        <div class="murdeni-custom-listing__item-inner murdeni-custom-listing__item-inner--<?php echo esc_attr($layout); ?>">
                            <?php if (!empty($item['image']['url'])) : ?>
                                <div class="murdeni-custom-listing__item-image-container">
                                    <div class="murdeni-custom-listing__item-image">
                                        <img 
                                            src="<?php echo esc_url($item['image']['url']); ?>" 
                                            alt="<?php echo esc_attr($item['image']['alt']); ?>" 
                                            style="object-fit: cover;"
                                        />
                                    </div>
                                </div>
                            <?php endif; ?>

                            <div class="murdeni-custom-listing__item-content">
                                <?php if (!empty($item['title'])) : ?>
                                    <h3 class="murdeni-custom-listing__item-title">
                                        <?php echo wp_kses_post($item['title']); ?>
                                    </h3>
                                <?php endif; ?>

                                <?php if (!empty($item['description'])) : ?>
                                    <div class="murdeni-custom-listing__item-description">
                                        <?php echo wp_kses_post($item['description']); ?>
                                    </div>
                                <?php endif; ?>
                                
                                <?php if (!empty($item['buttons']) && is_array($item['buttons'])) : ?>
                                    <div class="murdeni-custom-listing__item-buttons-container">
                                        <?php foreach ($item['buttons'] as $button) : ?>
                                            <?php if (!empty($button['text'])) : ?>
                                                <a 
                                                    href="<?php echo esc_url(!empty($button['url']) ? $button['url'] : '#'); ?>" 
                                                    class="murdeni-custom-listing__item-button button-style-<?php echo esc_attr(!empty($button['style']) ? $button['style'] : 'primary'); ?>"
                                                >
                                                    <?php echo esc_html($button['text']); ?>
                                                </a>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
}
