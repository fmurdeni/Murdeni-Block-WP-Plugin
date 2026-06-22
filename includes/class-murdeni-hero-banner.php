<?php
/**
 * Hero Banner Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Murdeni_Hero_Banner
 */
class Murdeni_Hero_Banner {
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
            MURDENI_BLOCKS_PATH . 'build/hero-banner',
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
        $background_image = isset($attributes['backgroundImage']) ? $attributes['backgroundImage'] : array('url' => '', 'id' => 0, 'alt' => '');
        $overlay_dark = isset($attributes['overlayDark']) ? $attributes['overlayDark'] : false;
        $title = isset($attributes['title']) ? $attributes['title'] : '';
        $title_type = isset($attributes['titleType']) ? $attributes['titleType'] : 'h2';
        $title_size = isset($attributes['titleSize']) ? $attributes['titleSize'] : 32;
        $subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : '';
        $subtitle_size = isset($attributes['subtitleSize']) ? $attributes['subtitleSize'] : 'medium';
        $show_subtitle = isset($attributes['showSubtitle']) ? $attributes['showSubtitle'] : true;
        $description = isset($attributes['description']) ? $attributes['description'] : '';
        $buttons = isset($attributes['buttons']) ? $attributes['buttons'] : array();
        $content_align = isset($attributes['contentAlign']) ? $attributes['contentAlign'] : 'left';
        $vertical_align = isset($attributes['verticalAlign']) ? $attributes['verticalAlign'] : 'center';
        $full_height = isset($attributes['fullHeight']) ? $attributes['fullHeight'] : false;
        $min_height = isset($attributes['minHeight']) ? $attributes['minHeight'] : 400;
        $padding_top = isset($attributes['paddingTop']) ? $attributes['paddingTop'] : 60;
        $padding_bottom = isset($attributes['paddingBottom']) ? $attributes['paddingBottom'] : 60;
        
        // USP List attributes
        $show_usp_list = isset($attributes['showUspList']) ? $attributes['showUspList'] : false;
        $usp_items = isset($attributes['uspItems']) ? $attributes['uspItems'] : array();
        $usp_layout = isset($attributes['uspLayout']) ? $attributes['uspLayout'] : 'horizontal';
        $usp_icon_size = isset($attributes['uspIconSize']) ? $attributes['uspIconSize'] : 24;
        $usp_spacing = isset($attributes['uspSpacing']) ? $attributes['uspSpacing'] : 10;

        // Generate inline styles
        $height_style = $full_height ? 'height: 85vh;' : sprintf('min-height: %dpx;', $min_height);
        
        $container_style = sprintf(
            '%s padding-top: %dpx; padding-bottom: %dpx; position: relative; display: flex; align-items: %s; justify-content: %s; %s',
            $height_style,
            $padding_top,
            $padding_bottom,
            $vertical_align,
            $content_align === 'center' ? 'center' : ($content_align === 'right' ? 'flex-end' : 'flex-start'),
            $background_image['url'] ? 'background-image: url(' . esc_url($background_image['url']) . '); background-size: cover; background-position: center;' : ''
        );

        // Start output buffer
        ob_start();
        ?>
        <section class="murdeni-hero-banner align-<?php echo esc_attr($content_align); ?>" style="<?php echo esc_attr($container_style); ?>">
            <?php if ($overlay_dark) : ?>
                <div class="murdeni-hero-banner__overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1;"></div>
            <?php endif; ?>

            <div class="murdeni-hero-banner__content" style="position: relative; z-index: 2; width: 100%; padding: 0 20px;">
                <div class="murdeni-hero-banner__inner">
                    <?php if ($title) : ?>
                        <<?php echo esc_attr($title_type); ?> class="murdeni-hero-banner__title" style="font-size: <?php echo esc_attr($title_size); ?>px;">
                            <?php echo wp_kses_post($title); ?>
                        </<?php echo esc_attr($title_type); ?>>
                    <?php endif; ?>

                    <?php if ($show_subtitle && $subtitle) : ?>
                        <div class="murdeni-hero-banner__subtitle murdeni-hero-banner__subtitle--<?php echo esc_attr($subtitle_size); ?>" style="<?php echo $overlay_dark ? 'color: #fff;' : ''; ?>">
                            <?php echo wp_kses_post($subtitle); ?>
                        </div>
                    <?php endif; ?>

                    <?php if ($description) : ?>
                        <div class="murdeni-hero-banner__description" style="<?php echo $overlay_dark ? 'color: #fff;' : ''; ?>">
                            <?php echo wp_kses_post($description); ?>
                        </div>
                    <?php endif; ?>

                    <?php if ($show_usp_list && !empty($usp_items)) : ?>
                        <div class="murdeni-hero-banner__usp-list murdeni-hero-banner__usp-list--<?php echo esc_attr($usp_layout); ?>" 
                             style="margin-bottom: 30px; display: flex; flex-direction: <?php echo $usp_layout === 'horizontal' ? 'row' : 'column'; ?>; flex-wrap: <?php echo $usp_layout === 'horizontal' ? 'wrap' : 'nowrap'; ?>; gap: <?php echo esc_attr($usp_spacing); ?>px; <?php echo $overlay_dark ? 'color: #fff;' : ''; ?>">
                            <?php foreach ($usp_items as $item) : ?>
                                <div class="murdeni-hero-banner__usp-item" 
                                     style="display: flex; align-items: center;">
                                    <?php if (!empty($item['icon']['url'])) : ?>
                                        <div class="murdeni-hero-banner__usp-icon" 
                                             style="margin-right: 10px; width: <?php echo esc_attr($usp_icon_size); ?>px; 
                                                    height: <?php echo esc_attr($usp_icon_size); ?>px; flex-shrink: 0;">
                                            <img src="<?php echo esc_url($item['icon']['url']); ?>" 
                                                 alt="<?php echo esc_attr($item['icon']['alt'] ?? ''); ?>" 
                                                 style="width: 100%; height: 100%; object-fit: contain;" />
                                        </div>
                                    <?php endif; ?>
                                    <div class="murdeni-hero-banner__usp-text">
                                        <?php echo esc_html($item['text']); ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($buttons)) : ?>
                        <div class="murdeni-hero-banner__buttons">
                            <?php foreach ($buttons as $button) : ?>
                                <a href="<?php echo esc_url($button['url']); ?>" 
                                   class="murdeni-hero-banner__button murdeni-hero-banner__button--<?php echo esc_attr($button['buttonStyle']); ?>"
                                   <?php echo isset($button['isExternal']) && $button['isExternal'] ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
                                    <?php echo esc_html($button['text']); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
}
