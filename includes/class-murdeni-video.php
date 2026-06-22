<?php
/**
 * Video Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Murdeni_Video
 */
class Murdeni_Video {

	/**
	 * Initialize the class
	 */
	public function init() {
		// Register block assets.
		add_action( 'init', array( $this, 'register_block_assets' ) );
		
		// Register frontend script for lightbox functionality.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_script' ) );
	}

	/**
	 * Register block assets
	 */
	public function register_block_assets() {
		// Register block editor script
		wp_register_script(
			'murdeni-video-editor',
			MURDENI_BLOCKS_URL . 'build/video/index.js',
			array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch'),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Register block editor styles
		wp_register_style(
			'murdeni-video-editor-style',
			MURDENI_BLOCKS_URL . 'build/video/index.css',
			array('wp-edit-blocks'),
			MURDENI_BLOCKS_VERSION
		);

		// Register frontend styles
		wp_register_style(
			'murdeni-video-style',
			MURDENI_BLOCKS_URL . 'build/video/style-index.css',
			array(),
			MURDENI_BLOCKS_VERSION
		);

		// Register block type.
		register_block_type(
			MURDENI_BLOCKS_PATH . 'build/video',
			array(
				'render_callback' => array( $this, 'render_video_block' ),
				'editor_script'   => 'murdeni-video-editor',
				'editor_style'    => 'murdeni-video-editor-style',
				'style'           => 'murdeni-video-style',
			)
		);
	}

	/**
	 * Register frontend script
	 */
	public function register_frontend_script() {
		// Register and enqueue frontend script.
		wp_register_script(
			'murdeni-video-frontend',
			MURDENI_BLOCKS_URL . 'build/video/frontend.js',
			array(),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Localize script with translations.
		wp_localize_script(
			'murdeni-video-frontend',
			'murdeniVideo',
			array(
				'closeLabel' => __( 'Close', 'murdeni-blocks' ),
			)
		);
	}

	/**
	 * Render video block
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_video_block( $attributes ) {
		// Extract attributes.
		$video_url       = isset( $attributes['videoUrl'] ) ? $attributes['videoUrl'] : '';
		$thumbnail_url   = isset( $attributes['thumbnailUrl'] ) ? $attributes['thumbnailUrl'] : '';
		$title           = isset( $attributes['title'] ) ? $attributes['title'] : '';
		$aspect_ratio    = isset( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '16:9';
		$max_width       = isset( $attributes['maxWidth'] ) ? $attributes['maxWidth'] : 0;
		$border_radius   = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 0;
		$border_width    = isset( $attributes['borderWidth'] ) ? $attributes['borderWidth'] : 0;
		$border_color    = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '';
		$box_shadow      = isset( $attributes['boxShadow'] ) ? $attributes['boxShadow'] : false;
		$overlay_color   = isset( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : 'rgba(0,0,0,0.5)';
		$play_button_size = isset( $attributes['playButtonSize'] ) ? $attributes['playButtonSize'] : 'medium';
		$play_button_color = isset( $attributes['playButtonColor'] ) ? $attributes['playButtonColor'] : '#ffffff';
		$play_button_bg_color = isset( $attributes['playButtonBgColor'] ) ? $attributes['playButtonBgColor'] : 'rgba(0,0,0,0.6)';
		$show_title      = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : false;
		$title_position  = isset( $attributes['titlePosition'] ) ? $attributes['titlePosition'] : 'below';
		$title_font_size = isset( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : 16;
		$title_color     = isset( $attributes['titleColor'] ) ? $attributes['titleColor'] : '';
		$title_alignment = isset( $attributes['titleAlignment'] ) ? $attributes['titleAlignment'] : 'center';

		// If no video URL or thumbnail, return empty.
		if ( empty( $video_url ) || empty( $thumbnail_url ) ) {
			return '';
		}

		// Get YouTube video ID.
		$video_id = $this->get_youtube_video_id( $video_url );
		$is_short = $this->is_youtube_short_url( $video_url );
		
		if ( empty( $video_id ) ) {
			return '';
		}

		// Enqueue frontend script.
		wp_enqueue_script( 'murdeni-video-frontend' );

		// Get aspect ratio style.
		$aspect_ratio_style = $this->get_aspect_ratio_style( $aspect_ratio );

		// Container style.
		$container_style = '';
		if ( $max_width > 0 ) {
			$container_style = 'max-width: ' . $max_width . 'px; margin: 0 auto;';
		}

		// Wrapper style.
		$wrapper_style = '';
		if ( $border_radius > 0 ) {
			$wrapper_style .= 'border-radius: ' . $border_radius . 'px; overflow: hidden;';
		}
		if ( $border_width > 0 && ! empty( $border_color ) ) {
			$wrapper_style .= 'border: ' . $border_width . 'px solid ' . $border_color . ';';
		}
		if ( $box_shadow ) {
			$wrapper_style .= 'box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);';
		}

		// Play button style.
		$play_button_style = 'background-color: ' . $play_button_bg_color . ';';
		switch ( $play_button_size ) {
			case 'small':
				$play_button_style .= 'width: 50px; height: 50px;';
				break;
			case 'medium':
				$play_button_style .= 'width: 70px; height: 70px;';
				break;
			case 'large':
				$play_button_style .= 'width: 90px; height: 90px;';
				break;
			default:
				$play_button_style .= 'width: 70px; height: 70px;';
		}

		// Title style.
		$title_style = '';
		if ( $title_font_size ) {
			$title_style .= 'font-size: ' . $title_font_size . 'px;';
		}
		if ( ! empty( $title_color ) ) {
			$title_style .= 'color: ' . $title_color . ';';
		}
		if ( $title_alignment ) {
			$title_style .= 'text-align: ' . $title_alignment . ';';
		}

		// Start output.
		ob_start();
		?>
		<div class="murdeni-video <?php echo $is_short ? 'is-short' : ''; ?>" style="<?php echo esc_attr( $container_style ); ?>">
			<div class="murdeni-video__wrapper" style="<?php echo esc_attr( $wrapper_style ); ?>">
				<div class="murdeni-video__inner" style="<?php echo esc_attr( $aspect_ratio_style ); ?>">
					<img 
						src="<?php echo esc_url( $thumbnail_url ); ?>" 
						alt="<?php echo esc_attr( $title ); ?>" 
						class="murdeni-video__thumbnail"
					/>
					<div 
						class="murdeni-video__overlay" 
						style="background-color: <?php echo esc_attr( $overlay_color ); ?>;"
						data-video-id="<?php echo esc_attr( $video_id ); ?>"
						data-video-layout="<?php echo $is_short ? 'short' : 'default'; ?>"
					>
						<div class="murdeni-video__play-button" style="<?php echo esc_attr( $play_button_style ); ?>">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
								<path d="M8 5v14l11-7z" fill="<?php echo esc_attr( $play_button_color ); ?>" />
							</svg>
						</div>
					</div>
					
					<?php if ( $show_title && ! empty( $title ) && 'overlay' === $title_position ) : ?>
						<h3 class="murdeni-video__title overlay" style="<?php echo esc_attr( $title_style ); ?>">
							<?php echo esc_html( $title ); ?>
						</h3>
					<?php endif; ?>
				</div>
			</div>
			
			<?php if ( $show_title && ! empty( $title ) && 'below' === $title_position ) : ?>
				<h3 class="murdeni-video__title" style="<?php echo esc_attr( $title_style ); ?>">
					<?php echo esc_html( $title ); ?>
				</h3>
			<?php endif; ?>
		</div>
		<?php

		return ob_get_clean();
	}

	/**
	 * Get aspect ratio style
	 *
	 * @param string $aspect_ratio Aspect ratio.
	 * @return string
	 */
	private function get_aspect_ratio_style( $aspect_ratio ) {
		switch ( $aspect_ratio ) {
			case '16:9':
				return 'padding-top: 56.25%;';
			case '4:3':
				return 'padding-top: 75%;';
			case '1:1':
				return 'padding-top: 100%;';
			case '21:9':
				return 'padding-top: 42.85%;';
			case '9:16':
				return 'padding-top: 177.78%;';
			default:
				return 'padding-top: 56.25%;';
		}
	}

	/**
	 * Get YouTube video ID from URL
	 *
	 * @param string $url YouTube URL.
	 * @return string
	 */
	private function get_youtube_video_id( $url ) {
		if ( empty( $url ) ) {
			return '';
		}

		$pattern = '/(?:youtube\.com\/(?:shorts\/|[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
		preg_match( $pattern, $url, $matches );

		return isset( $matches[1] ) ? $matches[1] : '';
	}

	/**
	 * Check whether the YouTube URL is a Shorts URL.
	 *
	 * @param string $url YouTube URL.
	 * @return bool
	 */
	private function is_youtube_short_url( $url ) {
		return ! empty( $url ) && (bool) preg_match( '/youtube\.com\/shorts\//i', $url );
	}
}
