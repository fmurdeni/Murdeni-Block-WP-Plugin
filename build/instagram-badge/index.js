(function (wp) {
    var el = wp.element.createElement;
    var __ = wp.i18n.__;
    var registerBlockType = wp.blocks.registerBlockType;
    var blockEditor = wp.blockEditor;
    var components = wp.components;

    var InspectorControls = blockEditor.InspectorControls;
    var MediaUpload = blockEditor.MediaUpload;
    var MediaUploadCheck = blockEditor.MediaUploadCheck;
    var PanelColorSettings = blockEditor.PanelColorSettings;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;

    var Button = components.Button;
    var PanelBody = components.PanelBody;
    var PanelRow = components.PanelRow;
    var RangeControl = components.RangeControl;
    var SelectControl = components.SelectControl;
    var TextControl = components.TextControl;
    var ToggleControl = components.ToggleControl;
    var BoxControl = components.__experimentalBoxControl;

    var metadata = {
        apiVersion: 2,
        name: 'murdeni/instagram-badge',
        title: 'Instagram Badge',
        category: 'murdeni-blocks',
        icon: 'instagram',
        description: 'Display a customizable Instagram profile badge.',
        supports: {
            html: false,
            align: ['wide', 'full']
        },
        textdomain: 'murdeni-blocks',
        attributes: {
            avatar: { type: 'object', default: { id: 0, url: '', alt: '' } },
            username: { type: 'string', default: '@klikkacamobil' },
            followersText: { type: 'string', default: '1,095 followers' },
            profileUrl: { type: 'string', default: 'https://www.instagram.com/klikkacamobil/?hl=en' },
            showAvatar: { type: 'boolean', default: true },
            showInstagramIcon: { type: 'boolean', default: true },
            showBlueCheck: { type: 'boolean', default: true },
            showFollowers: { type: 'boolean', default: true },
            openInNewTab: { type: 'boolean', default: true },
            badgeWidth: { type: 'number', default: 420 },
            badgeWidthUnit: { type: 'string', default: 'px' },
            badgeAlignment: { type: 'string', default: 'left' },
            backgroundType: { type: 'string', default: 'solid' },
            backgroundColor: { type: 'string', default: '#202022' },
            gradientStartColor: { type: 'string', default: '#202022' },
            gradientEndColor: { type: 'string', default: '#111111' },
            borderColor: { type: 'string', default: '#0b0b0c' },
            borderWidth: { type: 'number', default: 1 },
            borderRadius: { type: 'number', default: 14 },
            padding: { type: 'object', default: { top: 18, right: 22, bottom: 18, left: 22 } },
            gap: { type: 'number', default: 14 },
            avatarSize: { type: 'number', default: 52 },
            avatarBorderRadius: { type: 'number', default: 50 },
            iconSize: { type: 'number', default: 18 },
            checkSize: { type: 'number', default: 16 },
            usernameFontSize: { type: 'number', default: 18 },
            followersFontSize: { type: 'number', default: 15 },
            usernameColor: { type: 'string', default: '#ffffff' },
            followersColor: { type: 'string', default: '#b9b9bd' },
            iconColor: { type: 'string', default: '#ffffff' },
            blueCheckColor: { type: 'string', default: '#1d9bf0' },
            boxShadow: { type: 'boolean', default: false },
            customClass: { type: 'string', default: '' }
        }
    };

    function InstagramIcon(props) {
        var size = props.size || 18;
        return el(
            'svg',
            {
                className: 'murdeni-instagram-badge__instagram-icon-svg',
                width: size,
                height: size,
                viewBox: '0 0 24 24',
                'aria-hidden': 'true'
            },
            el('path', {
                fill: 'currentColor',
                d: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
            })
        );
    }

    function BlueCheckIcon(props) {
        var size = props.size || 16;
        return el(
            'svg',
            {
                className: 'murdeni-instagram-badge__check-svg',
                width: size,
                height: size,
                viewBox: '0 0 24 24',
                'aria-hidden': 'true'
            },
            el('circle', { cx: '12', cy: '12', r: '10', fill: 'currentColor' }),
            el('path', {
                fill: '#fff',
                d: 'M10.45 15.35 6.9 11.8l1.4-1.4 2.15 2.15 5.25-5.25 1.4 1.4-6.65 6.65z'
            })
        );
    }

    function getBoxValue(value, fallback) {
        if (value === undefined || value === null || value === '') {
            return fallback + 'px';
        }

        return typeof value === 'number' ? value + 'px' : value;
    }

    function getPaddingStyle(padding) {
        padding = padding || {};
        return [
            getBoxValue(padding.top, 18),
            getBoxValue(padding.right, 22),
            getBoxValue(padding.bottom, 18),
            getBoxValue(padding.left, 22)
        ].join(' ');
    }

    function getWidthValue(value, unit) {
        return value + (unit === '%' ? '%' : 'px');
    }

    function Edit(props) {
        var attributes = props.attributes;
        var setAttributes = props.setAttributes;
        var avatar = attributes.avatar || {};
        var padding = attributes.padding || {};

        var wrapperStyle = {
            justifyContent:
                attributes.badgeAlignment === 'center'
                    ? 'center'
                    : attributes.badgeAlignment === 'right'
                        ? 'flex-end'
                        : 'flex-start'
        };

        var badgeStyle = {
            width: '100%',
            maxWidth: getWidthValue(attributes.badgeWidth, attributes.badgeWidthUnit),
            background:
                attributes.backgroundType === 'gradient'
                    ? 'linear-gradient(135deg, ' + attributes.gradientStartColor + ', ' + attributes.gradientEndColor + ')'
                    : attributes.backgroundColor,
            borderColor: attributes.borderColor,
            borderWidth: attributes.borderWidth + 'px',
            borderRadius: attributes.borderRadius + 'px',
            padding: getPaddingStyle(padding),
            gap: attributes.gap + 'px',
            boxShadow: attributes.boxShadow ? '0 12px 30px rgba(0, 0, 0, 0.18)' : undefined
        };

        var blockProps = useBlockProps({ className: 'murdeni-instagram-badge-editor' });
        var widthMax = attributes.badgeWidthUnit === '%' ? 100 : 900;
        var widthMin = attributes.badgeWidthUnit === '%' ? 20 : 180;

        return el(
            wp.element.Fragment,
            null,
            el(
                InspectorControls,
                null,
                el(
                    PanelBody,
                    { title: __('Content Settings', 'murdeni-blocks'), initialOpen: true },
                    el(TextControl, {
                        label: __('Instagram Name', 'murdeni-blocks'),
                        value: attributes.username,
                        onChange: function (value) { return setAttributes({ username: value }); }
                    }),
                    el(TextControl, {
                        label: __('Followers Text', 'murdeni-blocks'),
                        value: attributes.followersText,
                        onChange: function (value) { return setAttributes({ followersText: value }); }
                    }),
                    el(TextControl, {
                        label: __('Profile URL', 'murdeni-blocks'),
                        value: attributes.profileUrl,
                        onChange: function (value) { return setAttributes({ profileUrl: value }); }
                    }),
                    el(ToggleControl, {
                        label: __('Open in New Tab', 'murdeni-blocks'),
                        checked: attributes.openInNewTab,
                        onChange: function (value) { return setAttributes({ openInNewTab: value }); }
                    }),
                    el(ToggleControl, {
                        label: __('Show Avatar', 'murdeni-blocks'),
                        checked: attributes.showAvatar,
                        onChange: function (value) { return setAttributes({ showAvatar: value }); }
                    }),
                    attributes.showAvatar && el(
                        PanelRow,
                        null,
                        el(
                            MediaUploadCheck,
                            null,
                            el(MediaUpload, {
                                onSelect: function (media) {
                                    setAttributes({
                                        avatar: {
                                            id: media.id,
                                            url: media.url,
                                            alt: media.alt || attributes.username
                                        }
                                    });
                                },
                                allowedTypes: ['image'],
                                value: avatar.id,
                                render: function (renderProps) {
                                    return el(
                                        'div',
                                        { className: 'murdeni-instagram-badge__media-control' },
                                        el(
                                            Button,
                                            { onClick: renderProps.open, variant: 'secondary' },
                                            avatar.url
                                                ? __('Replace Avatar', 'murdeni-blocks')
                                                : __('Upload Avatar', 'murdeni-blocks')
                                        ),
                                        avatar.url && el(
                                            Button,
                                            {
                                                onClick: function () {
                                                    setAttributes({ avatar: { id: 0, url: '', alt: '' } });
                                                },
                                                variant: 'link',
                                                isDestructive: true
                                            },
                                            __('Remove', 'murdeni-blocks')
                                        )
                                    );
                                }
                            })
                        )
                    ),
                    el(ToggleControl, {
                        label: __('Show Instagram Icon', 'murdeni-blocks'),
                        checked: attributes.showInstagramIcon,
                        onChange: function (value) { return setAttributes({ showInstagramIcon: value }); }
                    }),
                    el(ToggleControl, {
                        label: __('Show Blue Check', 'murdeni-blocks'),
                        checked: attributes.showBlueCheck,
                        onChange: function (value) { return setAttributes({ showBlueCheck: value }); }
                    }),
                    el(ToggleControl, {
                        label: __('Show Followers', 'murdeni-blocks'),
                        checked: attributes.showFollowers,
                        onChange: function (value) { return setAttributes({ showFollowers: value }); }
                    }),
                    el(TextControl, {
                        label: __('Custom Class', 'murdeni-blocks'),
                        value: attributes.customClass,
                        onChange: function (value) { return setAttributes({ customClass: value }); }
                    })
                ),
                el(
                    PanelBody,
                    { title: __('Layout Settings', 'murdeni-blocks'), initialOpen: false },
                    el(SelectControl, {
                        label: __('Badge Alignment', 'murdeni-blocks'),
                        value: attributes.badgeAlignment,
                        options: [
                            { label: __('Left', 'murdeni-blocks'), value: 'left' },
                            { label: __('Center', 'murdeni-blocks'), value: 'center' },
                            { label: __('Right', 'murdeni-blocks'), value: 'right' }
                        ],
                        onChange: function (value) { return setAttributes({ badgeAlignment: value }); }
                    }),
                    el(SelectControl, {
                        label: __('Width Unit', 'murdeni-blocks'),
                        value: attributes.badgeWidthUnit,
                        options: [
                            { label: 'px', value: 'px' },
                            { label: '%', value: '%' }
                        ],
                        onChange: function (value) { return setAttributes({ badgeWidthUnit: value }); }
                    }),
                    el(RangeControl, {
                        label: __('Badge Width', 'murdeni-blocks'),
                        value: attributes.badgeWidth,
                        onChange: function (value) { return setAttributes({ badgeWidth: value }); },
                        min: widthMin,
                        max: widthMax
                    }),
                    BoxControl && el(BoxControl, {
                        label: __('Padding', 'murdeni-blocks'),
                        values: padding,
                        onChange: function (value) { return setAttributes({ padding: value }); }
                    }),
                    el(RangeControl, {
                        label: __('Gap', 'murdeni-blocks'),
                        value: attributes.gap,
                        onChange: function (value) { return setAttributes({ gap: value }); },
                        min: 4,
                        max: 48
                    }),
                    el(RangeControl, {
                        label: __('Border Radius', 'murdeni-blocks'),
                        value: attributes.borderRadius,
                        onChange: function (value) { return setAttributes({ borderRadius: value }); },
                        min: 0,
                        max: 60
                    }),
                    el(RangeControl, {
                        label: __('Border Width', 'murdeni-blocks'),
                        value: attributes.borderWidth,
                        onChange: function (value) { return setAttributes({ borderWidth: value }); },
                        min: 0,
                        max: 8
                    }),
                    el(ToggleControl, {
                        label: __('Box Shadow', 'murdeni-blocks'),
                        checked: attributes.boxShadow,
                        onChange: function (value) { return setAttributes({ boxShadow: value }); }
                    })
                ),
                el(
                    PanelBody,
                    { title: __('Typography & Icons', 'murdeni-blocks'), initialOpen: false },
                    el(RangeControl, {
                        label: __('Username Font Size', 'murdeni-blocks'),
                        value: attributes.usernameFontSize,
                        onChange: function (value) { return setAttributes({ usernameFontSize: value }); },
                        min: 10,
                        max: 48
                    }),
                    el(RangeControl, {
                        label: __('Followers Font Size', 'murdeni-blocks'),
                        value: attributes.followersFontSize,
                        onChange: function (value) { return setAttributes({ followersFontSize: value }); },
                        min: 10,
                        max: 36
                    }),
                    el(RangeControl, {
                        label: __('Avatar Size', 'murdeni-blocks'),
                        value: attributes.avatarSize,
                        onChange: function (value) { return setAttributes({ avatarSize: value }); },
                        min: 24,
                        max: 160
                    }),
                    el(RangeControl, {
                        label: __('Avatar Border Radius (%)', 'murdeni-blocks'),
                        value: attributes.avatarBorderRadius,
                        onChange: function (value) { return setAttributes({ avatarBorderRadius: value }); },
                        min: 0,
                        max: 50
                    }),
                    el(RangeControl, {
                        label: __('Instagram Icon Size', 'murdeni-blocks'),
                        value: attributes.iconSize,
                        onChange: function (value) { return setAttributes({ iconSize: value }); },
                        min: 10,
                        max: 48
                    }),
                    el(RangeControl, {
                        label: __('Blue Check Size', 'murdeni-blocks'),
                        value: attributes.checkSize,
                        onChange: function (value) { return setAttributes({ checkSize: value }); },
                        min: 10,
                        max: 40
                    })
                ),
                el(
                    PanelBody,
                    { title: __('Background Style', 'murdeni-blocks'), initialOpen: false },
                    el(SelectControl, {
                        label: __('Background Type', 'murdeni-blocks'),
                        value: attributes.backgroundType,
                        options: [
                            { label: __('Solid', 'murdeni-blocks'), value: 'solid' },
                            { label: __('Gradient', 'murdeni-blocks'), value: 'gradient' }
                        ],
                        onChange: function (value) { return setAttributes({ backgroundType: value }); }
                    })
                ),
                el(PanelColorSettings, {
                    title: __('Color Settings', 'murdeni-blocks'),
                    initialOpen: false,
                    colorSettings: [
                        { value: attributes.backgroundColor, onChange: function (value) { return setAttributes({ backgroundColor: value }); }, label: __('Background Color', 'murdeni-blocks') },
                        { value: attributes.gradientStartColor, onChange: function (value) { return setAttributes({ gradientStartColor: value }); }, label: __('Gradient Start', 'murdeni-blocks') },
                        { value: attributes.gradientEndColor, onChange: function (value) { return setAttributes({ gradientEndColor: value }); }, label: __('Gradient End', 'murdeni-blocks') },
                        { value: attributes.borderColor, onChange: function (value) { return setAttributes({ borderColor: value }); }, label: __('Border Color', 'murdeni-blocks') },
                        { value: attributes.usernameColor, onChange: function (value) { return setAttributes({ usernameColor: value }); }, label: __('Username Color', 'murdeni-blocks') },
                        { value: attributes.followersColor, onChange: function (value) { return setAttributes({ followersColor: value }); }, label: __('Followers Color', 'murdeni-blocks') },
                        { value: attributes.iconColor, onChange: function (value) { return setAttributes({ iconColor: value }); }, label: __('Instagram Icon Color', 'murdeni-blocks') },
                        { value: attributes.blueCheckColor, onChange: function (value) { return setAttributes({ blueCheckColor: value }); }, label: __('Blue Check Color', 'murdeni-blocks') }
                    ]
                })
            ),
            el(
                'div',
                blockProps,
                el(
                    'div',
                    { className: 'murdeni-instagram-badge__wrapper', style: wrapperStyle },
                    el(
                        'div',
                        { className: 'murdeni-instagram-badge ' + (attributes.customClass || ''), style: badgeStyle },
                        attributes.showAvatar && el(
                            'div',
                            {
                                className: 'murdeni-instagram-badge__avatar',
                                style: {
                                    width: attributes.avatarSize + 'px',
                                    height: attributes.avatarSize + 'px',
                                    borderRadius: attributes.avatarBorderRadius + '%'
                                }
                            },
                            avatar.url
                                ? el('img', { src: avatar.url, alt: avatar.alt || attributes.username })
                                : el('span', null, __('Upload', 'murdeni-blocks'))
                        ),
                        el(
                            'div',
                            { className: 'murdeni-instagram-badge__content' },
                            el(
                                'div',
                                { className: 'murdeni-instagram-badge__identity' },
                                attributes.showInstagramIcon && el(
                                    'span',
                                    { className: 'murdeni-instagram-badge__instagram-icon', style: { color: attributes.iconColor } },
                                    el(InstagramIcon, { size: attributes.iconSize })
                                ),
                                el(RichText, {
                                    tagName: 'span',
                                    className: 'murdeni-instagram-badge__username',
                                    value: attributes.username,
                                    onChange: function (value) { return setAttributes({ username: value }); },
                                    placeholder: __('@username', 'murdeni-blocks'),
                                    style: {
                                        color: attributes.usernameColor,
                                        fontSize: attributes.usernameFontSize + 'px'
                                    }
                                }),
                                attributes.showBlueCheck && el(
                                    'span',
                                    { className: 'murdeni-instagram-badge__check', style: { color: attributes.blueCheckColor } },
                                    el(BlueCheckIcon, { size: attributes.checkSize })
                                )
                            ),
                            attributes.showFollowers && el(RichText, {
                                tagName: 'div',
                                className: 'murdeni-instagram-badge__followers',
                                value: attributes.followersText,
                                onChange: function (value) { return setAttributes({ followersText: value }); },
                                placeholder: __('Followers text...', 'murdeni-blocks'),
                                style: {
                                    color: attributes.followersColor,
                                    fontSize: attributes.followersFontSize + 'px'
                                }
                            })
                        )
                    )
                )
            )
        );
    }

    registerBlockType(metadata.name, {
        title: metadata.title,
        category: metadata.category,
        icon: metadata.icon,
        description: metadata.description,
        supports: metadata.supports,
        attributes: metadata.attributes,
        edit: Edit,
        save: function () {
            return null;
        }
    });
})(window.wp);
