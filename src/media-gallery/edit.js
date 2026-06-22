/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    Button,
    Placeholder,
    Spinner,
    BaseControl,
    ColorPicker,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import {
    InspectorControls,
    useBlockProps,
    MediaUpload,
    MediaPlaceholder,
    RichText,
} from '@wordpress/block-editor';
import { plus, trash, video, edit, image } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        items,
        columns,
        gapSize,
        aspectRatio,
        thumbnailSize,
        lightboxEnabled,
        showCaptions,
        captionPosition,
        captionFontSize,
        captionColor,
        overlayColor,
        overlayOpacity,
        hoverEffect,
        displayHeader,
        headerTitle,
        displayViewAll,
        viewAllText,
        viewAllUrl,
        borderRadius,
        borderWidth,
        borderColor,
        boxShadow,
    } = attributes;

    // Get aspect ratio style
    const getAspectRatioStyle = () => {
        switch (aspectRatio) {
            case '1:1':
                return { paddingTop: '100%' };
            case '4:3':
                return { paddingTop: '75%' };
            case '16:9':
                return { paddingTop: '56.25%' };
            case '3:2':
                return { paddingTop: '66.67%' };
            default:
                return { paddingTop: '100%' };
        }
    };

    // Add new item
    const addItem = (type) => {
        const newItem = {
            id: `item-${Date.now()}`,
            type: type, // 'image' or 'video'
            mediaId: 0,
            mediaUrl: '',
            videoUrl: type === 'video' ? '' : null,
            caption: '',
        };

        setAttributes({
            items: [...items, newItem],
        });
    };

    // Remove item
    const removeItem = (id) => {
        setAttributes({
            items: items.filter((item) => item.id !== id),
        });
    };

    // Update item
    const updateItem = (id, property, value) => {
        setAttributes({
            items: items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        [property]: value,
                    };
                }
                return item;
            }),
        });
    };

    // Handle media selection
    const onSelectMedia = (id, media) => {
        updateItem(id, 'mediaId', media.id);
        updateItem(id, 'mediaUrl', media.url);
    };

    // Get block props
    const blockProps = useBlockProps({
        className: `murdeni-media-gallery columns-${columns} hover-${hoverEffect}`,
    });

    // Get YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return '';
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : '';
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Gallery Settings', 'murdeni-blocks')}>
                    <RangeControl
                        label={__('Columns', 'murdeni-blocks')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={6}
                    />
                    <RangeControl
                        label={__('Gap Size (px)', 'murdeni-blocks')}
                        value={gapSize}
                        onChange={(value) => setAttributes({ gapSize: value })}
                        min={0}
                        max={60}
                    />
                    <SelectControl
                        label={__('Aspect Ratio', 'murdeni-blocks')}
                        value={aspectRatio}
                        options={[
                            { label: __('1:1 (Square)', 'murdeni-blocks'), value: '1:1' },
                            { label: __('4:3', 'murdeni-blocks'), value: '4:3' },
                            { label: __('16:9', 'murdeni-blocks'), value: '16:9' },
                            { label: __('3:2', 'murdeni-blocks'), value: '3:2' },
                        ]}
                        onChange={(value) => setAttributes({ aspectRatio: value })}
                    />
                    <SelectControl
                        label={__('Thumbnail Size', 'murdeni-blocks')}
                        value={thumbnailSize}
                        options={[
                            { label: __('Thumbnail', 'murdeni-blocks'), value: 'thumbnail' },
                            { label: __('Medium', 'murdeni-blocks'), value: 'medium' },
                            { label: __('Large', 'murdeni-blocks'), value: 'large' },
                            { label: __('Full', 'murdeni-blocks'), value: 'full' },
                        ]}
                        onChange={(value) => setAttributes({ thumbnailSize: value })}
                    />
                </PanelBody>
                
                <PanelBody title={__('Display Settings', 'murdeni-blocks')}>
                    <ToggleControl
                        label={__('Enable Lightbox', 'murdeni-blocks')}
                        checked={lightboxEnabled}
                        onChange={() => setAttributes({ lightboxEnabled: !lightboxEnabled })}
                    />
                    <ToggleControl
                        label={__('Show Captions', 'murdeni-blocks')}
                        checked={showCaptions}
                        onChange={() => setAttributes({ showCaptions: !showCaptions })}
                    />
                    {showCaptions && (
                        <>
                            <SelectControl
                                label={__('Caption Position', 'murdeni-blocks')}
                                value={captionPosition}
                                options={[
                                    { label: __('Below Image', 'murdeni-blocks'), value: 'below' },
                                    { label: __('Overlay on Hover', 'murdeni-blocks'), value: 'overlay' },
                                ]}
                                onChange={(value) => setAttributes({ captionPosition: value })}
                            />
                            <RangeControl
                                label={__('Caption Font Size (px)', 'murdeni-blocks')}
                                value={captionFontSize}
                                onChange={(value) => setAttributes({ captionFontSize: value })}
                                min={10}
                                max={24}
                            />
                            <BaseControl
                                label={__('Caption Color', 'murdeni-blocks')}
                                id="caption-color"
                            >
                                <ColorPicker
                                    color={captionColor}
                                    onChange={(value) => setAttributes({ captionColor: value })}
                                    enableAlpha
                                />
                            </BaseControl>
                        </>
                    )}
                </PanelBody>
                
                <PanelBody title={__('Header Settings', 'murdeni-blocks')}>                    
                    <ToggleControl
                        label={__('Display Header', 'murdeni-blocks')}
                        checked={displayHeader}
                        onChange={(value) => setAttributes({ displayHeader: value })}
                    />
                    {displayHeader && (
                        <>
                            <TextControl
                                label={__('Header Title', 'murdeni-blocks')}
                                value={headerTitle}
                                onChange={(value) => setAttributes({ headerTitle: value })}
                            />
                            <ToggleControl
                                label={__('Display View All Link', 'murdeni-blocks')}
                                checked={displayViewAll}
                                onChange={(value) => setAttributes({ displayViewAll: value })}
                            />
                            {displayViewAll && (
                                <>
                                    <TextControl
                                        label={__('View All Text', 'murdeni-blocks')}
                                        value={viewAllText}
                                        onChange={(value) => setAttributes({ viewAllText: value })}
                                    />
                                    <TextControl
                                        label={__('View All URL', 'murdeni-blocks')}
                                        value={viewAllUrl}
                                        onChange={(value) => setAttributes({ viewAllUrl: value })}
                                        placeholder="https://example.com/gallery"
                                    />
                                </>
                            )}
                        </>
                    )}
                </PanelBody>
                
                <PanelBody title={__('Style Settings', 'murdeni-blocks')}>
                    <SelectControl
                        label={__('Hover Effect', 'murdeni-blocks')}
                        value={hoverEffect}
                        options={[
                            { label: __('None', 'murdeni-blocks'), value: 'none' },
                            { label: __('Zoom', 'murdeni-blocks'), value: 'zoom' },
                            { label: __('Fade', 'murdeni-blocks'), value: 'fade' },
                            { label: __('Slide Up', 'murdeni-blocks'), value: 'slide-up' },
                        ]}
                        onChange={(value) => setAttributes({ hoverEffect: value })}
                    />
                    <RangeControl
                        label={__('Border Radius (px)', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={50}
                    />
                    <RangeControl
                        label={__('Border Width (px)', 'murdeni-blocks')}
                        value={borderWidth}
                        onChange={(value) => setAttributes({ borderWidth: value })}
                        min={0}
                        max={10}
                    />
                    {borderWidth > 0 && (
                        <BaseControl
                            label={__('Border Color', 'murdeni-blocks')}
                            id="border-color"
                        >
                            <ColorPicker
                                color={borderColor}
                                onChange={(value) => setAttributes({ borderColor: value })}
                                enableAlpha
                            />
                        </BaseControl>
                    )}
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={() => setAttributes({ boxShadow: !boxShadow })}
                    />
                    <BaseControl
                        label={__('Overlay Color', 'murdeni-blocks')}
                        id="overlay-color"
                    >
                        <ColorPicker
                            color={overlayColor}
                            onChange={(value) => setAttributes({ overlayColor: value })}
                            enableAlpha
                        />
                    </BaseControl>
                    <RangeControl
                        label={__('Overlay Opacity (%)', 'murdeni-blocks')}
                        value={overlayOpacity}
                        onChange={(value) => setAttributes({ overlayOpacity: value })}
                        min={0}
                        max={100}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div {...blockProps}>
                {displayHeader && (
                    <div className="murdeni-media-gallery__header">
                        <h3 className="murdeni-media-gallery__title">
                            {headerTitle}
                        </h3>
                        {displayViewAll && viewAllUrl && (
                            <a href={viewAllUrl} className="murdeni-media-gallery__view-all">
                                {viewAllText}
                            </a>
                        )}
                    </div>
                )}
                <div 
                    className="murdeni-media-gallery__grid"
                    style={{ 
                        gap: `${gapSize}px`,
                    }}
                >
                    {items.map((item) => (
                        <div 
                            key={item.id} 
                            className={`murdeni-media-gallery__item ${item.type === 'video' ? 'is-video' : ''}`}
                            style={{
                                borderRadius: borderRadius ? `${borderRadius}px` : undefined,
                                border: borderWidth ? `${borderWidth}px solid ${borderColor}` : undefined,
                                boxShadow: boxShadow ? '0 4px 10px rgba(0,0,0,0.1)' : undefined,
                            }}
                        >
                            <div className="murdeni-media-gallery__item-inner">
                                <div 
                                    className="murdeni-media-gallery__item-media-wrapper"
                                    style={getAspectRatioStyle()}
                                >
                                    {item.mediaUrl ? (
                                        <>
                                            <img 
                                                src={item.mediaUrl} 
                                                alt={item.caption} 
                                                className="murdeni-media-gallery__item-media"
                                            />
                                            {item.type === 'video' && (
                                                <div className="murdeni-media-gallery__item-play-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                                        <path d="M8 5v14l11-7z" fill="#ffffff"/>
                                                    </svg>
                                                </div>
                                            )}
                                            <div 
                                                className="murdeni-media-gallery__item-actions"
                                            >
                                                <Button
                                                    icon={edit}
                                                    label={__('Edit', 'murdeni-blocks')}
                                                    onClick={() => {
                                                        // Open media library
                                                    }}
                                                />
                                                <Button
                                                    icon={trash}
                                                    label={__('Remove', 'murdeni-blocks')}
                                                    onClick={() => removeItem(item.id)}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <MediaUpload
                                            onSelect={(media) => onSelectMedia(item.id, media)}
                                            allowedTypes={['image']}
                                            value={item.mediaId}
                                            render={({ open }) => (
                                                <Button
                                                    className="murdeni-media-gallery__item-upload-button"
                                                    onClick={open}
                                                >
                                                    {__('Upload Thumbnail', 'murdeni-blocks')}
                                                </Button>
                                            )}
                                        />
                                    )}
                                </div>
                                
                                {item.type === 'video' && (
                                    <div className="murdeni-media-gallery__item-video-url">
                                        <TextControl
                                            label={__('YouTube Video URL', 'murdeni-blocks')}
                                            value={item.videoUrl || ''}
                                            onChange={(value) => updateItem(item.id, 'videoUrl', value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>
                                )}
                                
                                {showCaptions && captionPosition === 'below' && (
                                    <RichText
                                        tagName="figcaption"
                                        className="murdeni-media-gallery__item-caption"
                                        value={item.caption}
                                        onChange={(value) => updateItem(item.id, 'caption', value)}
                                        placeholder={__('Write caption…', 'murdeni-blocks')}
                                        style={{
                                            fontSize: `${captionFontSize}px`,
                                            color: captionColor || undefined,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {/* Add new item buttons */}
                    <div className="murdeni-media-gallery__add-items">
                        <Button
                            className="murdeni-media-gallery__add-item-button"
                            icon={image}
                            onClick={() => addItem('image')}
                        >
                            {__('Add Image', 'murdeni-blocks')}
                        </Button>
                        <Button
                            className="murdeni-media-gallery__add-item-button"
                            icon={video}
                            onClick={() => addItem('video')}
                        >
                            {__('Add Video', 'murdeni-blocks')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
