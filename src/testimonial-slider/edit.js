/**
 * Testimonial Slider Edit Component
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    PanelRow,
    RangeControl,
    ToggleControl,
    ColorPicker,
    TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

const Edit = ({ attributes, setAttributes }) => {
    const {
        testimonials,
        slidesToShow,
        autoplay,
        autoplaySpeed,
        arrows,
        dots,
        infinite,
        speed,
        pauseOnHover,
        backgroundColor,
        textColor,
        ratingColor,
        borderRadius,
        boxShadow,
    } = attributes;

    const blockProps = useBlockProps({
        className: 'testimonial-slider-editor',
    });

    // Function to handle adding a new testimonial
    const addTestimonial = () => {
        const newTestimonials = [...testimonials];
        newTestimonials.push({
            id: `testimonial-${Date.now()}`,
            rating: 5,
            content: '',
            authorName: '',
            authorPosition: '',
            authorImage: 'https://placehold.co/150x150/cccccc/ffffff.png?text=+',
        });
        setAttributes({ testimonials: newTestimonials });
    };

    // Function to handle removing a testimonial
    const removeTestimonial = (index) => {
        const newTestimonials = [...testimonials];
        newTestimonials.splice(index, 1);
        setAttributes({ testimonials: newTestimonials });
        
        // Reset active testimonial to prevent out-of-bounds index
        if (index >= newTestimonials.length && newTestimonials.length > 0) {
            setActiveTestimonial(newTestimonials.length - 1);
        }
    };

    // Function to update a testimonial
    const updateTestimonial = (index, property, value) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = {
            ...newTestimonials[index],
            [property]: value,
        };
        setAttributes({ testimonials: newTestimonials });
    };

    // Function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={i < rating ? 'star filled' : 'star empty'}
                    style={{ color: ratingColor }}
                    onClick={() => updateTestimonial(activeTestimonial, 'rating', i + 1)}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    // State to track active testimonial for editing
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Slider Settings', 'murdeni-blocks')} initialOpen={true}>
                    <RangeControl
                        label={__('Slides to Show', 'murdeni-blocks')}
                        value={slidesToShow}
                        onChange={(value) => setAttributes({ slidesToShow: value })}
                        min={1}
                        max={3}
                    />
                    <ToggleControl
                        label={__('Autoplay', 'murdeni-blocks')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
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
                    <ToggleControl
                        label={__('Show Arrows', 'murdeni-blocks')}
                        checked={arrows}
                        onChange={(value) => setAttributes({ arrows: value })}
                    />
                    <ToggleControl
                        label={__('Show Dots', 'murdeni-blocks')}
                        checked={dots}
                        onChange={(value) => setAttributes({ dots: value })}
                    />
                    <ToggleControl
                        label={__('Infinite Loop', 'murdeni-blocks')}
                        checked={infinite}
                        onChange={(value) => setAttributes({ infinite: value })}
                    />
                    <RangeControl
                        label={__('Animation Speed (ms)', 'murdeni-blocks')}
                        value={speed}
                        onChange={(value) => setAttributes({ speed: value })}
                        min={100}
                        max={3000}
                        step={100}
                    />
                    <ToggleControl
                        label={__('Pause on Hover', 'murdeni-blocks')}
                        checked={pauseOnHover}
                        onChange={(value) => setAttributes({ pauseOnHover: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Style Settings', 'murdeni-blocks')} initialOpen={false}>
                    <PanelRow>
                        <span>{__('Background Color', 'murdeni-blocks')}</span>
                    </PanelRow>
                    <ColorPicker
                        color={backgroundColor}
                        onChange={(value) => setAttributes({ backgroundColor: value })}
                        enableAlpha
                    />
                    <PanelRow>
                        <span>{__('Text Color', 'murdeni-blocks')}</span>
                    </PanelRow>
                    <ColorPicker
                        color={textColor}
                        onChange={(value) => setAttributes({ textColor: value })}
                        enableAlpha
                    />
                    <PanelRow>
                        <span>{__('Rating Color', 'murdeni-blocks')}</span>
                    </PanelRow>
                    <ColorPicker
                        color={ratingColor}
                        onChange={(value) => setAttributes({ ratingColor: value })}
                        enableAlpha
                    />
                    <RangeControl
                        label={__('Border Radius (px)', 'murdeni-blocks')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        min={0}
                        max={50}
                    />
                    <ToggleControl
                        label={__('Box Shadow', 'murdeni-blocks')}
                        checked={boxShadow}
                        onChange={(value) => setAttributes({ boxShadow: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="testimonial-slider-tabs">
                    {testimonials.map((testimonial, index) => (
                        <button
                            key={testimonial.id}
                            className={`testimonial-tab ${index === activeTestimonial ? 'active' : ''}`}
                            onClick={() => setActiveTestimonial(index)}
                        >
                            {__('Testimonial', 'murdeni-blocks')} {index + 1}
                        </button>
                    ))}
                    <button
                        className="testimonial-add-button"
                        onClick={addTestimonial}
                    >
                        {__('+ Add', 'murdeni-blocks')}
                    </button>
                </div>

                {testimonials.length > 0 && (
                    <div 
                        className="testimonial-card-editor"
                        style={{
                            backgroundColor: backgroundColor,
                            color: textColor,
                            borderRadius: `${borderRadius}px`,
                            boxShadow: boxShadow ? '0 4px 16px rgba(0,0,0,0.1)' : 'none',
                        }}
                    >
                        <div className="testimonial-rating">
                            {renderStars(testimonials[activeTestimonial].rating)}
                        </div>
                        <div className="testimonial-content">
                            <RichText
                                tagName="p"
                                value={testimonials[activeTestimonial].content}
                                onChange={(content) => updateTestimonial(activeTestimonial, 'content', content)}
                                placeholder={__('Enter testimonial content...', 'murdeni-blocks')}
                            />
                        </div>
                        <div className="testimonial-author">
                            <div className="author-image">
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => updateTestimonial(activeTestimonial, 'authorImage', media.url)}
                                        allowedTypes={['image']}
                                        value={testimonials[activeTestimonial].authorImage}
                                        render={({ open }) => (
                                            <Button
                                                onClick={open}
                                                className="image-button"
                                                style={{
                                                    backgroundImage: `url(${testimonials[activeTestimonial].authorImage})`,
                                                }}
                                            >
                                                {!testimonials[activeTestimonial].authorImage && __('Upload Image', 'murdeni-blocks')}
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>
                            </div>
                            <div className="author-info">
                                <RichText
                                    tagName="h4"
                                    value={testimonials[activeTestimonial].authorName}
                                    onChange={(authorName) => updateTestimonial(activeTestimonial, 'authorName', authorName)}
                                    placeholder={__('Author Name', 'murdeni-blocks')}
                                />
                                <RichText
                                    tagName="p"
                                    value={testimonials[activeTestimonial].authorPosition}
                                    onChange={(authorPosition) => updateTestimonial(activeTestimonial, 'authorPosition', authorPosition)}
                                    placeholder={__('Author Position', 'murdeni-blocks')}
                                />
                            </div>
                        </div>
                        {testimonials.length > 1 && (
                            <Button
                                className="remove-testimonial-button"
                                onClick={() => removeTestimonial(activeTestimonial)}
                                isDestructive
                            >
                                {__('Remove Testimonial', 'murdeni-blocks')}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Edit;
