<?php
/**
 * Image Text Block Class
 *
 * @package Murdeni_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Murdeni_Image_Text
 */
class Murdeni_Image_Text {

	/**
	 * Initialize the class.
	 */
	public function init() {
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Register the block.
	 */
	public function register_block() {
		register_block_type(
			MURDENI_BLOCKS_PATH . 'build/image-text',
			array(
				'render_callback' => array( $this, 'render_block' ),
			)
		);
	}

	/**
	 * Render the block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_block( $attributes ) {
		$title                 = isset( $attributes['title'] ) ? $attributes['title'] : '';
		$description           = isset( $attributes['description'] ) ? $attributes['description'] : '';
		$image                 = isset( $attributes['image'] ) && is_array( $attributes['image'] ) ? $attributes['image'] : array();
		$alignment             = isset( $attributes['alignment'] ) ? $attributes['alignment'] : 'center';
		$image_width           = isset( $attributes['imageWidth'] ) ? absint( $attributes['imageWidth'] ) : 100;
		$image_width_unit      = isset( $attributes['imageWidthUnit'] ) ? $attributes['imageWidthUnit'] : '%';
		$image_border_radius   = isset( $attributes['imageBorderRadius'] ) ? absint( $attributes['imageBorderRadius'] ) : 0;
		$content_gap           = isset( $attributes['contentGap'] ) ? absint( $attributes['contentGap'] ) : 16;
		$title_font_size       = isset( $attributes['titleFontSize'] ) ? absint( $attributes['titleFontSize'] ) : 24;
		$description_font_size = isset( $attributes['descriptionFontSize'] ) ? absint( $attributes['descriptionFontSize'] ) : 16;
		$title_color           = isset( $attributes['titleColor'] ) ? $attributes['titleColor'] : '#111827';
		$description_color     = isset( $attributes['descriptionColor'] ) ? $attributes['descriptionColor'] : '#4b5563';
		$custom_class          = isset( $attributes['customClass'] ) ? $attributes['customClass'] : '';

		$alignment        = in_array( $alignment, array( 'left', 'center', 'right' ), true ) ? $alignment : 'center';
		$image_width_unit = in_array( $image_width_unit, array( 'px', '%' ), true ) ? $image_width_unit : '%';
		$image_url        = isset( $image['url'] ) ? $image['url'] : '';
		$image_alt        = isset( $image['alt'] ) ? $image['alt'] : $title;

		$block_style = array(
			'--murdeni-image-text-align: ' . $alignment,
			'--murdeni-image-text-gap: ' . $content_gap . 'px',
			'--murdeni-image-text-title-size: ' . $title_font_size . 'px',
			'--murdeni-image-text-description-size: ' . $description_font_size . 'px',
			'--murdeni-image-text-title-color: ' . $title_color,
			'--murdeni-image-text-description-color: ' . $description_color,
			'--murdeni-image-text-image-width: ' . $image_width . $image_width_unit,
			'--murdeni-image-text-image-radius: ' . $image_border_radius . 'px',
		);

		ob_start();
		?>
		<div class="murdeni-image-text align-<?php echo esc_attr( $alignment ); ?> <?php echo esc_attr( $custom_class ); ?>" style="<?php echo esc_attr( implode( '; ', $block_style ) ); ?>">
			<?php if ( ! empty( $title ) ) : ?>
				<h3 class="murdeni-image-text__title"><?php echo esc_html( $title ); ?></h3>
			<?php endif; ?>

			<?php if ( ! empty( $image_url ) ) : ?>
				<figure class="murdeni-image-text__image">
					<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" />
				</figure>
			<?php endif; ?>

			<?php if ( ! empty( $description ) ) : ?>
				<div class="murdeni-image-text__description"><?php echo wp_kses_post( wpautop( $description ) ); ?></div>
			<?php endif; ?>
		</div>
		<?php

		return ob_get_clean();
	}
}
