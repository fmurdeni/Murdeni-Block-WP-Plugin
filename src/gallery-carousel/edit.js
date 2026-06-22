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

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        items,
        slidesToShow,
        gapSize,
        aspectRatio,
        thumbnailSize,
        showArrows,
        showDots,
        autoplay,
        autoplaySpeed,
        displayHeader,
        headerTitle,
        displayViewAll,
        viewAllText,
        viewAllUrl,
        overlayColor,
        overlayOpacity,
        hoverEffect,
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
        className: `murdeni-gallery-carousel`,
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
                <PanelBody title={__('Carousel Settings', 'murdeni-blocks')}>
                    <RangeControl
                        label={__('Slides to Show', 'murdeni-blocks')}
                        value={slidesToShow}
                        onChange={(value) => setAttributes({ slidesToShow: value })}
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
                
                <PanelBody title={__('Navigation Settings', 'murdeni-blocks')}>
                    <ToggleControl
                        label={__('Show Arrows', 'murdeni-blocks')}
                        checked={showArrows}
                        onChange={() => setAttributes({ showArrows: !showArrows })}
                    />
                    <ToggleControl
                        label={__('Show Dots', 'murdeni-blocks')}
                        checked={showDots}
                        onChange={() => setAttributes({ showDots: !showDots })}
                    />
                    <ToggleControl
                        label={__('Autoplay', 'murdeni-blocks')}
                        checked={autoplay}
                        onChange={() => setAttributes({ autoplay: !autoplay })}
                    />
                    {autoplay && (
                        <RangeControl
                            label={__('Autoplay Speed (ms)', 'murdeni-blocks')}
                            value={autoplaySpeed}
                            onChange={(value) => setAttributes({ autoplaySpeed: value })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                    )}
                </PanelBody>
                
                <PanelBody title={__('Header Settings', 'murdeni-blocks')}>
                    <ToggleControl
                        label={__('Display Header', 'murdeni-blocks')}
                        checked={displayHeader}
                        onChange={() => setAttributes({ displayHeader: !displayHeader })}
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
                                onChange={() => setAttributes({ displayViewAll: !displayViewAll })}
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
                        <BaseControl label={__('Border Color', 'murdeni-blocks')}>
                            <ColorPicker
                                color={borderColor}
                                onChangeComplete={(value) => setAttributes({ borderColor: value.hex })}
                                disableAlpha
                            />
                        </BaseControl>
                    )}
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={() => setAttributes({ boxShadow: !boxShadow })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {displayHeader && (
                    <div className="murdeni-gallery-carousel__header">
                        <RichText
                            tagName="h2"
                            className="murdeni-gallery-carousel__title"
                            value={headerTitle}
                            onChange={(value) => setAttributes({ headerTitle: value })}
                            placeholder={__('Gallery Carousel', 'murdeni-blocks')}
                        />
                        {displayViewAll && (
                            <div className="murdeni-gallery-carousel__view-all-wrapper">
                                <RichText
                                    tagName="span"
                                    className="murdeni-gallery-carousel__view-all"
                                    value={viewAllText}
                                    onChange={(value) => setAttributes({ viewAllText: value })}
                                    placeholder={__('View All', 'murdeni-blocks')}
                                />
                                <TextControl
                                    className="murdeni-gallery-carousel__view-all-url"
                                    value={viewAllUrl}
                                    onChange={(value) => setAttributes({ viewAllUrl: value })}
                                    placeholder={__('https://', 'murdeni-blocks')}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="murdeni-gallery-carousel__container">
                    {showArrows && (
                        <button className="murdeni-gallery-carousel__arrow murdeni-gallery-carousel__arrow--prev">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
                            </svg>
                        </button>
                    )}

                    <div className="murdeni-gallery-carousel__track" style={{ gap: `${gapSize}px` }}>
                        {items.length > 0 ? (
                            items.map((item) => {
                                const isVideo = item.type === 'video';
                                const videoId = getYouTubeVideoId(item.videoUrl);
                                
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`murdeni-gallery-carousel__item ${isVideo ? 'is-video' : ''}`}
                                        style={{
                                            borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
                                            border: borderWidth > 0 && borderColor ? `${borderWidth}px solid ${borderColor}` : undefined,
                                            boxShadow: boxShadow ? '0 4px 10px rgba(0,0,0,0.1)' : undefined,
                                        }}
                                    >
                                        <div className="murdeni-gallery-carousel__item-inner">
                                            <div 
                                                className="murdeni-gallery-carousel__item-media-wrapper" 
                                                style={getAspectRatioStyle()}
                                            >
                                                {item.mediaUrl ? (
                                                    <>
                                                        <img 
                                                            src={item.mediaUrl} 
                                                            alt={item.caption || ''} 
                                                            className="murdeni-gallery-carousel__item-media"
                                                        />
                                                        {isVideo && videoId && (
                                                            <div className="murdeni-gallery-carousel__item-play-button">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                                                    <path d="M8 5v14l11-7z" fill="#ffffff"/>
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className="murdeni-gallery-carousel__item-actions">
                                                            <Button
                                                                icon={trash}
                                                                label={__('Remove item', 'murdeni-blocks')}
                                                                onClick={() => removeItem(item.id)}
                                                            />
                                                            <MediaUpload
                                                                onSelect={(media) => onSelectMedia(item.id, media)}
                                                                allowedTypes={['image']}
                                                                value={item.mediaId}
                                                                render={({ open }) => (
                                                                    <Button
                                                                        icon={edit}
                                                                        label={__('Edit image', 'murdeni-blocks')}
                                                                        onClick={open}
                                                                    />
                                                                )}
                                                            />
                                                            {isVideo && (
                                                                <Button
                                                                    icon={video}
                                                                    label={__('Edit video URL', 'murdeni-blocks')}
                                                                    onClick={() => {
                                                                        const videoUrl = prompt(__('Enter YouTube video URL:', 'murdeni-blocks'), item.videoUrl || '');
                                                                        if (videoUrl !== null) {
                                                                            updateItem(item.id, 'videoUrl', videoUrl);
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <MediaUpload
                                                        onSelect={(media) => onSelectMedia(item.id, media)}
                                                        allowedTypes={['image']}
                                                        value={item.mediaId}
                                                        render={({ open }) => (
                                                            <Button
                                                                className="murdeni-gallery-carousel__item-upload-button"
                                                                onClick={open}
                                                            >
                                                                {__('Upload Image', 'murdeni-blocks')}
                                                            </Button>
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <Placeholder
                                icon={image}
                                label={__('Gallery Carousel', 'murdeni-blocks')}
                                instructions={__('Add images or videos to create a carousel.', 'murdeni-blocks')}
                                className="murdeni-gallery-carousel__placeholder"
                            >
                                <div className="murdeni-gallery-carousel__placeholder-buttons">
                                    <Button
                                        isPrimary
                                        onClick={() => addItem('image')}
                                    >
                                        {__('Add Image', 'murdeni-blocks')}
                                    </Button>
                                    <Button
                                        isSecondary
                                        onClick={() => addItem('video')}
                                    >
                                        {__('Add Video', 'murdeni-blocks')}
                                    </Button>
                                </div>
                            </Placeholder>
                        )}
                    </div>

                    {showArrows && (
                        <button className="murdeni-gallery-carousel__arrow murdeni-gallery-carousel__arrow--next">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                            </svg>
                        </button>
                    )}
                </div>

                {showDots && items.length > 0 && (
                    <div className="murdeni-gallery-carousel__dots">
                        {items.map((item, index) => (
                            <button 
                                key={index} 
                                className={`murdeni-gallery-carousel__dot ${index === 0 ? 'is-active' : ''}`} 
                                data-index={index}
                            ></button>
                        ))}
                    </div>
                )}

                {items.length > 0 && (
                    <div className="murdeni-gallery-carousel__add-item">
                        <Button
                            icon={plus}
                            onClick={() => addItem('image')}
                        >
                            {__('Add Image', 'murdeni-blocks')}
                        </Button>
                        <Button
                            icon={video}
                            onClick={() => addItem('video')}
                        >
                            {__('Add Video', 'murdeni-blocks')}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
