<?php
/**
 * Plugin Name: Murdeni Blocks
 * Description: Collection of custom blocks for WordPress including Post Grid, Post Grid Popup, Portfolio Grid, and Skills Percentage.
 * Version: 1.0.5
 * Author: Murdeni
 * Text Domain: murdeni-blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MURDENI_BLOCKS_VERSION', '1.0.5');
define('MURDENI_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('MURDENI_BLOCKS_URL', plugin_dir_url(__FILE__));
define('MURDENI_BLOCKS_BASENAME', plugin_basename(__FILE__));

require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-cpt.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-post-grid.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-post-grid-popup.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-portfolio-grid.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-skills-percentage.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-testimonial-slider.php';

function murdeni_blocks_load_textdomain() {
    load_plugin_textdomain('murdeni-blocks', false, dirname(MURDENI_BLOCKS_BASENAME) . '/languages');
}

add_action('plugins_loaded', 'murdeni_blocks_load_textdomain');

function murdeni_blocks_init() {
	$cpt = new Murdeni_Block_CPT();
    $cpt->init();
    
    $post_grid = new Murdeni_Post_Grid();
    $post_grid->init();
    
    $post_grid_popup = new Murdeni_Post_Grid_Popup();
    $post_grid_popup->init();
    
    $portfolio_grid = new Murdeni_Portfolio_Grid();
    $portfolio_grid->init();
    
    $skills_percentage = new Murdeni_Skills_Percentage();
    $skills_percentage->init();
    
    $testimonial_slider = new Murdeni_Testimonial_Slider();
    $testimonial_slider->init();
}

murdeni_blocks_init();
