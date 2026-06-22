<?php
/**
 * Google Map Embed Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class for Google Map Embed Block functionality
 */
class Murdeni_Google_Map_Embed {

    /**
     * Constructor
     */
    public function __construct() {
        // Constructor is empty as initialization is done in init()
    }
    
    /**
     * Initialize the block
     */
    public function init() {
        // Register block
        add_action( 'init', array( $this, 'register_block' ) );
    }

    /**
     * Register the block
     */
    public function register_block() {
        // Register block script and style
        register_block_type( MURDENI_BLOCKS_PATH . 'build/google-map-embed' );
    }
}
