<?php
/**
 * Work Process Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_Work_Process
 */
class Murdeni_Work_Process {
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
            MURDENI_BLOCKS_PATH . 'build/work-process',
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
        $items = isset($attributes['items']) ? $attributes['items'] : array();
        $content_align = isset($attributes['contentAlign']) ? $attributes['contentAlign'] : 'center';
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '';
        $icon_background_color = isset($attributes['iconBackgroundColor']) ? $attributes['iconBackgroundColor'] : '#e6f7f5';
        $icon_color = isset($attributes['iconColor']) ? $attributes['iconColor'] : '#00b8a9';
        $number_color = isset($attributes['numberColor']) ? $attributes['numberColor'] : '#00b8a9';

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
        <section class="murdeni-work-process align-<?php echo esc_attr($content_align); ?>" style="<?php echo esc_attr($container_style); ?>">
            <div class="murdeni-work-process__header">
                <?php if ($title) : ?>
                    <h2 class="murdeni-work-process__title">
                        <?php echo wp_kses_post($title); ?>
                    </h2>
                <?php endif; ?>

                <?php if ($description) : ?>
                    <div class="murdeni-work-process__description">
                        <?php echo wp_kses_post($description); ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="murdeni-work-process__items">
                <?php foreach ($items as $item) : ?>
                    <div class="murdeni-work-process__item">
                        <div class="murdeni-work-process__item-inner">
                            <?php if (!empty($item['number'])) : ?>
                                <div class="murdeni-work-process__item-number" style="color: <?php echo esc_attr($number_color); ?>">
                                    <span class="murdeni-work-process__item-number-text">
                                        <?php echo esc_html($item['number']); ?>
                                    </span>
                                </div>
                            <?php endif; ?>
                            
                            <div class="murdeni-work-process__item-icon-container" style="background-color: <?php echo esc_attr($icon_background_color); ?>">
                                <?php if (!empty($item['icon']['url'])) : ?>
                                    <div class="murdeni-work-process__item-icon">
                                        <img 
                                            src="<?php echo esc_url($item['icon']['url']); ?>" 
                                            alt="<?php echo esc_attr($item['icon']['alt']); ?>" 
                                            style="width: 40px; height: 40px; object-fit: contain;"
                                        />
                                    </div>
                                <?php endif; ?>
                            </div>

                            <div class="murdeni-work-process__item-content">
                                <?php if (!empty($item['title'])) : ?>
                                    <h3 class="murdeni-work-process__item-title">
                                        <?php echo wp_kses_post($item['title']); ?>
                                    </h3>
                                <?php endif; ?>

                                <?php if (!empty($item['description'])) : ?>
                                    <div class="murdeni-work-process__item-description">
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
        return ob_get_clean();
    }
}
