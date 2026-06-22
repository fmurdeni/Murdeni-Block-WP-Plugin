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
    RangeControl,
    SelectControl,
    TextControl,
    ToggleControl,
    ColorPalette,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { plus, trash, dragHandle, image as imageIcon } from '@wordpress/icons';

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        title,
        description,
        columns,
        items,
        imageSize,
        contentAlign,
        backgroundColor,
        textColor,
    } = attributes;

    // Function to add a new item
    const addItem = () => {
        const newItems = [...items, {
            id: `item-${Date.now()}`,
            image: {
                url: '',
                id: 0,
                alt: ''
            },
            title: __('New Feature', 'murdeni-blocks'),
            description: __('Description for this feature', 'murdeni-blocks')
        }];
        setAttributes({ items: newItems });
    };

    // Function to remove an item
    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setAttributes({ items: newItems });
    };

    // Function to update item properties
    const updateItemProp = (index, prop, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [prop]: value };
        setAttributes({ items: newItems });
    };

    // Function to update item image
    const updateItemImage = (index, image) => {
        const newItems = [...items];
        newItems[index] = { 
            ...newItems[index], 
            image: {
                url: image.url,
                id: image.id,
                alt: image.alt || ''
            } 
        };
        setAttributes({ items: newItems });
    };

    // Block props
    const blockProps = useBlockProps({
        className: `murdeni-feature-grid align-${contentAlign}`,
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
                    <RangeControl
                        label={__('Columns', 'murdeni-blocks')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={4}
                        step={1}
                    />
                    <RangeControl
                        label={__('Image Size (px)', 'murdeni-blocks')}
                        value={imageSize}
                        onChange={(value) => setAttributes({ imageSize: value })}
                        min={40}
                        max={200}
                        step={10}
                    />
                    <SelectControl
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
                <div className="murdeni-feature-grid__header">
                    <RichText
                        tagName="h2"
                        className="murdeni-feature-grid__title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Add title...', 'murdeni-blocks')}
                    />
                    <RichText
                        tagName="div"
                        className="murdeni-feature-grid__description"
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        placeholder={__('Add description...', 'murdeni-blocks')}
                    />
                </div>

                <div 
                    className="murdeni-feature-grid__items"
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: '1rem',
                        marginBottom: '3rem'
                    }}
                >
                    {items.map((item, index) => (
                        <div key={item.id} className="murdeni-feature-grid__item">
                            <div className="murdeni-feature-grid__item-inner">
                                <div className="murdeni-feature-grid__item-image-container">
                                    <MediaUploadCheck>
                                        <MediaUpload
                                            onSelect={(media) => updateItemImage(index, media)}
                                            allowedTypes={['image']}
                                            value={item.image.id}
                                            render={({ open }) => (
                                                <div className="murdeni-feature-grid__item-image-wrapper">
                                                    {item.image.url ? (
                                                        <div className="murdeni-feature-grid__item-image">
                                                            <img 
                                                                src={item.image.url} 
                                                                alt={item.image.alt} 
                                                                style={{
                                                                    width: `${imageSize}px`,
                                                                    height: `${imageSize}px`,
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                            <ButtonGroup className="murdeni-feature-grid__item-image-actions">
                                                                <Button 
                                                                    onClick={open}
                                                                    isSmall
                                                                    variant="primary"
                                                                >
                                                                    {__('Replace', 'murdeni-blocks')}
                                                                </Button>
                                                                <Button 
                                                                    onClick={() => updateItemImage(index, { url: '', id: 0, alt: '' })}
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
                                                            className="murdeni-feature-grid__item-image-button"
                                                            style={{
                                                                width: `${imageSize}px`,
                                                                height: `${imageSize}px`
                                                            }}
                                                        >
                                                            {imageIcon}
                                                            <span>{__('Add Image', 'murdeni-blocks')}</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </MediaUploadCheck>
                                    <RichText
                                        tagName="h3"
                                        className="murdeni-feature-grid__item-title"
                                        value={item.title}
                                        onChange={(value) => updateItemProp(index, 'title', value)}
                                        placeholder={__('Feature title...', 'murdeni-blocks')}
                                    />
                                </div>

                                <div className="murdeni-feature-grid__item-content">
                                    <RichText
                                        tagName="div"
                                        className="murdeni-feature-grid__item-description"
                                        value={item.description}
                                        onChange={(value) => updateItemProp(index, 'description', value)}
                                        placeholder={__('Feature description...', 'murdeni-blocks')}
                                    />
                                </div>

                                <Button
                                    className="murdeni-feature-grid__item-remove"
                                    onClick={() => removeItem(index)}
                                    icon={trash}
                                    label={__('Remove item', 'murdeni-blocks')}
                                    isDestructive
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="murdeni-feature-grid__add-item" style={{ marginTop: '40px', clear: 'both', paddingBottom: '30px', position: 'relative', zIndex: '10', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button
                        onClick={addItem}
                        variant="primary"
                        className="murdeni-feature-grid__add-item-button"
                        icon={plus}
                    >
                        {__('Add Feature Item', 'murdeni-blocks')}
                    </Button>
                </div>
            </div>
        </>
    );
}
