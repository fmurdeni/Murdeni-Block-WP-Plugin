<?php
/**
 * Accordion Block Class
 *
 * @package Murdeni_Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Murdeni_Accordion
 */
class Murdeni_Accordion {

	/**
	 * Initialize the class
	 */
	public function init() {
		// Register block assets.
		add_action( 'init', array( $this, 'register_block_assets' ) );
		
		// Register frontend script for accordion functionality.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_script' ) );
	}

	/**
	 * Register block assets
	 */
	public function register_block_assets() {
		// Register block editor script
		wp_register_script(
			'murdeni-accordion-editor',
			MURDENI_BLOCKS_URL . 'build/accordion/index.js',
			array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data'),
			MURDENI_BLOCKS_VERSION,
			true
		);

		// Register block editor styles
		wp_register_style(
			'murdeni-accordion-editor-style',
			MURDENI_BLOCKS_URL . 'build/accordion/index.css',
			array('wp-edit-blocks'),
			MURDENI_BLOCKS_VERSION
		);

		// Register frontend styles
		wp_register_style(
			'murdeni-accordion-style',
			MURDENI_BLOCKS_URL . 'build/accordion/style-index.css',
			array(),
			MURDENI_BLOCKS_VERSION
		);

		// Register block type.
		register_block_type(
			MURDENI_BLOCKS_PATH . 'build/accordion',
			array(
				'render_callback' => array( $this, 'render_accordion_block' ),
				'editor_script'   => 'murdeni-accordion-editor',
				'editor_style'    => 'murdeni-accordion-editor-style',
				'style'           => 'murdeni-accordion-style',
			)
		);
	}

	/**
	 * Register frontend script
	 */
	public function register_frontend_script() {
		// Register and enqueue frontend script.
		wp_register_script(
			'murdeni-accordion-frontend',
			MURDENI_BLOCKS_URL . 'build/accordion/frontend.js',
			array(),
			MURDENI_BLOCKS_VERSION,
			true
		);
	}

	/**
	 * Render accordion block
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function render_accordion_block( $attributes ) {
		// Extract attributes.
		$items               = isset( $attributes['items'] ) ? $attributes['items'] : array();
		$allow_multiple_open = isset( $attributes['allowMultipleOpen'] ) ? $attributes['allowMultipleOpen'] : false;
		$initially_open      = isset( $attributes['initiallyOpen'] ) ? $attributes['initiallyOpen'] : false;
		$title_tag           = isset( $attributes['titleTag'] ) ? $attributes['titleTag'] : 'h3';
		$title_font_size     = isset( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : 18;
		$title_color         = isset( $attributes['titleColor'] ) ? $attributes['titleColor'] : '';
		$content_font_size   = isset( $attributes['contentFontSize'] ) ? $attributes['contentFontSize'] : 16;
		$content_color       = isset( $attributes['contentColor'] ) ? $attributes['contentColor'] : '';
		$border_width        = isset( $attributes['borderWidth'] ) ? $attributes['borderWidth'] : 1;
		$border_color        = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '#e0e0e0';
		$border_radius       = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 4;
		$background_color    = isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '';
		$active_bg_color     = isset( $attributes['activeBackgroundColor'] ) ? $attributes['activeBackgroundColor'] : '';
		$icon_color          = isset( $attributes['iconColor'] ) ? $attributes['iconColor'] : '';
		$icon_position       = isset( $attributes['iconPosition'] ) ? $attributes['iconPosition'] : 'right';
		$icon_type           = isset( $attributes['iconType'] ) ? $attributes['iconType'] : 'plus-minus';
		$spacing             = isset( $attributes['spacing'] ) ? $attributes['spacing'] : 10;
		$padding             = isset( $attributes['padding'] ) ? $attributes['padding'] : 15;

		// If no items, return empty.
		if ( empty( $items ) ) {
			return '';
		}

		// Enqueue frontend script.
		wp_enqueue_script( 'murdeni-accordion-frontend' );

		// Add data attributes for JavaScript.
		$data_attrs = array(
			'data-allow-multiple' => $allow_multiple_open ? 'true' : 'false',
			'data-initially-open' => $initially_open ? 'true' : 'false',
		);

		$data_attr_string = '';
		foreach ( $data_attrs as $key => $value ) {
			$data_attr_string .= ' ' . esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
		}

		// Start output.
		ob_start();
		?>
		<div class="murdeni-accordion" <?php echo $data_attr_string; ?>>
			<?php foreach ( $items as $index => $item ) : 
				$item_id = isset( $item['id'] ) ? $item['id'] : 'item-' . $index;
				$question = isset( $item['question'] ) ? $item['question'] : '';
				$answer = isset( $item['answer'] ) ? $item['answer'] : '';
				$is_open = $initially_open ? 'is-open' : '';
				
				// Item style.
				$item_style = '';
				if ( $border_width >= 0 ) {
					$item_style .= 'border-width: ' . $border_width . 'px; ';
					$item_style .= 'border-style: solid; ';
					$item_style .= 'border-color: ' . $border_color . '; ';
				}
				if ( $border_radius > 0 ) {
					$item_style .= 'border-radius: ' . $border_radius . 'px; ';
				}
				if ( $background_color ) {
					$item_style .= 'background-color: ' . $background_color . '; ';
				}
				if ( $spacing > 0 ) {
					$item_style .= 'margin-bottom: ' . $spacing . 'px; ';
				}
				
				// Header style.
				$header_style = '';
				if ( $padding > 0 ) {
					$header_style .= 'padding: ' . $padding . 'px; '; 
				}
				if ( $title_font_size > 0 ) {
					$header_style .= 'font-size: ' . $title_font_size . 'px; ';
				}
				if ( $title_color ) {
					$header_style .= 'color: ' . $title_color . '; ';
				}
				
				// Content style.
				$content_style = '';
				if ( $content_font_size > 0 ) {
					$content_style .= 'font-size: ' . $content_font_size . 'px; ';
				}
				if ( $content_color ) {
					$content_style .= 'color: ' . $content_color . '; ';
				}
				if ( $border_width > 0 ) {
					$content_style .= 'border-top: ' . $border_width . 'px solid ' . $border_color . '; ';
				}
				
				// Icon style.
				$icon_style = '';
				if ( $icon_color ) {
					$icon_style .= 'color: ' . $icon_color . '; ';
				}
				
				// Get icons based on type.
				$plus_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" fill="currentColor"></path></svg>';
				$minus_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M6 11h12v2H6z" fill="currentColor"></path></svg>';
				$chevron_down = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6z" fill="currentColor"></path></svg>';
				$chevron_up = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M12 8l-5.5 4.4.9 1.2L12 10l4.5 3.6.9-1.2z" fill="currentColor"></path></svg>';
				
				// Set icons based on type.
				if ( $icon_type === 'plus-minus' ) {
					$closed_icon = $plus_icon;
					$open_icon = $minus_icon;
				} else {
					$closed_icon = $chevron_down;
					$open_icon = $chevron_up;
				}
			?>
				<div 
					id="murdeni-accordion-<?php echo esc_attr( $item_id ); ?>" 
					class="murdeni-accordion__item <?php echo esc_attr( $is_open ); ?>"
					style="<?php echo esc_attr( $item_style ); ?>"
				>
					<div 
						class="murdeni-accordion__header murdeni-accordion__header--<?php echo esc_attr( $icon_position ); ?>"
						style="<?php echo esc_attr( $header_style ); ?>"
					>
						<?php if ( $icon_position === 'left' ) : ?>
							<span class="murdeni-accordion__icon icon-<?php echo esc_attr( $icon_type ); ?>" style="<?php echo esc_attr( $icon_style ); ?>">
								<?php echo $icon_type === 'plus-minus' ? $plus_icon : $chevron_down; ?>
							</span>
						<?php endif; ?>
						
						<<?php echo esc_attr( $title_tag ); ?> class="murdeni-accordion__title">
							<?php echo wp_kses_post( $question ); ?>
						</<?php echo esc_attr( $title_tag ); ?>>
						
						<?php if ( $icon_position === 'right' ) : ?>
							<span class="murdeni-accordion__icon icon-<?php echo esc_attr( $icon_type ); ?>" style="<?php echo esc_attr( $icon_style ); ?>">
								<?php echo $icon_type === 'plus-minus' ? $plus_icon : $chevron_down; ?>
							</span>
						<?php endif; ?>
					</div>
					
					<div 
						class="murdeni-accordion__content"
						style="<?php echo esc_attr( $content_style ); ?><?php echo ! $is_open ? ' display: none;' : ''; ?>"
					>
						<div class="murdeni-accordion__content-inner">
							<?php echo wp_kses_post( $answer ); ?>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php

		return ob_get_clean();
	}
}
