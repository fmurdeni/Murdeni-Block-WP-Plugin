<?php
/**
 * Services Grid Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_Services_Grid
 */
class Murdeni_Services_Grid {
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
            MURDENI_BLOCKS_PATH . 'build/services-grid',
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

        // Generate inline styles
        $container_style = '';
        if ($background_color) {
            $container_style .= 'background-color: ' . esc_attr($background_color) . ';';
        }
        if ($text_color) {
            $container_style .= 'color: ' . esc_attr($text_color) . ';';
        }

        // Start output buffer
        ob_start();
        ?>
        <section class="murdeni-services-grid murdeni-services-grid--<?php echo esc_attr($layout); ?> align-<?php echo esc_attr($content_align); ?>" style="<?php echo esc_attr($container_style); ?>">
            <div class="murdeni-services-grid__header">
                <?php if ($title) : ?>
                    <h2 class="murdeni-services-grid__title">
                        <?php echo wp_kses_post($title); ?>
                    </h2>
                <?php endif; ?>

                <?php if ($description) : ?>
                    <div class="murdeni-services-grid__description">
                        <?php echo wp_kses_post($description); ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="murdeni-services-grid__items murdeni-services-grid__items--<?php echo esc_attr($layout); ?>">
                <?php foreach ($items as $item) : ?>
                    <div class="murdeni-services-grid__item">
                        <div class="murdeni-services-grid__item-inner murdeni-services-grid__item-inner--<?php echo esc_attr($layout); ?>">
                            <?php if (!empty($item['image']['url'])) : ?>
                                <div class="murdeni-services-grid__item-image-container">
                                    <div class="murdeni-services-grid__item-image">
                                        <img 
                                            src="<?php echo esc_url($item['image']['url']); ?>" 
                                            alt="<?php echo esc_attr($item['image']['alt']); ?>" 
                                            style="object-fit: cover;"
                                        />
                                    </div>
                                </div>
                            <?php endif; ?>

                            <div class="murdeni-services-grid__item-content">
                                <?php if (!empty($item['title'])) : ?>
                                    <h3 class="murdeni-services-grid__item-title">
                                        <?php echo wp_kses_post($item['title']); ?>
                                    </h3>
                                <?php endif; ?>

                                <?php if (!empty($item['description'])) : ?>
                                    <div class="murdeni-services-grid__item-description">
                                        <?php echo wp_kses_post($item['description']); ?>
                                    </div>
                                <?php endif; ?>
                                
                                <?php if (!empty($item['buttonText'])) : ?>
                                    <div class="murdeni-services-grid__item-button-container">
                                        <a 
                                            href="<?php echo esc_url(!empty($item['buttonUrl']) ? $item['buttonUrl'] : '#'); ?>" 
                                            class="murdeni-services-grid__item-button"
                                        >
                                            <?php echo esc_html($item['buttonText']); ?>
                                        </a>
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
