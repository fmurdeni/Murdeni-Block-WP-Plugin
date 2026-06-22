/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Icon with Text Block Save Component
 */
const Save = ({ attributes }) => {
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
    const blockProps = useBlockProps.save({
        className: `murdeni-icon-with-text murdeni-icon-with-text--${layout} murdeni-icon-with-text--${iconPosition}`,
        style: {
            display: layout === 'inline' ? 'flex' : 'block',
            alignItems: layout === 'inline' ? verticalAlignment : 'flex-start',
            flexDirection: layout === 'inline' && iconPosition === 'after' ? 'row-reverse' : 'row',
            justifyContent: layout === 'stack' ? 'center' : 'flex-start',
            textAlign: layout === 'stack' ? 'center' : 'left',
        },
    });

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

    // Content to render
    const content = (
        <>
            {(iconImage?.url || iconSvg) && (
                <div className="murdeni-icon-with-text__icon" style={iconContainerStyles}>
                    {iconImage?.url && useUploadedIcon ? (
                        <img
                            src={iconImage.url}
                            alt={iconImage.alt || ''}
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

            <RichText.Content
                tagName="p"
                className="murdeni-icon-with-text__text"
                value={text}
                style={textStyles}
            />
        </>
    );

    // If link URL is provided, wrap content in an anchor tag
    if (linkUrl) {
        return (
            <div {...blockProps}>
                <a
                    href={linkUrl}
                    className="murdeni-icon-with-text__link"
                    target={linkTarget ? '_blank' : undefined}
                    rel={linkTarget ? 'noopener noreferrer' : undefined}
                >
                    {content}
                </a>
            </div>
        );
    }

    // Otherwise, just return the content
    return <div {...blockProps}>{content}</div>;
};

export default Save;
