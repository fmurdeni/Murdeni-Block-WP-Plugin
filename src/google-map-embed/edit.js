/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextareaControl,
    RangeControl,
    ToggleControl,
    TextControl,
    Placeholder,
    Button,
    ExternalLink,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Extract map URL from embed code
 * 
 * @param {string} embedCode The embed code from Google Maps
 * @return {string} The extracted map URL or empty string
 */
const extractMapUrl = (embedCode) => {
    if (!embedCode) return '';
    
    // Try to extract src attribute from iframe
    const srcMatch = embedCode.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
    }
    
    // If it's just a URL, return it directly
    if (embedCode.startsWith('https://')) {
        return embedCode;
    }
    
    return '';
};

/**
 * Google Map Embed Block Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
    const {
        embedCode,
        mapUrl,
        height,
        width,
        zoom,
        showControls,
        allowFullscreen,
        borderRadius,
        boxShadow,
    } = attributes;

    const [isPreviewVisible, setIsPreviewVisible] = useState(!!mapUrl);
    const [previewError, setPreviewError] = useState('');

    // Update map URL when embed code changes
    useEffect(() => {
        if (embedCode) {
            const extractedUrl = extractMapUrl(embedCode);
            if (extractedUrl && extractedUrl !== mapUrl) {
                setAttributes({ mapUrl: extractedUrl });
                setIsPreviewVisible(true);
                setPreviewError('');
            } else if (!extractedUrl) {
                setPreviewError(__('Could not extract map URL from the provided embed code.', 'murdeni-blocks'));
            }
        }
    }, [embedCode]);

    // Block props with custom styles
    const blockProps = useBlockProps({
        className: 'murdeni-google-map-embed',
        style: {
            borderRadius: borderRadius ? `${borderRadius}px` : undefined,
            boxShadow: boxShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : undefined,
        },
    });

    // Map container styles
    const mapContainerStyles = {
        width: `${width}%`,
        height: `${height}px`,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        boxShadow: boxShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : undefined,
    };

    // Prepare iframe URL with parameters
    const prepareMapUrl = () => {
        if (!mapUrl) return '';
        
        let url = mapUrl;
        
        // Add zoom parameter if not already present
        if (!url.includes('z=') && zoom) {
            url = url.includes('?') ? `${url}&z=${zoom}` : `${url}?z=${zoom}`;
        }
        
        return url;
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Map Settings', 'murdeni-blocks')} initialOpen={true}>
                    <TextareaControl
                        label={__('Google Maps Embed Code', 'murdeni-blocks')}
                        help={__('Paste the embed code from Google Maps.', 'murdeni-blocks')}
                        value={embedCode}
                        onChange={(value) => setAttributes({ embedCode: value })}
                        rows={4}
                    />
                    
                    <TextControl
                        label={__('Map URL', 'murdeni-blocks')}
                        help={__('URL will be automatically extracted from embed code, but you can modify it manually.', 'murdeni-blocks')}
                        value={mapUrl}
                        onChange={(value) => setAttributes({ mapUrl: value })}
                    />
                    
                    <Button
                        variant="secondary"
                        onClick={() => {
                            if (mapUrl) {
                                setIsPreviewVisible(true);
                                setPreviewError('');
                            } else {
                                setPreviewError(__('Please enter a valid map URL or embed code.', 'murdeni-blocks'));
                            }
                        }}
                        style={{ marginBottom: '15px' }}
                    >
                        {__('Update Preview', 'murdeni-blocks')}
                    </Button>
                    
                    <ExternalLink href="https://www.google.com/maps" style={{ display: 'block', marginBottom: '15px' }}>
                        {__('Open Google Maps', 'murdeni-blocks')}
                    </ExternalLink>
                </PanelBody>
                
                <PanelBody title={__('Display Settings', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Height (px)', 'murdeni-blocks')}
                        value={height}
                        onChange={(value) => setAttributes({ height: value })}
                        min={200}
                        max={800}
                    />
                    
                    <RangeControl
                        label={__('Width (%)', 'murdeni-blocks')}
                        value={width}
                        onChange={(value) => setAttributes({ width: value })}
                        min={50}
                        max={100}
                    />
                    
                    <RangeControl
                        label={__('Zoom Level', 'murdeni-blocks')}
                        value={zoom}
                        onChange={(value) => setAttributes({ zoom: value })}
                        min={1}
                        max={20}
                    />
                    
                    <ToggleControl
                        label={__('Show Map Controls', 'murdeni-blocks')}
                        checked={showControls}
                        onChange={(value) => setAttributes({ showControls: value })}
                    />
                    
                    <ToggleControl
                        label={__('Allow Fullscreen', 'murdeni-blocks')}
                        checked={allowFullscreen}
                        onChange={(value) => setAttributes({ allowFullscreen: value })}
                    />
                </PanelBody>
                
                <PanelBody title={__('Style Settings', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Border Radius (px)', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={30}
                    />
                    
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={(value) => setAttributes({ boxShadow: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {!isPreviewVisible || !mapUrl ? (
                    <Placeholder
                        icon="location-alt"
                        label={__('Google Map Embed', 'murdeni-blocks')}
                        instructions={__('Enter a Google Maps embed code in the sidebar to display a map.', 'murdeni-blocks')}
                    >
                        {previewError && <p className="murdeni-google-map-embed__error">{previewError}</p>}
                        <TextareaControl
                            value={embedCode}
                            onChange={(value) => setAttributes({ embedCode: value })}
                            placeholder={__('Paste Google Maps embed code here...', 'murdeni-blocks')}
                            rows={4}
                            style={{ width: '100%', maxWidth: '600px' }}
                        />
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (mapUrl) {
                                    setIsPreviewVisible(true);
                                    setPreviewError('');
                                } else {
                                    const extractedUrl = extractMapUrl(embedCode);
                                    if (extractedUrl) {
                                        setAttributes({ mapUrl: extractedUrl });
                                        setIsPreviewVisible(true);
                                        setPreviewError('');
                                    } else {
                                        setPreviewError(__('Could not extract map URL from the provided embed code.', 'murdeni-blocks'));
                                    }
                                }
                            }}
                        >
                            {__('Preview Map', 'murdeni-blocks')}
                        </Button>
                    </Placeholder>
                ) : (
                    <div className="murdeni-google-map-embed__container" style={mapContainerStyles}>
                        <iframe
                            src={prepareMapUrl()}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={allowFullscreen}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={__('Google Map', 'murdeni-blocks')}
                        ></iframe>
                    </div>
                )}
            </div>
        </>
    );
};

export default Edit;
