<?php
/**
 * Instagram Badge Block Class
 *
 * @package Murdeni_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Murdeni_Instagram_Badge
 */
class Murdeni_Instagram_Badge {

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
			MURDENI_BLOCKS_PATH . 'build/instagram-badge',
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
		$avatar                 = isset( $attributes['avatar'] ) && is_array( $attributes['avatar'] ) ? $attributes['avatar'] : array();
		$username               = isset( $attributes['username'] ) ? $attributes['username'] : '@klikkacamobil';
		$followers_text         = isset( $attributes['followersText'] ) ? $attributes['followersText'] : '1,095 followers';
		$profile_url            = isset( $attributes['profileUrl'] ) ? $attributes['profileUrl'] : 'https://www.instagram.com/klikkacamobil/?hl=en';
		$show_avatar            = isset( $attributes['showAvatar'] ) ? (bool) $attributes['showAvatar'] : true;
		$show_instagram_icon    = isset( $attributes['showInstagramIcon'] ) ? (bool) $attributes['showInstagramIcon'] : true;
		$show_blue_check        = isset( $attributes['showBlueCheck'] ) ? (bool) $attributes['showBlueCheck'] : true;
		$show_followers         = isset( $attributes['showFollowers'] ) ? (bool) $attributes['showFollowers'] : true;
		$open_in_new_tab        = isset( $attributes['openInNewTab'] ) ? (bool) $attributes['openInNewTab'] : true;
		$badge_width            = isset( $attributes['badgeWidth'] ) ? absint( $attributes['badgeWidth'] ) : 420;
		$badge_width_unit       = isset( $attributes['badgeWidthUnit'] ) ? $attributes['badgeWidthUnit'] : 'px';
		$badge_alignment        = isset( $attributes['badgeAlignment'] ) ? $attributes['badgeAlignment'] : 'left';
		$background_type        = isset( $attributes['backgroundType'] ) ? $attributes['backgroundType'] : 'solid';
		$background_color       = isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '#202022';
		$gradient_start_color   = isset( $attributes['gradientStartColor'] ) ? $attributes['gradientStartColor'] : '#202022';
		$gradient_end_color     = isset( $attributes['gradientEndColor'] ) ? $attributes['gradientEndColor'] : '#111111';
		$border_color           = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '#0b0b0c';
		$border_width           = isset( $attributes['borderWidth'] ) ? absint( $attributes['borderWidth'] ) : 1;
		$border_radius          = isset( $attributes['borderRadius'] ) ? absint( $attributes['borderRadius'] ) : 14;
		$padding                = isset( $attributes['padding'] ) && is_array( $attributes['padding'] ) ? $attributes['padding'] : array();
		$gap                    = isset( $attributes['gap'] ) ? absint( $attributes['gap'] ) : 14;
		$avatar_size            = isset( $attributes['avatarSize'] ) ? absint( $attributes['avatarSize'] ) : 52;
		$avatar_border_radius   = isset( $attributes['avatarBorderRadius'] ) ? absint( $attributes['avatarBorderRadius'] ) : 50;
		$icon_size              = isset( $attributes['iconSize'] ) ? absint( $attributes['iconSize'] ) : 18;
		$check_size             = isset( $attributes['checkSize'] ) ? absint( $attributes['checkSize'] ) : 16;
		$username_font_size     = isset( $attributes['usernameFontSize'] ) ? absint( $attributes['usernameFontSize'] ) : 18;
		$followers_font_size    = isset( $attributes['followersFontSize'] ) ? absint( $attributes['followersFontSize'] ) : 15;
		$username_color         = isset( $attributes['usernameColor'] ) ? $attributes['usernameColor'] : '#ffffff';
		$followers_color        = isset( $attributes['followersColor'] ) ? $attributes['followersColor'] : '#b9b9bd';
		$icon_color             = isset( $attributes['iconColor'] ) ? $attributes['iconColor'] : '#ffffff';
		$blue_check_color       = isset( $attributes['blueCheckColor'] ) ? $attributes['blueCheckColor'] : '#1d9bf0';
		$box_shadow             = isset( $attributes['boxShadow'] ) ? (bool) $attributes['boxShadow'] : false;
		$custom_class           = isset( $attributes['customClass'] ) ? $attributes['customClass'] : '';

		$badge_width_unit = in_array( $badge_width_unit, array( 'px', '%' ), true ) ? $badge_width_unit : 'px';
		$badge_alignment  = in_array( $badge_alignment, array( 'left', 'center', 'right' ), true ) ? $badge_alignment : 'left';
		$background_type  = in_array( $background_type, array( 'solid', 'gradient' ), true ) ? $background_type : 'solid';

		$padding_top    = isset( $padding['top'] ) ? absint( $padding['top'] ) : 18;
		$padding_right  = isset( $padding['right'] ) ? absint( $padding['right'] ) : 22;
		$padding_bottom = isset( $padding['bottom'] ) ? absint( $padding['bottom'] ) : 18;
		$padding_left   = isset( $padding['left'] ) ? absint( $padding['left'] ) : 22;

		$wrapper_justify = 'flex-start';
		if ( 'center' === $badge_alignment ) {
			$wrapper_justify = 'center';
		} elseif ( 'right' === $badge_alignment ) {
			$wrapper_justify = 'flex-end';
		}

		$background_style = $background_color;
		if ( 'gradient' === $background_type ) {
			$background_style = 'linear-gradient(135deg, ' . $gradient_start_color . ', ' . $gradient_end_color . ')';
		}

		$badge_style = array(
			'width: 100%',
			'max-width: ' . $badge_width . $badge_width_unit,
			'background: ' . $background_style,
			'border-color: ' . $border_color,
			'border-width: ' . $border_width . 'px',
			'border-radius: ' . $border_radius . 'px',
			'padding: ' . $padding_top . 'px ' . $padding_right . 'px ' . $padding_bottom . 'px ' . $padding_left . 'px',
			'gap: ' . $gap . 'px',
		);

		if ( $box_shadow ) {
			$badge_style[] = 'box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18)';
		}

		$avatar_url = isset( $avatar['url'] ) ? $avatar['url'] : '';
		$avatar_alt = isset( $avatar['alt'] ) ? $avatar['alt'] : $username;

		$tag        = ! empty( $profile_url ) ? 'a' : 'div';
		$tag_attrs  = 'class="murdeni-instagram-badge ' . esc_attr( $custom_class ) . '" style="' . esc_attr( implode( '; ', $badge_style ) ) . '"';
		if ( ! empty( $profile_url ) ) {
			$tag_attrs .= ' href="' . esc_url( $profile_url ) . '"';
			if ( $open_in_new_tab ) {
				$tag_attrs .= ' target="_blank" rel="noopener noreferrer"';
			}
		}

		ob_start();
		?>
		<div class="murdeni-instagram-badge__wrapper" style="justify-content: <?php echo esc_attr( $wrapper_justify ); ?>;">
			<<?php echo tag_escape( $tag ); ?> <?php echo $tag_attrs; ?>>
				<?php if ( $show_avatar ) : ?>
					<div class="murdeni-instagram-badge__avatar" style="width: <?php echo esc_attr( $avatar_size ); ?>px; height: <?php echo esc_attr( $avatar_size ); ?>px; border-radius: <?php echo esc_attr( $avatar_border_radius ); ?>%;">
						<?php if ( ! empty( $avatar_url ) ) : ?>
							<img src="<?php echo esc_url( $avatar_url ); ?>" alt="<?php echo esc_attr( $avatar_alt ); ?>" />
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<div class="murdeni-instagram-badge__content">
					<div class="murdeni-instagram-badge__identity">
						<?php if ( $show_instagram_icon ) : ?>
							<span class="murdeni-instagram-badge__instagram-icon" style="color: <?php echo esc_attr( $icon_color ); ?>;">
								<?php echo $this->get_instagram_icon( $icon_size ); ?>
							</span>
						<?php endif; ?>

						<span class="murdeni-instagram-badge__username" style="color: <?php echo esc_attr( $username_color ); ?>; font-size: <?php echo esc_attr( $username_font_size ); ?>px;">
							<?php echo esc_html( $username ); ?>
						</span>

						<?php if ( $show_blue_check ) : ?>
							<span class="murdeni-instagram-badge__check" style="color: <?php echo esc_attr( $blue_check_color ); ?>;">
								<?php echo $this->get_blue_check_icon( $check_size ); ?>
							</span>
						<?php endif; ?>
					</div>

					<?php if ( $show_followers ) : ?>
						<div class="murdeni-instagram-badge__followers" style="color: <?php echo esc_attr( $followers_color ); ?>; font-size: <?php echo esc_attr( $followers_font_size ); ?>px;">
							<?php echo esc_html( $followers_text ); ?>
						</div>
					<?php endif; ?>
				</div>
			</<?php echo tag_escape( $tag ); ?>>
		</div>
		<?php

		return ob_get_clean();
	}

	/**
	 * Get Instagram icon SVG.
	 *
	 * @param int $size Icon size.
	 * @return string
	 */
	private function get_instagram_icon( $size ) {
		return '<svg class="murdeni-instagram-badge__instagram-icon-svg" width="' . esc_attr( $size ) . '" height="' . esc_attr( $size ) . '" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>';
	}

	/**
	 * Get blue check icon SVG.
	 *
	 * @param int $size Icon size.
	 * @return string
	 */
	private function get_blue_check_icon( $size ) {
		return '<svg class="murdeni-instagram-badge__check-svg" width="' . esc_attr( $size ) . '" height="' . esc_attr( $size ) . '" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path fill="#fff" d="M10.45 15.35 6.9 11.8l1.4-1.4 2.15 2.15 5.25-5.25 1.4 1.4-6.65 6.65z"/></svg>';
	}
}
