<?php
/**
 * Portfolio Grid Block Class
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Murdeni Portfolio Grid Class
 */
class Murdeni_Portfolio_Grid {

    /**
     * Initialize the class
     */
    public function init() {
        // Register block
        add_action('init', array($this, 'register_block'));
        
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Enqueue frontend scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
    }

    /**
     * Register block
     */
    public function register_block() {
        // Register block with render callback
        if (function_exists('register_block_type_from_metadata')) {
            register_block_type_from_metadata(
                MURDENI_BLOCKS_PATH . 'build/portfolio-grid',
                array(
                    'render_callback' => array($this, 'render_portfolio_grid'),
                )
            );
        }
    }

    /**
     * Register REST API endpoints
     */
    public function register_rest_routes() {
        // We can reuse the same endpoints from the post grid block
        // as they provide the same functionality
    }

    /**
     * Enqueue frontend scripts
     */
    public function enqueue_frontend_scripts() {
        // Register editor script
        wp_register_script(
            'murdeni-portfolio-grid-editor',
            MURDENI_BLOCKS_URL . 'build/portfolio-grid/index.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-api-fetch'),
            MURDENI_BLOCKS_VERSION,
            true
        );
        
        // Register editor style
        wp_register_style(
            'murdeni-portfolio-grid-editor',
            MURDENI_BLOCKS_URL . 'build/portfolio-grid/index.css',
            array('wp-edit-blocks'),
            MURDENI_BLOCKS_VERSION
        );
        
        // Register frontend style
        wp_register_style(
            'murdeni-portfolio-grid-style',
            MURDENI_BLOCKS_URL . 'build/portfolio-grid/style-index.css',
            array(),
            MURDENI_BLOCKS_VERSION
        );
        
        // Enqueue frontend script if block is used
        // if (has_block('murdeni/portfolio-grid')) {
            wp_enqueue_script(
                'murdeni-portfolio-grid-frontend',
                MURDENI_BLOCKS_URL . 'build/portfolio-grid/frontend.js',
                array('jquery'),
                MURDENI_BLOCKS_VERSION,
                true
            );
        // }
    }

    /**
     * Render portfolio grid block
     */
    public function render_portfolio_grid($attributes) {
        // Extract attributes
        $post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
        $posts_to_show = isset($attributes['postsToShow']) ? $attributes['postsToShow'] : 6;
        $order = isset($attributes['order']) ? $attributes['order'] : 'desc';
        $order_by = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
        $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;
        $display_title = isset($attributes['displayTitle']) ? $attributes['displayTitle'] : true;
        $display_category = isset($attributes['displayCategory']) ? $attributes['displayCategory'] : true;
        $image_size = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'medium';
        $aspect_ratio = isset($attributes['aspectRatio']) ? $attributes['aspectRatio'] : '1:1';
        $grid_gap = isset($attributes['gridGap']) ? $attributes['gridGap'] : 20;
        $title_font_size = isset($attributes['titleFontSize']) ? $attributes['titleFontSize'] : 18;
        $meta_font_size = isset($attributes['metaFontSize']) ? $attributes['metaFontSize'] : 12;
        $hover_effect = isset($attributes['hoverEffect']) ? $attributes['hoverEffect'] : 'zoom';
        $overlay_color = isset($attributes['overlayColor']) ? $attributes['overlayColor'] : 'rgba(0, 0, 0, 0.7)';
        $overlay_text_color = isset($attributes['overlayTextColor']) ? $attributes['overlayTextColor'] : '#ffffff';
        $border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 0;
        $overlay_content_position = isset($attributes['overlayContentPosition']) ? $attributes['overlayContentPosition'] : 'center';
        
        // Convert aspect ratio to class name
        $aspect_ratio_class = 'murdeni-portfolio-grid-aspect-' . str_replace(':', '-', $aspect_ratio);
        
        // Convert hover effect to class name
        $hover_effect_class = 'murdeni-portfolio-grid-hover-' . $hover_effect;
        
        // Query args
        $args = array(
            'post_type'      => $post_type,
            'posts_per_page' => $posts_to_show,
            'order'          => $order,
            'orderby'        => $order_by,
            'post_status'    => 'publish',
        );
        
        // Add taxonomy query if set
        if (!empty($attributes['taxonomies'])) {
            $tax_query = array();
            
            foreach ($attributes['taxonomies'] as $taxonomy => $terms) {
                if (!empty($terms)) {
                    $tax_query[] = array(
                        'taxonomy' => $taxonomy,
                        'field'    => 'term_id',
                        'terms'    => $terms,
                    );
                }
            }
            
            if (!empty($tax_query)) {
                $args['tax_query'] = $tax_query;
            }
        }
        
        // Get posts
        $query = new WP_Query($args);
        
        // Generate unique ID for this block instance
        $block_id = 'murdeni-portfolio-grid-' . uniqid();
        
        // Start output buffering
        ob_start();
        
        // Custom CSS variables
        ?>
        <style>
            #<?php echo esc_attr($block_id); ?> {
                --murdeni-pg-columns: <?php echo esc_attr($columns); ?>;
                --murdeni-pg-grid-gap: <?php echo esc_attr($grid_gap); ?>px;
                --murdeni-pg-title-font-size: <?php echo esc_attr($title_font_size); ?>px;
                --murdeni-pg-meta-font-size: <?php echo esc_attr($meta_font_size); ?>px;
                --murdeni-pg-overlay-color: <?php echo esc_attr($overlay_color); ?>;
                --murdeni-pg-overlay-text-color: <?php echo esc_attr($overlay_text_color); ?>;
                --murdeni-pg-border-radius: <?php echo esc_attr($border_radius); ?>px;
                --murdeni-pg-overlay-position: <?php echo esc_attr($overlay_content_position); ?>;
            }
        </style>
        
        <div id="<?php echo esc_attr($block_id); ?>" class="murdeni-portfolio-grid">
            <div class="murdeni-portfolio-grid-container">
                <?php
                // Loop through posts
                if ($query->have_posts()) :
                    while ($query->have_posts()) :
                        $query->the_post();
                        
                        // Get featured image
                        $image_url = '';
                        $image_alt = '';
                        $full_image_url = '';
                        
                        if (has_post_thumbnail()) {
                            $image_id = get_post_thumbnail_id();
                            $image = wp_get_attachment_image_src($image_id, $image_size);
                            $full_image = wp_get_attachment_image_src($image_id, 'full');
                            $image_url = $image[0];
                            $full_image_url = $full_image[0];
                            $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                        }
                        
                        // Get categories
                        $categories = array();
                        $category_html = '';
                        
                        // Get tags
                        $tags = array();
                        $tags_html = '';
                        
                        if ($post_type === 'post') {
                            // Get categories
                            $post_categories = get_the_category();
                            
                            if (!empty($post_categories)) {
                                foreach ($post_categories as $category) {
                                    $categories[] = $category->name;
                                }
                                
                                $category_html = implode(', ', $categories);
                            }
                            
                            // Get tags
                            $post_tags = get_the_tags();
                            
                            if (!empty($post_tags)) {
                                foreach ($post_tags as $tag) {
                                    $tags[] = $tag->name;
                                }
                                
                                $tags_html = implode(', ', $tags);
                            }
                        } else {
                            // Get taxonomies for this post type
                            $taxonomies = get_object_taxonomies($post_type, 'objects');
                            
                            foreach ($taxonomies as $taxonomy) {
                                $terms = get_the_terms(get_the_ID(), $taxonomy->name);
                                
                                if (!empty($terms) && !is_wp_error($terms)) {
                                    if ($taxonomy->hierarchical) { // Hierarchical taxonomies (like categories)
                                        foreach ($terms as $term) {
                                            $categories[] = $term->name;
                                        }
                                    } else { // Non-hierarchical taxonomies (like tags)
                                        foreach ($terms as $term) {
                                            $tags[] = $term->name;
                                        }
                                    }
                                }
                            }
                            
                            if (!empty($categories)) {
                                $category_html = implode(', ', $categories);
                            }
                            
                            if (!empty($tags)) {
                                $tags_html = implode(', ', $tags);
                            }
                        }
                        ?>
                        <article class="murdeni-portfolio-grid-item <?php echo esc_attr($hover_effect_class); ?>" data-post-id="<?php the_ID(); ?>">
                            <div class="murdeni-portfolio-grid-image-wrapper <?php echo esc_attr($aspect_ratio_class); ?>">
                                <?php if ($image_url) : ?>
                                    <div class="murdeni-portfolio-grid-image">
                                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>" class="murdeni-portfolio-grid-thumbnail">
                                        <span class="murdeni-portfolio-grid-image-url" data-image-url="<?php echo esc_url($image_url); ?>" data-full-image-url="<?php echo esc_url($full_image_url); ?>"></span>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="murdeni-portfolio-grid-overlay">
                                    <?php if ($display_title) : ?>
                                        <h3 class="murdeni-portfolio-grid-title"><?php the_title(); ?></h3>
                                    <?php endif; ?>
                                    
                                    <?php if ($display_category && !empty($category_html)) : ?>
                                        <div class="murdeni-portfolio-grid-category"><?php echo esc_html($category_html); ?></div>
                                    <?php endif; ?>
                                </div>
                            </div>
                            
                            <div class="murdeni-portfolio-grid-full-content" style="display: none;">
                                <?php the_content(); ?>
                            </div>
                            
                            <?php if (!empty($tags_html)) : ?>
                                <div class="murdeni-portfolio-grid-tags" style="display: none;">
                                    <?php echo esc_html($tags_html); ?>
                                </div>
                            <?php endif; ?>
                        </article>
                        <?php
                    endwhile;
                    wp_reset_postdata();
                else :
                    ?>
                    <p><?php esc_html_e('No items found.', 'murdeni-blocks'); ?></p>
                    <?php
                endif;
                ?>
            </div>
            
            <!-- Modal -->
            <div id="<?php echo esc_attr($block_id); ?>-modal" class="murdeni-portfolio-grid-modal">
                <div class="murdeni-portfolio-grid-modal-content">
                    <span class="murdeni-portfolio-grid-modal-close">&times;</span>
                    
                    <div class="murdeni-portfolio-grid-modal-image">
                        <img src="" alt="">
                    </div>
                    
                    <div class="murdeni-portfolio-grid-modal-header">
                        <h2 class="murdeni-portfolio-grid-modal-title"></h2>
                        <div class="murdeni-portfolio-grid-modal-meta"></div>
                        <div class="murdeni-portfolio-grid-modal-tags"></div>
                    </div>
                    
                    <div class="murdeni-portfolio-grid-modal-body"></div>
                </div>
            </div>
        </div>
        <?php
        
        // Return the output
        return ob_get_clean();
    }
}
