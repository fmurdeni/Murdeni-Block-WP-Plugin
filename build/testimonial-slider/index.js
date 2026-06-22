(function (wp) {
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var useState = wp.element.useState;
    var __ = wp.i18n.__;
    var registerBlockType = wp.blocks.registerBlockType;
    var blockEditor = wp.blockEditor;
    var components = wp.components;

    var InspectorControls = blockEditor.InspectorControls;
    var MediaUpload = blockEditor.MediaUpload;
    var MediaUploadCheck = blockEditor.MediaUploadCheck;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;
    var Button = components.Button;
    var PanelBody = components.PanelBody;
    var PanelRow = components.PanelRow;
    var RangeControl = components.RangeControl;
	    var ToggleControl = components.ToggleControl;
	    var ColorPicker = components.ColorPicker;
	    var TextControl = components.TextControl;

	    var avatarColors = ['#16a34a', '#0ea5e9', '#f97316', '#8b5cf6', '#ef4444', '#0891b2'];

	    function getInitials(name) {
	        var words = (name || '').trim().split(/\s+/).filter(Boolean);
	        if (!words.length) {
	            return '+';
	        }
	        return words.slice(0, 2).map(function (word) { return word.charAt(0).toUpperCase(); }).join('');
	    }

	    function getAvatarColor(testimonial) {
	        if (testimonial && testimonial.authorAvatarColor) {
	            return testimonial.authorAvatarColor;
	        }
	        var name = (testimonial && (testimonial.authorName || testimonial.id)) || '';
	        var total = name.split('').reduce(function (sum, character) {
	            return sum + character.charCodeAt(0);
	        }, 0);
	        return avatarColors[total % avatarColors.length];
	    }

    function renderStars(rating, color, onRate) {
        var stars = [];
        for (var i = 0; i < 5; i++) {
            (function (index) {
                stars.push(el(
                    'span',
                    {
                        key: index,
                        className: index < rating ? 'star filled' : 'star empty',
                        style: { color: color },
                        onClick: function () { return onRate(index + 1); }
                    },
                    '★'
                ));
            })(i);
        }
        return stars;
    }

    function calculateAverageRating(testimonials) {
        if (!testimonials || !testimonials.length) {
            return 0;
        }
        return testimonials.reduce(function (total, testimonial) {
            return total + (testimonial.rating || 0);
        }, 0) / testimonials.length;
    }

    function Edit(props) {
        var attributes = props.attributes;
        var setAttributes = props.setAttributes;
        var testimonials = attributes.testimonials || [];
        var activeState = useState(0);
        var activeTestimonial = activeState[0];
        var setActiveTestimonial = activeState[1];
        var active = testimonials[activeTestimonial] || {};

        var blockProps = useBlockProps({
            className: 'testimonial-slider-editor' + (attributes.fixedHeight ? ' fixed-height' : ''),
            style: attributes.fixedHeight ? { '--slide-height': attributes.slideHeight + 'px' } : {}
        });

        function updateTestimonial(index, property, value) {
            var nextTestimonials = testimonials.slice();
            nextTestimonials[index] = Object.assign({}, nextTestimonials[index], (_a = {}, _a[property] = value, _a));
            setAttributes({ testimonials: nextTestimonials });
            var _a;
        }

        function addTestimonial() {
            setAttributes({
                testimonials: testimonials.concat([{
                    id: 'testimonial-' + Date.now(),
                    rating: 5,
                    content: '',
	                    authorName: '',
	                    authorPosition: '',
		                    authorImage: '',
		                    authorAvatarColor: avatarColors[testimonials.length % avatarColors.length],
		                    reviewTime: '',
		                    reviewUrl: ''
	                }])
	            });
            setActiveTestimonial(testimonials.length);
        }

        function removeTestimonial(index) {
            var nextTestimonials = testimonials.slice();
            nextTestimonials.splice(index, 1);
            setAttributes({ testimonials: nextTestimonials });
            if (index >= nextTestimonials.length && nextTestimonials.length > 0) {
                setActiveTestimonial(nextTestimonials.length - 1);
            }
        }

        var averageRating = calculateAverageRating(testimonials);

        return el(
            Fragment,
            null,
            el(
                InspectorControls,
                null,
                el(
                    PanelBody,
                    { title: __('Slider Settings', 'murdeni-blocks'), initialOpen: true },
                    el(RangeControl, {
                        label: __('Slides to Show', 'murdeni-blocks'),
                        value: attributes.slidesToShow,
                        onChange: function (value) { return setAttributes({ slidesToShow: value }); },
                        min: 1,
                        max: 2
                    }),
                    el(ToggleControl, {
                        label: __('Autoplay', 'murdeni-blocks'),
                        checked: attributes.autoplay,
                        onChange: function (value) { return setAttributes({ autoplay: value }); }
                    }),
                    attributes.autoplay && el(RangeControl, {
                        label: __('Autoplay Speed (ms)', 'murdeni-blocks'),
                        value: attributes.autoplaySpeed,
                        onChange: function (value) { return setAttributes({ autoplaySpeed: value }); },
                        min: 1000,
                        max: 10000,
                        step: 500
                    }),
                    el(ToggleControl, {
                        label: __('Show Arrows', 'murdeni-blocks'),
                        checked: attributes.arrows,
                        onChange: function (value) { return setAttributes({ arrows: value }); }
                    }),
                    el(ToggleControl, {
                        label: __('Show Dots', 'murdeni-blocks'),
                        checked: attributes.dots,
                        onChange: function (value) { return setAttributes({ dots: value }); }
                    }),
                    el(ToggleControl, {
                        label: __('Infinite Loop', 'murdeni-blocks'),
                        checked: attributes.infinite,
                        onChange: function (value) { return setAttributes({ infinite: value }); }
                    }),
                    el(RangeControl, {
                        label: __('Animation Speed (ms)', 'murdeni-blocks'),
                        value: attributes.speed,
                        onChange: function (value) { return setAttributes({ speed: value }); },
                        min: 100,
                        max: 3000,
                        step: 100
                    }),
	                    el(ToggleControl, {
	                        label: __('Pause on Hover', 'murdeni-blocks'),
	                        checked: attributes.pauseOnHover,
	                        onChange: function (value) { return setAttributes({ pauseOnHover: value }); }
	                    })
	                ),
	                el(
	                    PanelBody,
	                    { title: __('Card Bottom Settings', 'murdeni-blocks'), initialOpen: false },
	                    el(TextControl, {
	                        label: __('Bottom Title', 'murdeni-blocks'),
	                        value: attributes.cardBottomTitle,
	                        onChange: function (value) { return setAttributes({ cardBottomTitle: value }); }
	                    }),
	                    el(TextControl, {
	                        label: __('Bottom Subtitle', 'murdeni-blocks'),
	                        value: attributes.cardBottomSubtitle,
	                        onChange: function (value) { return setAttributes({ cardBottomSubtitle: value }); }
	                    }),
	                    el(TextControl, {
	                        label: __('Review Link Text', 'murdeni-blocks'),
	                        value: attributes.cardReviewLinkText,
	                        onChange: function (value) { return setAttributes({ cardReviewLinkText: value }); }
	                    })
	                ),
	                el(
	                    PanelBody,
	                    { title: __('Rating Settings', 'murdeni-blocks'), initialOpen: false },
                    el(ToggleControl, {
                        label: __('Show Overall Rating', 'murdeni-blocks'),
                        checked: attributes.showOverallRating,
                        onChange: function (value) { return setAttributes({ showOverallRating: value }); }
                    }),
                    attributes.showOverallRating && el(
                        Fragment,
                        null,
                        el(RangeControl, {
                            label: __('Reviewer Count', 'murdeni-blocks'),
                            value: attributes.reviewerCount,
                            onChange: function (value) { return setAttributes({ reviewerCount: value }); },
                            min: 0,
                            max: 1000
                        }),
                        el(TextControl, {
                            label: __('Rating Text Format', 'murdeni-blocks'),
                            help: __('Use %d as placeholder for reviewer count', 'murdeni-blocks'),
                            value: attributes.overallRatingText,
                            onChange: function (value) { return setAttributes({ overallRatingText: value }); }
                        })
                    )
                ),
                el(
                    PanelBody,
                    { title: __('Height Settings', 'murdeni-blocks'), initialOpen: false },
                    el(ToggleControl, {
                        label: __('Fixed Height Slides', 'murdeni-blocks'),
                        checked: attributes.fixedHeight,
                        onChange: function (value) { return setAttributes({ fixedHeight: value }); }
                    }),
                    attributes.fixedHeight && el(RangeControl, {
                        label: __('Slide Height (px)', 'murdeni-blocks'),
                        value: attributes.slideHeight,
                        onChange: function (value) { return setAttributes({ slideHeight: value }); },
                        min: 100,
                        max: 800,
                        step: 10
                    })
                ),
                el(
                    PanelBody,
                    { title: __('Style Settings', 'murdeni-blocks'), initialOpen: false },
                    el(PanelRow, null, el('span', null, __('Background Color', 'murdeni-blocks'))),
                    el(ColorPicker, {
                        color: attributes.backgroundColor,
                        onChange: function (value) { return setAttributes({ backgroundColor: value }); },
                        enableAlpha: true
                    }),
                    el(PanelRow, null, el('span', null, __('Text Color', 'murdeni-blocks'))),
                    el(ColorPicker, {
                        color: attributes.textColor,
                        onChange: function (value) { return setAttributes({ textColor: value }); },
                        enableAlpha: true
                    }),
                    el(PanelRow, null, el('span', null, __('Rating Color', 'murdeni-blocks'))),
                    el(ColorPicker, {
                        color: attributes.ratingColor,
                        onChange: function (value) { return setAttributes({ ratingColor: value }); },
                        enableAlpha: true
                    }),
                    el(RangeControl, {
                        label: __('Border Radius (px)', 'murdeni-blocks'),
                        value: attributes.borderRadius,
                        onChange: function (value) { return setAttributes({ borderRadius: value }); },
                        min: 0,
                        max: 50
                    }),
                    el(ToggleControl, {
                        label: __('Box Shadow', 'murdeni-blocks'),
                        checked: attributes.boxShadow,
                        onChange: function (value) { return setAttributes({ boxShadow: value }); }
                    })
                )
            ),
            el(
                'div',
                blockProps,
                attributes.showOverallRating && el(
                    'div',
                    { className: 'testimonial-overall-rating' },
                    el(
                        'div',
                        { className: 'overall-rating-stars' },
                        renderStars(averageRating, attributes.ratingColor, function () {}),
                        el('span', { className: 'average-rating' }, averageRating.toFixed(1))
                    ),
                    el('div', { className: 'overall-rating-text' }, (attributes.overallRatingText || '').replace('%d', attributes.reviewerCount || 0))
                ),
                el(
                    'div',
                    { className: 'testimonial-slider-tabs' },
                    testimonials.map(function (testimonial, index) {
                        return el(
                            'button',
                            {
                                key: testimonial.id,
                                className: 'testimonial-tab ' + (index === activeTestimonial ? 'active' : ''),
                                onClick: function () { return setActiveTestimonial(index); }
                            },
                            __('Testimonial', 'murdeni-blocks') + ' ' + (index + 1)
                        );
                    }),
                    el('button', { className: 'testimonial-add-button', onClick: addTestimonial }, __('+ Add', 'murdeni-blocks'))
                ),
                testimonials.length > 0 && el(
                    'div',
                    {
                        className: 'testimonial-card-editor',
                        style: {
                            backgroundColor: attributes.backgroundColor,
                            color: attributes.textColor,
                            borderRadius: attributes.borderRadius + 'px',
                            boxShadow: attributes.boxShadow ? '0 4px 16px rgba(0,0,0,0.1)' : 'none'
                        }
                    },
                    el(
                        'div',
                        { className: 'testimonial-author' },
                        el(
                            'div',
                            { className: 'author-image' },
                            el(
                                MediaUploadCheck,
                                null,
                                el(MediaUpload, {
                                    onSelect: function (media) { return updateTestimonial(activeTestimonial, 'authorImage', media.url); },
                                    allowedTypes: ['image'],
                                    value: active.authorImage,
                                    render: function (renderProps) {
                                        return el(
                                            Button,
                                            {
                                                onClick: renderProps.open,
                                                className: 'image-button',
	                                                style: active.authorImage ? { backgroundImage: 'url(' + active.authorImage + ')' } : { backgroundColor: getAvatarColor(active) }
	                                            },
	                                            !active.authorImage && getInitials(active.authorName)
	                                        );
                                    }
                                })
                            )
                        ),
                        el(
                            'div',
                            { className: 'author-info' },
                            el(RichText, {
                                tagName: 'h4',
                                value: active.authorName,
                                onChange: function (value) { return updateTestimonial(activeTestimonial, 'authorName', value); },
                                placeholder: __('Author Name', 'murdeni-blocks')
                            }),
                            el(RichText, {
                                tagName: 'p',
                                value: active.authorPosition,
                                onChange: function (value) { return updateTestimonial(activeTestimonial, 'authorPosition', value); },
                                placeholder: __('Author Details', 'murdeni-blocks')
                            })
                        ),
                        el(RichText, {
                            tagName: 'div',
                            className: 'testimonial-review-time',
                            value: active.reviewTime,
                            onChange: function (value) { return updateTestimonial(activeTestimonial, 'reviewTime', value); },
                            placeholder: __('Review time...', 'murdeni-blocks')
                        })
                    ),
                    el('div', { className: 'testimonial-rating' }, renderStars(active.rating || 5, attributes.ratingColor, function (rating) {
                        updateTestimonial(activeTestimonial, 'rating', rating);
                    })),
                    el(
                        'div',
                        { className: 'testimonial-content' },
                        el(RichText, {
                            tagName: 'p',
                            value: active.content,
                            onChange: function (value) { return updateTestimonial(activeTestimonial, 'content', value); },
                            placeholder: __('Enter testimonial content...', 'murdeni-blocks')
                        })
                    ),
	                    el(
	                        'div',
	                        { className: 'testimonial-card-bottom' },
	                        el(
	                            'div',
	                            { className: 'testimonial-bottom-copy' },
	                            attributes.cardBottomTitle && el('div', { className: 'testimonial-bottom-title' }, attributes.cardBottomTitle),
	                            attributes.cardBottomSubtitle && el('div', { className: 'testimonial-bottom-subtitle' }, attributes.cardBottomSubtitle)
	                        ),
	                        el(
	                            'div',
	                            { className: 'testimonial-bottom-link-editor' },
	                            attributes.cardReviewLinkText && el('span', { className: 'testimonial-review-link' }, attributes.cardReviewLinkText),
	                            el(TextControl, {
	                                value: active.reviewUrl,
	                                onChange: function (value) { return updateTestimonial(activeTestimonial, 'reviewUrl', value); },
                                placeholder: __('Review URL...', 'murdeni-blocks')
                            })
                        )
                    ),
                    testimonials.length > 1 && el(
                        Button,
                        { className: 'remove-testimonial-button', onClick: function () { return removeTestimonial(activeTestimonial); }, isDestructive: true },
                        __('Remove Testimonial', 'murdeni-blocks')
                    )
                )
            )
        );
    }

    registerBlockType('murdeni/testimonial-slider', {
        icon: 'format-status',
        edit: Edit,
        save: function () {
            return null;
        }
    });
})(window.wp);
