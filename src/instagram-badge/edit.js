import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    PanelColorSettings,
    RichText,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    PanelRow,
    RangeControl,
    SelectControl,
    TextControl,
    ToggleControl,
    __experimentalBoxControl as BoxControl,
} from '@wordpress/components';

const InstagramIcon = ({ size = 18 }) => (
    <svg className="murdeni-instagram-badge__instagram-icon-svg" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
);

const BlueCheckIcon = ({ size = 16 }) => (
    <svg className="murdeni-instagram-badge__check-svg" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path fill="#fff" d="M10.45 15.35 6.9 11.8l1.4-1.4 2.15 2.15 5.25-5.25 1.4 1.4-6.65 6.65z" />
    </svg>
);

const getPaddingStyle = (padding = {}) => {
    const top = padding.top ?? 18;
    const right = padding.right ?? 22;
    const bottom = padding.bottom ?? 18;
    const left = padding.left ?? 22;
    return `${top}px ${right}px ${bottom}px ${left}px`;
};

const getWidthValue = (value, unit) => {
    if (unit === '%') {
        return `${value}%`;
    }

    return `${value}px`;
};

const Edit = ({ attributes, setAttributes }) => {
    const {
        avatar,
        username,
        followersText,
        profileUrl,
        showAvatar,
        showInstagramIcon,
        showBlueCheck,
        showFollowers,
        openInNewTab,
        badgeWidth,
        badgeWidthUnit,
        badgeAlignment,
        backgroundType,
        backgroundColor,
        gradientStartColor,
        gradientEndColor,
        borderColor,
        borderWidth,
        borderRadius,
        padding,
        gap,
        avatarSize,
        avatarBorderRadius,
        iconSize,
        checkSize,
        usernameFontSize,
        followersFontSize,
        usernameColor,
        followersColor,
        iconColor,
        blueCheckColor,
        boxShadow,
        customClass,
    } = attributes;

    const alignmentOptions = [
        { label: __('Left', 'murdeni-blocks'), value: 'left' },
        { label: __('Center', 'murdeni-blocks'), value: 'center' },
        { label: __('Right', 'murdeni-blocks'), value: 'right' },
    ];

    const widthUnitOptions = [
        { label: 'px', value: 'px' },
        { label: '%', value: '%' },
    ];

    const wrapperStyle = {
        justifyContent:
            badgeAlignment === 'center'
                ? 'center'
                : badgeAlignment === 'right'
                    ? 'flex-end'
                    : 'flex-start',
    };

    const badgeStyle = {
        width: getWidthValue(badgeWidth, badgeWidthUnit),
        maxWidth: '100%',
        background:
            backgroundType === 'gradient'
                ? `linear-gradient(135deg, ${gradientStartColor}, ${gradientEndColor})`
                : backgroundColor,
        borderColor,
        borderWidth: `${borderWidth}px`,
        borderRadius: `${borderRadius}px`,
        padding: getPaddingStyle(padding),
        gap: `${gap}px`,
        boxShadow: boxShadow ? '0 12px 30px rgba(0, 0, 0, 0.18)' : undefined,
    };

    const blockProps = useBlockProps({
        className: 'murdeni-instagram-badge-editor',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'murdeni-blocks')} initialOpen>
                    <TextControl
                        label={__('Instagram Name', 'murdeni-blocks')}
                        value={username}
                        onChange={(value) => setAttributes({ username: value })}
                    />
                    <TextControl
                        label={__('Followers Text', 'murdeni-blocks')}
                        value={followersText}
                        onChange={(value) => setAttributes({ followersText: value })}
                    />
                    <TextControl
                        label={__('Profile URL', 'murdeni-blocks')}
                        value={profileUrl}
                        onChange={(value) => setAttributes({ profileUrl: value })}
                    />
                    <ToggleControl
                        label={__('Open in New Tab', 'murdeni-blocks')}
                        checked={openInNewTab}
                        onChange={(value) => setAttributes({ openInNewTab: value })}
                    />
                    <ToggleControl
                        label={__('Show Avatar', 'murdeni-blocks')}
                        checked={showAvatar}
                        onChange={(value) => setAttributes({ showAvatar: value })}
                    />
                    {showAvatar && (
                        <PanelRow>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) =>
                                        setAttributes({
                                            avatar: {
                                                id: media.id,
                                                url: media.url,
                                                alt: media.alt || username,
                                            },
                                        })
                                    }
                                    allowedTypes={['image']}
                                    value={avatar?.id}
                                    render={({ open }) => (
                                        <div className="murdeni-instagram-badge__media-control">
                                            <Button onClick={open} variant="secondary">
                                                {avatar?.url
                                                    ? __('Replace Avatar', 'murdeni-blocks')
                                                    : __('Upload Avatar', 'murdeni-blocks')}
                                            </Button>
                                            {avatar?.url && (
                                                <Button
                                                    onClick={() =>
                                                        setAttributes({
                                                            avatar: { id: 0, url: '', alt: '' },
                                                        })
                                                    }
                                                    variant="link"
                                                    isDestructive
                                                >
                                                    {__('Remove', 'murdeni-blocks')}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                />
                            </MediaUploadCheck>
                        </PanelRow>
                    )}
                    <ToggleControl
                        label={__('Show Instagram Icon', 'murdeni-blocks')}
                        checked={showInstagramIcon}
                        onChange={(value) => setAttributes({ showInstagramIcon: value })}
                    />
                    <ToggleControl
                        label={__('Show Blue Check', 'murdeni-blocks')}
                        checked={showBlueCheck}
                        onChange={(value) => setAttributes({ showBlueCheck: value })}
                    />
                    <ToggleControl
                        label={__('Show Followers', 'murdeni-blocks')}
                        checked={showFollowers}
                        onChange={(value) => setAttributes({ showFollowers: value })}
                    />
                    <TextControl
                        label={__('Custom Class', 'murdeni-blocks')}
                        value={customClass}
                        onChange={(value) => setAttributes({ customClass: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'murdeni-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Badge Alignment', 'murdeni-blocks')}
                        value={badgeAlignment}
                        options={alignmentOptions}
                        onChange={(value) => setAttributes({ badgeAlignment: value })}
                    />
                    <SelectControl
                        label={__('Width Unit', 'murdeni-blocks')}
                        value={badgeWidthUnit}
                        options={widthUnitOptions}
                        onChange={(value) => setAttributes({ badgeWidthUnit: value })}
                    />
                    <RangeControl
                        label={__('Badge Width', 'murdeni-blocks')}
                        value={badgeWidth}
                        onChange={(value) => setAttributes({ badgeWidth: value })}
                        min={badgeWidthUnit === '%' ? 20 : 180}
                        max={badgeWidthUnit === '%' ? 100 : 900}
                    />
                    <BoxControl
                        label={__('Padding', 'murdeni-blocks')}
                        values={padding}
                        onChange={(value) => setAttributes({ padding: value })}
                    />
                    <RangeControl
                        label={__('Gap', 'murdeni-blocks')}
                        value={gap}
                        onChange={(value) => setAttributes({ gap: value })}
                        min={4}
                        max={48}
                    />
                    <RangeControl
                        label={__('Border Radius', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={60}
                    />
                    <RangeControl
                        label={__('Border Width', 'murdeni-blocks')}
                        value={borderWidth}
                        onChange={(value) => setAttributes({ borderWidth: value })}
                        min={0}
                        max={8}
                    />
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={(value) => setAttributes({ boxShadow: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Typography & Icons', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Username Font Size', 'murdeni-blocks')}
                        value={usernameFontSize}
                        onChange={(value) => setAttributes({ usernameFontSize: value })}
                        min={10}
                        max={48}
                    />
                    <RangeControl
                        label={__('Followers Font Size', 'murdeni-blocks')}
                        value={followersFontSize}
                        onChange={(value) => setAttributes({ followersFontSize: value })}
                        min={10}
                        max={36}
                    />
                    <RangeControl
                        label={__('Avatar Size', 'murdeni-blocks')}
                        value={avatarSize}
                        onChange={(value) => setAttributes({ avatarSize: value })}
                        min={24}
                        max={160}
                    />
                    <RangeControl
                        label={__('Avatar Border Radius (%)', 'murdeni-blocks')}
                        value={avatarBorderRadius}
                        onChange={(value) => setAttributes({ avatarBorderRadius: value })}
                        min={0}
                        max={50}
                    />
                    <RangeControl
                        label={__('Instagram Icon Size', 'murdeni-blocks')}
                        value={iconSize}
                        onChange={(value) => setAttributes({ iconSize: value })}
                        min={10}
                        max={48}
                    />
                    <RangeControl
                        label={__('Blue Check Size', 'murdeni-blocks')}
                        value={checkSize}
                        onChange={(value) => setAttributes({ checkSize: value })}
                        min={10}
                        max={40}
                    />
                </PanelBody>

                <PanelBody title={__('Background Style', 'murdeni-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Background Type', 'murdeni-blocks')}
                        value={backgroundType}
                        options={[
                            { label: __('Solid', 'murdeni-blocks'), value: 'solid' },
                            { label: __('Gradient', 'murdeni-blocks'), value: 'gradient' },
                        ]}
                        onChange={(value) => setAttributes({ backgroundType: value })}
                    />
                </PanelBody>

                <PanelColorSettings
                    title={__('Color Settings', 'murdeni-blocks')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: backgroundColor,
                            onChange: (value) => setAttributes({ backgroundColor: value }),
                            label: __('Background Color', 'murdeni-blocks'),
                        },
                        {
                            value: gradientStartColor,
                            onChange: (value) => setAttributes({ gradientStartColor: value }),
                            label: __('Gradient Start', 'murdeni-blocks'),
                        },
                        {
                            value: gradientEndColor,
                            onChange: (value) => setAttributes({ gradientEndColor: value }),
                            label: __('Gradient End', 'murdeni-blocks'),
                        },
                        {
                            value: borderColor,
                            onChange: (value) => setAttributes({ borderColor: value }),
                            label: __('Border Color', 'murdeni-blocks'),
                        },
                        {
                            value: usernameColor,
                            onChange: (value) => setAttributes({ usernameColor: value }),
                            label: __('Username Color', 'murdeni-blocks'),
                        },
                        {
                            value: followersColor,
                            onChange: (value) => setAttributes({ followersColor: value }),
                            label: __('Followers Color', 'murdeni-blocks'),
                        },
                        {
                            value: iconColor,
                            onChange: (value) => setAttributes({ iconColor: value }),
                            label: __('Instagram Icon Color', 'murdeni-blocks'),
                        },
                        {
                            value: blueCheckColor,
                            onChange: (value) => setAttributes({ blueCheckColor: value }),
                            label: __('Blue Check Color', 'murdeni-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <div {...blockProps}>
                <div className="murdeni-instagram-badge__wrapper" style={wrapperStyle}>
                    <div className={`murdeni-instagram-badge ${customClass || ''}`} style={badgeStyle}>
                        {showAvatar && (
                            <div
                                className="murdeni-instagram-badge__avatar"
                                style={{
                                    width: `${avatarSize}px`,
                                    height: `${avatarSize}px`,
                                    borderRadius: `${avatarBorderRadius}%`,
                                }}
                            >
                                {avatar?.url ? (
                                    <img src={avatar.url} alt={avatar.alt || username} />
                                ) : (
                                    <span>{__('Upload', 'murdeni-blocks')}</span>
                                )}
                            </div>
                        )}
                        <div className="murdeni-instagram-badge__content">
                            <div className="murdeni-instagram-badge__identity">
                                {showInstagramIcon && (
                                    <span className="murdeni-instagram-badge__instagram-icon" style={{ color: iconColor }}>
                                        <InstagramIcon size={iconSize} />
                                    </span>
                                )}
                                <RichText
                                    tagName="span"
                                    className="murdeni-instagram-badge__username"
                                    value={username}
                                    onChange={(value) => setAttributes({ username: value })}
                                    placeholder={__('@username', 'murdeni-blocks')}
                                    style={{
                                        color: usernameColor,
                                        fontSize: `${usernameFontSize}px`,
                                    }}
                                />
                                {showBlueCheck && (
                                    <span className="murdeni-instagram-badge__check" style={{ color: blueCheckColor }}>
                                        <BlueCheckIcon size={checkSize} />
                                    </span>
                                )}
                            </div>
                            {showFollowers && (
                                <RichText
                                    tagName="div"
                                    className="murdeni-instagram-badge__followers"
                                    value={followersText}
                                    onChange={(value) => setAttributes({ followersText: value })}
                                    placeholder={__('Followers text...', 'murdeni-blocks')}
                                    style={{
                                        color: followersColor,
                                        fontSize: `${followersFontSize}px`,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
