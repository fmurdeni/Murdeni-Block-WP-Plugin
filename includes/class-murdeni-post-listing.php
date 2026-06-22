<?php
/**
 * Post Listing Block Class
 */
class Murdeni_Post_Listing {
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
            'murdeni-post-listing-editor',
            MURDENI_BLOCKS_URL . 'build/post-listing/index.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch'),
            MURDENI_BLOCKS_VERSION,
            true
        );

        // Register block editor styles
        wp_register_style(
            'murdeni-post-listing-editor-style',
            MURDENI_BLOCKS_URL . 'build/post-listing/index.css',
            array('wp-edit-blocks'),
            MURDENI_BLOCKS_VERSION
        );

        // Register frontend styles
        wp_register_style(
            'murdeni-post-listing-style',
            MURDENI_BLOCKS_URL . 'build/post-listing/style-index.css',
            array(),
            MURDENI_BLOCKS_VERSION
        );

        // Register block type
        register_block_type('murdeni/post-listing', array(
            'editor_script' => 'murdeni-post-listing-editor',
            'editor_style' => 'murdeni-post-listing-editor-style',
            'style' => 'murdeni-post-listing-style',
            'render_callback' => array($this, 'render_block'),
            'attributes' => $this->get_block_attributes(),
        ));

        // Set translations
        if (function_exists('wp_set_script_translations')) {
            wp_set_script_translations('murdeni-post-listing-editor', 'murdeni-blocks', MURDENI_BLOCKS_PATH . 'languages');
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
                'default' => 5,
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
                'default' => __('Baca Selengkapnya', 'murdeni-blocks'),
            ),
            'displayHeader' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'headerTitle' => array(
                'type' => 'string',
                'default' => 'Latest Post',
            ),
            'displayViewAll' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'viewAllText' => array(
                'type' => 'string',
                'default' => 'View All',
            ),
            'viewAllUrl' => array(
                'type' => 'string',
                'default' => '',
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
                'default' => '4:3',
            ),
            'listGap' => array(
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
            'imageWidth' => array(
                'type' => 'number',
                'default' => 30,
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
        register_rest_route('murdeni-blocks/v1', '/post-types', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_post_types'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));

        // Register route for getting taxonomies
        register_rest_route('murdeni-blocks/v1', '/taxonomies/(?P<post_type>[a-zA-Z0-9-_]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_taxonomies'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));

        // Register route for getting terms
        register_rest_route('murdeni-blocks/v1', '/terms/(?P<taxonomy>[a-zA-Z0-9-_]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_terms'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));
    }

    /**
     * Get post types
     */
    public function get_post_types($request) {
        $post_types = get_post_types(array('public' => true), 'objects');
        $data = array();

        foreach ($post_types as $post_type) {
            $data[] = array(
                'value' => $post_type->name,
                'label' => $post_type->label,
            );
        }

        return rest_ensure_response($data);
    }

    /**
     * Get taxonomies
     */
    public function get_taxonomies($request) {
        $post_type = $request->get_param('post_type');
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
     * Get terms
     */
    public function get_terms($request) {
        $taxonomy = $request->get_param('taxonomy');
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
     * Render block
     */
    public function render_block($attributes) {
        // Extract attributes
        $post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
        $posts_to_show = isset($attributes['postsToShow']) ? intval($attributes['postsToShow']) : 5;
        $order = isset($attributes['order']) ? $attributes['order'] : 'desc';
        $order_by = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
        $categories = isset($attributes['categories']) ? $attributes['categories'] : array();
        $tags = isset($attributes['tags']) ? $attributes['tags'] : array();
        $taxonomies = isset($attributes['taxonomies']) ? (array) $attributes['taxonomies'] : array();
        $display_featured_image = isset($attributes['displayFeaturedImage']) ? $attributes['displayFeaturedImage'] : true;
        $display_title = isset($attributes['displayTitle']) ? $attributes['displayTitle'] : true;
        $display_excerpt = isset($attributes['displayExcerpt']) ? $attributes['displayExcerpt'] : true;
        $excerpt_length = isset($attributes['excerptLength']) ? intval($attributes['excerptLength']) : 20;
        $display_read_more = isset($attributes['displayReadMore']) ? $attributes['displayReadMore'] : true;
        $read_more_text = isset($attributes['readMoreText']) ? $attributes['readMoreText'] : __('Baca Selengkapnya', 'murdeni-blocks');
        $display_header = isset($attributes['displayHeader']) ? $attributes['displayHeader'] : true;
        $header_title = isset($attributes['headerTitle']) ? $attributes['headerTitle'] : __('Latest Post', 'murdeni-blocks');
        $display_view_all = isset($attributes['displayViewAll']) ? $attributes['displayViewAll'] : true;
        $view_all_text = isset($attributes['viewAllText']) ? $attributes['viewAllText'] : __('View All', 'murdeni-blocks');
        $view_all_url = isset($attributes['viewAllUrl']) ? $attributes['viewAllUrl'] : '';
        $display_date = isset($attributes['displayDate']) ? $attributes['displayDate'] : true;
        $display_author = isset($attributes['displayAuthor']) ? $attributes['displayAuthor'] : false;
        $display_category = isset($attributes['displayCategory']) ? $attributes['displayCategory'] : true;
        $image_size = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'medium';
        $aspect_ratio = isset($attributes['aspectRatio']) ? $attributes['aspectRatio'] : '4:3';
        $list_gap = isset($attributes['listGap']) ? intval($attributes['listGap']) : 20;
        $card_style = isset($attributes['cardStyle']) ? $attributes['cardStyle'] : 'bordered';
        $title_font_size = isset($attributes['titleFontSize']) ? intval($attributes['titleFontSize']) : 18;
        $content_font_size = isset($attributes['contentFontSize']) ? intval($attributes['contentFontSize']) : 14;
        $meta_font_size = isset($attributes['metaFontSize']) ? intval($attributes['metaFontSize']) : 12;
        $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';
        $image_width = isset($attributes['imageWidth']) ? intval($attributes['imageWidth']) : 30;
        $class_name = isset($attributes['className']) ? $attributes['className'] : '';

        // Build query args
        $query_args = array(
            'post_type' => $post_type,
            'posts_per_page' => $posts_to_show,
            'order' => $order,
            'orderby' => $order_by,
            'ignore_sticky_posts' => true,
        );

        // Add category filter
        if (!empty($categories)) {
            $query_args['category__in'] = $categories;
        }

        // Add tag filter
        if (!empty($tags)) {
            $query_args['tag__in'] = $tags;
        }

        // Add taxonomy filters
        if (!empty($taxonomies)) {
            $tax_query = array();

            foreach ($taxonomies as $taxonomy => $terms) {
                if (!empty($terms)) {
                    $tax_query[] = array(
                        'taxonomy' => $taxonomy,
                        'field' => 'id',
                        'terms' => $terms,
                    );
                }
            }

            if (!empty($tax_query)) {
                $query_args['tax_query'] = $tax_query;
            }
        }

        // Run the query
        $posts_query = new WP_Query($query_args);

        // Calculate aspect ratio style
        $aspect_ratio_parts = explode(':', $aspect_ratio);
        $aspect_ratio_style = '';
        if (count($aspect_ratio_parts) === 2) {
            $width = intval($aspect_ratio_parts[0]);
            $height = intval($aspect_ratio_parts[1]);
            if ($width > 0 && $height > 0) {
                $aspect_ratio_style = 'padding-bottom: ' . ($height / $width * 100) . '%;';
            }
        }

        // Start output buffer
        ob_start();
        ?>
        <div class="murdeni-post-listing align-<?php echo esc_attr($alignment); ?> style-<?php echo esc_attr($card_style); ?> <?php echo esc_attr($class_name); ?>">
            <?php if ($display_header) : ?>
            <div class="murdeni-post-listing__header">
                <h2 class="murdeni-post-listing__title"><?php echo esc_html($header_title); ?></h2>
                <?php if ($display_view_all && !empty($view_all_url)) : ?>
                <a href="<?php echo esc_url($view_all_url); ?>" class="murdeni-post-listing__view-all"><?php echo esc_html($view_all_text); ?> →</a>
                <?php endif; ?>
            </div>
            <?php endif; ?>
            <div class="murdeni-post-listing__items" style="gap: <?php echo esc_attr($list_gap); ?>px;">
                <?php if ($posts_query->have_posts()) : ?>
                    <?php while ($posts_query->have_posts()) : $posts_query->the_post(); ?>
                        <div class="murdeni-post-listing__item">
                            <div class="murdeni-post-listing__item-inner">
                                <?php if ($display_featured_image && has_post_thumbnail()) : ?>
                                    <div class="murdeni-post-listing__item-image-container" style="width: <?php echo esc_attr($image_width); ?>%;">
                                        <div class="murdeni-post-listing__item-image-wrapper" style="<?php echo esc_attr($aspect_ratio_style); ?>">
                                            <?php echo get_the_post_thumbnail(get_the_ID(), $image_size, array('class' => 'murdeni-post-listing__item-image')); ?>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="murdeni-post-listing__item-content" style="width: <?php echo $display_featured_image && has_post_thumbnail() ? (100 - $image_width) . '%' : '100%'; ?>;">
                                    <?php if ($display_category) : ?>
                                        <?php
                                        $categories = get_the_category();
                                        if (!empty($categories)) :
                                        ?>
                                            <div class="murdeni-post-listing__item-category" style="font-size: <?php echo esc_attr($meta_font_size); ?>px;">
                                                <?php echo esc_html($categories[0]->name); ?>
                                            </div>
                                        <?php endif; ?>
                                    <?php endif; ?>
                                    
                                    <?php if ($display_title) : ?>
                                        <h3 class="murdeni-post-listing__item-title" style="font-size: <?php echo esc_attr($title_font_size); ?>px;">
                                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                        </h3>
                                    <?php endif; ?>
                                    
                                    <div class="murdeni-post-listing__item-meta" style="font-size: <?php echo esc_attr($meta_font_size); ?>px;">
                                        <?php if ($display_date) : ?>
                                            <span class="murdeni-post-listing__item-date">
                                                <?php echo get_the_date(); ?>
                                            </span>
                                        <?php endif; ?>
                                        
                                        <?php if ($display_author) : ?>
                                            <span class="murdeni-post-listing__item-author">
                                                <?php the_author(); ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                    
                                    <?php if ($display_excerpt) : ?>
                                        <div class="murdeni-post-listing__item-excerpt" style="font-size: <?php echo esc_attr($content_font_size); ?>px;">
                                            <?php
                                            $excerpt = get_the_excerpt();
                                            $excerpt = wp_trim_words($excerpt, $excerpt_length, '...');
                                            echo wp_kses_post($excerpt);
                                            ?>
                                        </div>
                                    <?php endif; ?>
                                    
                                    <?php if ($display_read_more) : ?>
                                        <div class="murdeni-post-listing__item-read-more">
                                            <a href="<?php the_permalink(); ?>" class="murdeni-post-listing__item-read-more-link">
                                                <?php echo esc_html($read_more_text); ?>
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php endwhile; ?>
                    <?php wp_reset_postdata(); ?>
                <?php else : ?>
                    <p><?php _e('No posts found.', 'murdeni-blocks'); ?></p>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
