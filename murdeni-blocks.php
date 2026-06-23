<?php
/**
 * Plugin Name: Murdeni Blocks
 * Description: Collection of custom blocks for WordPress including Post Grid, Post Grid Popup, Portfolio Grid, and Skills Percentage.
 * Version: 1.0.20
 * Author: Murdeni
 * Text Domain: murdeni-blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MURDENI_BLOCKS_VERSION', '1.0.20');
define('MURDENI_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('MURDENI_BLOCKS_URL', plugin_dir_url(__FILE__));
define('MURDENI_BLOCKS_BASENAME', plugin_basename(__FILE__));

require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-cpt.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-post-grid.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-post-grid-popup.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-portfolio-grid.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-skills-percentage.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-testimonial-slider.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-hero-banner.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-feature-grid.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-services-grid.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-work-process.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-post-listing.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-media-gallery.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-video.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-accordion.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-faq.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-cta.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-icon-with-text.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-google-map-embed.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-whatsapp-button.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-custom-listing.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-gallery-carousel.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-instagram-badge.php';
require_once MURDENI_BLOCKS_PATH . 'includes/class-murdeni-image-text.php';

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
    
    $hero_banner = new Murdeni_Hero_Banner();
    $hero_banner->init();
    
    $feature_grid = new Murdeni_Feature_Grid();
    $feature_grid->init();
    
    $services_grid = new Murdeni_Services_Grid();
    $services_grid->init();
    
    $work_process = new Murdeni_Work_Process();
    $work_process->init();
    
    $post_listing = new Murdeni_Post_Listing();
    $post_listing->init();
    
    $media_gallery = new Murdeni_Media_Gallery();
    $media_gallery->init();
    
    $video = new Murdeni_Video();
    $video->init();
    
    $accordion = new Murdeni_Accordion();
    $accordion->init();
    
    $faq = new Murdeni_FAQ();
    $faq->init();
    
    $cta = new Murdeni_CTA();
    $cta->init();
    
    $icon_with_text = new Murdeni_Icon_With_Text();
    $icon_with_text->init();
    
    $google_map_embed = new Murdeni_Google_Map_Embed();
    $google_map_embed->init();
    
    $whatsapp_button = new Murdeni_WhatsApp_Button();
    $whatsapp_button->init();
    
    $custom_listing = new Murdeni_Custom_Listing();
    $custom_listing->init();

    $gallery_carousel = new Murdeni_Gallery_Carousel();
    $gallery_carousel->init();

    $instagram_badge = new Murdeni_Instagram_Badge();
    $instagram_badge->init();

    $image_text = new Murdeni_Image_Text();
    $image_text->init();
}

murdeni_blocks_init();
