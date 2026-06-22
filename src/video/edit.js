/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    RangeControl,
    ToggleControl,
    SelectControl,
    Button,
    Placeholder,
    ColorPicker,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Icon, video } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the Murdeni Video block
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        videoUrl,
        thumbnailUrl,
        thumbnailId,
        title,
        aspectRatio,
        maxWidth,
        borderRadius,
        borderWidth,
        borderColor,
        boxShadow,
        overlayColor,
        overlayOpacity,
        playButtonSize,
        playButtonColor,
        playButtonBgColor,
        showTitle,
        titlePosition,
        titleFontSize,
        titleColor,
        titleAlignment,
    } = attributes;

    const [isValidYouTubeUrl, setIsValidYouTubeUrl] = useState(true);

    // Extract YouTube video ID from standard, short, embed, and Shorts URLs.
    const getYouTubeVideoId = (url) => {
        if (!url) {
            return '';
        }

        const pattern = /(?:youtube\.com\/(?:shorts\/|embed\/|watch\?v=|watch\?.*&v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(pattern);

        return match ? match[1] : '';
    };

    // Validate YouTube URL
    const validateYouTubeUrl = (url) => {
        if (!url) {
            setIsValidYouTubeUrl(true);
            return true;
        }
        
        const isValid = Boolean(getYouTubeVideoId(url));
        setIsValidYouTubeUrl(isValid);
        return isValid;
    };

    // Handle video URL change
    const onChangeVideoUrl = (newVideoUrl) => {
        validateYouTubeUrl(newVideoUrl);
        setAttributes({ videoUrl: newVideoUrl });
    };

    // Get aspect ratio style
    const getAspectRatioStyle = () => {
        switch (aspectRatio) {
            case '16:9':
                return { paddingTop: '56.25%' };
            case '4:3':
                return { paddingTop: '75%' };
            case '1:1':
                return { paddingTop: '100%' };
            case '21:9':
                return { paddingTop: '42.85%' };
            case '9:16':
                return { paddingTop: '177.78%' };
            default:
                return { paddingTop: '56.25%' };
        }
    };

    // Get container style
    const getContainerStyle = () => {
        const style = {};
        
        if (maxWidth > 0) {
            style.maxWidth = `${maxWidth}px`;
            style.margin = '0 auto';
        }
        
        return style;
    };

    // Get video wrapper style
    const getVideoWrapperStyle = () => {
        const style = {
            borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
            overflow: 'hidden',
        };
        
        if (borderWidth > 0 && borderColor) {
            style.border = `${borderWidth}px solid ${borderColor}`;
        }
        
        if (boxShadow) {
            style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        }
        
        return style;
    };

    // Get play button style
    const getPlayButtonStyle = () => {
        const style = {
            backgroundColor: playButtonBgColor || 'rgba(0, 0, 0, 0.6)',
        };
        
        switch (playButtonSize) {
            case 'small':
                style.width = '50px';
                style.height = '50px';
                break;
            case 'medium':
                style.width = '70px';
                style.height = '70px';
                break;
            case 'large':
                style.width = '90px';
                style.height = '90px';
                break;
            default:
                style.width = '70px';
                style.height = '70px';
        }
        
        return style;
    };

    // Get title style
    const getTitleStyle = () => {
        return {
            fontSize: `${titleFontSize}px`,
            color: titleColor || undefined,
            textAlign: titleAlignment,
        };
    };

    // Block props
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Video Settings', 'murdeni-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('YouTube Video URL', 'murdeni-blocks')}
                        value={videoUrl}
                        onChange={onChangeVideoUrl}
                        help={!isValidYouTubeUrl ? __('Please enter a valid YouTube URL or Shorts URL', 'murdeni-blocks') : ''}
                        className={!isValidYouTubeUrl ? 'has-error' : ''}
                    />
                    <SelectControl
                        label={__('Aspect Ratio', 'murdeni-blocks')}
                        value={aspectRatio}
                        options={[
                            { label: '16:9', value: '16:9' },
                            { label: '4:3', value: '4:3' },
                            { label: '1:1', value: '1:1' },
                            { label: '21:9', value: '21:9' },
                            { label: '9:16 (Shorts)', value: '9:16' },
                        ]}
                        onChange={(value) => setAttributes({ aspectRatio: value })}
                    />
                    <RangeControl
                        label={__('Max Width (px)', 'murdeni-blocks')}
                        value={maxWidth}
                        onChange={(value) => setAttributes({ maxWidth: value })}
                        min={0}
                        max={1200}
                        step={10}
                        help={__('0 = full width', 'murdeni-blocks')}
                    />
                </PanelBody>

                <PanelBody title={__('Thumbnail Settings', 'murdeni-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Title', 'murdeni-blocks')}
                        checked={showTitle}
                        onChange={() => setAttributes({ showTitle: !showTitle })}
                    />
                    {showTitle && (
                        <>
                            <SelectControl
                                label={__('Title Position', 'murdeni-blocks')}
                                value={titlePosition}
                                options={[
                                    { label: 'Below Video', value: 'below' },
                                    { label: 'Overlay (Bottom)', value: 'overlay' },
                                ]}
                                onChange={(value) => setAttributes({ titlePosition: value })}
                            />
                            <RangeControl
                                label={__('Title Font Size', 'murdeni-blocks')}
                                value={titleFontSize}
                                onChange={(value) => setAttributes({ titleFontSize: value })}
                                min={12}
                                max={32}
                            />
                            <SelectControl
                                label={__('Title Alignment', 'murdeni-blocks')}
                                value={titleAlignment}
                                options={[
                                    { label: 'Left', value: 'left' },
                                    { label: 'Center', value: 'center' },
                                    { label: 'Right', value: 'right' },
                                ]}
                                onChange={(value) => setAttributes({ titleAlignment: value })}
                            />
                            <div className="murdeni-color-label">
                                {__('Title Color', 'murdeni-blocks')}
                            </div>
                            <ColorPicker
                                color={titleColor}
                                onChange={(value) => setAttributes({ titleColor: value })}
                                enableAlpha
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Play Button Settings', 'murdeni-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Play Button Size', 'murdeni-blocks')}
                        value={playButtonSize}
                        options={[
                            { label: 'Small', value: 'small' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Large', value: 'large' },
                        ]}
                        onChange={(value) => setAttributes({ playButtonSize: value })}
                    />
                    <div className="murdeni-color-label">
                        {__('Play Button Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={playButtonColor}
                        onChange={(value) => setAttributes({ playButtonColor: value })}
                        enableAlpha
                    />
                    <div className="murdeni-color-label">
                        {__('Play Button Background', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={playButtonBgColor}
                        onChange={(value) => setAttributes({ playButtonBgColor: value })}
                        enableAlpha
                    />
                </PanelBody>

                <PanelBody title={__('Style Settings', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Border Radius', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={30}
                    />
                    <RangeControl
                        label={__('Border Width', 'murdeni-blocks')}
                        value={borderWidth}
                        onChange={(value) => setAttributes({ borderWidth: value })}
                        min={0}
                        max={10}
                    />
                    {borderWidth > 0 && (
                        <div className="murdeni-color-label">
                            {__('Border Color', 'murdeni-blocks')}
                            <ColorPicker
                                color={borderColor}
                                onChange={(value) => setAttributes({ borderColor: value })}
                                enableAlpha
                            />
                        </div>
                    )}
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={() => setAttributes({ boxShadow: !boxShadow })}
                    />
                    <div className="murdeni-color-label">
                        {__('Overlay Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={overlayColor}
                        onChange={(value) => setAttributes({ overlayColor: value })}
                        enableAlpha
                    />
                    <RangeControl
                        label={__('Overlay Opacity (%)', 'murdeni-blocks')}
                        value={overlayOpacity}
                        onChange={(value) => setAttributes({ overlayOpacity: value })}
                        min={0}
                        max={100}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="murdeni-video" style={getContainerStyle()}>
                <div className="murdeni-video__wrapper" style={getVideoWrapperStyle()}>
                    <div className="murdeni-video__inner" style={getAspectRatioStyle()}>
                        {thumbnailUrl ? (
                            <>
                                <img 
                                    src={thumbnailUrl} 
                                    alt={title || __('Video thumbnail', 'murdeni-blocks')} 
                                    className="murdeni-video__thumbnail"
                                />
                                <div className="murdeni-video__overlay" style={{ backgroundColor: overlayColor }}>
                                    <div className="murdeni-video__play-button" style={getPlayButtonStyle()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path d="M8 5v14l11-7z" fill={playButtonColor || '#ffffff'} />
                                        </svg>
                                    </div>
                                </div>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => {
                                            setAttributes({
                                                thumbnailUrl: media.url,
                                                thumbnailId: media.id,
                                            });
                                        }}
                                        allowedTypes={['image']}
                                        value={thumbnailId}
                                        render={({ open }) => (
                                            <Button
                                                onClick={open}
                                                className="murdeni-video__change-image"
                                                variant="secondary"
                                            >
                                                {__('Change Thumbnail', 'murdeni-blocks')}
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>
                            </>
                        ) : (
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => {
                                        setAttributes({
                                            thumbnailUrl: media.url,
                                            thumbnailId: media.id,
                                        });
                                    }}
                                    allowedTypes={['image']}
                                    value={thumbnailId}
                                    render={({ open }) => (
                                        <Placeholder
                                            icon={<Icon icon={video} />}
                                            label={__('Video Thumbnail', 'murdeni-blocks')}
                                            instructions={__('Upload or select a thumbnail image for your video.', 'murdeni-blocks')}
                                            className="murdeni-video__placeholder"
                                        >
                                            <Button
                                                onClick={open}
                                                variant="primary"
                                            >
                                                {__('Upload Thumbnail', 'murdeni-blocks')}
                                            </Button>
                                        </Placeholder>
                                    )}
                                />
                            </MediaUploadCheck>
                        )}
                    </div>
                </div>
                
                {showTitle && title && titlePosition === 'below' && (
                    <h3 className="murdeni-video__title" style={getTitleStyle()}>
                        {title}
                    </h3>
                )}
                
                {showTitle && titlePosition === 'below' && (
                    <TextControl
                        placeholder={__('Enter video title...', 'murdeni-blocks')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        className="murdeni-video__title-input"
                    />
                )}
            </div>
        </div>
    );
}
