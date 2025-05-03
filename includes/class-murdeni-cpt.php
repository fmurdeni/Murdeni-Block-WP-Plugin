<?php 
class Murdeni_Block_CPT {
    
    public function init() {
        add_action('init', array($this, 'register_cpt'));
    }

    public function register_cpt() {
        $labels = array(
        'name'               => _x( 'Portfolio', 'post type general name', 'murdeni-blocks' ),
        'singular_name'      => _x( 'Portfolio Item', 'post type singular name', 'murdeni-blocks' ),
        'menu_name'          => _x( 'Portfolio', 'admin menu', 'murdeni-blocks' ),
        'name_admin_bar'     => _x( 'Portfolio Item', 'add new on admin bar', 'murdeni-blocks' ),
        'add_new'            => _x( 'Add New', 'portfolio', 'murdeni-blocks' ),
        'add_new_item'       => __( 'Add New Portfolio Item', 'murdeni-blocks' ),
        'new_item'           => __( 'New Portfolio Item', 'murdeni-blocks' ),
        'edit_item'          => __( 'Edit Portfolio Item', 'murdeni-blocks' ),
        'view_item'          => __( 'View Portfolio Item', 'murdeni-blocks' ),
        'all_items'          => __( 'All Portfolio Items', 'murdeni-blocks' ),
        'search_items'       => __( 'Search Portfolio Items', 'murdeni-blocks' ),
        'parent_item_colon'  => __( 'Parent Portfolio Items:', 'murdeni-blocks' ),
        'not_found'          => __( 'No portfolio items found.', 'murdeni-blocks' ),
        'not_found_in_trash' => __( 'No portfolio items found in Trash.', 'murdeni-blocks' )
    );

    $args = array(
        'labels'             => $labels,
        'description'        => __( 'Portfolio items for showcasing work', 'murdeni-blocks' ),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true, // Enable Gutenberg editor
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'portfolio' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'custom-fields' )
    );

    register_post_type( 'portfolio', $args );

    // Register Portfolio Category Taxonomy
    $category_labels = array(
        'name'              => _x( 'Portfolio Categories', 'taxonomy general name', 'murdeni-blocks' ),
        'singular_name'     => _x( 'Portfolio Category', 'taxonomy singular name', 'murdeni-blocks' ),
        'search_items'      => __( 'Search Portfolio Categories', 'murdeni-blocks' ),
        'all_items'         => __( 'All Portfolio Categories', 'murdeni-blocks' ),
        'parent_item'       => __( 'Parent Portfolio Category', 'murdeni-blocks' ),
        'parent_item_colon' => __( 'Parent Portfolio Category:', 'murdeni-blocks' ),
        'edit_item'         => __( 'Edit Portfolio Category', 'murdeni-blocks' ),
        'update_item'       => __( 'Update Portfolio Category', 'murdeni-blocks' ),
        'add_new_item'      => __( 'Add New Portfolio Category', 'murdeni-blocks' ),
        'new_item_name'     => __( 'New Portfolio Category Name', 'murdeni-blocks' ),
        'menu_name'         => __( 'Categories', 'murdeni-blocks' ),
    );

    $category_args = array(
        'hierarchical'      => true,
        'labels'            => $category_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'portfolio-category' ),
    );

    register_taxonomy( 'portfolio_category', array( 'portfolio' ), $category_args );

    // Register Portfolio Tags Taxonomy
    $tag_labels = array(
        'name'              => _x( 'Portfolio Tags', 'taxonomy general name', 'murdeni-blocks' ),
        'singular_name'     => _x( 'Portfolio Tag', 'taxonomy singular name', 'murdeni-blocks' ),
        'search_items'      => __( 'Search Portfolio Tags', 'murdeni-blocks' ),
        'all_items'         => __( 'All Portfolio Tags', 'murdeni-blocks' ),
        'parent_item'       => __( 'Parent Portfolio Tag', 'murdeni-blocks' ),
        'parent_item_colon' => __( 'Parent Portfolio Tag:', 'murdeni-blocks' ),
        'edit_item'         => __( 'Edit Portfolio Tag', 'murdeni-blocks' ),
        'update_item'       => __( 'Update Portfolio Tag', 'murdeni-blocks' ),
        'add_new_item'      => __( 'Add New Portfolio Tag', 'murdeni-blocks' ),
        'new_item_name'     => __( 'New Portfolio Tag Name', 'murdeni-blocks' ),
        'menu_name'         => __( 'Tags', 'murdeni-blocks' ),
    );

    $tag_args = array(
        'hierarchical'      => false,
        'labels'            => $tag_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'portfolio-tag' ),
    );

    register_taxonomy( 'portfolio_tag', array( 'portfolio' ), $tag_args );
    }
}