<?php
/**
 * Media Gallery Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Murdeni_Media_Gallery
 */
class Murdeni_Media_Gallery {

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
			'murdeni-media-gallery-editor',
			MURDENI_BLOCKS_URL . 'build/media-gallery/index.js',
			array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch'),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Register block editor styles
		wp_register_style(
			'murdeni-media-gallery-editor-style',
			MURDENI_BLOCKS_URL . 'build/media-gallery/index.css',
			array('wp-edit-blocks'),
			MURDENI_BLOCKS_VERSION
		);

		// Register frontend styles
		wp_register_style(
			'murdeni-media-gallery-style',
			MURDENI_BLOCKS_URL . 'build/media-gallery/style-index.css',
			array(),
			MURDENI_BLOCKS_VERSION
		);

		// Register block type.
		register_block_type(
			MURDENI_BLOCKS_PATH . 'build/media-gallery',
			array(
				'render_callback' => array( $this, 'render_media_gallery_block' ),
				'attributes'      => $this->get_block_attributes(),
				'editor_script'   => 'murdeni-media-gallery-editor',
				'editor_style'    => 'murdeni-media-gallery-editor-style',
				'style'           => 'murdeni-media-gallery-style',
			)
		);
	}

	/**
	 * Register frontend script
	 */
	public function register_frontend_script() {
		// Register and enqueue frontend script.
		wp_register_script(
			'murdeni-media-gallery-frontend',
			MURDENI_BLOCKS_URL . 'build/media-gallery/frontend.js',
			array(),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Localize script with translations.
		wp_localize_script(
			'murdeni-media-gallery-frontend',
			'murdeniMediaGallery',
			array(
				'closeLabel' => __( 'Close', 'murdeni-blocks' ),
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
			'items'           => array(
				'type'    => 'array',
				'default' => array(),
			),
			'columns'         => array(
				'type'    => 'number',
				'default' => 3,
			),
			'gapSize'         => array(
				'type'    => 'number',
				'default' => 20,
			),
			'aspectRatio'     => array(
				'type'    => 'string',
				'default' => '1:1',
			),
			'thumbnailSize'   => array(
				'type'    => 'string',
				'default' => 'medium',
			),
			'lightboxEnabled' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'showCaptions'    => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'captionPosition' => array(
				'type'    => 'string',
				'default' => 'below',
			),
			'displayHeader' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'headerTitle' => array(
				'type'    => 'string',
				'default' => __('Media Gallery', 'murdeni-blocks'),
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
			'captionFontSize' => array(
				'type'    => 'number',
				'default' => 14,
			),
			'captionColor'    => array(
				'type'    => 'string',
				'default' => '',
			),
			'overlayColor'    => array(
				'type'    => 'string',
				'default' => 'rgba(0,0,0,0.7)',
			),
			'overlayOpacity'  => array(
				'type'    => 'number',
				'default' => 70,
			),
			'hoverEffect'     => array(
				'type'    => 'string',
				'default' => 'zoom',
			),
			'borderRadius'    => array(
				'type'    => 'number',
				'default' => 0,
			),
			'borderWidth'     => array(
				'type'    => 'number',
				'default' => 0,
			),
			'borderColor'     => array(
				'type'    => 'string',
				'default' => '',
			),
			'boxShadow'       => array(
				'type'    => 'boolean',
				'default' => false,
			),
		);
	}

	/**
	 * Render media gallery block
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_media_gallery_block( $attributes ) {
		// Extract attributes.
		$items            = isset( $attributes['items'] ) ? $attributes['items'] : array();
		$columns          = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
		$gap_size         = isset( $attributes['gapSize'] ) ? $attributes['gapSize'] : 20;
		$aspect_ratio     = isset( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '1:1';
		$thumbnail_size   = isset( $attributes['thumbnailSize'] ) ? $attributes['thumbnailSize'] : 'medium';
		$lightbox_enabled = isset( $attributes['lightboxEnabled'] ) ? $attributes['lightboxEnabled'] : true;
		$show_captions    = isset( $attributes['showCaptions'] ) ? $attributes['showCaptions'] : true;
		$caption_position = isset( $attributes['captionPosition'] ) ? $attributes['captionPosition'] : 'below';
		$caption_font_size = isset( $attributes['captionFontSize'] ) ? $attributes['captionFontSize'] : 14;
		$caption_color    = isset( $attributes['captionColor'] ) ? $attributes['captionColor'] : '';
		$hover_effect     = isset( $attributes['hoverEffect'] ) ? $attributes['hoverEffect'] : 'zoom';
		$border_radius    = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 0;
		$border_width     = isset( $attributes['borderWidth'] ) ? $attributes['borderWidth'] : 0;
		$border_color     = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '';
		$box_shadow       = isset( $attributes['boxShadow'] ) ? $attributes['boxShadow'] : false;
		
		// Header attributes
		$display_header   = isset( $attributes['displayHeader'] ) ? $attributes['displayHeader'] : true;
		$header_title     = isset( $attributes['headerTitle'] ) ? $attributes['headerTitle'] : __('Media Gallery', 'murdeni-blocks');
		$display_view_all = isset( $attributes['displayViewAll'] ) ? $attributes['displayViewAll'] : true;
		$view_all_text    = isset( $attributes['viewAllText'] ) ? $attributes['viewAllText'] : __('View All', 'murdeni-blocks');
		$view_all_url     = isset( $attributes['viewAllUrl'] ) ? $attributes['viewAllUrl'] : '';

		// If no items, return empty.
		if ( empty( $items ) ) {
			return '';
		}

		// Enqueue frontend script if lightbox is enabled.
		if ( $lightbox_enabled ) {
			wp_enqueue_script( 'murdeni-media-gallery-frontend' );
		}

		// Get aspect ratio style.
		$aspect_ratio_style = $this->get_aspect_ratio_style( $aspect_ratio );

		// Start output.
		ob_start();

		// Gallery container.
		$gallery_classes = array(
			'murdeni-media-gallery',
			'columns-' . $columns,
			'hover-' . $hover_effect,
		);

		$gallery_style = '';
		?>
		<div class="<?php echo esc_attr( implode( ' ', $gallery_classes ) ); ?>" <?php echo $gallery_style ? 'style="' . esc_attr( $gallery_style ) . '"' : ''; ?>>
			<?php if ( $display_header ) : ?>
			<div class="murdeni-media-gallery__header">
				<h2 class="murdeni-media-gallery__title"><?php echo esc_html( $header_title ); ?></h2>
				<?php if ( $display_view_all && ! empty( $view_all_url ) ) : ?>
				<a href="<?php echo esc_url( $view_all_url ); ?>" class="murdeni-media-gallery__view-all"><?php echo esc_html( $view_all_text ); ?></a>
				<?php endif; ?>
			</div>
			<?php endif; ?>
			<div class="murdeni-media-gallery__grid" style="gap: <?php echo esc_attr( $gap_size ); ?>px;">
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
						'murdeni-media-gallery__item',
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

					// Caption style.
					$caption_style = array();

					

					if ( ! empty( $caption_color ) ) {
						$caption_style[] = 'color: ' . $caption_color;
					}

					// Video URL.
					$video_url = isset( $item['videoUrl'] ) ? $item['videoUrl'] : '';
					$video_id  = $this->get_youtube_video_id( $video_url );

					// Lightbox attributes.
					$lightbox_attrs = array();

					if ( $lightbox_enabled ) {
						$lightbox_attrs[] = 'data-lightbox="true"';
						
						if ( $is_video && ! empty( $video_id ) ) {
							$lightbox_attrs[] = 'data-type="video"';
							$lightbox_attrs[] = 'data-video-id="' . esc_attr( $video_id ) . '"';
						} else {
							$lightbox_attrs[] = 'data-type="image"';
							$lightbox_attrs[] = 'data-full-image="' . esc_url( $item['mediaUrl'] ) . '"';
						}

						if ( ! empty( $item['caption'] ) ) {
							$lightbox_attrs[] = 'data-caption="' . esc_attr( $item['caption'] ) . '"';
						}
					}
					?>
					<div class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" <?php echo ! empty( $item_style ) ? 'style="' . esc_attr( implode( '; ', $item_style ) ) . '"' : ''; ?>>
						<div class="murdeni-media-gallery__item-inner">
							<div class="murdeni-media-gallery__item-media-wrapper" style="<?php echo esc_attr( $aspect_ratio_style ); ?>">
								<a href="<?php echo $is_video && ! empty( $video_id ) ? esc_url( 'https://www.youtube.com/watch?v=' . $video_id ) : esc_url( $item['mediaUrl'] ); ?>" 
									class="murdeni-media-gallery__item-link"
									<?php echo implode( ' ', $lightbox_attrs ); ?>
								>
									<img 
										src="<?php echo esc_url( $item['mediaUrl'] ); ?>" 
										alt="<?php echo esc_attr( $item['caption'] ?? '' ); ?>" 
										class="murdeni-media-gallery__item-media"
									/>
									<?php if ( $is_video && ! empty( $video_id ) ) : ?>
										<div class="murdeni-media-gallery__item-play-button">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
												<path d="M8 5v14l11-7z" fill="#ffffff"/>
											</svg>
										</div>
									<?php endif; ?>
								</a>
							</div>
							
							<?php if ( $show_captions && ! empty( $item['caption'] ) && 'below' === $caption_position ) : ?>
								<figcaption 
									class="murdeni-media-gallery__item-caption" 
									<?php echo ! empty( $caption_style ) ? 'style="' . esc_attr( implode( '; ', $caption_style ) ) . '"' : ''; ?>
								>
									<?php echo wp_kses_post( $item['caption'] ); ?>
								</figcaption>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
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
