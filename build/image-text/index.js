(() => {
	'use strict';

	const { registerBlockType } = window.wp.blocks;
	const { __ } = window.wp.i18n;
	const {
		InspectorControls,
		MediaUpload,
		MediaUploadCheck,
		RichText,
		useBlockProps,
	} = window.wp.blockEditor;
	const {
		Button,
		ColorPicker,
		PanelBody,
		RangeControl,
		SelectControl,
		TextControl,
	} = window.wp.components;
	const { createElement: el, Fragment } = window.React;

	registerBlockType('murdeni/image-text', {
		edit({ attributes, setAttributes }) {
			const {
				title,
				description,
				image = {},
				alignment,
				imageWidth,
				imageWidthUnit,
				imageBorderRadius,
				contentGap,
				titleFontSize,
				descriptionFontSize,
				titleColor,
				descriptionColor,
				customClass,
			} = attributes;

			const widthUnit = imageWidthUnit || '%';
			const blockProps = useBlockProps({
				className: `murdeni-image-text align-${alignment || 'center'} ${customClass || ''}`,
				style: {
					'--murdeni-image-text-align': alignment || 'center',
					'--murdeni-image-text-gap': `${contentGap || 16}px`,
					'--murdeni-image-text-title-size': `${titleFontSize || 24}px`,
					'--murdeni-image-text-description-size': `${descriptionFontSize || 16}px`,
					'--murdeni-image-text-title-color': titleColor || '#111827',
					'--murdeni-image-text-description-color': descriptionColor || '#4b5563',
					'--murdeni-image-text-image-width': `${imageWidth || 100}${widthUnit}`,
					'--murdeni-image-text-image-radius': `${imageBorderRadius || 0}px`,
				},
			});

			const setImage = (media) => {
				setAttributes({
					image: {
						id: media.id || 0,
						url: media.url || '',
						alt: media.alt || title || '',
					},
				});
			};

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __('Layout', 'murdeni-blocks'), initialOpen: true },
						el(SelectControl, {
							label: __('Alignment', 'murdeni-blocks'),
							value: alignment || 'center',
							options: [
								{ label: __('Left', 'murdeni-blocks'), value: 'left' },
								{ label: __('Center', 'murdeni-blocks'), value: 'center' },
								{ label: __('Right', 'murdeni-blocks'), value: 'right' },
							],
							onChange: (value) => setAttributes({ alignment: value }),
						}),
						el(RangeControl, {
							label: __('Content Gap', 'murdeni-blocks'),
							value: contentGap,
							onChange: (value) => setAttributes({ contentGap: value }),
							min: 0,
							max: 80,
						})
					),
					el(
						PanelBody,
						{ title: __('Image', 'murdeni-blocks'), initialOpen: false },
						el(SelectControl, {
							label: __('Image Width Unit', 'murdeni-blocks'),
							value: widthUnit,
							options: [
								{ label: '%', value: '%' },
								{ label: 'px', value: 'px' },
							],
							onChange: (value) => setAttributes({ imageWidthUnit: value }),
						}),
						el(RangeControl, {
							label: __('Image Width', 'murdeni-blocks'),
							value: imageWidth,
							onChange: (value) => setAttributes({ imageWidth: value }),
							min: widthUnit === '%' ? 10 : 80,
							max: widthUnit === '%' ? 100 : 1200,
						}),
						el(RangeControl, {
							label: __('Image Border Radius', 'murdeni-blocks'),
							value: imageBorderRadius,
							onChange: (value) => setAttributes({ imageBorderRadius: value }),
							min: 0,
							max: 80,
						})
					),
					el(
						PanelBody,
						{ title: __('Typography', 'murdeni-blocks'), initialOpen: false },
						el(RangeControl, {
							label: __('Title Font Size', 'murdeni-blocks'),
							value: titleFontSize,
							onChange: (value) => setAttributes({ titleFontSize: value }),
							min: 12,
							max: 72,
						}),
						el(RangeControl, {
							label: __('Description Font Size', 'murdeni-blocks'),
							value: descriptionFontSize,
							onChange: (value) => setAttributes({ descriptionFontSize: value }),
							min: 10,
							max: 32,
						})
					),
					el(
						PanelBody,
						{ title: __('Colors', 'murdeni-blocks'), initialOpen: false },
						el('p', null, __('Title Color', 'murdeni-blocks')),
						el(ColorPicker, {
							color: titleColor,
							onChange: (value) => setAttributes({ titleColor: value }),
							enableAlpha: true,
						}),
						el('p', null, __('Description Color', 'murdeni-blocks')),
						el(ColorPicker, {
							color: descriptionColor,
							onChange: (value) => setAttributes({ descriptionColor: value }),
							enableAlpha: true,
						})
					),
					el(
						PanelBody,
						{ title: __('Additional', 'murdeni-blocks'), initialOpen: false },
						el(TextControl, {
							label: __('Custom CSS Class', 'murdeni-blocks'),
							value: customClass || '',
							onChange: (value) => setAttributes({ customClass: value }),
						})
					)
				),
				el(
					'div',
					blockProps,
					el(RichText, {
						tagName: 'h3',
						className: 'murdeni-image-text__title',
						value: title,
						onChange: (value) => setAttributes({ title: value }),
						placeholder: __('Add title...', 'murdeni-blocks'),
					}),
					el(
						'figure',
						{ className: 'murdeni-image-text__image' },
						image.url
							? el(
									Fragment,
									null,
									el('img', { src: image.url, alt: image.alt || title || '' }),
									el(
										'div',
										{ className: 'murdeni-image-text__image-actions' },
										el(MediaUploadCheck, null, el(MediaUpload, {
											onSelect: setImage,
											allowedTypes: ['image'],
											value: image.id,
											render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, __('Replace', 'murdeni-blocks')),
										})),
										el(Button, {
											variant: 'tertiary',
											isDestructive: true,
											onClick: () => setAttributes({ image: { id: 0, url: '', alt: '' } }),
										}, __('Remove', 'murdeni-blocks'))
									)
								)
							: el(MediaUploadCheck, null, el(MediaUpload, {
									onSelect: setImage,
									allowedTypes: ['image'],
									value: image.id,
									render: ({ open }) => el(Button, { variant: 'primary', onClick: open }, __('Upload Image', 'murdeni-blocks')),
								}))
					),
					el(RichText, {
						tagName: 'div',
						className: 'murdeni-image-text__description',
						value: description,
						onChange: (value) => setAttributes({ description: value }),
						placeholder: __('Add description...', 'murdeni-blocks'),
						multiline: 'p',
					})
				)
			);
		},
		save() {
			return null;
		},
	});
})();
