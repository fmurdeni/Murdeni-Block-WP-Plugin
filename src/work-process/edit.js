/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    RichText,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    BlockControls,
    AlignmentToolbar,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ButtonGroup,
    TextControl,
    ColorPalette,
} from '@wordpress/components';
import { plus, trash, image as imageIcon } from '@wordpress/icons';

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        title,
        description,
        items,
        contentAlign,
        backgroundColor,
        textColor,
        iconBackgroundColor,
        iconColor,
        numberColor,
    } = attributes;

    // Function to add a new item
    const addItem = () => {
        const newItems = [...items, {
            id: `item-${Date.now()}`,
            icon: {
                url: '',
                id: 0,
                alt: ''
            },
            number: `0${items.length + 1}`,
            title: __('New Step', 'murdeni-blocks'),
            description: __('Description for this step', 'murdeni-blocks'),
        }];
        setAttributes({ items: newItems });
    };

    // Function to remove an item
    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        
        // Update numbers for remaining items
        newItems.forEach((item, idx) => {
            item.number = `0${idx + 1}`;
        });
        
        setAttributes({ items: newItems });
    };

    // Function to update item properties
    const updateItemProp = (index, prop, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [prop]: value };
        setAttributes({ items: newItems });
    };

    // Function to update item icon
    const updateItemIcon = (index, image) => {
        const newItems = [...items];
        newItems[index] = { 
            ...newItems[index], 
            icon: {
                url: image.url,
                id: image.id,
                alt: image.alt || ''
            } 
        };
        setAttributes({ items: newItems });
    };

    // Block props
    const blockProps = useBlockProps({
        className: `murdeni-work-process align-${contentAlign}`,
        style: {
            backgroundColor: backgroundColor || undefined,
            color: textColor || undefined,
            textAlign: contentAlign
        }
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'murdeni-blocks')}>
                    <TextControl
                        label={__('Content Alignment', 'murdeni-blocks')}
                        value={contentAlign}
                        options={[
                            { label: __('Left', 'murdeni-blocks'), value: 'left' },
                            { label: __('Center', 'murdeni-blocks'), value: 'center' },
                            { label: __('Right', 'murdeni-blocks'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ contentAlign: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Color Settings', 'murdeni-blocks')}>
                    <div className="murdeni-color-settings">
                        <label>{__('Background Color', 'murdeni-blocks')}</label>
                        <ColorPalette
                            value={backgroundColor}
                            onChange={(value) => setAttributes({ backgroundColor: value })}
                        />
                        <label>{__('Text Color', 'murdeni-blocks')}</label>
                        <ColorPalette
                            value={textColor}
                            onChange={(value) => setAttributes({ textColor: value })}
                        />
                        <label>{__('Icon Background Color', 'murdeni-blocks')}</label>
                        <ColorPalette
                            value={iconBackgroundColor}
                            onChange={(value) => setAttributes({ iconBackgroundColor: value })}
                        />
                        <label>{__('Icon Color', 'murdeni-blocks')}</label>
                        <ColorPalette
                            value={iconColor}
                            onChange={(value) => setAttributes({ iconColor: value })}
                        />
                        <label>{__('Number Color', 'murdeni-blocks')}</label>
                        <ColorPalette
                            value={numberColor}
                            onChange={(value) => setAttributes({ numberColor: value })}
                        />
                    </div>
                </PanelBody>
            </InspectorControls>

            <BlockControls>
                <AlignmentToolbar
                    value={contentAlign}
                    onChange={(value) => setAttributes({ contentAlign: value })}
                />
            </BlockControls>

            <div {...blockProps}>
                <div className="murdeni-work-process__header">
                    <RichText
                        tagName="h2"
                        className="murdeni-work-process__title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Add title...', 'murdeni-blocks')}
                    />
                    <RichText
                        tagName="div"
                        className="murdeni-work-process__description"
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        placeholder={__('Add description...', 'murdeni-blocks')}
                    />
                </div>

                <div className="murdeni-work-process__items">
                    {items.map((item, index) => (
                        <div key={item.id} className="murdeni-work-process__item">
                            <div className="murdeni-work-process__item-inner">
                                <div className="murdeni-work-process__item-number" style={{ color: numberColor }}>
                                    <RichText
                                        tagName="span"
                                        className="murdeni-work-process__item-number-text"
                                        value={item.number}
                                        onChange={(value) => updateItemProp(index, 'number', value)}
                                        placeholder={__('01', 'murdeni-blocks')}
                                    />
                                </div>
                                
                                <div 
                                    className="murdeni-work-process__item-icon-container"
                                    style={{ backgroundColor: iconBackgroundColor }}
                                >
                                    <MediaUploadCheck>
                                        <MediaUpload
                                            onSelect={(media) => updateItemIcon(index, media)}
                                            allowedTypes={['image']}
                                            value={item.icon.id}
                                            render={({ open }) => (
                                                <div className="murdeni-work-process__item-icon-wrapper">
                                                    {item.icon.url ? (
                                                        <div className="murdeni-work-process__item-icon">
                                                            <img 
                                                                src={item.icon.url} 
                                                                alt={item.icon.alt} 
                                                                style={{
                                                                    width: '100%',
                                                                    height: 'auto',
                                                                    objectFit: 'contain'
                                                                }}
                                                            />
                                                            <ButtonGroup className="murdeni-work-process__item-icon-actions">
                                                                <Button 
                                                                    onClick={open}
                                                                    isSmall
                                                                    variant="primary"
                                                                >
                                                                    {__('Replace', 'murdeni-blocks')}
                                                                </Button>
                                                                <Button 
                                                                    onClick={() => updateItemIcon(index, { url: '', id: 0, alt: '' })}
                                                                    isSmall
                                                                    variant="tertiary"
                                                                >
                                                                    {__('Remove', 'murdeni-blocks')}
                                                                </Button>
                                                            </ButtonGroup>
                                                        </div>
                                                    ) : (
                                                        <Button 
                                                            onClick={open}
                                                            className="murdeni-work-process__item-icon-button"
                                                            style={{ color: iconColor }}
                                                        >
                                                            {imageIcon}
                                                            <span>{__('Add Icon', 'murdeni-blocks')}</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </MediaUploadCheck>
                                </div>

                                <div className="murdeni-work-process__item-content">
                                    <RichText
                                        tagName="h3"
                                        className="murdeni-work-process__item-title"
                                        value={item.title}
                                        onChange={(value) => updateItemProp(index, 'title', value)}
                                        placeholder={__('Step title...', 'murdeni-blocks')}
                                    />
                                    <RichText
                                        tagName="div"
                                        className="murdeni-work-process__item-description"
                                        value={item.description}
                                        onChange={(value) => updateItemProp(index, 'description', value)}
                                        placeholder={__('Step description...', 'murdeni-blocks')}
                                    />
                                </div>
                                
                                <Button
                                    className="murdeni-work-process__item-remove"
                                    onClick={() => removeItem(index)}
                                    icon={trash}
                                    label={__('Remove item', 'murdeni-blocks')}
                                    isDestructive
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="murdeni-work-process__add-item">
                    <Button
                        onClick={addItem}
                        variant="primary"
                        className="murdeni-work-process__add-item-button"
                        icon={plus}
                    >
                        {__('Add Process Step', 'murdeni-blocks')}
                    </Button>
                </div>
            </div>
        </>
    );
}

// Helper function to convert color to hue-rotate value
function getHueRotate(color) {
    // This is a simplified approach - for production, you might want a more sophisticated color conversion
    if (!color) return '0deg';
    
    // For teal/cyan colors like in the example
    if (color.includes('#00b8a9') || color.toLowerCase().includes('teal')) {
        return '175deg';
    }
    
    return '0deg';
}
