<?php
/**
 * Skills Percentage Block Class
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Murdeni Skills Percentage Class
 */
class Murdeni_Skills_Percentage {

    /**
     * Initialize the class
     */
    public function init() {
        
        add_action('init', array($this, 'register_block'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_filter('render_block', array($this, 'render_block_scripts'), 10, 2);
    }

    /**
     * Register block
     */
    public function register_block() {
        // Register block with render callback
        if (function_exists('register_block_type_from_metadata')) {
            register_block_type_from_metadata(
                MURDENI_BLOCKS_PATH . 'build/skills-percentage',
                array(
                    'render_callback' => array($this, 'render_skills_percentage'),
                )
            );
        }
    }

    /**
     * Enqueue frontend scripts
     */
    public function enqueue_frontend_scripts() {
        // Register frontend style
        wp_register_style(
            'murdeni-skills-percentage-style',
            MURDENI_BLOCKS_URL . 'build/skills-percentage/style-index.css',
            array(),
            MURDENI_BLOCKS_VERSION
        );
        
    }

    /**
     * Render block scripts
     */
    public function render_block_scripts($block_content, $block) {
        if ($block['blockName'] === 'murdeni/skills-percentage') {
            wp_enqueue_script(
                'murdeni-skills-percentage-frontend',
                MURDENI_BLOCKS_URL . 'build/skills-percentage/frontend.js',
                array('jquery'),
                MURDENI_BLOCKS_VERSION,
                true
            );
        }
        return $block_content;
    }

    /**
     * Render skills percentage block
     */
    public function render_skills_percentage($attributes) {
        // Extract attributes
        $skills = isset($attributes['skills']) ? $attributes['skills'] : array();
        $bar_height = isset($attributes['barHeight']) ? $attributes['barHeight'] : 10;
        $bar_color = isset($attributes['barColor']) ? $attributes['barColor'] : '#219a68';
        $bar_background_color = isset($attributes['barBackgroundColor']) ? $attributes['barBackgroundColor'] : '#f0f0f0';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#333333';
        $font_size = isset($attributes['fontSize']) ? $attributes['fontSize'] : 16;
        $bar_border_radius = isset($attributes['barBorderRadius']) ? $attributes['barBorderRadius'] : 10;
        $show_percentage = isset($attributes['showPercentage']) ? $attributes['showPercentage'] : true;
        $animate_on_scroll = isset($attributes['animateOnScroll']) ? $attributes['animateOnScroll'] : true;
        $spacing = isset($attributes['spacing']) ? $attributes['spacing'] : 20;
        
        // Generate unique ID for this block instance
        $block_id = 'murdeni-skills-percentage-' . uniqid();
        
        // Start output buffering
        ob_start();
        
        // Custom CSS variables
        ?>
        <style>
            #<?php echo esc_attr($block_id); ?> {
                --murdeni-skills-spacing: <?php echo esc_attr($spacing); ?>px;
                --murdeni-skills-font-size: <?php echo esc_attr($font_size); ?>px;
                --murdeni-skills-text-color: <?php echo esc_attr($text_color); ?>;
                
            }
            
            #<?php echo esc_attr($block_id); ?> .murdeni-skills-percentage-bar-bg {
                height: <?php echo esc_attr($bar_height); ?>px;
                background-color: <?php echo esc_attr($bar_background_color); ?>;
                border-radius: <?php echo esc_attr($bar_border_radius); ?>px;
            }
            
            #<?php echo esc_attr($block_id); ?> .murdeni-skills-percentage-bar {
                height: <?php echo esc_attr($bar_height); ?>px;
                background-color: <?php echo esc_attr($bar_color); ?>;
                border-radius: <?php echo esc_attr($bar_border_radius); ?>px;
            }
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="murdeni-skills-percentage" data-animate="<?php echo esc_attr($animate_on_scroll ? 'true' : 'false'); ?>">
            <div class="murdeni-skills-percentage-container">
                <?php
                // Loop through skills
                if (!empty($skills)) :
                    foreach ($skills as $skill) :
                        $skill_name = isset($skill['name']) ? $skill['name'] : '';
                        $skill_percentage = isset($skill['percentage']) ? $skill['percentage'] : 0;
                        ?>
                        <div class="murdeni-skills-percentage-item">
                            <div class="murdeni-skills-percentage-header">
                                <span class="murdeni-skills-percentage-name"><?php echo esc_html($skill_name); ?></span>
                                <?php if ($show_percentage) : ?>
                                    <span class="murdeni-skills-percentage-value"><?php echo esc_html($skill_percentage); ?>%</span>
                                <?php endif; ?>
                            </div>
                            <div class="murdeni-skills-percentage-bar-bg">
                                <div 
                                    class="murdeni-skills-percentage-bar" 
                                    data-percentage="<?php echo esc_attr($skill_percentage); ?>"
                                    style="<?php echo $animate_on_scroll ? '' : 'width: ' . esc_attr($skill_percentage) . '%;'; ?>"
                                ></div>
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
