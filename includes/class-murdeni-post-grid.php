<?php
/**
 * Main plugin class
 */
class Murdeni_Post_Grid {
    /**
     * Initialize the plugin
     */
    public function init() {
        // Register block assets
        add_action('init', array($this, 'register_block_assets'));
        
        // Register block category
        add_filter('block_categories_all', array($this, 'register_block_category'), 10, 2);
        
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    

    /**
     * Register block assets
     */
    public function register_block_assets() {
        // Register block editor script
        wp_register_script(
            'murdeni-post-grid-editor',
            MURDENI_BLOCKS_URL . 'build/post-grid/index.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch'),
            MURDENI_BLOCKS_VERSION,
            true
        );

        // Register block editor styles
        wp_register_style(
            'murdeni-post-grid-editor-style',
            MURDENI_BLOCKS_URL . 'build/post-grid/index.css',
            array('wp-edit-blocks'),
            MURDENI_BLOCKS_VERSION
        );

        // Register frontend styles
        wp_register_style(
            'murdeni-post-grid-style',
            MURDENI_BLOCKS_URL . 'build/post-grid/style-index.css',
            array(),
            MURDENI_BLOCKS_VERSION
        );

        // Register block type
        register_block_type('murdeni/post-grid', array(
            'editor_script' => 'murdeni-post-grid-editor',
            'editor_style' => 'murdeni-post-grid-editor-style',
            'style' => 'murdeni-post-grid-style',
            'render_callback' => array($this, 'render_post_grid_block'),
            'attributes' => $this->get_block_attributes(),
        ));

        // Set translations
        if (function_exists('wp_set_script_translations')) {
            wp_set_script_translations('murdeni-post-grid-editor', 'murdeni-blocks', MURDENI_BLOCKS_PATH . 'languages');
        }
    }

    /**
     * Get block attributes
     */
    public function get_block_attributes() {
        return array(
            'postType' => array(
                'type' => 'string',
                'default' => 'post',
            ),
            'postsToShow' => array(
                'type' => 'number',
                'default' => 6,
            ),
            'order' => array(
                'type' => 'string',
                'default' => 'desc',
            ),
            'orderBy' => array(
                'type' => 'string',
                'default' => 'date',
            ),
            'categories' => array(
                'type' => 'array',
                'default' => [],
            ),
            'tags' => array(
                'type' => 'array',
                'default' => [],
            ),
            'taxonomies' => array(
                'type' => 'object',
                'default' => (object) [],
            ),
            'layout' => array(
                'type' => 'string',
                'default' => 'grid',
            ),
            'columns' => array(
                'type' => 'number',
                'default' => 3,
            ),
            'displayFeaturedImage' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'displayTitle' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'displayExcerpt' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'excerptLength' => array(
                'type' => 'number',
                'default' => 20,
            ),
            'displayReadMore' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'readMoreText' => array(
                'type' => 'string',
                'default' => 'Baca Selengkapnya',
            ),
            'displayDate' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'displayAuthor' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'displayCategory' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'imageSize' => array(
                'type' => 'string',
                'default' => 'medium',
            ),
            'aspectRatio' => array(
                'type' => 'string',
                'default' => '16:9',
            ),
            'gridGap' => array(
                'type' => 'number',
                'default' => 20,
            ),
            'cardStyle' => array(
                'type' => 'string',
                'default' => 'bordered',
            ),
            'titleFontSize' => array(
                'type' => 'number',
                'default' => 18,
            ),
            'contentFontSize' => array(
                'type' => 'number',
                'default' => 14,
            ),
            'metaFontSize' => array(
                'type' => 'number',
                'default' => 12,
            ),
            'alignment' => array(
                'type' => 'string',
                'default' => 'left',
            ),
            'className' => array(
                'type' => 'string',
                'default' => '',
            ),
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
                ),
            )
        );
    }

    /**
     * Register REST API endpoints
     */
    public function register_rest_routes() {
        // Register route for getting post types
        register_rest_route('murdeni-post-grid/v1', '/post-types', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_post_types'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));

        // Register route for getting taxonomies
        register_rest_route('murdeni-post-grid/v1', '/taxonomies/(?P<post_type>[a-zA-Z0-9_-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_taxonomies'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));

        // Register route for getting terms
        register_rest_route('murdeni-post-grid/v1', '/terms/(?P<taxonomy>[a-zA-Z0-9_-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_terms'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));
    }

    /**
     * Get post types for REST API
     */
    public function get_post_types($request) {
        $post_types = get_post_types(
            array(
                'public' => true,
                'show_in_rest' => true,
            ),
            'objects'
        );

        $data = array();
        foreach ($post_types as $post_type) {
            if ($post_type->name === 'attachment') {
                continue;
            }
            $data[] = array(
                'value' => $post_type->name,
                'label' => $post_type->label,
            );
        }

        return rest_ensure_response($data);
    }

    /**
     * Get taxonomies for REST API
     */
    public function get_taxonomies($request) {
        $post_type = $request['post_type'];
        $taxonomies = get_object_taxonomies($post_type, 'objects');

        $data = array();
        foreach ($taxonomies as $taxonomy) {
            if ($taxonomy->show_in_rest) {
                $data[] = array(
                    'value' => $taxonomy->name,
                    'label' => $taxonomy->label,
                    'restBase' => $taxonomy->rest_base ? $taxonomy->rest_base : $taxonomy->name,
                );
            }
        }

        return rest_ensure_response($data);
    }

    /**
     * Get terms for REST API
     */
    public function get_terms($request) {
        $taxonomy = $request['taxonomy'];
        $terms = get_terms(array(
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
        ));

        if (is_wp_error($terms)) {
            return rest_ensure_response(array());
        }

        $data = array();
        foreach ($terms as $term) {
            $data[] = array(
                'value' => $term->term_id,
                'label' => $term->name,
            );
        }

        return rest_ensure_response($data);
    }

    /**
     * Render post grid block
     */
    public function render_post_grid_block($attributes) {
        // Extract attributes
        $post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
        $posts_to_show = isset($attributes['postsToShow']) ? $attributes['postsToShow'] : 6;
        $order = isset($attributes['order']) ? $attributes['order'] : 'desc';
        $order_by = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
        $categories = isset($attributes['categories']) ? $attributes['categories'] : array();
        $tags = isset($attributes['tags']) ? $attributes['tags'] : array();
        $taxonomies = isset($attributes['taxonomies']) ? (array) $attributes['taxonomies'] : array();
        $layout = isset($attributes['layout']) ? $attributes['layout'] : 'grid';
        $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;
        $display_featured_image = isset($attributes['displayFeaturedImage']) ? $attributes['displayFeaturedImage'] : true;
        $display_title = isset($attributes['displayTitle']) ? $attributes['displayTitle'] : true;
        $display_excerpt = isset($attributes['displayExcerpt']) ? $attributes['displayExcerpt'] : true;
        $excerpt_length = isset($attributes['excerptLength']) ? $attributes['excerptLength'] : 20;
        $display_read_more = isset($attributes['displayReadMore']) ? $attributes['displayReadMore'] : true;
        $read_more_text = isset($attributes['readMoreText']) ? $attributes['readMoreText'] : __('Baca Selengkapnya', 'murdeni-post-grid');
        $display_date = isset($attributes['displayDate']) ? $attributes['displayDate'] : true;
        $display_author = isset($attributes['displayAuthor']) ? $attributes['displayAuthor'] : false;
        $display_category = isset($attributes['displayCategory']) ? $attributes['displayCategory'] : true;
        $image_size = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'medium';
        $aspect_ratio = isset($attributes['aspectRatio']) ? $attributes['aspectRatio'] : '16:9';
        $grid_gap = isset($attributes['gridGap']) ? $attributes['gridGap'] : 20;
        $card_style = isset($attributes['cardStyle']) ? $attributes['cardStyle'] : 'bordered';
        $title_font_size = isset($attributes['titleFontSize']) ? $attributes['titleFontSize'] : 18;
        $content_font_size = isset($attributes['contentFontSize']) ? $attributes['contentFontSize'] : 14;
        $meta_font_size = isset($attributes['metaFontSize']) ? $attributes['metaFontSize'] : 12;
        $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';
        $class_name = isset($attributes['className']) ? $attributes['className'] : '';

        // Build query arguments
        $args = array(
            'post_type' => $post_type,
            'posts_per_page' => $posts_to_show,
            'order' => $order,
            'orderby' => $order_by,
            'ignore_sticky_posts' => 1,
        );

        // Add taxonomy queries
        $tax_query = array();

        // Add categories
        if (!empty($categories) && $post_type === 'post') {
            $tax_query[] = array(
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => $categories,
            );
        }

        // Add tags
        if (!empty($tags) && $post_type === 'post') {
            $tax_query[] = array(
                'taxonomy' => 'post_tag',
                'field' => 'term_id',
                'terms' => $tags,
            );
        }

        // Add custom taxonomies
        foreach ($taxonomies as $taxonomy => $terms) {
            if (!empty($terms)) {
                $tax_query[] = array(
                    'taxonomy' => $taxonomy,
                    'field' => 'term_id',
                    'terms' => $terms,
                );
            }
        }

        // Add tax query to args
        if (!empty($tax_query)) {
            $args['tax_query'] = $tax_query;
        }

        // Get posts
        $query = new WP_Query($args);

        // Start output buffer
        ob_start();

        if ($query->have_posts()) {
            // Generate unique ID for this instance
            $unique_id = 'murdeni-post-grid-' . uniqid();

            // Calculate column width based on columns
            $column_width = 100 / $columns;

            // Get aspect ratio values
            $aspect_ratio_values = explode(':', $aspect_ratio);
            $aspect_ratio_x = isset($aspect_ratio_values[0]) ? intval($aspect_ratio_values[0]) : 16;
            $aspect_ratio_y = isset($aspect_ratio_values[1]) ? intval($aspect_ratio_values[1]) : 9;
            $aspect_ratio_percentage = ($aspect_ratio_y / $aspect_ratio_x) * 100;

            // Generate inline styles
            $inline_styles = "
                #{$unique_id} {
                    --murdeni-pg-columns: {$columns};
                    --murdeni-pg-grid-gap: {$grid_gap}px;
                    --murdeni-pg-title-font-size: {$title_font_size}px;
                    --murdeni-pg-content-font-size: {$content_font_size}px;
                    --murdeni-pg-meta-font-size: {$meta_font_size}px;
                    --murdeni-pg-aspect-ratio: {$aspect_ratio_percentage}%;
                    text-align: {$alignment};
                }
            ";

            // Output inline styles
            echo '<style>' . $inline_styles . '</style>';

            // Container classes
            $container_classes = array(
                'murdeni-post-grid',
                'murdeni-post-grid-layout-' . $layout,
                'murdeni-post-grid-card-style-' . $card_style,
                $class_name,
            );

            // Start container
            echo '<div id="' . esc_attr($unique_id) . '" class="' . esc_attr(implode(' ', $container_classes)) . '">';

            // Grid container
            echo '<div class="murdeni-post-grid-container">';

            // Loop through posts
            while ($query->have_posts()) {
                $query->the_post();

                // Get post ID
                $post_id = get_the_ID();

                // Item classes
                $item_classes = array(
                    'murdeni-post-grid-item',
                );

                // Start item
                echo '<article class="' . esc_attr(implode(' ', $item_classes)) . '">';

                // Card wrapper
                echo '<div class="murdeni-post-grid-card">';

                // Featured image
                if ($display_featured_image && has_post_thumbnail()) {
                    echo '<div class="murdeni-post-grid-image-wrapper">';
                    echo '<a href="' . esc_url(get_permalink()) . '" class="murdeni-post-grid-image-link">';
                    echo '<div class="murdeni-post-grid-image">';
                    the_post_thumbnail($image_size, array(
                        'class' => 'murdeni-post-grid-thumbnail',
                        'alt' => get_the_title(),
                    ));
                    echo '</div>';
                    echo '</a>';
                    echo '</div>';
                }

                // Content wrapper
                echo '<div class="murdeni-post-grid-content">';

                // Category
                if ($display_category && $post_type === 'post') {
                    $categories = get_the_category();
                    if (!empty($categories)) {
                        echo '<div class="murdeni-post-grid-category">';
                        echo '<a href="' . esc_url(get_category_link($categories[0]->term_id)) . '">' . esc_html($categories[0]->name) . '</a>';
                        echo '</div>';
                    }
                } elseif ($display_category && $post_type !== 'post') {
                    // Get the first taxonomy for this post type
                    $taxonomies = get_object_taxonomies($post_type, 'objects');
                    if (!empty($taxonomies)) {
                        foreach ($taxonomies as $taxonomy) {
                            if ($taxonomy->hierarchical) {
                                $terms = get_the_terms($post_id, $taxonomy->name);
                                if (!empty($terms) && !is_wp_error($terms)) {
                                    echo '<div class="murdeni-post-grid-category">';
                                    echo '<a href="' . esc_url(get_term_link($terms[0])) . '">' . esc_html($terms[0]->name) . '</a>';
                                    echo '</div>';
                                    break;
                                }
                            }
                        }
                    }
                }

                // Title
                if ($display_title) {
                    echo '<h3 class="murdeni-post-grid-title">';
                    echo '<a href="' . esc_url(get_permalink()) . '">' . esc_html(get_the_title()) . '</a>';
                    echo '</h3>';
                }

                // Meta
                if ($display_date || $display_author) {
                    echo '<div class="murdeni-post-grid-meta">';
                    
                    if ($display_date) {
                        echo '<span class="murdeni-post-grid-date">';
                        echo esc_html(get_the_date());
                        echo '</span>';
                    }
                    
                    if ($display_date && $display_author) {
                        echo '<span class="murdeni-post-grid-meta-separator">·</span>';
                    }
                    
                    if ($display_author) {
                        echo '<span class="murdeni-post-grid-author">';
                        echo esc_html(get_the_author());
                        echo '</span>';
                    }
                    
                    echo '</div>';
                }

                // Excerpt
                if ($display_excerpt) {
                    echo '<div class="murdeni-post-grid-excerpt">';
                    if (has_excerpt()) {
                        echo wp_trim_words(get_the_excerpt(), $excerpt_length, '...');
                    } else {
                        echo wp_trim_words(get_the_content(), $excerpt_length, '...');
                    }
                    echo '</div>';
                }

                // Read more
                if ($display_read_more) {
                    echo '<div class="murdeni-post-grid-read-more">';
                    echo '<a href="' . esc_url(get_permalink()) . '" class="murdeni-post-grid-read-more-link">' . esc_html($read_more_text) . '</a>';
                    echo '</div>';
                }

                // End content wrapper
                echo '</div>';

                // End card wrapper
                echo '</div>';

                // End item
                echo '</article>';
            }

            // End grid container
            echo '</div>';

            // End container
            echo '</div>';
        } else {
            echo '<p>' . __('No posts found.', 'murdeni-post-grid') . '</p>';
        }

        // Reset post data
        wp_reset_postdata();

        // Return output buffer
        return ob_get_clean();
    }
}
