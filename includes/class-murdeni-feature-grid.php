<?php
/**
 * Feature Grid Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_Feature_Grid
 */
class Murdeni_Feature_Grid {
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
            MURDENI_BLOCKS_PATH . 'build/feature-grid',
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
        <section class="murdeni-feature-grid align-<?php echo esc_attr($content_align); ?>" style="<?php echo esc_attr($container_style); ?>">
            <div class="murdeni-feature-grid__header">
                <?php if ($title) : ?>
                    <h2 class="murdeni-feature-grid__title">
                        <?php echo wp_kses_post($title); ?>
                    </h2>
                <?php endif; ?>

                <?php if ($description) : ?>
                    <div class="murdeni-feature-grid__description">
                        <?php echo wp_kses_post($description); ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="murdeni-feature-grid__items">
                <?php foreach ($items as $item) : ?>
                    <div class="murdeni-feature-grid__item">
                        <div class="murdeni-feature-grid__item-inner">
                            <?php if (!empty($item['image']['url'])) : ?>
                                <div class="murdeni-feature-grid__item-image-container">
                                    <div class="murdeni-feature-grid__item-image">
                                        <img 
                                            src="<?php echo esc_url($item['image']['url']); ?>" 
                                            alt="<?php echo esc_attr($item['image']['alt']); ?>" 
                                            style="width: <?php echo esc_attr($image_size); ?>px; height: <?php echo esc_attr($image_size); ?>px; object-fit: contain;"
                                        />
                                    </div>
                                    <?php if (!empty($item['title'])) : ?>
                                        <h3 class="murdeni-feature-grid__item-title">
                                            <?php echo wp_kses_post($item['title']); ?>
                                        </h3>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>

                            <div class="murdeni-feature-grid__item-content">

                                <?php if (!empty($item['description'])) : ?>
                                    <div class="murdeni-feature-grid__item-description">
                                        <?php echo wp_kses_post($item['description']); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
        
        // Return the output
        return ob_get_clean();
    }
}
