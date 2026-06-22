/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    PanelColorSettings,
    RichText,
    URLInput,
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

/**
 * CTA Block Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
    const {
        title,
        titleTag,
        titleFontSize,
        titleColor,
        description,
        descriptionFontSize,
        descriptionColor,
        buttonText,
        buttonUrl,
        buttonNewTab,
        buttonBackgroundColor,
        buttonTextColor,
        buttonBorderRadius,
        buttonSize,
        layout,
        contentWidth,
        contentAlignment,
        padding,
        backgroundColor,
        backgroundImage,
        backgroundOverlay,
        backgroundOverlayOpacity,
        borderRadius,
        boxShadow,
    } = attributes;

    // Block props with custom styles
    const blockProps = useBlockProps({
        className: `murdeni-cta murdeni-cta--${layout}`,
        style: {
            backgroundColor: backgroundColor ? backgroundColor : undefined,
            borderRadius: borderRadius ? `${borderRadius}px` : undefined,
            boxShadow: boxShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : undefined,
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            backgroundImage: backgroundImage?.url ? `url(${backgroundImage.url})` : undefined,
            backgroundSize: backgroundImage?.url ? 'cover' : undefined,
            backgroundPosition: backgroundImage?.url ? 'center center' : undefined,
            position: 'relative',
            overflow: 'hidden',
            textAlign: contentAlignment,
        },
    });

    // Title tag options
    const titleTagOptions = [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'H5', value: 'h5' },
        { label: 'H6', value: 'h6' },
    ];

    // Layout options
    const layoutOptions = [
        { label: __('Centered', 'murdeni-blocks'), value: 'centered' },
        { label: __('Split', 'murdeni-blocks'), value: 'split' },
        { label: __('Banner', 'murdeni-blocks'), value: 'banner' },
    ];

    // Button size options
    const buttonSizeOptions = [
        { label: __('Small', 'murdeni-blocks'), value: 'small' },
        { label: __('Medium', 'murdeni-blocks'), value: 'medium' },
        { label: __('Large', 'murdeni-blocks'), value: 'large' },
    ];

    // Content alignment options
    const contentAlignmentOptions = [
        { label: __('Left', 'murdeni-blocks'), value: 'left' },
        { label: __('Center', 'murdeni-blocks'), value: 'center' },
        { label: __('Right', 'murdeni-blocks'), value: 'right' },
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'murdeni-blocks')} initialOpen={true}>
                    <SelectControl
                        label={__('Title Tag', 'murdeni-blocks')}
                        value={titleTag}
                        options={titleTagOptions}
                        onChange={(value) => setAttributes({ titleTag: value })}
                    />
                    <RangeControl
                        label={__('Title Font Size', 'murdeni-blocks')}
                        value={titleFontSize}
                        onChange={(value) => setAttributes({ titleFontSize: value })}
                        min={16}
                        max={60}
                    />
                    <RangeControl
                        label={__('Description Font Size', 'murdeni-blocks')}
                        value={descriptionFontSize}
                        onChange={(value) => setAttributes({ descriptionFontSize: value })}
                        min={12}
                        max={32}
                    />
                </PanelBody>

                <PanelBody title={__('Button Settings', 'murdeni-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Button URL', 'murdeni-blocks')}
                        value={buttonUrl}
                        onChange={(value) => setAttributes({ buttonUrl: value })}
                    />
                    <ToggleControl
                        label={__('Open in New Tab', 'murdeni-blocks')}
                        checked={buttonNewTab}
                        onChange={(value) => setAttributes({ buttonNewTab: value })}
                    />
                    <SelectControl
                        label={__('Button Size', 'murdeni-blocks')}
                        value={buttonSize}
                        options={buttonSizeOptions}
                        onChange={(value) => setAttributes({ buttonSize: value })}
                    />
                    <RangeControl
                        label={__('Button Border Radius', 'murdeni-blocks')}
                        value={buttonBorderRadius}
                        onChange={(value) => setAttributes({ buttonBorderRadius: value })}
                        min={0}
                        max={50}
                    />
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'murdeni-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout Style', 'murdeni-blocks')}
                        value={layout}
                        options={layoutOptions}
                        onChange={(value) => setAttributes({ layout: value })}
                    />
                    <RangeControl
                        label={__('Content Width (px)', 'murdeni-blocks')}
                        value={contentWidth}
                        onChange={(value) => setAttributes({ contentWidth: value })}
                        min={400}
                        max={1200}
                    />
                    <SelectControl
                        label={__('Content Alignment', 'murdeni-blocks')}
                        value={contentAlignment}
                        options={contentAlignmentOptions}
                        onChange={(value) => setAttributes({ contentAlignment: value })}
                    />
                    <BoxControl
                        label={__('Padding', 'murdeni-blocks')}
                        values={padding}
                        onChange={(value) => setAttributes({ padding: value })}
                    />
                    <RangeControl
                        label={__('Border Radius', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={50}
                    />
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={(value) => setAttributes({ boxShadow: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Background Settings', 'murdeni-blocks')} initialOpen={false}>
                    <PanelRow>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) =>
                                    setAttributes({
                                        backgroundImage: {
                                            url: media.url,
                                            id: media.id,
                                            alt: media.alt || '',
                                        },
                                    })
                                }
                                allowedTypes={['image']}
                                value={backgroundImage?.id}
                                render={({ open }) => (
                                    <div>
                                        <Button
                                            onClick={open}
                                            variant="secondary"
                                            className="editor-media-placeholder__button is-button is-default is-large"
                                        >
                                            {backgroundImage?.url
                                                ? __('Replace Background Image', 'murdeni-blocks')
                                                : __('Add Background Image', 'murdeni-blocks')}
                                        </Button>
                                        {backgroundImage?.url && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={backgroundImage.url}
                                                    alt={backgroundImage.alt}
                                                    style={{ maxHeight: '100px' }}
                                                />
                                                <Button
                                                    onClick={() =>
                                                        setAttributes({
                                                            backgroundImage: {
                                                                url: '',
                                                                id: 0,
                                                                alt: '',
                                                            },
                                                        })
                                                    }
                                                    isDestructive
                                                    style={{ display: 'block', marginTop: '5px' }}
                                                >
                                                    {__('Remove Image', 'murdeni-blocks')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </PanelRow>
                    {backgroundImage?.url && (
                        <RangeControl
                            label={__('Overlay Opacity', 'murdeni-blocks')}
                            value={backgroundOverlayOpacity}
                            onChange={(value) => setAttributes({ backgroundOverlayOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    )}
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
                            value: backgroundOverlay,
                            onChange: (value) => setAttributes({ backgroundOverlay: value }),
                            label: __('Background Overlay Color', 'murdeni-blocks'),
                        },
                        {
                            value: titleColor,
                            onChange: (value) => setAttributes({ titleColor: value }),
                            label: __('Title Color', 'murdeni-blocks'),
                        },
                        {
                            value: descriptionColor,
                            onChange: (value) => setAttributes({ descriptionColor: value }),
                            label: __('Description Color', 'murdeni-blocks'),
                        },
                        {
                            value: buttonBackgroundColor,
                            onChange: (value) => setAttributes({ buttonBackgroundColor: value }),
                            label: __('Button Background Color', 'murdeni-blocks'),
                        },
                        {
                            value: buttonTextColor,
                            onChange: (value) => setAttributes({ buttonTextColor: value }),
                            label: __('Button Text Color', 'murdeni-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <div {...blockProps}>
                {backgroundImage?.url && backgroundOverlay && (
                    <div
                        className="murdeni-cta__overlay"
                        style={{
                            backgroundColor: backgroundOverlay,
                            opacity: backgroundOverlayOpacity,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    ></div>
                )}

                <div
                    className="murdeni-cta__content"
                    style={{
                        maxWidth: `${contentWidth}px`,
                        margin: contentAlignment === 'center' ? '0 auto' : '0',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <RichText
                        tagName={titleTag}
                        className="murdeni-cta__title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Add title...', 'murdeni-blocks')}
                        style={{
                            fontSize: `${titleFontSize}px`,
                            color: titleColor || undefined,
                        }}
                    />

                    <RichText
                        tagName="p"
                        className="murdeni-cta__description"
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        placeholder={__('Add description...', 'murdeni-blocks')}
                        style={{
                            fontSize: `${descriptionFontSize}px`,
                            color: descriptionColor || undefined,
                        }}
                    />

                    <div className="murdeni-cta__button-container">
                        <div
                            className={`murdeni-cta__button murdeni-cta__button--${buttonSize}`}
                            style={{
                                backgroundColor: buttonBackgroundColor || undefined,
                                color: buttonTextColor || undefined,
                                borderRadius: `${buttonBorderRadius}px`,
                            }}
                        >
                            <RichText
                                tagName="span"
                                className="murdeni-cta__button-text"
                                value={buttonText}
                                onChange={(value) => setAttributes({ buttonText: value })}
                                placeholder={__('Button text...', 'murdeni-blocks')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
