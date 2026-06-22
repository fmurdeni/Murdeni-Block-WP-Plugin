<?php
/**
 * Gallery Carousel Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Murdeni_Gallery_Carousel
 */
class Murdeni_Gallery_Carousel {

	/**
	 * Initialize the class
	 */
	public function init() {
		// Register block assets.
		add_action( 'init', array( $this, 'register_block_assets' ) );
		
		// Register frontend script for carousel functionality.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_script' ) );
	}

	/**
	 * Register block assets
	 */
	public function register_block_assets() {
		// Register block editor script
		wp_register_script(
			'murdeni-gallery-carousel-editor',
			MURDENI_BLOCKS_URL . 'build/gallery-carousel/index.js',
			array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch'),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Register block editor styles
		wp_register_style(
			'murdeni-gallery-carousel-editor-style',
			MURDENI_BLOCKS_URL . 'build/gallery-carousel/index.css',
			array('wp-edit-blocks'),
			MURDENI_BLOCKS_VERSION
		);

		// Register frontend styles
		wp_register_style(
			'murdeni-gallery-carousel-style',
			MURDENI_BLOCKS_URL . 'build/gallery-carousel/style-index.css',
			array(),
			MURDENI_BLOCKS_VERSION
		);

		// Register block type.
		register_block_type(
			MURDENI_BLOCKS_PATH . 'build/gallery-carousel',
			array(
				'render_callback' => array( $this, 'render_gallery_carousel_block' ),
				'attributes'      => $this->get_block_attributes(),
				'editor_script'   => 'murdeni-gallery-carousel-editor',
				'editor_style'    => 'murdeni-gallery-carousel-editor-style',
				'style'           => 'murdeni-gallery-carousel-style',
			)
		);
	}

	/**
	 * Register frontend script
	 */
	public function register_frontend_script() {
		// Register and enqueue frontend script.
		wp_register_script(
			'murdeni-gallery-carousel-frontend',
			MURDENI_BLOCKS_URL . 'build/gallery-carousel/frontend.js',
			array('jquery'),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Localize script with translations.
		wp_localize_script(
			'murdeni-gallery-carousel-frontend',
			'murdeniGalleryCarousel',
			array(
				'nextLabel'  => __( 'Next', 'murdeni-blocks' ),
				'prevLabel'  => __( 'Previous', 'murdeni-blocks' ),
			)
		);
	}

	/**
	 * Get block attributes
	 *
	 * @return array
	 */
	public function get_block_attributes() {
		return array(
			'items' => array(
				'type'    => 'array',
				'default' => array(),
			),
			'slidesToShow' => array(
				'type'    => 'number',
				'default' => 3,
			),
			'gapSize' => array(
				'type'    => 'number',
				'default' => 20,
			),
			'aspectRatio' => array(
				'type'    => 'string',
				'default' => '1:1',
			),
			'thumbnailSize' => array(
				'type'    => 'string',
				'default' => 'medium',
			),
			'showArrows' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'showDots' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'autoplay' => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'autoplaySpeed' => array(
				'type'    => 'number',
				'default' => 3000,
			),
			'displayHeader' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'headerTitle' => array(
				'type'    => 'string',
				'default' => __('Gallery Carousel', 'murdeni-blocks'),
			),
			'headerDescription' => array(
				'type'    => 'string',
				'default' => '',
			),
			'headerAlignment' => array(
				'type'    => 'string',
				'default' => 'center',
			),
			'displayViewAll' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'viewAllText' => array(
				'type'    => 'string',
				'default' => __('View All', 'murdeni-blocks'),
			),
			'viewAllUrl' => array(
				'type'    => 'string',
				'default' => '',
			),
			'overlayColor' => array(
				'type'    => 'string',
				'default' => 'rgba(0,0,0,0.7)',
			),
			'overlayOpacity' => array(
				'type'    => 'number',
				'default' => 70,
			),
			'hoverEffect' => array(
				'type'    => 'string',
				'default' => 'zoom',
			),
			'borderRadius' => array(
				'type'    => 'number',
				'default' => 0,
			),
			'borderWidth' => array(
				'type'    => 'number',
				'default' => 0,
			),
			'borderColor' => array(
				'type'    => 'string',
				'default' => '',
			),
			'boxShadow' => array(
				'type'    => 'boolean',
				'default' => false,
			),
		);
	}

	/**
	 * Render gallery carousel block
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_gallery_carousel_block( $attributes ) {
		// Extract attributes.
		$items            = isset( $attributes['items'] ) ? $attributes['items'] : array();
		$slides_to_show   = isset( $attributes['slidesToShow'] ) ? $attributes['slidesToShow'] : 3;
		$gap_size         = isset( $attributes['gapSize'] ) ? $attributes['gapSize'] : 20;
		$aspect_ratio     = isset( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '1:1';
		$thumbnail_size   = isset( $attributes['thumbnailSize'] ) ? $attributes['thumbnailSize'] : 'medium';
		$show_arrows      = isset( $attributes['showArrows'] ) ? $attributes['showArrows'] : true;
		$show_dots        = isset( $attributes['showDots'] ) ? $attributes['showDots'] : true;
		$autoplay         = isset( $attributes['autoplay'] ) ? $attributes['autoplay'] : false;
		$autoplay_speed   = isset( $attributes['autoplaySpeed'] ) ? $attributes['autoplaySpeed'] : 3000;
		$hover_effect     = isset( $attributes['hoverEffect'] ) ? $attributes['hoverEffect'] : 'zoom';
		$border_radius    = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 0;
		$border_width     = isset( $attributes['borderWidth'] ) ? $attributes['borderWidth'] : 0;
		$border_color     = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '';
		$box_shadow       = isset( $attributes['boxShadow'] ) ? $attributes['boxShadow'] : false;
		
		// Header attributes
		$display_header   = isset( $attributes['displayHeader'] ) ? $attributes['displayHeader'] : true;
		$header_title     = isset( $attributes['headerTitle'] ) ? $attributes['headerTitle'] : __('Gallery Carousel', 'murdeni-blocks');
		$header_description = isset( $attributes['headerDescription'] ) ? $attributes['headerDescription'] : '';
		$header_alignment = isset( $attributes['headerAlignment'] ) ? $attributes['headerAlignment'] : 'center';
		$allowed_header_alignments = array( 'left', 'center', 'right' );
		if ( ! in_array( $header_alignment, $allowed_header_alignments, true ) ) {
			$header_alignment = 'center';
		}
		$display_view_all = isset( $attributes['displayViewAll'] ) ? $attributes['displayViewAll'] : true;
		$view_all_text    = isset( $attributes['viewAllText'] ) ? $attributes['viewAllText'] : __('View All', 'murdeni-blocks');
		$view_all_url     = isset( $attributes['viewAllUrl'] ) ? $attributes['viewAllUrl'] : '';

		// If no items, return empty.
		if ( empty( $items ) ) {
			return '';
		}

		// Enqueue frontend script for carousel functionality
		wp_enqueue_script( 'murdeni-gallery-carousel-frontend' );

		// Generate unique ID for this carousel instance
		$carousel_id = 'murdeni-gallery-carousel-' . uniqid();

		// Get aspect ratio style.
		$aspect_ratio_style = $this->get_aspect_ratio_style( $aspect_ratio );

		// Start output.
		ob_start();

		// Carousel container.
		$carousel_classes = array(
			'murdeni-gallery-carousel',
			'hover-' . $hover_effect,
		);

		$carousel_data_attrs = array(
			'data-slides-to-show="' . esc_attr( $slides_to_show ) . '"',
			'data-gap="' . esc_attr( $gap_size ) . '"',
			'data-show-arrows="' . ( $show_arrows ? 'true' : 'false' ) . '"',
			'data-show-dots="' . ( $show_dots ? 'true' : 'false' ) . '"',
			'data-autoplay="' . ( $autoplay ? 'true' : 'false' ) . '"',
			'data-autoplay-speed="' . esc_attr( $autoplay_speed ) . '"',
		);
		
		// Debug output for autoplay settings
		$debug_script = '';
		if ( $autoplay ) {
			$debug_script = '<script>console.log("Carousel ' . esc_attr( $carousel_id ) . ' autoplay settings: enabled, speed: ' . esc_attr( $autoplay_speed ) . 'ms");</script>';
		}
		?>
		<?php echo $debug_script; ?>
		<div id="<?php echo esc_attr( $carousel_id ); ?>" class="<?php echo esc_attr( implode( ' ', $carousel_classes ) ); ?>" <?php echo implode( ' ', $carousel_data_attrs ); ?>>
			<?php if ( $display_header ) : ?>
			<div class="murdeni-gallery-carousel__header">
				<div class="murdeni-gallery-carousel__heading is-align-<?php echo esc_attr( $header_alignment ); ?>" style="text-align: <?php echo esc_attr( $header_alignment ); ?>;">
					<h2 class="murdeni-gallery-carousel__title"><?php echo esc_html( $header_title ); ?></h2>
					<?php if ( ! empty( $header_description ) ) : ?>
					<p class="murdeni-gallery-carousel__description"><?php echo wp_kses_post( $header_description ); ?></p>
					<?php endif; ?>
				</div>
				<?php if ( $display_view_all && ! empty( $view_all_url ) ) : ?>
				<a href="<?php echo esc_url( $view_all_url ); ?>" class="murdeni-gallery-carousel__view-all"><?php echo esc_html( $view_all_text ); ?></a>
				<?php endif; ?>
			</div>
			<?php endif; ?>
			
			<div class="murdeni-gallery-carousel__container">
				<?php if ( $show_arrows ) : ?>
				<button class="murdeni-gallery-carousel__arrow murdeni-gallery-carousel__arrow--prev" aria-label="<?php esc_attr_e( 'Previous slide', 'murdeni-blocks' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
						<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
					</svg>
				</button>
				<?php endif; ?>
				
				<div class="murdeni-gallery-carousel__track" style="">
					<?php foreach ( $items as $item ) : ?>
						<?php
						// Skip if no media URL.
						if ( empty( $item['mediaUrl'] ) ) {
							continue;
						}

						// Item type.
						$is_video = isset( $item['type'] ) && 'video' === $item['type'];

						// Item classes.
						$item_classes = array(
							'murdeni-gallery-carousel__item',
						);

						if ( $is_video ) {
							$item_classes[] = 'is-video';
						}

						// Item style.
						$item_style = array();

						if ( $border_radius > 0 ) {
							$item_style[] = 'border-radius: ' . $border_radius . 'px';
						}

						if ( $border_width > 0 && ! empty( $border_color ) ) {
							$item_style[] = 'border: ' . $border_width . 'px solid ' . $border_color;
						}

						if ( $box_shadow ) {
							$item_style[] = 'box-shadow: 0 4px 10px rgba(0,0,0,0.1)';
						}

						// Video URL.
						$video_url = isset( $item['videoUrl'] ) ? $item['videoUrl'] : '';
						$video_id  = $this->get_youtube_video_id( $video_url );
						?>
						<div class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" style="<?php echo ! empty( $item_style ) ? esc_attr( implode( '; ', $item_style ) ) . '; ' : ''; ?>margin-right: <?php echo esc_attr( $gap_size ); ?>px;">
							<div class="murdeni-gallery-carousel__item-inner">
								<div class="murdeni-gallery-carousel__item-media-wrapper" style="<?php echo esc_attr( $aspect_ratio_style ); ?>">
									<a href="<?php echo $is_video && ! empty( $video_id ) ? esc_url( 'https://www.youtube.com/watch?v=' . $video_id ) : esc_url( $item['mediaUrl'] ); ?>" 
										class="murdeni-gallery-carousel__item-link"
									>
										<img 
											src="<?php echo esc_url( $item['mediaUrl'] ); ?>" 
											alt="<?php echo esc_attr( $item['caption'] ?? '' ); ?>" 
											class="murdeni-gallery-carousel__item-media"
										/>
										<?php if ( $is_video && ! empty( $video_id ) ) : ?>
											<div class="murdeni-gallery-carousel__item-play-button">
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
													<path d="M8 5v14l11-7z" fill="#ffffff"/>
												</svg>
											</div>
										<?php endif; ?>
									</a>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
				
				<?php if ( $show_arrows ) : ?>
				<button class="murdeni-gallery-carousel__arrow murdeni-gallery-carousel__arrow--next" aria-label="<?php esc_attr_e( 'Next slide', 'murdeni-blocks' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
						<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
					</svg>
				</button>
				<?php endif; ?>
			</div>
			
			<?php if ( $show_dots ) : ?>
			<div class="murdeni-gallery-carousel__dots">
				<?php for ( $i = 0; $i < count( $items ); $i++ ) : ?>
					<button class="murdeni-gallery-carousel__dot <?php echo $i === 0 ? 'is-active' : ''; ?>" data-index="<?php echo esc_attr( $i ); ?>" aria-label="<?php printf( esc_attr__( 'Go to slide %d', 'murdeni-blocks' ), $i + 1 ); ?>"></button>
				<?php endfor; ?>
			</div>
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
			case '1:1':
				return 'padding-top: 100%';
			case '4:3':
				return 'padding-top: 75%';
			case '16:9':
				return 'padding-top: 56.25%';
			case '3:2':
				return 'padding-top: 66.67%';
			default:
				return 'padding-top: 100%';
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

		$pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
		preg_match( $pattern, $url, $matches );

		return isset( $matches[1] ) ? $matches[1] : '';
	}
}
