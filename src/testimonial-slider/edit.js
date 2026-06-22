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
        cardBottomTitle,
        cardBottomSubtitle,
        cardReviewLinkText,
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
        showOverallRating,
        reviewerCount,
        overallRatingText,
        showReviewLink,
        reviewLinkText,
        reviewLinkUrl,
        fixedHeight,
        slideHeight,
    } = attributes;

    const blockProps = useBlockProps({
        className: `testimonial-slider-editor${fixedHeight ? ' fixed-height' : ''}`,
        style: fixedHeight ? { '--slide-height': `${slideHeight}px` } : {},
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
            reviewTime: '',
            reviewUrl: '',
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

    // Function to calculate average rating from all testimonials
    const calculateAverageRating = () => {
        if (!testimonials.length) return 0;
        
        const sum = testimonials.reduce((total, testimonial) => {
            return total + (testimonial.rating || 0);
        }, 0);
        
        return sum / testimonials.length;
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
                        max={2}
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
                <PanelBody title={__('Card Bottom Settings', 'murdeni-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Bottom Title', 'murdeni-blocks')}
                        value={cardBottomTitle}
                        onChange={(value) => setAttributes({ cardBottomTitle: value })}
                    />
                    <TextControl
                        label={__('Bottom Subtitle', 'murdeni-blocks')}
                        value={cardBottomSubtitle}
                        onChange={(value) => setAttributes({ cardBottomSubtitle: value })}
                    />
                    <TextControl
                        label={__('Review Link Text', 'murdeni-blocks')}
                        value={cardReviewLinkText}
                        onChange={(value) => setAttributes({ cardReviewLinkText: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Rating Settings', 'murdeni-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Overall Rating', 'murdeni-blocks')}
                        checked={showOverallRating}
                        onChange={(value) => setAttributes({ showOverallRating: value })}
                    />
                    {showOverallRating && (
                        <>
                            <RangeControl
                                label={__('Reviewer Count', 'murdeni-blocks')}
                                value={reviewerCount}
                                onChange={(value) => setAttributes({ reviewerCount: value })}
                                min={0}
                                max={1000}
                            />
                            <TextControl
                                label={__('Rating Text Format', 'murdeni-blocks')}
                                help={__('Use %d as placeholder for reviewer count', 'murdeni-blocks')}
                                value={overallRatingText}
                                onChange={(value) => setAttributes({ overallRatingText: value })}
                            />
                            
                            <ToggleControl
                                label={__('Show Review Link', 'murdeni-blocks')}
                                checked={showReviewLink}
                                onChange={(value) => setAttributes({ showReviewLink: value })}
                            />
                            
                            {showReviewLink && (
                                <>
                                    <TextControl
                                        label={__('Review Link Text', 'murdeni-blocks')}
                                        value={reviewLinkText}
                                        onChange={(value) => setAttributes({ reviewLinkText: value })}
                                    />
                                    <TextControl
                                        label={__('Review Link URL', 'murdeni-blocks')}
                                        value={reviewLinkUrl}
                                        onChange={(value) => setAttributes({ reviewLinkUrl: value })}
                                    />
                                </>
                            )}
                        </>
                    )}
                </PanelBody>
                <PanelBody title={__('Height Settings', 'murdeni-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Fixed Height Slides', 'murdeni-blocks')}
                        help={__('Enable to make all slides the same height', 'murdeni-blocks')}
                        checked={fixedHeight}
                        onChange={(value) => setAttributes({ fixedHeight: value })}
                    />
                    {fixedHeight && (
                        <RangeControl
                            label={__('Slide Height (px)', 'murdeni-blocks')}
                            value={slideHeight}
                            onChange={(value) => setAttributes({ slideHeight: value })}
                            min={100}
                            max={800}
                            step={10}
                        />
                    )}
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
                {showOverallRating && (
                    <div className="testimonial-overall-rating">
                        <div className="overall-rating-stars">
                            {renderStars(calculateAverageRating())}
                            <span className="average-rating">{calculateAverageRating().toFixed(1)}</span>
                        </div>
                        <div className="overall-rating-text">
                            {overallRatingText.replace('%d', reviewerCount)}
                        </div>
                        {showReviewLink && (
                            <div className="review-link">
                                <a href={reviewLinkUrl} target="_blank" rel="noopener noreferrer">
                                    {reviewLinkText}
                                </a>
                            </div>
                        )}
                    </div>
                )}
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
                            <RichText
                                tagName="div"
                                className="testimonial-review-time"
                                value={testimonials[activeTestimonial].reviewTime}
                                onChange={(reviewTime) => updateTestimonial(activeTestimonial, 'reviewTime', reviewTime)}
                                placeholder={__('Review time...', 'murdeni-blocks')}
                            />
                        </div>
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
                        <div className="testimonial-card-bottom">
                            <div className="testimonial-bottom-copy">
                                {cardBottomTitle && (
                                    <div className="testimonial-bottom-title">{cardBottomTitle}</div>
                                )}
                                {cardBottomSubtitle && (
                                    <div className="testimonial-bottom-subtitle">{cardBottomSubtitle}</div>
                                )}
                            </div>
                            <div className="testimonial-bottom-link-editor">
                                {cardReviewLinkText && (
                                    <span className="testimonial-review-link">{cardReviewLinkText}</span>
                                )}
                                <TextControl
                                    value={testimonials[activeTestimonial].reviewUrl}
                                    onChange={(reviewUrl) => updateTestimonial(activeTestimonial, 'reviewUrl', reviewUrl)}
                                    placeholder={__('Review URL...', 'murdeni-blocks')}
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
