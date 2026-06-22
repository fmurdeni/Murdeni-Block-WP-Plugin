/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Google Map Embed Block Save Component
 */
const Save = ({ attributes }) => {
    const {
        mapUrl,
        height,
        width,
        zoom,
        showControls,
        allowFullscreen,
        borderRadius,
        boxShadow,
    } = attributes;

    // Block props with custom styles
    const blockProps = useBlockProps.save({
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
        
        // Add UI controls parameter if needed
        if (!showControls && !url.includes('ui=')) {
            url = url.includes('?') ? `${url}&ui=0` : `${url}?ui=0`;
        }
        
        return url;
    };

    // If no map URL is provided, don't render anything
    if (!mapUrl) {
        return null;
    }

    return (
        <div {...blockProps}>
            <div className="murdeni-google-map-embed__container" style={mapContainerStyles}>
                <iframe
                    src={prepareMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={allowFullscreen}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                ></iframe>
            </div>
        </div>
    );
};

export default Save;
