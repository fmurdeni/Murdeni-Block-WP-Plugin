<?php
/**
 * WhatsApp Button Block Class
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Murdeni WhatsApp Button Class
 */
class Murdeni_WhatsApp_Button {

    /**
     * Initialize the class
     */
    public function init() {
        // Register block
        add_action('init', array($this, 'register_block'));
    }

    /**
     * Register block
     */
    public function register_block() {
        // Register block type from metadata (block.json)
        if (function_exists('register_block_type_from_metadata')) {
            register_block_type_from_metadata(
                MURDENI_BLOCKS_PATH . 'build/whatsapp-button',
                array(
                    'render_callback' => array($this, 'render_whatsapp_button'),
                )
            );
        }
    }

    /**
     * Render WhatsApp button block
     */
    public function render_whatsapp_button($attributes) {
        // Extract attributes
        $phone_number = isset($attributes['phoneNumber']) ? $attributes['phoneNumber'] : '';
        $message = isset($attributes['message']) ? $attributes['message'] : 'Hello, I have a question about your services.';
        $button_text = isset($attributes['buttonText']) ? $attributes['buttonText'] : 'Chat via WhatsApp';
        $button_subtitle = isset($attributes['buttonSubtitle']) ? $attributes['buttonSubtitle'] : '';
        $button_size = isset($attributes['buttonSize']) ? $attributes['buttonSize'] : 'medium';
        $button_style = isset($attributes['buttonStyle']) ? $attributes['buttonStyle'] : 'filled';
        $button_color = isset($attributes['buttonColor']) ? $attributes['buttonColor'] : '#25D366';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#FFFFFF';
        $border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 4;
        $show_icon = isset($attributes['showIcon']) ? $attributes['showIcon'] : true;
        $icon_position = isset($attributes['iconPosition']) ? $attributes['iconPosition'] : 'before';
        $button_width = isset($attributes['buttonWidth']) ? $attributes['buttonWidth'] : 'auto';
        $center_content = isset($attributes['centerContent']) ? $attributes['centerContent'] : false;
        $custom_class = isset($attributes['customClass']) ? $attributes['customClass'] : '';
        $open_in_new_tab = isset($attributes['openInNewTab']) ? $attributes['openInNewTab'] : true;
        $floating_button = isset($attributes['floatingButton']) ? $attributes['floatingButton'] : false;
        $floating_position = isset($attributes['floatingPosition']) ? $attributes['floatingPosition'] : 'bottom-right';
        $image_url = isset($attributes['imageUrl']) ? $attributes['imageUrl'] : '';
        $image_width = isset($attributes['imageWidth']) ? $attributes['imageWidth'] : 200;
        $image_height = isset($attributes['imageHeight']) ? $attributes['imageHeight'] : 0;
        $image_alt = isset($attributes['imageAlt']) ? $attributes['imageAlt'] : 'WhatsApp Chat';
        
        // Generate unique ID for this block instance
        $block_id = 'murdeni-whatsapp-button-' . uniqid();
        
        // Prepare WhatsApp URL
        $whatsapp_url = 'https://wa.me/' . $phone_number;
        if (!empty($message)) {
            $whatsapp_url .= '?text=' . urlencode($message);
        }
        
        // WhatsApp icon SVG
        $whatsapp_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="whatsapp-icon"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
        
        // Start output buffering
        ob_start();
        
        // Custom CSS variables
        ?>
        <style>
            #<?php echo esc_attr($block_id); ?> {
                --button-color: <?php echo esc_attr($button_color); ?>;
                --text-color: <?php echo esc_attr($text_color); ?>;
                --border-radius: <?php echo esc_attr($border_radius); ?>px;
            }
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="murdeni-whatsapp-button <?php echo esc_attr($button_size); ?> <?php echo esc_attr($button_style); ?> <?php echo $button_width === 'full' ? 'full-width' : ''; ?> <?php echo $center_content ? 'content-align-center' : ''; ?> <?php echo esc_attr($custom_class); ?> <?php echo $floating_button ? 'floating ' . esc_attr($floating_position) : ''; ?>">
            <div class="whatsapp-button-wrapper<?php echo $button_style === 'image' ? ' image-button' : ''; ?>">
                <a 
                    href="<?php echo esc_url($whatsapp_url); ?>" 
                    class="whatsapp-button <?php echo esc_attr($button_style); ?> <?php echo $button_style !== 'image' ? esc_attr($button_size) : ''; ?>"
                    <?php echo $open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
                >
                    <?php if ($button_style === 'image' && !empty($image_url)) : ?>
                        <img 
                            src="<?php echo esc_url($image_url); ?>" 
                            alt="<?php echo esc_attr($image_alt); ?>"
                            <?php if ($image_width > 0) : ?>
                                width="<?php echo esc_attr($image_width); ?>"
                            <?php endif; ?>
                            <?php if ($image_height > 0) : ?>
                                height="<?php echo esc_attr($image_height); ?>"
                            <?php endif; ?>
                        />
                    <?php else : ?>
                        <?php if ($show_icon && $icon_position === 'before') echo $whatsapp_icon; ?>
                        <div class="button-text-container">
                            <span class="button-text"><?php echo esc_html($button_text); ?></span>
                            <?php if (!empty($button_subtitle)) : ?>
                                <span class="button-subtitle"><?php echo esc_html($button_subtitle); ?></span>
                            <?php endif; ?>
                        </div>
                        <?php if ($show_icon && $icon_position === 'after') echo $whatsapp_icon; ?>
                    <?php endif; ?>
                </a>
            </div>
        </div>
        <?php
        
        // Return the output
        return ob_get_clean();
    }
}
