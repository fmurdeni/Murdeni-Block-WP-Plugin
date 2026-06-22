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
    BlockControls,
    AlignmentToolbar,
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    PanelRow,
    RangeControl,
    SelectControl,
    TextControl,
    ToggleControl,
    Toolbar,
    ToolbarButton,
} from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';

/**
 * Icon with Text Block Edit Component
 */
const Edit = ({ attributes, setAttributes, isSelected }) => {
    const {
        iconImage,
        iconSvg,
        useUploadedIcon,
        text,
        layout,
        iconPosition,
        iconSize,
        fontSize,
        textColor,
        iconColor,
        spacing,
        verticalAlignment,
        linkUrl,
        linkTarget,
    } = attributes;

    // Block props with custom styles
    const blockProps = useBlockProps({
        className: `murdeni-icon-with-text murdeni-icon-with-text--${layout} murdeni-icon-with-text--${iconPosition}`,
        style: {
            display: layout === 'inline' ? 'flex' : 'block',
            alignItems: layout === 'inline' ? verticalAlignment : 'flex-start',
            flexDirection: layout === 'inline' && iconPosition === 'after' ? 'row-reverse' : 'row',
            justifyContent: layout === 'stack' ? 'center' : 'flex-start',
            textAlign: layout === 'stack' ? 'center' : 'left',
        },
    });

    // Layout options
    const layoutOptions = [
        { label: __('Inline', 'murdeni-blocks'), value: 'inline' },
        { label: __('Stack', 'murdeni-blocks'), value: 'stack' },
    ];

    // Icon position options
    const iconPositionOptions = [
        { label: __('Before Text', 'murdeni-blocks'), value: 'before' },
        { label: __('After Text', 'murdeni-blocks'), value: 'after' },
    ];

    // Vertical alignment options
    const verticalAlignmentOptions = [
        { label: __('Top', 'murdeni-blocks'), value: 'flex-start' },
        { label: __('Center', 'murdeni-blocks'), value: 'center' },
        { label: __('Bottom', 'murdeni-blocks'), value: 'flex-end' },
    ];

    // Icon container styles
    const iconContainerStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: layout === 'stack' ? 'center' : 'flex-start',
        marginBottom: layout === 'stack' ? `${spacing}px` : 0,
        marginRight: layout === 'inline' && iconPosition === 'before' ? `${spacing}px` : 0,
        marginLeft: layout === 'inline' && iconPosition === 'after' ? `${spacing}px` : 0,
    };

    // Icon styles
    const iconStyles = {
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        color: iconColor || undefined,
    };

    // Text styles
    const textStyles = {
        fontSize: `${fontSize}px`,
        color: textColor || undefined,
        margin: 0,
    };

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={blockProps.style.textAlign}
                    onChange={(value) => {
                        const newBlockProps = { ...blockProps };
                        newBlockProps.style.textAlign = value;
                        setAttributes({ blockProps: newBlockProps });
                    }}
                />
                <Toolbar>
                    <ToolbarButton
                        icon={link}
                        title={__('Add Link', 'murdeni-blocks')}
                        isActive={!!linkUrl}
                        onClick={() => {
                            setAttributes({ linkUrl: linkUrl ? '' : '#' });
                        }}
                    />
                </Toolbar>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Icon Settings', 'murdeni-blocks')} initialOpen={true}>
                    <PanelRow>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) =>
                                    setAttributes({
                                        iconImage: {
                                            url: media.url,
                                            id: media.id,
                                            alt: media.alt || '',
                                        },
                                        useUploadedIcon: true,
                                    })
                                }
                                allowedTypes={['image']}
                                value={iconImage?.id}
                                render={({ open }) => (
                                    <div>
                                        <Button
                                            onClick={open}
                                            variant="secondary"
                                            className="editor-media-placeholder__button is-button is-default is-large"
                                        >
                                            {iconImage?.url
                                                ? __('Replace Icon', 'murdeni-blocks')
                                                : __('Upload Icon', 'murdeni-blocks')}
                                        </Button>
                                        {iconImage?.url && (
                                            <div style={{ marginTop: '10px' }}>
                                                <img
                                                    src={iconImage.url}
                                                    alt={iconImage.alt}
                                                    style={{ maxHeight: '40px' }}
                                                />
                                                <Button
                                                    onClick={() =>
                                                        setAttributes({
                                                            iconImage: {
                                                                url: '',
                                                                id: 0,
                                                                alt: '',
                                                            },
                                                        })
                                                    }
                                                    isDestructive
                                                    style={{ display: 'block', marginTop: '5px' }}
                                                >
                                                    {__('Remove Icon', 'murdeni-blocks')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </PanelRow>

                    <RangeControl
                        label={__('Icon Size (px)', 'murdeni-blocks')}
                        value={iconSize}
                        onChange={(value) => setAttributes({ iconSize: value })}
                        min={12}
                        max={120}
                    />

                    <SelectControl
                        label={__('Icon Position', 'murdeni-blocks')}
                        value={iconPosition}
                        options={iconPositionOptions}
                        onChange={(value) => setAttributes({ iconPosition: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Text Settings', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Font Size (px)', 'murdeni-blocks')}
                        value={fontSize}
                        onChange={(value) => setAttributes({ fontSize: value })}
                        min={12}
                        max={60}
                    />
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'murdeni-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout', 'murdeni-blocks')}
                        value={layout}
                        options={layoutOptions}
                        onChange={(value) => setAttributes({ layout: value })}
                    />

                    {layout === 'inline' && (
                        <SelectControl
                            label={__('Vertical Alignment', 'murdeni-blocks')}
                            value={verticalAlignment}
                            options={verticalAlignmentOptions}
                            onChange={(value) => setAttributes({ verticalAlignment: value })}
                        />
                    )}

                    <RangeControl
                        label={__('Spacing (px)', 'murdeni-blocks')}
                        value={spacing}
                        onChange={(value) => setAttributes({ spacing: value })}
                        min={0}
                        max={100}
                    />
                </PanelBody>

                {linkUrl && (
                    <PanelBody title={__('Link Settings', 'murdeni-blocks')} initialOpen={false}>
                        <URLInput
                            value={linkUrl}
                            onChange={(value) => setAttributes({ linkUrl: value })}
                        />
                        <ToggleControl
                            label={__('Open in new tab', 'murdeni-blocks')}
                            checked={linkTarget}
                            onChange={(value) => setAttributes({ linkTarget: value })}
                        />
                    </PanelBody>
                )}

                <PanelColorSettings
                    title={__('Color Settings', 'murdeni-blocks')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: iconColor,
                            onChange: (value) => setAttributes({ iconColor: value }),
                            label: __('Icon Color', 'murdeni-blocks'),
                        },
                        {
                            value: textColor,
                            onChange: (value) => setAttributes({ textColor: value }),
                            label: __('Text Color', 'murdeni-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <div {...blockProps}>
                {(iconImage?.url || iconSvg) && (
                    <div className="murdeni-icon-with-text__icon" style={iconContainerStyles}>
                        {iconImage?.url && useUploadedIcon ? (
                            <img
                                src={iconImage.url}
                                alt={iconImage.alt}
                                style={iconStyles}
                                className="murdeni-icon-with-text__icon-img"
                            />
                        ) : (
                            iconSvg && (
                                <div
                                    className="murdeni-icon-with-text__icon-svg"
                                    style={iconStyles}
                                    dangerouslySetInnerHTML={{ __html: iconSvg }}
                                />
                            )
                        )}
                    </div>
                )}

                <RichText
                    tagName="p"
                    className="murdeni-icon-with-text__text"
                    value={text}
                    onChange={(value) => setAttributes({ text: value })}
                    placeholder={__('Add text...', 'murdeni-blocks')}
                    style={textStyles}
                />
            </div>
        </>
    );
};

export default Edit;
