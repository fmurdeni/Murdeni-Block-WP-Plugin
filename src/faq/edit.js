/**
 * Murdeni FAQ Block Edit Component
 * 
 * Handles the editor interface for the FAQ block.
 */

import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    RichText,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    RangeControl,
    SelectControl,
    Button,
    TextControl,
    ColorPalette,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { plus, minus, trash } from '@wordpress/icons';

/**
 * FAQ Block Edit Component
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        items,
        allowMultipleOpen,
        initiallyOpen,
        titleTag,
        titleFontSize,
        titleColor,
        contentFontSize,
        contentColor,
        borderWidth,
        borderColor,
        borderRadius,
        backgroundColor,
        activeBackgroundColor,
        iconColor,
        iconPosition,
        iconType,
        spacing,
        padding,
        sectionTitle,
        sectionTitleTag,
        sectionTitleFontSize,
        sectionTitleColor,
        sectionTitleAlign,
    } = attributes;

    const [activeItem, setActiveItem] = useState(null);

    // Toggle FAQ item open/closed
    const toggleItem = (id) => {
        if (activeItem === id) {
            setActiveItem(null);
        } else {
            if (!allowMultipleOpen) {
                setActiveItem(id);
            } else {
                setActiveItem(id);
            }
        }
    };

    // Add new FAQ item
    const addItem = () => {
        const newItems = [...items];
        const id = `item-${Date.now()}`;
        newItems.push({
            id,
            question: __('New FAQ Question', 'murdeni-blocks'),
            answer: __('Answer to the FAQ question.', 'murdeni-blocks'),
        });
        setAttributes({ items: newItems });
    };

    // Remove FAQ item
    const removeItem = (id) => {
        const newItems = items.filter((item) => item.id !== id);
        setAttributes({ items: newItems });
        if (activeItem === id) {
            setActiveItem(null);
        }
    };

    // Update FAQ item content
    const updateItemContent = (id, field, content) => {
        const newItems = items.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    [field]: content,
                };
            }
            return item;
        });
        setAttributes({ items: newItems });
    };

    // Move item up in the list
    const moveItemUp = (index) => {
        if (index === 0) return;
        const newItems = [...items];
        const item = newItems[index];
        newItems[index] = newItems[index - 1];
        newItems[index - 1] = item;
        setAttributes({ items: newItems });
    };

    // Move item down in the list
    const moveItemDown = (index) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        const item = newItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = item;
        setAttributes({ items: newItems });
    };

    // Block props with custom styles
    const blockProps = useBlockProps({
        className: 'murdeni-faq',
    });

    // Custom styles for the FAQ items
    const getFaqItemStyle = (isActive = false) => {
        return {
            marginBottom: `${spacing}px`,
            borderWidth: `${borderWidth}px`,
            borderStyle: 'solid',
            borderColor: borderColor || undefined,
            borderRadius: `${borderRadius}px`,
            backgroundColor: isActive && activeBackgroundColor ? activeBackgroundColor : backgroundColor || undefined,
        };
    };

    // Custom styles for the FAQ header
    const getFaqHeaderStyle = () => {
        return {
            padding: `${padding}px`,
            fontSize: `${titleFontSize}px`,
            color: titleColor || undefined,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: iconPosition === 'left' ? 'row-reverse' : 'row',
        };
    };

    // Custom styles for the FAQ content
    const getFaqContentStyle = () => {
        return {
            padding: `${padding}px`,
            fontSize: `${contentFontSize}px`,
            color: contentColor || undefined,
            borderTop: `${borderWidth}px solid ${borderColor || '#e0e0e0'}`,
        };
    };

    // Custom styles for the section title
    const getSectionTitleStyle = () => {
        return {
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor || undefined,
            textAlign: sectionTitleAlign,
            marginBottom: '20px',
        };
    };

    // Icon styles
    const getIconStyle = () => {
        return {
            color: iconColor || undefined,
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };
    };

    // Render icon based on type and state
    const renderIcon = (isActive) => {
        const style = getIconStyle();
        
        if (iconType === 'plus-minus') {
            return isActive ? (
                <span style={style}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M5 12h14"></path>
                    </svg>
                </span>
            ) : (
                <span style={style}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 5v14M5 12h14"></path>
                    </svg>
                </span>
            );
        } else if (iconType === 'arrow') {
            return (
                <span style={style} className={isActive ? 'is-active' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <path d="M7 10l5 5 5-5"></path>
                    </svg>
                </span>
            );
        }
        
        return null;
    };

    // Define the title tag component
    const TitleTag = `${titleTag}`;
    const SectionTitleTag = `${sectionTitleTag}`;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('FAQ Settings', 'murdeni-blocks')}>
                    <ToggleControl
                        label={__('Allow Multiple Open', 'murdeni-blocks')}
                        checked={allowMultipleOpen}
                        onChange={(value) => setAttributes({ allowMultipleOpen: value })}
                    />
                    <ToggleControl
                        label={__('Initially Open', 'murdeni-blocks')}
                        checked={initiallyOpen}
                        onChange={(value) => setAttributes({ initiallyOpen: value })}
                    />
                    <SelectControl
                        label={__('Title Tag', 'murdeni-blocks')}
                        value={titleTag}
                        options={[
                            { label: 'H2', value: 'h2' },
                            { label: 'H3', value: 'h3' },
                            { label: 'H4', value: 'h4' },
                            { label: 'H5', value: 'h5' },
                            { label: 'H6', value: 'h6' },
                            { label: 'p', value: 'p' },
                        ]}
                        onChange={(value) => setAttributes({ titleTag: value })}
                    />
                    <RangeControl
                        label={__('Title Font Size', 'murdeni-blocks')}
                        value={titleFontSize}
                        onChange={(value) => setAttributes({ titleFontSize: value })}
                        min={12}
                        max={36}
                    />
                    <RangeControl
                        label={__('Content Font Size', 'murdeni-blocks')}
                        value={contentFontSize}
                        onChange={(value) => setAttributes({ contentFontSize: value })}
                        min={12}
                        max={36}
                    />
                </PanelBody>
                
                <PanelBody title={__('Section Title', 'murdeni-blocks')}>
                    <TextControl
                        label={__('Section Title', 'murdeni-blocks')}
                        value={sectionTitle}
                        onChange={(value) => setAttributes({ sectionTitle: value })}
                    />
                    <SelectControl
                        label={__('Section Title Tag', 'murdeni-blocks')}
                        value={sectionTitleTag}
                        options={[
                            { label: 'H1', value: 'h1' },
                            { label: 'H2', value: 'h2' },
                            { label: 'H3', value: 'h3' },
                            { label: 'H4', value: 'h4' },
                            { label: 'H5', value: 'h5' },
                            { label: 'H6', value: 'h6' },
                        ]}
                        onChange={(value) => setAttributes({ sectionTitleTag: value })}
                    />
                    <RangeControl
                        label={__('Section Title Font Size', 'murdeni-blocks')}
                        value={sectionTitleFontSize}
                        onChange={(value) => setAttributes({ sectionTitleFontSize: value })}
                        min={16}
                        max={48}
                    />
                    <SelectControl
                        label={__('Section Title Alignment', 'murdeni-blocks')}
                        value={sectionTitleAlign}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ sectionTitleAlign: value })}
                    />
                </PanelBody>
                
                <PanelBody title={__('Appearance', 'murdeni-blocks')}>
                    <RangeControl
                        label={__('Border Width', 'murdeni-blocks')}
                        value={borderWidth}
                        onChange={(value) => setAttributes({ borderWidth: value })}
                        min={0}
                        max={10}
                    />
                    <RangeControl
                        label={__('Border Radius', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={30}
                    />
                    <RangeControl
                        label={__('Item Spacing', 'murdeni-blocks')}
                        value={spacing}
                        onChange={(value) => setAttributes({ spacing: value })}
                        min={0}
                        max={50}
                    />
                    <RangeControl
                        label={__('Padding', 'murdeni-blocks')}
                        value={padding}
                        onChange={(value) => setAttributes({ padding: value })}
                        min={0}
                        max={50}
                    />
                    <SelectControl
                        label={__('Icon Position', 'murdeni-blocks')}
                        value={iconPosition}
                        options={[
                            { label: 'Right', value: 'right' },
                            { label: 'Left', value: 'left' },
                        ]}
                        onChange={(value) => setAttributes({ iconPosition: value })}
                    />
                    <SelectControl
                        label={__('Icon Type', 'murdeni-blocks')}
                        value={iconType}
                        options={[
                            { label: 'Plus/Minus', value: 'plus-minus' },
                            { label: 'Arrow', value: 'arrow' },
                        ]}
                        onChange={(value) => setAttributes({ iconType: value })}
                    />
                </PanelBody>
                
                <PanelBody title={__('Colors', 'murdeni-blocks')}>
                    <p>{__('Title Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={titleColor}
                        onChange={(value) => setAttributes({ titleColor: value })}
                    />
                    <p>{__('Content Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={contentColor}
                        onChange={(value) => setAttributes({ contentColor: value })}
                    />
                    <p>{__('Section Title Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={sectionTitleColor}
                        onChange={(value) => setAttributes({ sectionTitleColor: value })}
                    />
                    <p>{__('Border Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={borderColor}
                        onChange={(value) => setAttributes({ borderColor: value })}
                    />
                    <p>{__('Background Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={backgroundColor}
                        onChange={(value) => setAttributes({ backgroundColor: value })}
                    />
                    <p>{__('Active Background Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={activeBackgroundColor}
                        onChange={(value) => setAttributes({ activeBackgroundColor: value })}
                    />
                    <p>{__('Icon Color', 'murdeni-blocks')}</p>
                    <ColorPalette
                        value={iconColor}
                        onChange={(value) => setAttributes({ iconColor: value })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <BlockControls>
                <AlignmentToolbar
                    value={sectionTitleAlign}
                    onChange={(value) => setAttributes({ sectionTitleAlign: value })}
                />
            </BlockControls>
            
            <div {...blockProps}>
                {sectionTitle && (
                    <RichText
                        tagName={SectionTitleTag}
                        value={sectionTitle}
                        onChange={(value) => setAttributes({ sectionTitle: value })}
                        placeholder={__('FAQ Section Title', 'murdeni-blocks')}
                        style={getSectionTitleStyle()}
                    />
                )}
                
                <div className="murdeni-faq__items">
                    {items.map((item, index) => {
                        const isActive = activeItem === item.id;
                        
                        return (
                            <div
                                key={item.id}
                                className={`murdeni-faq__item ${isActive ? 'is-active' : ''}`}
                                style={getFaqItemStyle(isActive)}
                            >
                                <div
                                    className="murdeni-faq__header"
                                    style={getFaqHeaderStyle()}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    <RichText
                                        tagName={TitleTag}
                                        value={item.question}
                                        onChange={(value) => updateItemContent(item.id, 'question', value)}
                                        placeholder={__('FAQ Question', 'murdeni-blocks')}
                                        style={{ margin: 0, flex: 1 }}
                                    />
                                    <div className="murdeni-faq__controls">
                                        {renderIcon(isActive)}
                                    </div>
                                </div>
                                
                                {isActive && (
                                    <div className="murdeni-faq__content" style={getFaqContentStyle()}>
                                        <RichText
                                            tagName="div"
                                            value={item.answer}
                                            onChange={(value) => updateItemContent(item.id, 'answer', value)}
                                            placeholder={__('FAQ Answer', 'murdeni-blocks')}
                                        />
                                        
                                        <div className="murdeni-faq__item-controls" style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                                            {index > 0 && (
                                                <Button
                                                    isSmall
                                                    onClick={() => moveItemUp(index)}
                                                    icon="arrow-up-alt2"
                                                    label={__('Move Up', 'murdeni-blocks')}
                                                />
                                            )}
                                            {index < items.length - 1 && (
                                                <Button
                                                    isSmall
                                                    onClick={() => moveItemDown(index)}
                                                    icon="arrow-down-alt2"
                                                    label={__('Move Down', 'murdeni-blocks')}
                                                />
                                            )}
                                            <Button
                                                isSmall
                                                isDestructive
                                                onClick={() => removeItem(item.id)}
                                                icon={trash}
                                                label={__('Remove', 'murdeni-blocks')}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                <Button
                    isPrimary
                    onClick={addItem}
                    icon={plus}
                    style={{ marginTop: '10px' }}
                >
                    {__('Add FAQ Item', 'murdeni-blocks')}
                </Button>
            </div>
        </>
    );
}
