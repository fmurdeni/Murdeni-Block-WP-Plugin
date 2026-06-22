/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    SelectControl,
    Button,
    ColorPicker,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the Accordion block
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
    } = attributes;

    // Track open items in the editor
    const [openItems, setOpenItems] = useState(
        initiallyOpen ? items.map((item) => item.id) : []
    );

    // Toggle item open/closed
    const toggleItem = (itemId) => {
        if (openItems.includes(itemId)) {
            setOpenItems(openItems.filter((id) => id !== itemId));
        } else {
            if (allowMultipleOpen) {
                setOpenItems([...openItems, itemId]);
            } else {
                setOpenItems([itemId]);
            }
        }
    };

    // Add new item
    const addItem = () => {
        const newItem = {
            id: `item-${Date.now()}`,
            question: '',
            answer: '',
        };
        setAttributes({ items: [...items, newItem] });
    };

    // Remove item
    const removeItem = (itemId) => {
        setAttributes({
            items: items.filter((item) => item.id !== itemId),
        });
        setOpenItems(openItems.filter((id) => id !== itemId));
    };

    // Move item up
    const moveItemUp = (index) => {
        if (index === 0) return;
        const newItems = [...items];
        const item = newItems[index];
        newItems[index] = newItems[index - 1];
        newItems[index - 1] = item;
        setAttributes({ items: newItems });
    };

    // Move item down
    const moveItemDown = (index) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        const item = newItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = item;
        setAttributes({ items: newItems });
    };

    // Update item question
    const updateItemQuestion = (value, index) => {
        const newItems = [...items];
        newItems[index].question = value;
        setAttributes({ items: newItems });
    };

    // Update item answer
    const updateItemAnswer = (value, index) => {
        const newItems = [...items];
        newItems[index].answer = value;
        setAttributes({ items: newItems });
    };

    // Get icon based on type and state
    const getIcon = (isOpen) => {
        switch (iconType) {
            case 'plus-minus':
                return isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M6 11h12v2H6z" fill="currentColor"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" fill="currentColor"></path>
                    </svg>
                );
            case 'chevron':
                return isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M12 8l-5.5 4.4.9 1.2L12 10l4.5 3.6.9-1.2z" fill="currentColor"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6z" fill="currentColor"></path>
                    </svg>
                );
            default:
                return isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M6 11h12v2H6z" fill="currentColor"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" fill="currentColor"></path>
                    </svg>
                );
        }
    };

    // Get title tag component
    const TitleTag = `${titleTag}`;

    // Get accordion item style
    const getAccordionItemStyle = (isOpen) => {
        return {
            borderWidth: `${borderWidth}px`,
            borderStyle: 'solid',
            borderColor: borderColor || '#e0e0e0',
            borderRadius: `${borderRadius}px`,
            backgroundColor: isOpen && activeBackgroundColor ? activeBackgroundColor : backgroundColor,
            marginBottom: `${spacing}px`,
        };
    };

    // Get accordion header style
    const getAccordionHeaderStyle = () => {
        return {
            padding: `${padding}px`,
            fontSize: `${titleFontSize}px`,
            color: titleColor || undefined,
            cursor: 'pointer',
        };
    };

    // Get accordion content style
    const getAccordionContentStyle = () => {
        return {
            padding: `${padding}px`,
            fontSize: `${contentFontSize}px`,
            color: contentColor || undefined,
            borderTop: `${borderWidth}px solid ${borderColor || '#e0e0e0'}`,
        };
    };

    // Get icon style
    const getIconStyle = () => {
        return {
            color: iconColor || undefined,
        };
    };

    // Block props
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Accordion Settings', 'murdeni-blocks')} initialOpen={true}>
                    <ToggleControl
                        label={__('Allow Multiple Open', 'murdeni-blocks')}
                        checked={allowMultipleOpen}
                        onChange={() => setAttributes({ allowMultipleOpen: !allowMultipleOpen })}
                        help={
                            allowMultipleOpen
                                ? __('Multiple items can be open simultaneously.', 'murdeni-blocks')
                                : __('Only one item can be open at a time.', 'murdeni-blocks')
                        }
                    />
                    <ToggleControl
                        label={__('Initially Open', 'murdeni-blocks')}
                        checked={initiallyOpen}
                        onChange={() => setAttributes({ initiallyOpen: !initiallyOpen })}
                        help={
                            initiallyOpen
                                ? __('Items will be open by default.', 'murdeni-blocks')
                                : __('Items will be closed by default.', 'murdeni-blocks')
                        }
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
                            { label: 'DIV', value: 'div' },
                        ]}
                        onChange={(value) => setAttributes({ titleTag: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Typography', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Title Font Size', 'murdeni-blocks')}
                        value={titleFontSize}
                        onChange={(value) => setAttributes({ titleFontSize: value })}
                        min={12}
                        max={36}
                    />
                    <div className="murdeni-color-label">
                        {__('Title Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={titleColor}
                        onChange={(value) => setAttributes({ titleColor: value })}
                        enableAlpha
                    />
                    <RangeControl
                        label={__('Content Font Size', 'murdeni-blocks')}
                        value={contentFontSize}
                        onChange={(value) => setAttributes({ contentFontSize: value })}
                        min={12}
                        max={24}
                    />
                    <div className="murdeni-color-label">
                        {__('Content Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={contentColor}
                        onChange={(value) => setAttributes({ contentColor: value })}
                        enableAlpha
                    />
                </PanelBody>

                <PanelBody title={__('Style', 'murdeni-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Border Width', 'murdeni-blocks')}
                        value={borderWidth}
                        onChange={(value) => setAttributes({ borderWidth: value })}
                        min={0}
                        max={10}
                    />
                    <div className="murdeni-color-label">
                        {__('Border Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={borderColor}
                        onChange={(value) => setAttributes({ borderColor: value })}
                        enableAlpha
                    />
                    <RangeControl
                        label={__('Border Radius', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={30}
                    />
                    <div className="murdeni-color-label">
                        {__('Background Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={backgroundColor}
                        onChange={(value) => setAttributes({ backgroundColor: value })}
                        enableAlpha
                    />
                    <div className="murdeni-color-label">
                        {__('Active Background Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={activeBackgroundColor}
                        onChange={(value) => setAttributes({ activeBackgroundColor: value })}
                        enableAlpha
                    />
                </PanelBody>

                <PanelBody title={__('Icon Settings', 'murdeni-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Icon Type', 'murdeni-blocks')}
                        value={iconType}
                        options={[
                            { label: 'Plus/Minus', value: 'plus-minus' },
                            { label: 'Chevron', value: 'chevron' },
                        ]}
                        onChange={(value) => setAttributes({ iconType: value })}
                    />
                    <SelectControl
                        label={__('Icon Position', 'murdeni-blocks')}
                        value={iconPosition}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ iconPosition: value })}
                    />
                    <div className="murdeni-color-label">
                        {__('Icon Color', 'murdeni-blocks')}
                    </div>
                    <ColorPicker
                        color={iconColor}
                        onChange={(value) => setAttributes({ iconColor: value })}
                        enableAlpha
                    />
                </PanelBody>

                <PanelBody title={__('Spacing', 'murdeni-blocks')} initialOpen={false}>
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
                </PanelBody>
            </InspectorControls>

            <div className="murdeni-accordion">
                {items.map((item, index) => {
                    const isOpen = openItems.includes(item.id);
                    
                    return (
                        <div 
                            key={item.id} 
                            className={`murdeni-accordion__item ${isOpen ? 'is-open' : ''}`}
                            style={getAccordionItemStyle(isOpen)}
                        >
                            <div 
                                className={`murdeni-accordion__header murdeni-accordion__header--${iconPosition}`}
                                onClick={() => toggleItem(item.id)}
                                style={getAccordionHeaderStyle()}
                            >
                                {iconPosition === 'left' && (
                                    <span 
                                        className={`murdeni-accordion__icon icon-${iconType}`}
                                        style={getIconStyle()}
                                    >
                                        {getIcon(isOpen)}
                                    </span>
                                )}
                                
                                <TitleTag className="murdeni-accordion__title">
                                    <RichText
                                        tagName="span"
                                        value={item.question}
                                        onChange={(value) => updateItemQuestion(value, index)}
                                        placeholder={__('Add question...', 'murdeni-blocks')}
                                        keepPlaceholderOnFocus={true}
                                    />
                                </TitleTag>
                                
                                {iconPosition === 'right' && (
                                    <span 
                                        className={`murdeni-accordion__icon icon-${iconType}`}
                                        style={getIconStyle()}
                                    >
                                        {getIcon(isOpen)}
                                    </span>
                                )}
                            </div>
                            
                            {isOpen && (
                                <div 
                                    className="murdeni-accordion__content"
                                    style={getAccordionContentStyle()}
                                >
                                    <RichText
                                        tagName="div"
                                        value={item.answer}
                                        onChange={(value) => updateItemAnswer(value, index)}
                                        placeholder={__('Add answer...', 'murdeni-blocks')}
                                        keepPlaceholderOnFocus={true}
                                    />
                                </div>
                            )}
                            
                            <div className="murdeni-accordion__item-actions">
                                <Button
                                    isSmall
                                    variant="secondary"
                                    onClick={() => moveItemUp(index)}
                                    disabled={index === 0}
                                    icon="arrow-up-alt2"
                                    label={__('Move up', 'murdeni-blocks')}
                                />
                                <Button
                                    isSmall
                                    variant="secondary"
                                    onClick={() => moveItemDown(index)}
                                    disabled={index === items.length - 1}
                                    icon="arrow-down-alt2"
                                    label={__('Move down', 'murdeni-blocks')}
                                />
                                <Button
                                    isSmall
                                    variant="secondary"
                                    onClick={() => removeItem(item.id)}
                                    disabled={items.length === 1}
                                    icon="trash"
                                    label={__('Remove item', 'murdeni-blocks')}
                                />
                            </div>
                        </div>
                    );
                })}
                
                <Button
                    variant="primary"
                    onClick={addItem}
                    className="murdeni-accordion__add-item"
                >
                    {__('Add FAQ Item', 'murdeni-blocks')}
                </Button>
            </div>
        </div>
    );
}
