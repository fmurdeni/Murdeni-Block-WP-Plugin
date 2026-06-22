/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls, 
    MediaUpload, 
    MediaUploadCheck,
    RichText,
    BlockControls,
    AlignmentToolbar
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
    ButtonGroup,
    Placeholder,
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { plus, trash } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { heroBanner as icon } from './icons';

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        backgroundImage,
        overlayDark,
        title,
        titleType,
        subtitle,
        subtitleSize,
        description,
        buttons,
        contentAlign,
        verticalAlign,
        fullHeight,
        showSubtitle,
        minHeight,
        paddingTop,
        paddingBottom
    } = attributes;

    // Function to add a new button
    const addButton = () => {
        const newButtons = [...buttons, {
            text: __('New Button', 'murdeni-blocks'),
            url: '#',
            isExternal: false,
            buttonStyle: 'primary'
        }];
        setAttributes({ buttons: newButtons });
    };

    // Function to remove a button
    const removeButton = (index) => {
        const newButtons = [...buttons];
        newButtons.splice(index, 1);
        setAttributes({ buttons: newButtons });
    };

    // Function to update button properties
    const updateButtonProp = (index, prop, value) => {
        const newButtons = [...buttons];
        newButtons[index] = { ...newButtons[index], [prop]: value };
        setAttributes({ buttons: newButtons });
    };

    // Block props
    const blockProps = useBlockProps({
        className: `murdeni-hero-banner align-${contentAlign}`,
        style: {
            minHeight: fullHeight ? '100vh' : (minHeight ? `${minHeight}px` : undefined),
            paddingTop: paddingTop ? `${paddingTop}px` : undefined,
            paddingBottom: paddingBottom ? `${paddingBottom}px` : undefined,
            position: 'relative',
            display: 'flex',
            alignItems: verticalAlign,
            justifyContent: contentAlign === 'center' ? 'center' : 
                           contentAlign === 'right' ? 'flex-end' : 'flex-start',
            textAlign: contentAlign
        }
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Background Settings', 'murdeni-blocks')}>
                    <div className="editor-post-featured-image">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({
                                        backgroundImage: {
                                            url: media.url,
                                            id: media.id,
                                            alt: media.alt || ''
                                        }
                                    });
                                }}
                                allowedTypes={['image']}
                                value={backgroundImage?.id}
                                render={({ open }) => (
                                    <div>
                                        {!backgroundImage?.url && (
                                            <Button
                                                onClick={open}
                                                variant="primary"
                                                className="editor-post-featured-image__toggle"
                                            >
                                                {__('Set background image', 'murdeni-blocks')}
                                            </Button>
                                        )}
                                        {backgroundImage?.url && (
                                            <div>
                                                <img
                                                    src={backgroundImage.url}
                                                    alt={backgroundImage.alt}
                                                    style={{ maxWidth: '100%', marginBottom: '10px' }}
                                                />
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={open}
                                                        variant="secondary"
                                                        className="editor-post-featured-image__toggle"
                                                    >
                                                        {__('Replace Image', 'murdeni-blocks')}
                                                    </Button>
                                                    <Button
                                                        onClick={() => setAttributes({ backgroundImage: { url: '', id: 0, alt: '' } })}
                                                        variant="secondary"
                                                        isDestructive
                                                    >
                                                        {__('Remove Image', 'murdeni-blocks')}
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>
                    <ToggleControl
                        label={__('Dark Overlay', 'murdeni-blocks')}
                        checked={overlayDark}
                        onChange={(value) => setAttributes({ overlayDark: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Content Settings', 'murdeni-blocks')}>
                    <SelectControl
                        label={__('Title Type', 'murdeni-blocks')}
                        value={titleType}
                        options={[
                            { label: 'H1', value: 'h1' },
                            { label: 'H2', value: 'h2' },
                            { label: 'H3', value: 'h3' },
                        ]}
                        onChange={(value) => setAttributes({ titleType: value })}
                    />
                    <ToggleControl
                        label={__('Show Subtitle', 'murdeni-blocks')}
                        checked={showSubtitle}
                        onChange={(value) => setAttributes({ showSubtitle: value })}
                    />
                    {showSubtitle && (
                        <SelectControl
                            label={__('Subtitle Size', 'murdeni-blocks')}
                            value={subtitleSize}
                            options={[
                                { label: __('Small', 'murdeni-blocks'), value: 'small' },
                                { label: __('Medium', 'murdeni-blocks'), value: 'medium' },
                                { label: __('Large', 'murdeni-blocks'), value: 'large' },
                            ]}
                            onChange={(value) => setAttributes({ subtitleSize: value })}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'murdeni-blocks')}>
                    <SelectControl
                        label={__('Horizontal Alignment', 'murdeni-blocks')}
                        value={contentAlign}
                        options={[
                            { label: __('Left', 'murdeni-blocks'), value: 'left' },
                            { label: __('Center', 'murdeni-blocks'), value: 'center' },
                            { label: __('Right', 'murdeni-blocks'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ contentAlign: value })}
                    />
                    <SelectControl
                        label={__('Vertical Alignment', 'murdeni-blocks')}
                        value={verticalAlign}
                        options={[
                            { label: __('Top', 'murdeni-blocks'), value: 'flex-start' },
                            { label: __('Center', 'murdeni-blocks'), value: 'center' },
                            { label: __('Bottom', 'murdeni-blocks'), value: 'flex-end' },
                        ]}
                        onChange={(value) => setAttributes({ verticalAlign: value })}
                    />
                    <ToggleControl
                        label={__('Full Height', 'murdeni-blocks')}
                        checked={fullHeight}
                        onChange={(value) => setAttributes({ fullHeight: value })}
                        help={__('Make the banner full height of the viewport', 'murdeni-blocks')}
                    />
                    {!fullHeight && (
                        <RangeControl
                            label={__('Minimum Height (px)', 'murdeni-blocks')}
                            value={minHeight}
                            onChange={(value) => setAttributes({ minHeight: value })}
                            min={200}
                            max={1000}
                            step={10}
                        />
                    )}
                    <RangeControl
                        label={__('Padding Top (px)', 'murdeni-blocks')}
                        value={paddingTop}
                        onChange={(value) => setAttributes({ paddingTop: value })}
                        min={0}
                        max={200}
                        step={5}
                    />
                    <RangeControl
                        label={__('Padding Bottom (px)', 'murdeni-blocks')}
                        value={paddingBottom}
                        onChange={(value) => setAttributes({ paddingBottom: value })}
                        min={0}
                        max={200}
                        step={5}
                    />
                </PanelBody>
                
                <PanelBody title={__('Buttons Settings', 'murdeni-blocks')} initialOpen={false}>
                    {buttons.map((button, index) => (
                        <div key={index} className="murdeni-hero-banner__button-sidebar-controls" style={{ marginBottom: '15px', padding: '10px', border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                            <h3>{__('Button', 'murdeni-blocks')} #{index + 1}</h3>
                            <TextControl
                                label={__('Button Text', 'murdeni-blocks')}
                                value={button.text}
                                onChange={(value) => updateButtonProp(index, 'text', value)}
                            />
                            <TextControl
                                label={__('Button URL', 'murdeni-blocks')}
                                value={button.url}
                                onChange={(value) => updateButtonProp(index, 'url', value)}
                            />
                            <ToggleControl
                                label={__('Open in new tab', 'murdeni-blocks')}
                                checked={button.isExternal}
                                onChange={(value) => updateButtonProp(index, 'isExternal', value)}
                            />
                            <SelectControl
                                label={__('Button Style', 'murdeni-blocks')}
                                value={button.buttonStyle}
                                options={[
                                    { label: __('Primary', 'murdeni-blocks'), value: 'primary' },
                                    { label: __('Secondary', 'murdeni-blocks'), value: 'secondary' },
                                    { label: __('Outline', 'murdeni-blocks'), value: 'outline' },
                                ]}
                                onChange={(value) => updateButtonProp(index, 'buttonStyle', value)}
                            />
                            <Button
                                isDestructive
                                onClick={() => removeButton(index)}
                                icon={trash}
                                style={{ marginTop: '10px' }}
                            >
                                {__('Remove Button', 'murdeni-blocks')}
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="secondary"
                        onClick={addButton}
                        icon={plus}
                        style={{ marginTop: '10px' }}
                    >
                        {__('Add Button', 'murdeni-blocks')}
                    </Button>
                </PanelBody>
            </InspectorControls>

            <BlockControls>
                <AlignmentToolbar
                    value={contentAlign}
                    onChange={(value) => setAttributes({ contentAlign: value })}
                />
            </BlockControls>

            <div {...blockProps}>
                {/* Background image */}
                {backgroundImage && backgroundImage.url && (
                    <div
                        className="murdeni-hero-banner__background"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${backgroundImage.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0
                        }}
                    />
                )}
                {/* Dark overlay */}
                {overlayDark && (
                    <div
                        className="murdeni-hero-banner__overlay"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1
                        }}
                    />
                )}

                {/* Content container */}
                <div
                    className="murdeni-hero-banner__content"
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        maxWidth: '1200px',
                        width: '100%',
                        padding: '0 20px',
                    }}
                >
                    <div className="murdeni-hero-banner__inner">
                        {/* Title */}
                        <RichText
                            tagName={titleType}
                            className="murdeni-hero-banner__title"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('Add title...', 'murdeni-blocks')}
                            style={{
                                color: overlayDark ? '#fff' : undefined,
                                marginTop: 0
                            }}
                        />

                        {/* Subtitle - only show if showSubtitle is true */}
                        {showSubtitle && (
                            <RichText
                                tagName="div"
                                className={`murdeni-hero-banner__subtitle murdeni-hero-banner__subtitle--${subtitleSize}`}
                                value={subtitle}
                                onChange={(value) => setAttributes({ subtitle: value })}
                                placeholder={__('Add subtitle...', 'murdeni-blocks')}
                                style={{
                                    color: overlayDark ? '#fff' : undefined
                                }}
                            />
                        )}

                        {/* Description */}
                        <RichText
                            tagName="div"
                            className="murdeni-hero-banner__description"
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
                            placeholder={__('Add description...', 'murdeni-blocks')}
                            style={{
                                color: overlayDark ? '#fff' : undefined
                            }}
                        />

                        {/* Buttons */}
                        <div className="murdeni-hero-banner__buttons">
                            {buttons.map((button, index) => (
                                <div key={index} style={{ marginRight: '10px', marginBottom: '10px', display: 'inline-block' }}>
                                    <a 
                                        href="#"
                                        className={`murdeni-hero-banner__button murdeni-hero-banner__button--${button.buttonStyle}`}
                                        style={{
                                            display: 'inline-block',
                                            padding: '0.75em 1.5em',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: button.buttonStyle === 'primary' ? '#0073aa' : 
                                                           button.buttonStyle === 'secondary' ? '#6c757d' : 'transparent',
                                            color: button.buttonStyle === 'outline' ? '#0073aa' : '#fff',
                                            border: button.buttonStyle === 'primary' ? '1px solid #0073aa' : 
                                                   button.buttonStyle === 'secondary' ? '1px solid #6c757d' : 
                                                   '1px solid #0073aa'
                                        }}
                                    >
                                        {button.text}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
